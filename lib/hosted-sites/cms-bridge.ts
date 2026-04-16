export function getCmsBridgeScript(): string {
  return `
(function(){
  var tenantId = document.documentElement.getAttribute('data-tenant-id');
  if (!tenantId) return;

  var IMG = '/templates/country/images';

  function tryParse(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && parsed.state ? parsed.state : parsed;
    } catch(e) { return null; }
  }

  function formatPrice(n) {
    if (!n) return '';
    return '$' + Number(n).toLocaleString('en-CA');
  }

  function listingCardHtml(listing, badge) {
    var img = (listing.gallery && listing.gallery[0] && listing.gallery[0].url) || IMG + '/featured-1.webp';
    var price = formatPrice(listing.listPrice);
    var addr = listing.address || 'Property';
    return '<div class="img-hover-wrap"><div class="relative w-full h-[200px] md:h-[280px] overflow-clip"><div class="absolute inset-0 img-hover"><img src="' + img + '" alt="' + addr + '" class="w-full h-full object-cover" /></div><div class="absolute top-0 left-0 p-[8px] z-10"><div class="gold-gradient-bg px-[12px] md:px-[16px] py-[4px] md:py-[6px]"><span class="text-[#09312a] text-[14px] md:text-[16px] leading-[24px] font-normal" style="font-family:\\'Lato\\',sans-serif">' + badge + '</span></div></div></div><div class="py-[12px] md:py-[16px] border-b border-[#daaf3a]"><p class="gold-gradient-text text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-heading" style="font-weight:400">' + price + '</p><p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]" style="font-family:\\'Lato\\',sans-serif">' + addr + '</p></div></div>';
  }

  function blogCardHtml(post) {
    var img = post.featuredImage || IMG + '/about-image.webp';
    var title = post.title || 'Blog Post';
    var cat = post.category || 'Article';
    var excerpt = post.excerpt || '';
    var date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-CA', {year:'numeric',month:'long'}) : '';
    return '<div class="block group"><div class="relative w-full aspect-[16/10] overflow-clip"><img src="' + img + '" alt="' + title + '" class="w-full h-full object-cover" /></div><div class="pt-4 md:pt-5 pb-5 md:pb-6 border-b border-white/10"><span class="gold-gradient-text text-[11px] md:text-[12px] uppercase tracking-[0.1em]" style="font-family:\\'Lato\\',sans-serif">' + cat + '</span><h3 class="font-heading text-[20px] md:text-[24px] leading-[1.25] text-white mt-2" style="font-weight:400">' + title + '</h3><p class="mt-2 text-white/50 text-[12px] md:text-[13px]" style="font-family:\\'Lato\\',sans-serif">' + date + '</p><p class="mt-3 text-white/60 text-[14px] md:text-[15px] leading-[22px] md:leading-[24px] line-clamp-2" style="font-family:\\'Lato\\',sans-serif">' + excerpt + '</p><div class="mt-4"><span class="text-[#daaf3a] text-[13px] md:text-[14px] font-semibold" style="font-family:\\'Lato\\',sans-serif">Read Now</span></div></div></div>';
  }

  function populateListings() {
    var data = tryParse('listings-storage');
    if (!data || !data.listings) return;
    var allListings = data.listings.filter(function(l) { return l.userId === tenantId; });
    if (allListings.length === 0) return;

    var active = allListings.filter(function(l) { return l.listingStatus === 'for_sale'; });
    var sold = allListings.filter(function(l) { return l.listingStatus === 'sold'; });

    var activeContainers = document.querySelectorAll('[data-cms-listings="active"], [data-cms-listings="featured"], [data-cms-listings="estates"]');
    activeContainers.forEach(function(container) {
      if (active.length === 0) return;
      var grid = container.querySelector('.grid');
      if (!grid) return;
      grid.innerHTML = active.map(function(l) { return '<div class="sr visible">' + listingCardHtml(l, 'For Sale') + '</div>'; }).join('');
    });

    var soldContainers = document.querySelectorAll('[data-cms-listings="sold"]');
    soldContainers.forEach(function(container) {
      if (sold.length === 0) return;
      var grid = container.querySelector('.grid');
      if (!grid) return;
      grid.innerHTML = sold.map(function(l) { return '<div class="sr visible">' + listingCardHtml(l, 'Sold') + '</div>'; }).join('');
    });
  }

  function populateBlogs() {
    var data = tryParse('blogs-storage');
    if (!data || !data.blogs) return;
    var blogs = data.blogs.filter(function(b) { return b.userId === tenantId && b.status === 'published'; });
    if (blogs.length === 0) return;

    var containers = document.querySelectorAll('[data-cms-blogs]');
    containers.forEach(function(container) {
      var grid = container.querySelector('.grid');
      if (!grid) return;
      grid.innerHTML = blogs.map(function(b) { return '<div class="sr visible">' + blogCardHtml(b) + '</div>'; }).join('');
    });
  }

  setTimeout(function() {
    populateListings();
    populateBlogs();
  }, 100);
})();
`.trim();
}
