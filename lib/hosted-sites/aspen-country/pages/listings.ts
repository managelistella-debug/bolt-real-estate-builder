import { IMG } from '../shared';

function listingCard(price: string, address: string, img: string, badge: string): string {
  return `<div class="img-hover-wrap"><div class="relative w-full h-[200px] md:h-[280px] overflow-clip"><div class="absolute inset-0 img-hover"><img src="${IMG}/${img}" alt="${address}" class="w-full h-full object-cover" /></div><div class="absolute top-0 left-0 p-[8px] z-10"><div class="gold-gradient-bg px-[12px] md:px-[16px] py-[4px] md:py-[6px]"><span class="text-[#09312a] text-[14px] md:text-[16px] leading-[24px] font-normal" style="font-family:'Lato',sans-serif">${badge}</span></div></div></div><div class="py-[12px] md:py-[16px] border-b border-[#daaf3a]"><p class="gold-gradient-text text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-heading" style="font-weight:400">${price}</p><p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]" style="font-family:'Lato',sans-serif">${address}</p></div></div>`;
}

export function estatesPage(): string {
  return `
<section class="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/estate-hero.webp)"></div>
  <div class="absolute inset-0 bg-[#09312a]/85"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white" style="font-weight:400">Estates &amp; Ranch Properties</h1>
    <p class="hero-fade hero-fade-delay2 mt-4 md:mt-6 text-white/70 text-[15px] md:text-[16px] max-w-[600px] leading-[26px]" style="font-family:'Lato',sans-serif">Explore exclusive estate and ranch properties in Sundre, Mountain View County, and the surrounding Alberta foothills.</p>
  </div>
</section>
<section class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]" data-cms-listings="estates">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
      <div class="sr">${listingCard('$2,100,000', '55123 Foothills Drive, Sundre, AB', 'featured-3.webp', 'For Sale')}</div>
      <div class="sr">${listingCard('$1,475,000', '78901 Range Road 54, Sundre, AB', 'featured-2.webp', 'For Sale')}</div>
      <div class="sr">${listingCard('$1,200,000', '33289 Lakeview Court, Sundre, AB', 'featured-1.webp', 'For Sale')}</div>
      <div class="sr">${listingCard('$1,350,000', '22034 Lakeview Drive, Sundre, AB', 'featured-2.webp', 'For Sale')}</div>
    </div>
  </div>
</section>`;
}

export function activeListingsPage(): string {
  return `
<section class="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/active-listings-banner.webp)"></div>
  <div class="absolute inset-0 bg-[#09312a]/85"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white" style="font-weight:400">Active Listings</h1>
    <p class="hero-fade hero-fade-delay2 mt-4 md:mt-6 text-white/70 text-[15px] md:text-[16px] max-w-[600px] leading-[26px]" style="font-family:'Lato',sans-serif">Explore our current properties for sale in Sundre, Olds, and across Mountain View County and the surrounding Alberta foothills.</p>
  </div>
</section>
<section class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]" data-cms-listings="active">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
      <div class="sr">${listingCard('$1,200,000', '33289 Lakeview Court, Sundre, AB', 'featured-1.webp', 'For Sale')}</div>
      <div class="sr">${listingCard('$1,350,000', '22034 Lakeview Drive, Sundre, AB', 'featured-2.webp', 'For Sale')}</div>
      <div class="sr">${listingCard('$1,200,000', '33291 Lakeview Court, Sundre, AB', 'featured-3.webp', 'For Sale')}</div>
    </div>
  </div>
</section>`;
}

export function soldListingsPage(): string {
  return `
<section class="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/sold-banner.webp)"></div>
  <div class="absolute inset-0 bg-[#09312a]/85"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white" style="font-weight:400">Sold Properties</h1>
    <p class="hero-fade hero-fade-delay2 mt-4 md:mt-6 text-white/70 text-[15px] md:text-[16px] max-w-[600px] leading-[26px]" style="font-family:'Lato',sans-serif">A selection of properties successfully sold by Aspen Muraski in Sundre, Mountain View County, and the surrounding foothills.</p>
  </div>
</section>
<section class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]" data-cms-listings="sold">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="sr">${listingCard('$985,000', '14422 Mountain View Road, Olds, AB', 'featured-1.webp', 'Sold')}</div>
      <div class="sr">${listingCard('$1,475,000', '78901 Range Road 54, Sundre, AB', 'featured-2.webp', 'Sold')}</div>
      <div class="sr">${listingCard('$2,100,000', '55123 Foothills Drive, Sundre, AB', 'featured-3.webp', 'Sold')}</div>
    </div>
  </div>
</section>`;
}
