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
    var url = row.thumbnail || (row.gallery && row.gallery[0] && row.gallery[0].url) || '';
    if (url && url.charAt(0) === '/' && ORIGIN) url = ORIGIN + url;
    return url;
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
      showCount: cfg.showListingCount !== false,
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
      carousel: cfg.carousel || { totalListings: 10, visibleCount: 3, arrowPosition: 'beside', arrowSize: 36, arrowColor: '#000', customLeftArrowSvg: '', customRightArrowSvg: '', autoplay: false, autoplayInterval: 5 },
      pagBtn: cfg.paginationButton || { bg: '#fff', color: '#888C99', borderColor: '#EBEBEB', borderWidth: 1, radius: 8, fontFamily: '', fontSize: 13, paddingX: 12, paddingY: 8, hoverBg: '#F5F5F3', hoverColor: '#000' },
      lmBtn: cfg.loadMoreButton || { bg: '#fff', color: '#000', borderColor: '#EBEBEB', borderWidth: 1, radius: 8, fontFamily: '', fontSize: 13, paddingX: 24, paddingY: 10, hoverBg: '#F5F5F3', hoverColor: '#000' },
      maxListings: cfg.maxListings,
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
      background: 'transparent',
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
    css(body, {
      padding: '16px',
      background: v.dBg,
      borderRadius: v.dRadius ? v.dRadius + 'px ' + v.dRadius + 'px 0 0' : '',
      marginTop: v.dRadius ? '-' + v.dRadius + 'px' : '',
      position: 'relative',
      zIndex: '1',
    });

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
    css(body, { padding: '14px 16px', textAlign: 'center', background: v.dBg });

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
    css(body, { padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: v.dBg });

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

  // ── Carousel renderer ─────────────────────────────────────────────────────

  function renderCarousel(container, config, listings) {
    container.innerHTML = '';
    var v = d(config);
    var cc = v.carousel;
    var displayed = listings.slice(0, cc.totalListings || listings.length);
    var visible = cc.visibleCount || 3;
    var offset = 0;
    var maxOffset = Math.max(0, displayed.length - visible);
    var detailPattern = config.detailPageUrlPattern || '#';

    function makeArrowSvg(dir) {
      var custom = dir === 'left' ? cc.customLeftArrowSvg : cc.customRightArrowSvg;
      if (custom) {
        var span = el('span');
        span.innerHTML = custom;
        css(span, { display: 'flex', width: Math.floor(cc.arrowSize * 0.5) + 'px', height: Math.floor(cc.arrowSize * 0.5) + 'px' });
        return span;
      }
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', Math.floor(cc.arrowSize * 0.5));
      svg.setAttribute('height', Math.floor(cc.arrowSize * 0.5));
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', cc.arrowColor || '#000');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      poly.setAttribute('points', dir === 'left' ? '15 18 9 12 15 6' : '9 6 15 12 9 18');
      svg.appendChild(poly);
      return svg;
    }

    function makeArrowBtn(dir) {
      var btn = el('button', { type: 'button' });
      css(btn, {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: cc.arrowSize + 'px', height: cc.arrowSize + 'px',
        borderRadius: '50%', border: '1px solid ' + (cc.arrowColor || '#000'),
        background: 'transparent', cursor: 'pointer', flexShrink: '0',
      });
      btn.appendChild(makeArrowSvg(dir));
      return btn;
    }

    var track = el('div');
    css(track, { display: 'flex', gap: v.gap + 'px', transition: 'transform 0.4s ease' });

    displayed.forEach(function (listing) {
      var href = detailPattern.replace('{slug}', listing.slug);
      var item = el('div');
      css(item, { flex: '0 0 calc(' + (100 / visible) + '% - ' + ((v.gap * (visible - 1)) / visible) + 'px)', minWidth: '0' });
      item.appendChild(renderCardClassic(listing, config, href));
      track.appendChild(item);
    });

    function updateTransform() {
      track.style.transform = 'translateX(-' + (offset * (100 / visible + v.gap / visible)) + '%)';
      if (leftBtn) leftBtn.style.opacity = offset <= 0 ? '0.3' : '1';
      if (rightBtn) rightBtn.style.opacity = offset >= maxOffset ? '0.3' : '1';
    }

    var leftBtn = makeArrowBtn('left');
    var rightBtn = makeArrowBtn('right');
    leftBtn.onclick = function () { if (offset > 0) { offset--; updateTransform(); } };
    rightBtn.onclick = function () { if (offset < maxOffset) { offset++; updateTransform(); } };

    var viewport = el('div');
    css(viewport, { flex: '1', overflow: 'hidden' });
    viewport.appendChild(track);

    if (cc.arrowPosition === 'beside') {
      var row = el('div');
      css(row, { display: 'flex', alignItems: 'center', gap: v.gap + 'px' });
      row.appendChild(leftBtn);
      row.appendChild(viewport);
      row.appendChild(rightBtn);
      container.appendChild(row);
    } else {
      container.appendChild(viewport);
      var arrows = el('div');
      css(arrows, { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' });
      arrows.appendChild(leftBtn);
      arrows.appendChild(rightBtn);
      container.appendChild(arrows);
    }

    updateTransform();

    if (cc.autoplay && cc.autoplayInterval > 0) {
      setInterval(function () {
        offset = offset >= maxOffset ? 0 : offset + 1;
        updateTransform();
      }, cc.autoplayInterval * 1000);
    }
  }

  // ── Feed renderer ──────────────────────────────────────────────────────────

  function renderFeed(container, config, listings, total, page, loadedExtra) {
    container.innerHTML = '';
    var v = d(config);

    if (v.layout === 'carousel') {
      renderCarousel(container, config, listings);
      return;
    }

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
      var pb = v.pagBtn;
      var pagDiv = el('div', { class: PREFIX + '-pagination' });
      css(pagDiv, { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' });
      function makePagBtn(html, isActive, disabled) {
        var btn = el('button', { type: 'button' }, html);
        css(btn, {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: isActive ? '#000' : pb.bg, color: isActive ? '#fff' : pb.color,
          border: pb.borderWidth + 'px solid ' + (isActive ? '#000' : pb.borderColor),
          borderRadius: pb.radius + 'px', fontFamily: pb.fontFamily || 'inherit',
          fontSize: pb.fontSize + 'px', padding: pb.paddingY + 'px ' + pb.paddingX + 'px',
          cursor: disabled ? 'default' : 'pointer', opacity: disabled ? '0.4' : '1',
          minWidth: '34px', transition: 'background .2s, color .2s',
        });
        btn.onmouseenter = function () { if (!disabled && !isActive) { btn.style.background = pb.hoverBg; btn.style.color = pb.hoverColor; } };
        btn.onmouseleave = function () { if (!disabled && !isActive) { btn.style.background = pb.bg; btn.style.color = pb.color; } };
        return btn;
      }
      var prevBtn = makePagBtn('&larr;', false, page <= 1);
      prevBtn.onclick = function () { if (page > 1) loadPage(container, config, page - 1, 0); };
      pagDiv.appendChild(prevBtn);
      for (var i = 1; i <= totalPages; i++) {
        (function (p) {
          var btn = makePagBtn(String(p), p === page, false);
          btn.onclick = function () { loadPage(container, config, p, 0); };
          pagDiv.appendChild(btn);
        })(i);
      }
      var nextBtn = makePagBtn('&rarr;', false, page >= totalPages);
      nextBtn.onclick = function () { if (page < totalPages) loadPage(container, config, page + 1, 0); };
      pagDiv.appendChild(nextBtn);
      container.appendChild(pagDiv);
    }

    if (config.paginationType === 'load_more' && perPage && (perPage + loadedExtra) < total) {
      var lb = v.lmBtn;
      var lmDiv = el('div', { class: PREFIX + '-load-more' });
      css(lmDiv, { display: 'flex', justifyContent: 'center', marginTop: '24px' });
      var lmBtn = el('button', { type: 'button' }, 'Load More');
      css(lmBtn, {
        background: lb.bg, color: lb.color,
        border: lb.borderWidth + 'px solid ' + lb.borderColor,
        borderRadius: lb.radius + 'px', fontFamily: lb.fontFamily || 'inherit',
        fontSize: lb.fontSize + 'px', padding: lb.paddingY + 'px ' + lb.paddingX + 'px',
        cursor: 'pointer', transition: 'background .2s, color .2s',
      });
      lmBtn.onmouseenter = function () { lmBtn.style.background = lb.hoverBg; lmBtn.style.color = lb.hoverColor; };
      lmBtn.onmouseleave = function () { lmBtn.style.background = lb.bg; lmBtn.style.color = lb.color; };
      lmBtn.onclick = function () { loadPage(container, config, 1, loadedExtra + perPage); };
      lmDiv.appendChild(lmBtn);
      container.appendChild(lmDiv);
    }

    if (v.showCount) {
      var countEl = el('p', {}, 'Showing ' + listings.length + ' of ' + total + ' listings');
      css(countEl, { marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#CCC' });
      container.appendChild(countEl);
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

    var isCarousel = (config.cardLayout || 'classic') === 'carousel';
    var perPage = config.itemsPerPage === 'unlimited' ? null : config.itemsPerPage;
    var maxL = config.maxListings;
    if (!isCarousel) {
      if (config.paginationType === 'pagination' && perPage) {
        sp.set('page', String(page));
        sp.set('perPage', String(perPage));
      } else if (config.paginationType === 'load_more' && perPage) {
        sp.set('page', '1');
        sp.set('perPage', String(perPage + loadedExtra));
      }
    }
    if (maxL && maxL !== 'unlimited') sp.set('limit', String(maxL));

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

  // ── Testimonial Feed ─────────────────────────────────────────────────────────

  function tfStarPath(sz) {
    var cx = sz / 2, cy = sz / 2, oR = sz / 2, iR = oR * 0.38;
    var pts = [];
    for (var i = 0; i < 5; i++) {
      var oa = -Math.PI / 2 + (2 * Math.PI * i) / 5;
      var ia = oa + Math.PI / 5;
      pts.push((cx + oR * Math.cos(oa)) + ',' + (cy + oR * Math.sin(oa)));
      pts.push((cx + iR * Math.cos(ia)) + ',' + (cy + iR * Math.sin(ia)));
    }
    return 'M' + pts.join('L') + 'Z';
  }

  function tfIsGrad(v) { return v && v.indexOf('linear-gradient') === 0; }

  function tfParseStops(v) {
    var m = v.match(/^linear-gradient\(\s*\d+deg\s*,\s*(.+)\)$/);
    if (!m) return [{ c: '#D4AF37', p: 0 }, { c: '#F5E6A3', p: 100 }];
    return m[1].split(',').map(function (s) {
      var pp = s.trim().split(/\s+/);
      return { c: pp[0], p: parseInt(pp[1]) || 0 };
    });
  }

  function tfStarsSvg(rating, sz, color, uid) {
    var w = sz * 5 + 8;
    var isG = tfIsGrad(color);
    var gid = 'tfsg-' + uid;
    var svg = '<svg width="' + w + '" height="' + sz + '" viewBox="0 0 ' + w + ' ' + sz + '" xmlns="http://www.w3.org/2000/svg">';
    if (isG) {
      svg += '<defs><linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="0%">';
      tfParseStops(color).forEach(function (s) { svg += '<stop offset="' + s.p + '%" stop-color="' + s.c + '"/>'; });
      svg += '</linearGradient></defs>';
    }
    for (var i = 0; i < 5; i++) {
      var fill = i < rating ? (isG ? 'url(#' + gid + ')' : color) : '#E0E0E0';
      svg += '<g transform="translate(' + (i * (sz + 2)) + ', 0)"><path d="' + tfStarPath(sz) + '" fill="' + fill + '"/></g>';
    }
    svg += '</svg>';
    return svg;
  }

  function tfFmtDate(d) {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch (e) { return d; }
  }

  function tfDefaultArrow(dir, sz, color) {
    var c = tfIsGrad(color) ? '#000' : color;
    var pts = dir === 'left' ? '15 18 9 12 15 6' : '9 6 15 12 9 18';
    return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="' + pts + '" stroke="' + c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function renderTestimonialFeed(container, cfg, testimonials) {
    container.innerHTML = '';

    var items = testimonials.slice();
    if (cfg.selectionMode === 'manual' && cfg.selectedTestimonialIds && cfg.selectedTestimonialIds.length) {
      var sIds = {};
      cfg.selectedTestimonialIds.forEach(function (id) { sIds[id] = true; });
      items = items.filter(function (t) { return sIds[t.id]; });
      if (cfg.sortBy === 'custom_order') {
        var idxMap = {};
        cfg.selectedTestimonialIds.forEach(function (id, i) { idxMap[id] = i; });
        items.sort(function (a, b) { return (idxMap[a.id] || 0) - (idxMap[b.id] || 0); });
      }
    }
    if (cfg.sortBy === 'newest') items.sort(function (a, b) { return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); });
    else if (cfg.sortBy === 'oldest') items.sort(function (a, b) { return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); });
    else if (cfg.sortBy !== 'custom_order') items.sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });

    if (items.length === 0) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:#888;font-family:system-ui">No testimonials to display.</div>';
      return;
    }

    var winW = window.innerWidth;
    var cols = cfg.columns || 1;
    if (winW <= 640 && cfg.responsive && cfg.responsive.mobile && cfg.responsive.mobile.columns) cols = cfg.responsive.mobile.columns;
    else if (winW <= 1024 && cfg.responsive && cfg.responsive.tablet && cfg.responsive.tablet.columns) cols = cfg.responsive.tablet.columns;

    var totalPages = Math.max(1, Math.ceil(items.length / cols));
    var page = 0;

    var wrap = el('div');
    css(wrap, { background: cfg.backgroundColor === 'transparent' ? '' : (cfg.backgroundColor || ''), padding: '24px', fontFamily: 'system-ui, sans-serif' });

    var grid = el('div');
    var navWrap = el('div');

    function renderPage() {
      grid.innerHTML = '';
      css(grid, { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gap: (cfg.gap || 24) + 'px' });

      var pageItems = items.slice(page * cols, page * cols + cols);
      pageItems.forEach(function (t) {
        var card = el('div');
        css(card, {
          background: cfg.cardBackgroundColor || '#fff',
          borderRadius: (cfg.cardRadius || 12) + 'px',
          border: '1px solid ' + (cfg.cardBorderColor || '#EBEBEB'),
          padding: (cfg.cardPadding || 32) + 'px',
          display: 'flex',
          flexDirection: 'column',
        });

        if (cfg.showRating !== false && t.rating && t.rating > 0) {
          var starsDiv = el('div', {}, tfStarsSvg(t.rating, cfg.starSize || 20, cfg.starColor || '#D4AF37', t.id));
          css(starsDiv, { marginBottom: '12px' });
          card.appendChild(starsDiv);
        }

        if (cfg.showQuote !== false) {
          var quote = el('p', {}, '&ldquo;' + t.quote + '&rdquo;');
          css(quote, {
            fontFamily: cfg.quoteFont || '',
            fontSize: (cfg.quoteFontSize || 15) + 'px',
            color: cfg.quoteColor || '#333',
            lineHeight: String(cfg.quoteLineHeight || 1.6),
            marginBottom: '12px',
          });
          card.appendChild(quote);
        }

        var authorDiv = el('div');
        css(authorDiv, { marginTop: 'auto' });

        if (cfg.showAuthorName !== false) {
          var nameEl = el('p', {}, t.author_name || '');
          css(nameEl, {
            fontFamily: cfg.authorNameFont || '',
            fontSize: (cfg.authorNameFontSize || 15) + 'px',
            color: cfg.authorNameColor || '#000',
            fontWeight: '500',
            margin: '0',
          });
          authorDiv.appendChild(nameEl);
        }

        if (cfg.showAuthorTitle !== false && t.author_title) {
          var titleEl = el('p', {}, t.author_title);
          css(titleEl, {
            fontFamily: cfg.authorTitleFont || '',
            fontSize: (cfg.authorTitleFontSize || 13) + 'px',
            color: cfg.authorTitleColor || '#888C99',
            margin: '0',
          });
          authorDiv.appendChild(titleEl);
        }

        if (cfg.showDate && t.date) {
          var dateEl = el('p', {}, tfFmtDate(t.date));
          css(dateEl, {
            fontFamily: cfg.dateFont || '',
            fontSize: (cfg.dateFontSize || 12) + 'px',
            color: cfg.dateColor || '#888C99',
            marginTop: '4px',
          });
          authorDiv.appendChild(dateEl);
        }

        card.appendChild(authorDiv);
        grid.appendChild(card);
      });

      renderNav();
    }

    function renderNav() {
      navWrap.innerHTML = '';
      if (totalPages <= 1) return;
      css(navWrap, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' });

      if (cfg.showArrows !== false) {
        var leftBtn = el('button', { type: 'button' });
        css(leftBtn, { cursor: 'pointer', background: 'none', border: 'none', opacity: page === 0 ? '0.3' : '1', width: (cfg.arrowSize || 36) + 'px', height: (cfg.arrowSize || 36) + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        leftBtn.innerHTML = cfg.customLeftArrowSvg || tfDefaultArrow('left', Math.floor((cfg.arrowSize || 36) * 0.6), cfg.arrowColor || '#000');
        leftBtn.onclick = function () { if (page > 0) { page--; renderPage(); } };
        navWrap.appendChild(leftBtn);
      }

      if (cfg.showDots !== false) {
        var dotsDiv = el('div');
        css(dotsDiv, { display: 'flex', alignItems: 'center', gap: '8px' });
        for (var i = 0; i < totalPages; i++) {
          (function (idx) {
            var dot = el('button', { type: 'button' });
            css(dot, {
              cursor: 'pointer', width: (cfg.dotSize || 8) + 'px', height: (cfg.dotSize || 8) + 'px',
              borderRadius: '50%', background: idx === page ? (cfg.activeDotColor || '#000') : (cfg.inactiveDotColor || '#CCC'),
              border: 'none', padding: '0', transition: 'background 0.2s',
            });
            dot.onclick = function () { page = idx; renderPage(); };
            dotsDiv.appendChild(dot);
          })(i);
        }
        navWrap.appendChild(dotsDiv);
      }

      if (cfg.showArrows !== false) {
        var rightBtn = el('button', { type: 'button' });
        css(rightBtn, { cursor: 'pointer', background: 'none', border: 'none', opacity: page === totalPages - 1 ? '0.3' : '1', width: (cfg.arrowSize || 36) + 'px', height: (cfg.arrowSize || 36) + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        rightBtn.innerHTML = cfg.customRightArrowSvg || tfDefaultArrow('right', Math.floor((cfg.arrowSize || 36) * 0.6), cfg.arrowColor || '#000');
        rightBtn.onclick = function () { if (page < totalPages - 1) { page++; renderPage(); } };
        navWrap.appendChild(rightBtn);
      }
    }

    wrap.appendChild(grid);
    wrap.appendChild(navWrap);
    container.appendChild(wrap);
    renderPage();

    if (cfg.autoplay && cfg.autoplayInterval > 0 && totalPages > 1) {
      setInterval(function () {
        page = (page + 1) % totalPages;
        renderPage();
      }, (cfg.autoplayInterval || 5) * 1000);
    }
  }

  function loadTestimonialFeed(container, cfg) {
    var tenantId = container.getAttribute('data-tenant-id');
    if (!tenantId) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:#888">Missing tenant ID.</div>';
      return;
    }
    container.innerHTML = '<div style="padding:40px;text-align:center;color:#888;font-size:13px">Loading testimonials...</div>';

    fetch(ORIGIN + '/api/data/testimonials?tenantId=' + encodeURIComponent(tenantId))
      .then(function (r) { return r.json(); })
      .then(function (rows) {
        renderTestimonialFeed(container, cfg, rows || []);
      })
      .catch(function () {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#888">Failed to load testimonials.</div>';
      });
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
      } else if (type === 'testimonial-feed') {
        var tfEmbedId = container.getAttribute('data-embed-id');
        if (tfEmbedId) {
          fetch(API_BASE + '/embed-config/' + encodeURIComponent(tfEmbedId))
            .then(function (r) { return r.json(); })
            .then(function (cfg) {
              loadTestimonialFeed(container, cfg.config || {});
            })
            .catch(function () {
              container.innerHTML = '<div style="padding:40px;text-align:center;color:#888">Failed to load embed configuration.</div>';
            });
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
