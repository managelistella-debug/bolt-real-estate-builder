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
  var REP_LABELS = { buyer_representation: 'Buyer Representation', seller_representation: 'Seller Representation' };

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

  function css(elem, styles) {
    Object.keys(styles).forEach(function (k) { if (styles[k] !== undefined && styles[k] !== '') elem.style[k] = styles[k]; });
  }

  function d(cfg) {
    return {
      layout: cfg.cardLayout || 'classic',
      badgePos: cfg.statusBadgePosition || 'left',
      showRep: cfg.showRepresentation || false,
      ih: cfg.imageHeight || { value: 75, unit: 'vh' },
      gap: cfg.gap != null ? cfg.gap : 16,
      cRadius: cfg.cardRadius != null ? cfg.cardRadius : 12,
      iRadius: cfg.imageRadius || 0,
      dRadius: cfg.detailsBoxRadius || 0,
      dBg: cfg.detailsBoxBg || '#ffffff',
      dBorder: cfg.detailsBoxBorder || '#EBEBEB',
      shadow: cfg.dropShadow || false,
      badge: cfg.statusBadge || { bg: '#DAFF07', color: '#000', borderColor: '', fontFamily: '', fontSize: 11, radius: 999 },
      typo: cfg.typography || { address: { fontFamily: '', fontSize: 15, color: '#000' }, city: { fontFamily: '', fontSize: 13, color: '#555' }, price: { fontFamily: '', fontSize: 17, color: '#000' }, specs: { fontFamily: '', fontSize: 12, color: '#888C99' } },
      responsive: cfg.responsive || { tablet: {}, mobile: {} },
    };
  }

  // ── Scoped CSS ───────────────────────────────────────────────────────────────

  function injectStyles(cfg) {
    var existing = document.getElementById(PREFIX + '-styles');
    if (existing) existing.remove();
    var v = d(cfg);
    var tabCols = (v.responsive.tablet && v.responsive.tablet.columns) || cfg.columns || 3;
    var mobCols = (v.responsive.mobile && v.responsive.mobile.columns) || tabCols;

    var baseCss = [
      '.' + PREFIX + '-wrap{font-family:"Geist","Inter",system-ui,sans-serif}',
      '.' + PREFIX + '-grid{display:grid}',
      '.' + PREFIX + '-card{display:block;overflow:hidden;text-decoration:none;color:inherit;transition:border-color .2s,box-shadow .2s}',
      '.' + PREFIX + '-card:hover{opacity:0.92}',
      '.' + PREFIX + '-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .3s}',
      '.' + PREFIX + '-card:hover .' + PREFIX + '-card-img img{transform:scale(1.02)}',
      '.' + PREFIX + '-no-img{display:flex;align-items:center;justify-content:center;height:100%;color:#CCC;font-size:13px}',
      '.' + PREFIX + '-pagination{display:flex;justify-content:center;gap:8px;margin-top:24px}',
      '.' + PREFIX + '-page-btn{padding:8px 12px;border:1px solid #EBEBEB;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;color:#888C99}',
      '.' + PREFIX + '-page-btn.active{background:#000;color:#fff;border-color:#000}',
      '.' + PREFIX + '-page-btn:disabled{opacity:.4;cursor:default}',
      '.' + PREFIX + '-load-more{display:flex;justify-content:center;margin-top:24px}',
      '.' + PREFIX + '-load-btn{padding:10px 24px;border:1px solid #EBEBEB;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;color:#000}',
      '.' + PREFIX + '-load-btn:hover{background:#F5F5F3}',
      '.' + PREFIX + '-loading{padding:40px;text-align:center;color:#888C99;font-size:13px}',
      '@media(max-width:768px){.' + PREFIX + '-grid{grid-template-columns:repeat(' + tabCols + ',1fr)!important}}',
      '@media(max-width:480px){.' + PREFIX + '-grid{grid-template-columns:repeat(' + mobCols + ',1fr)!important}}',
    ].join('\n');

    var style = document.createElement('style');
    style.id = PREFIX + '-styles';
    style.textContent = baseCss;
    document.head.appendChild(style);
  }

  // ── Card renderers ─────────────────────────────────────────────────────────

  function makeBadge(listing, cfg) {
    var v = d(cfg);
    if (v.badgePos === 'hidden') return null;
    var b = v.badge;
    var span = el('span', {}, STATUS_LABELS[listing.listing_status] || listing.listing_status);
    css(span, {
      position: 'absolute',
      borderRadius: b.radius + 'px',
      padding: '4px 10px',
      fontSize: b.fontSize + 'px',
      fontWeight: '500',
      background: b.bg,
      color: b.color,
      border: b.borderColor ? '1px solid ' + b.borderColor : '',
      fontFamily: b.fontFamily || '',
    });
    span.style[v.badgePos === 'left' ? 'left' : 'right'] = '12px';
    span.style.top = '12px';
    return span;
  }

  function makeImgWrap(listing, cfg) {
    var v = d(cfg);
    var thumb = getThumb(listing);
    var wrap = el('div', { class: PREFIX + '-card-img' });
    css(wrap, {
      position: 'relative',
      height: v.ih.value + v.ih.unit,
      maxHeight: '500px',
      background: '#F5F5F3',
      overflow: 'hidden',
      borderRadius: v.iRadius ? v.iRadius + 'px' : '',
    });
    if (thumb) {
      wrap.appendChild(el('img', { src: thumb, alt: listing.address || '', loading: 'lazy' }));
    } else {
      wrap.appendChild(el('div', { class: PREFIX + '-no-img' }, 'No image'));
    }
    return wrap;
  }

  function cardStyles(cfg) {
    var v = d(cfg);
    return {
      display: 'block',
      overflow: 'hidden',
      borderRadius: v.cRadius + 'px',
      border: v.dBorder ? '1px solid ' + v.dBorder : '',
      background: v.layout === 'overlay' ? 'transparent' : v.dBg,
      boxShadow: v.shadow ? '0 2px 12px rgba(0,0,0,0.08)' : '',
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
    };
  }

  function renderCardClassic(listing, cfg, href) {
    var v = d(cfg);
    var card = el('a', { href: href, class: PREFIX + '-card' });
    css(card, cardStyles(cfg));

    var imgWrap = makeImgWrap(listing, cfg);
    var badge = makeBadge(listing, cfg);
    if (badge) imgWrap.appendChild(badge);
    card.appendChild(imgWrap);

    var body = el('div');
    css(body, { padding: '16px', background: v.dBg, borderRadius: v.dRadius ? v.dRadius + 'px' : '' });

    var price = el('p', {}, formatPrice(listing.list_price));
    css(price, { margin: '0', fontWeight: '600', fontSize: v.typo.price.fontSize + 'px', color: v.typo.price.color, fontFamily: v.typo.price.fontFamily || '' });
    body.appendChild(price);

    var addr = el('p', {}, listing.address || '');
    css(addr, { margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: v.typo.address.fontSize + 'px', color: v.typo.address.color, fontFamily: v.typo.address.fontFamily || '' });
    body.appendChild(addr);

    var meta = el('div', {}, listing.bedrooms + ' Beds &middot; ' + listing.bathrooms + ' Baths &middot; ' + formatNum(listing.living_area_sqft) + ' Sqft');
    css(meta, { display: 'flex', gap: '12px', marginTop: '8px', fontSize: v.typo.specs.fontSize + 'px', color: v.typo.specs.color, fontFamily: v.typo.specs.fontFamily || '' });
    body.appendChild(meta);

    card.appendChild(body);
    return card;
  }

  function renderCardOverlay(listing, cfg, href) {
    var v = d(cfg);
    var card = el('a', { href: href, class: PREFIX + '-card' });
    css(card, { display: 'block', overflow: 'hidden', borderRadius: v.cRadius + 'px', textDecoration: 'none', color: 'inherit', position: 'relative' });

    var imgWrap = makeImgWrap(listing, cfg);
    css(imgWrap, { borderRadius: v.cRadius + 'px' });
    var badge = makeBadge(listing, cfg);
    if (badge) imgWrap.appendChild(badge);

    var grad = el('div');
    css(grad, { position: 'absolute', bottom: '0', left: '0', right: '0', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', pointerEvents: 'none' });
    imgWrap.appendChild(grad);

    var textWrap = el('div');
    css(textWrap, { position: 'absolute', bottom: '0', left: '0', right: '0', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' });

    var left = el('div');
    var addrEl = el('p', {}, listing.address || '');
    css(addrEl, { margin: '0', fontWeight: '600', color: '#fff', fontSize: v.typo.address.fontSize + 'px', fontFamily: v.typo.address.fontFamily || '' });
    var cityEl = el('p', {}, listing.city || '');
    css(cityEl, { margin: '2px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: v.typo.city.fontSize + 'px', fontFamily: v.typo.city.fontFamily || '' });
    left.appendChild(addrEl);
    left.appendChild(cityEl);

    var priceEl = el('p', {}, formatPrice(listing.list_price));
    css(priceEl, { margin: '0', fontWeight: '700', color: '#fff', fontSize: v.typo.price.fontSize + 'px', fontFamily: v.typo.price.fontFamily || '', whiteSpace: 'nowrap' });

    textWrap.appendChild(left);
    textWrap.appendChild(priceEl);
    imgWrap.appendChild(textWrap);
    card.appendChild(imgWrap);
    return card;
  }

  function renderCardMinimal(listing, cfg, href) {
    var v = d(cfg);
    var card = el('a', { href: href, class: PREFIX + '-card' });
    css(card, cardStyles(cfg));

    var imgWrap = makeImgWrap(listing, cfg);
    var badge = makeBadge(listing, cfg);
    if (badge) imgWrap.appendChild(badge);
    card.appendChild(imgWrap);

    var body = el('div');
    css(body, { padding: '14px 16px', textAlign: 'center' });

    var addrEl = el('p', {}, listing.address || '');
    css(addrEl, { margin: '0', fontWeight: '500', fontSize: v.typo.address.fontSize + 'px', color: v.typo.address.color, fontFamily: v.typo.address.fontFamily || '' });
    body.appendChild(addrEl);

    var cityPrice = el('p', {}, (listing.city || '') + ', ' + formatPrice(listing.list_price));
    css(cityPrice, { margin: '4px 0 0', fontSize: v.typo.city.fontSize + 'px', color: v.typo.city.color, fontFamily: v.typo.city.fontFamily || '' });
    body.appendChild(cityPrice);

    if (v.showRep && listing.representation) {
      var repEl = el('p', {}, REP_LABELS[listing.representation] || listing.representation);
      css(repEl, { margin: '4px 0 0', fontSize: v.typo.specs.fontSize + 'px', color: v.typo.specs.color });
      body.appendChild(repEl);
    }

    card.appendChild(body);
    return card;
  }

  function renderCardSplitInfo(listing, cfg, href) {
    var v = d(cfg);
    var card = el('a', { href: href, class: PREFIX + '-card' });
    css(card, cardStyles(cfg));

    var imgWrap = makeImgWrap(listing, cfg);
    card.appendChild(imgWrap);

    var body = el('div');
    css(body, { padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' });

    var leftDiv = el('div');
    var addrEl = el('p', {}, listing.address || '');
    css(addrEl, { margin: '0', fontWeight: '500', fontSize: v.typo.address.fontSize + 'px', color: v.typo.address.color, fontFamily: v.typo.address.fontFamily || '' });
    var cityEl = el('p', {}, listing.city || '');
    css(cityEl, { margin: '2px 0 0', fontSize: v.typo.city.fontSize + 'px', color: v.typo.city.color, fontFamily: v.typo.city.fontFamily || '' });
    leftDiv.appendChild(addrEl);
    leftDiv.appendChild(cityEl);

    var rightDiv = el('div');
    css(rightDiv, { textAlign: 'right' });
    if (v.badgePos !== 'hidden') {
      var statusEl = el('p', {}, STATUS_LABELS[listing.listing_status] || listing.listing_status);
      css(statusEl, { margin: '0', fontSize: v.badge.fontSize + 'px', fontWeight: '500', color: v.badge.color });
      rightDiv.appendChild(statusEl);
    }
    var priceEl = el('p', {}, formatPrice(listing.list_price));
    css(priceEl, { margin: '2px 0 0', fontWeight: '600', fontSize: v.typo.price.fontSize + 'px', color: v.typo.price.color, fontFamily: v.typo.price.fontFamily || '' });
    rightDiv.appendChild(priceEl);

    body.appendChild(leftDiv);
    body.appendChild(rightDiv);
    card.appendChild(body);
    return card;
  }

  function renderCard(listing, cfg, href) {
    var layout = (cfg && cfg.cardLayout) || 'classic';
    if (layout === 'overlay') return renderCardOverlay(listing, cfg, href);
    if (layout === 'minimal') return renderCardMinimal(listing, cfg, href);
    if (layout === 'split_info') return renderCardSplitInfo(listing, cfg, href);
    return renderCardClassic(listing, cfg, href);
  }

  // ── Feed renderer ──────────────────────────────────────────────────────────

  function renderFeed(container, config, listings, total, page, loadedExtra) {
    container.innerHTML = '';
    var v = d(config);
    var cols = config.columns || 3;

    var grid = el('div', { class: PREFIX + '-grid' });
    css(grid, { gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gap: v.gap + 'px' });
    var detailPattern = config.detailPageUrlPattern || '#';
    listings.forEach(function (listing) {
      var href = detailPattern.replace('{slug}', listing.slug);
      grid.appendChild(renderCard(listing, config, href));
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
        if (patternParts[i] === ':slug' && pathParts[i]) { slug = pathParts[i]; break; }
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
        for (var j = 0; j < arr.length; j++) { if (arr[j].slug === slug) { listing = arr[j]; break; } }
        if (!listing) { container.innerHTML = '<div class="' + PREFIX + '-loading">Listing not found.</div>'; return; }
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
    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;font-size:13px"><span style="color:#888C99">MLS# ' + (listing.mls_number || '') + '</span></div>';
    if (thumb) { html += '<div style="margin-bottom:32px;border-radius:12px;overflow:hidden"><img src="' + thumb + '" alt="' + (listing.address || '') + '" style="width:100%;max-height:560px;object-fit:cover"></div>'; }
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px">';
    html += '<span style="font-size:32px;font-weight:500;color:#000">' + formatPrice(listing.list_price) + '</span>';
    var badgeBg = status === 'for_sale' ? '#DAFF07' : status === 'pending' ? '#F5F5F3' : '#000';
    var badgeColor = status === 'sold' ? '#fff' : '#000';
    html += '<span style="border-radius:999px;padding:4px 10px;font-size:11px;font-weight:500;background:' + badgeBg + ';color:' + badgeColor + '">' + (STATUS_LABELS[status] || status) + '</span></div>';
    html += '<h2 style="font-size:24px;font-weight:500;color:#000;margin:0 0 4px">' + (listing.address || '') + '</h2>';
    html += '<p style="font-size:13px;color:#888C99;margin:0 0 16px">' + (listing.neighborhood || '') + ', ' + (listing.city || '') + '</p>';
    html += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;border-top:1px solid #EBEBEB;padding-top:16px;font-size:13px;margin-bottom:24px">';
    html += '<div><span style="color:#888C99">Beds</span><br><strong>' + listing.bedrooms + '</strong></div>';
    html += '<div><span style="color:#888C99">Baths</span><br><strong>' + listing.bathrooms + '</strong></div>';
    html += '<div><span style="color:#888C99">Sq Ft</span><br><strong>' + formatNum(listing.living_area_sqft) + '</strong></div>';
    html += '<div><span style="color:#888C99">Year Built</span><br><strong>' + (listing.year_built || '') + '</strong></div>';
    html += '<div><span style="color:#888C99">Type</span><br><strong>' + (listing.property_type || '') + '</strong></div></div>';
    if (listing.description) {
      html += '<div style="margin-bottom:24px"><h3 style="font-size:15px;font-weight:500;color:#000;margin:0 0 12px">About This Property</h3>';
      html += '<p style="font-size:13px;line-height:1.7;color:#888C99;white-space:pre-wrap">' + listing.description + '</p></div>';
    }
    html += '<div style="margin-bottom:24px"><h3 style="font-size:15px;font-weight:500;color:#000;margin:0 0 12px">Property Details</h3>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:13px">';
    var details = [['Property Type', listing.property_type], ['Lot Area', listing.lot_area_value + ' ' + (listing.lot_area_unit || 'sqft')], ['Year Built', listing.year_built], ['Taxes', formatPrice(listing.taxes_annual)], ['MLS', listing.mls_number], ['Brokerage', listing.listing_brokerage]];
    details.forEach(function (dd) { html += '<div style="border:1px solid #EBEBEB;border-radius:12px;padding:16px"><p style="color:#888C99;margin:0 0 4px">' + dd[0] + '</p><p style="font-weight:500;color:#000;margin:0">' + (dd[1] || '') + '</p></div>'; });
    html += '</div></div></div>';
    container.innerHTML = html;
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  function init() {
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
              injectStyles(feedConfig);
              loadPage(container, feedConfig, 1, 0);
            })
            .catch(function () {
              container.innerHTML = '<div class="' + PREFIX + '-loading">Failed to load embed configuration.</div>';
            });
        }
      } else if (type === 'listing-detail') {
        injectStyles({});
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
