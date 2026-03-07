(function () {
  'use strict';

  var ORIGIN = (function () {
    var scripts = document.querySelectorAll('script[src*="bolt-embed"]');
    if (scripts.length > 0) {
      var src = scripts[scripts.length - 1].src;
      return src.replace(/\/embed\/bolt-embed\.js.*$/, '');
    }
    return '';
  })();

  var API_BASE = ORIGIN + '/api/public';
  var PREFIX = 'bolt-e';

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function formatPrice(v) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
  }

  function formatNum(v) {
    return new Intl.NumberFormat('en-US').format(v || 0);
  }

  var STATUS_LABELS = { for_sale: 'For Sale', pending: 'Pending', sold: 'Sold' };

  function getThumb(row) {
    return row.thumbnail || (row.gallery && row.gallery[0] && row.gallery[0].url) || '';
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (typeof children === 'string') e.innerHTML = children;
    else if (Array.isArray(children)) children.forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  // ── Scoped CSS ───────────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById(PREFIX + '-styles')) return;
    var css = [
      '.' + PREFIX + '-card{display:block;border-radius:12px;border:1px solid #EBEBEB;overflow:hidden;text-decoration:none;color:inherit;background:#fff;transition:border-color .2s}',
      '.' + PREFIX + '-card:hover{border-color:#DAFF07}',
      '.' + PREFIX + '-card-img{position:relative;aspect-ratio:4/3;background:#F5F5F3;overflow:hidden}',
      '.' + PREFIX + '-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .3s}',
      '.' + PREFIX + '-card:hover .' + PREFIX + '-card-img img{transform:scale(1.02)}',
      '.' + PREFIX + '-badge{position:absolute;left:12px;top:12px;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:500}',
      '.' + PREFIX + '-badge-for_sale{background:#DAFF07;color:#000}',
      '.' + PREFIX + '-badge-pending{background:#F5F5F3;color:#888C99;border:1px solid #EBEBEB}',
      '.' + PREFIX + '-badge-sold{background:#000;color:#fff}',
      '.' + PREFIX + '-card-body{padding:16px}',
      '.' + PREFIX + '-price{font-size:17px;font-weight:600;color:#000;margin:0}',
      '.' + PREFIX + '-addr{font-size:13px;color:#555;margin:4px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.' + PREFIX + '-meta{display:flex;gap:12px;font-size:12px;color:#888C99;margin-top:8px}',
      '.' + PREFIX + '-grid{display:grid;gap:16px}',
      '.' + PREFIX + '-grid-1{grid-template-columns:1fr}',
      '.' + PREFIX + '-grid-2{grid-template-columns:repeat(2,1fr)}',
      '.' + PREFIX + '-grid-3{grid-template-columns:repeat(3,1fr)}',
      '@media(max-width:768px){.' + PREFIX + '-grid-3{grid-template-columns:repeat(2,1fr)}}',
      '@media(max-width:480px){.' + PREFIX + '-grid-2,.' + PREFIX + '-grid-3{grid-template-columns:1fr}}',
      '.' + PREFIX + '-pagination{display:flex;justify-content:center;gap:8px;margin-top:24px}',
      '.' + PREFIX + '-page-btn{padding:8px 12px;border:1px solid #EBEBEB;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;color:#888C99}',
      '.' + PREFIX + '-page-btn.active{background:#000;color:#fff;border-color:#000}',
      '.' + PREFIX + '-page-btn:disabled{opacity:.4;cursor:default}',
      '.' + PREFIX + '-load-more{display:flex;justify-content:center;margin-top:24px}',
      '.' + PREFIX + '-load-btn{padding:10px 24px;border:1px solid #EBEBEB;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;color:#000}',
      '.' + PREFIX + '-load-btn:hover{background:#F5F5F3}',
      '.' + PREFIX + '-no-img{display:flex;align-items:center;justify-content:center;height:100%;color:#CCC;font-size:13px}',
      '.' + PREFIX + '-wrap{font-family:"Geist","Inter",system-ui,sans-serif}',
      '.' + PREFIX + '-loading{padding:40px;text-align:center;color:#888C99;font-size:13px}',
    ].join('\n');
    var style = document.createElement('style');
    style.id = PREFIX + '-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Listing Feed ─────────────────────────────────────────────────────────────

  function renderCard(listing, detailPattern) {
    var href = detailPattern ? detailPattern.replace('{slug}', listing.slug) : '#';
    var thumb = getThumb(listing);
    var status = listing.listing_status || '';

    var imgEl;
    if (thumb) {
      imgEl = el('img', { src: thumb, alt: listing.address, loading: 'lazy' });
    } else {
      imgEl = el('div', { class: PREFIX + '-no-img' }, 'No image');
    }

    var badge = el('span', { class: PREFIX + '-badge ' + PREFIX + '-badge-' + status }, STATUS_LABELS[status] || status);
    var imgWrap = el('div', { class: PREFIX + '-card-img' }, [imgEl, badge]);

    var price = el('p', { class: PREFIX + '-price' }, formatPrice(listing.list_price));
    var addr = el('p', { class: PREFIX + '-addr' }, listing.address || '');
    var meta = el('div', { class: PREFIX + '-meta' },
      listing.bedrooms + ' Beds &middot; ' + listing.bathrooms + ' Baths &middot; ' + formatNum(listing.living_area_sqft) + ' Sqft'
    );
    var body = el('div', { class: PREFIX + '-card-body' }, [price, addr, meta]);

    var card = el('a', { href: href, class: PREFIX + '-card' }, [imgWrap, body]);
    return card;
  }

  function renderFeed(container, config, listings, total, page, loadedExtra) {
    container.innerHTML = '';

    var cols = config.columns || 3;
    var grid = el('div', { class: PREFIX + '-grid ' + PREFIX + '-grid-' + cols });
    listings.forEach(function (listing) {
      grid.appendChild(renderCard(listing, config.detailPageUrlPattern));
    });
    container.appendChild(grid);

    var perPage = config.itemsPerPage === 'unlimited' ? null : config.itemsPerPage;
    var totalPages = perPage ? Math.ceil(total / perPage) : 1;

    if (config.paginationType === 'pagination' && perPage && totalPages > 1) {
      var pagDiv = el('div', { class: PREFIX + '-pagination' });

      var prevBtn = el('button', { class: PREFIX + '-page-btn', type: 'button' }, '&larr;');
      if (page <= 1) prevBtn.disabled = true;
      prevBtn.onclick = function () { if (page > 1) loadPage(container, config, page - 1, 0); };
      pagDiv.appendChild(prevBtn);

      for (var i = 1; i <= totalPages; i++) {
        (function (p) {
          var btn = el('button', { class: PREFIX + '-page-btn' + (p === page ? ' active' : ''), type: 'button' }, String(p));
          btn.onclick = function () { loadPage(container, config, p, 0); };
          pagDiv.appendChild(btn);
        })(i);
      }

      var nextBtn = el('button', { class: PREFIX + '-page-btn', type: 'button' }, '&rarr;');
      if (page >= totalPages) nextBtn.disabled = true;
      nextBtn.onclick = function () { if (page < totalPages) loadPage(container, config, page + 1, 0); };
      pagDiv.appendChild(nextBtn);

      container.appendChild(pagDiv);
    }

    if (config.paginationType === 'load_more' && perPage && (perPage + loadedExtra) < total) {
      var lmDiv = el('div', { class: PREFIX + '-load-more' });
      var lmBtn = el('button', { class: PREFIX + '-load-btn', type: 'button' }, 'Load More');
      lmBtn.onclick = function () { loadPage(container, config, 1, loadedExtra + perPage); };
      lmDiv.appendChild(lmBtn);
      container.appendChild(lmDiv);
    }
  }

  function loadPage(container, config, page, loadedExtra) {
    var tenantId = container.getAttribute('data-tenant-id');
    if (!tenantId) return;

    var sp = new URLSearchParams();
    sp.set('tenantId', tenantId);
    var f = config.filters || {};
    if (f.statuses && f.statuses.length) sp.set('status', f.statuses.join(','));
    if (f.cities && f.cities.length) sp.set('city', f.cities.join(','));
    if (f.neighborhoods && f.neighborhoods.length) sp.set('neighborhood', f.neighborhoods.join(','));
    if (f.propertyTypes && f.propertyTypes.length) sp.set('propertyType', f.propertyTypes.join(','));
    sp.set('sort', config.sortBy || 'newest');

    var perPage = config.itemsPerPage === 'unlimited' ? null : config.itemsPerPage;
    if (config.paginationType === 'pagination' && perPage) {
      sp.set('page', String(page));
      sp.set('perPage', String(perPage));
    } else if (config.paginationType === 'load_more' && perPage) {
      sp.set('page', '1');
      sp.set('perPage', String(perPage + loadedExtra));
    }

    container.innerHTML = '<div class="' + PREFIX + '-loading">Loading listings...</div>';

    fetch(API_BASE + '/listings?' + sp.toString())
      .then(function (r) { return r.json(); })
      .then(function (res) {
        var data = Array.isArray(res) ? res : (res.data || []);
        var total = Array.isArray(res) ? res.length : (res.total || 0);
        renderFeed(container, config, data, total, page, loadedExtra);
      })
      .catch(function () {
        container.innerHTML = '<div class="' + PREFIX + '-loading">Failed to load listings.</div>';
      });
  }

  // ── Listing Detail ───────────────────────────────────────────────────────────

  function loadDetail(container) {
    var tenantId = container.getAttribute('data-tenant-id');
    var slug = container.getAttribute('data-slug') || '';
    var slugFromUrl = container.getAttribute('data-slug-from-url') === 'true';
    var urlPattern = container.getAttribute('data-url-pattern') || '/listings/:slug';

    if (slugFromUrl && !slug) {
      var pathParts = window.location.pathname.split('/');
      var patternParts = urlPattern.split('/');
      for (var i = 0; i < patternParts.length; i++) {
        if (patternParts[i] === ':slug' && pathParts[i]) {
          slug = pathParts[i];
          break;
        }
      }
    }

    if (!tenantId || !slug) {
      container.innerHTML = '<div class="' + PREFIX + '-loading">Missing tenant ID or listing slug.</div>';
      return;
    }

    container.innerHTML = '<div class="' + PREFIX + '-loading">Loading listing...</div>';

    fetch(API_BASE + '/listings?tenantId=' + encodeURIComponent(tenantId))
      .then(function (r) { return r.json(); })
      .then(function (listings) {
        var arr = Array.isArray(listings) ? listings : (listings.data || []);
        var listing = null;
        for (var j = 0; j < arr.length; j++) {
          if (arr[j].slug === slug) { listing = arr[j]; break; }
        }
        if (!listing) {
          container.innerHTML = '<div class="' + PREFIX + '-loading">Listing not found.</div>';
          return;
        }
        renderDetailPage(container, listing);
      })
      .catch(function () {
        container.innerHTML = '<div class="' + PREFIX + '-loading">Failed to load listing.</div>';
      });
  }

  function renderDetailPage(container, listing) {
    var thumb = getThumb(listing);
    var status = listing.listing_status || '';
    var gallery = listing.gallery || [];
    gallery.sort(function (a, b) { return a.order - b.order; });

    var html = '<div class="' + PREFIX + '-wrap" style="max-width:1300px;margin:0 auto;padding:16px">';

    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;font-size:13px">';
    html += '<span style="color:#888C99">MLS# ' + (listing.mls_number || '') + '</span>';
    html += '</div>';

    if (thumb) {
      html += '<div style="margin-bottom:32px;border-radius:12px;overflow:hidden">';
      html += '<img src="' + thumb + '" alt="' + (listing.address || '') + '" style="width:100%;max-height:560px;object-fit:cover">';
      html += '</div>';
    }

    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px">';
    html += '<span style="font-size:32px;font-weight:500;color:#000">' + formatPrice(listing.list_price) + '</span>';
    var badgeBg = status === 'for_sale' ? '#DAFF07' : status === 'pending' ? '#F5F5F3' : '#000';
    var badgeColor = status === 'sold' ? '#fff' : '#000';
    html += '<span style="border-radius:999px;padding:4px 10px;font-size:11px;font-weight:500;background:' + badgeBg + ';color:' + badgeColor + '">' + (STATUS_LABELS[status] || status) + '</span>';
    html += '</div>';

    html += '<h2 style="font-size:24px;font-weight:500;color:#000;margin:0 0 4px">' + (listing.address || '') + '</h2>';
    html += '<p style="font-size:13px;color:#888C99;margin:0 0 16px">' + (listing.neighborhood || '') + ', ' + (listing.city || '') + '</p>';

    html += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;border-top:1px solid #EBEBEB;padding-top:16px;font-size:13px;margin-bottom:24px">';
    html += '<div><span style="color:#888C99">Beds</span><br><strong>' + listing.bedrooms + '</strong></div>';
    html += '<div><span style="color:#888C99">Baths</span><br><strong>' + listing.bathrooms + '</strong></div>';
    html += '<div><span style="color:#888C99">Sq Ft</span><br><strong>' + formatNum(listing.living_area_sqft) + '</strong></div>';
    html += '<div><span style="color:#888C99">Year Built</span><br><strong>' + (listing.year_built || '') + '</strong></div>';
    html += '<div><span style="color:#888C99">Type</span><br><strong>' + (listing.property_type || '') + '</strong></div>';
    html += '</div>';

    if (listing.description) {
      html += '<div style="margin-bottom:24px">';
      html += '<h3 style="font-size:15px;font-weight:500;color:#000;margin:0 0 12px">About This Property</h3>';
      html += '<p style="font-size:13px;line-height:1.7;color:#888C99;white-space:pre-wrap">' + listing.description + '</p>';
      html += '</div>';
    }

    html += '<div style="margin-bottom:24px">';
    html += '<h3 style="font-size:15px;font-weight:500;color:#000;margin:0 0 12px">Property Details</h3>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:13px">';
    var details = [
      ['Property Type', listing.property_type],
      ['Lot Area', listing.lot_area_value + ' ' + (listing.lot_area_unit || 'sqft')],
      ['Year Built', listing.year_built],
      ['Taxes', formatPrice(listing.taxes_annual)],
      ['MLS', listing.mls_number],
      ['Brokerage', listing.listing_brokerage],
    ];
    details.forEach(function (d) {
      html += '<div style="border:1px solid #EBEBEB;border-radius:12px;padding:16px">';
      html += '<p style="color:#888C99;margin:0 0 4px">' + d[0] + '</p>';
      html += '<p style="font-weight:500;color:#000;margin:0">' + (d[1] || '') + '</p>';
      html += '</div>';
    });
    html += '</div></div>';

    html += '</div>';
    container.innerHTML = html;
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  function init() {
    injectStyles();

    var containers = document.querySelectorAll('[data-bolt-embed]');
    containers.forEach(function (container) {
      var type = container.getAttribute('data-bolt-embed');

      if (type === 'listing-feed') {
        var embedId = container.getAttribute('data-embed-id');
        if (embedId) {
          fetch(API_BASE + '/embed-config/' + encodeURIComponent(embedId))
            .then(function (r) { return r.json(); })
            .then(function (cfg) {
              var feedConfig = cfg.config || {};
              container._feedConfig = feedConfig;
              loadPage(container, feedConfig, 1, 0);
            })
            .catch(function () {
              container.innerHTML = '<div class="' + PREFIX + '-loading">Failed to load embed configuration.</div>';
            });
        }
      } else if (type === 'listing-detail') {
        loadDetail(container);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
