import { IMG } from '../shared';

export function blogPage(): string {
  return `
<section class="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/blog-banner.webp)"></div>
  <div class="absolute inset-0 bg-[#09312a]/85"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white" style="font-weight:400">Blog</h1>
    <p class="hero-fade hero-fade-delay2 mt-4 md:mt-6 text-white/70 text-[15px] md:text-[16px] max-w-[600px] leading-[26px]" style="font-family:'Lato',sans-serif">Insights, market updates, and expert advice on buying and selling rural properties in Sundre and the surrounding foothills.</p>
  </div>
</section>
<section class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]" data-cms-blogs>
    <div class="sr block mb-10 md:mb-14">
      <div class="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10">
        <div class="relative w-full lg:w-[60%] aspect-[16/9] overflow-clip"><img src="${IMG}/blog-banner.webp" alt="Featured blog post" class="w-full h-full object-cover" /></div>
        <div class="flex-1 flex flex-col justify-center">
          <span class="gold-gradient-text text-[12px] md:text-[13px] uppercase tracking-[0.1em] mb-2 md:mb-3" style="font-family:'Lato',sans-serif">Market Update</span>
          <h2 class="font-heading text-[24px] sm:text-[28px] md:text-[34px] lg:text-[38px] leading-[1.2] text-white" style="font-weight:400">Mountain View County Real Estate Market: What You Need to Know</h2>
          <p class="mt-3 md:mt-4 text-white/50 text-[13px] md:text-[14px]" style="font-family:'Lato',sans-serif">March 2025 &middot; Aspen Muraski</p>
          <p class="mt-3 md:mt-4 text-white/70 text-[14px] md:text-[15px] leading-[24px] md:leading-[26px] line-clamp-3" style="font-family:'Lato',sans-serif">As the spring season approaches, the real estate market in Mountain View County continues to evolve. Whether you're looking to buy or sell, understanding the current trends can help you make informed decisions.</p>
          <div class="mt-5 md:mt-6"><span class="inline-flex items-center justify-center gold-gradient-bg h-[42px] px-6 text-[#09312a] font-semibold text-[13px] md:text-[14px] transition-all duration-300" style="font-family:'Lato',sans-serif">Read Article</span></div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      ${[
        {cat:'Buying Guide',title:'First-Time Acreage Buyer? Here&apos;s What to Know',date:'February 2025',excerpt:'From water rights to zoning regulations, buying rural property requires specialized knowledge. Here are the key considerations every first-time acreage buyer should understand.'},
        {cat:'Selling Tips',title:'5 Steps to Prepare Your Ranch Property for Sale',date:'January 2025',excerpt:'Selling a ranch or estate property is different from a standard home sale. Learn how to position your property to attract qualified buyers and maximize your return.'},
        {cat:'Community',title:'Why Sundre Is One of Alberta&apos;s Best-Kept Secrets',date:'December 2024',excerpt:'Nestled in the foothills of the Canadian Rockies, Sundre offers a unique blend of natural beauty, community spirit, and real estate opportunity.'},
        {cat:'Market Insights',title:'Understanding Land Titles in Rural Alberta',date:'November 2024',excerpt:'Land titles can be complex, especially for rural properties. This guide breaks down what you need to know about titles, easements, and encumbrances.'}
      ].map(p => `
      <div class="sr"><div class="block group"><div class="relative w-full aspect-[16/10] overflow-clip"><img src="${IMG}/about-image.webp" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div><div class="pt-4 md:pt-5 pb-5 md:pb-6 border-b border-white/10"><span class="gold-gradient-text text-[11px] md:text-[12px] uppercase tracking-[0.1em]" style="font-family:'Lato',sans-serif">${p.cat}</span><h3 class="font-heading text-[20px] md:text-[24px] leading-[1.25] text-white mt-2" style="font-weight:400">${p.title}</h3><p class="mt-2 text-white/50 text-[12px] md:text-[13px]" style="font-family:'Lato',sans-serif">${p.date}</p><p class="mt-3 text-white/60 text-[14px] md:text-[15px] leading-[22px] md:leading-[24px] line-clamp-2" style="font-family:'Lato',sans-serif">${p.excerpt}</p><div class="mt-4"><span class="text-[#daaf3a] text-[13px] md:text-[14px] font-semibold" style="font-family:'Lato',sans-serif">Read Now</span></div></div></div></div>`).join('')}
    </div>
  </div>
</section>`;
}
