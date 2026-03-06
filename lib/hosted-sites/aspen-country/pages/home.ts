import { IMG } from '../shared';

export function homePage(): string {
  return `
<!-- HERO -->
<section class="relative w-full h-[100svh] md:h-[824px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/hero-bg.webp)"></div>
  <div class="absolute inset-0 bg-black/35"></div>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 md:px-10 lg:px-[60px] text-center pt-[70px] md:pt-[99px]">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[64px] lg:text-[74px] leading-[1.13] lg:leading-[84px] text-white max-w-[970px] text-center" style="font-weight:400">Extraordinary Land. Exceptional Representation</h1>
    <p class="hero-fade hero-fade-delay2 mt-6 md:mt-[39px] text-white text-[14px] md:text-[16px] max-w-[696px] leading-[24px] font-normal text-center" style="font-family:'Lato',sans-serif">Specializing in Sundre and the surrounding Mountain View County region, Aspen Muraski brings deep local expertise to every estate, ranch, and acreage transaction. Whether buying or selling, she delivers results rooted in strategy, care, and precision.</p>
    <div class="hero-fade hero-fade-delay3 flex flex-col sm:flex-row items-center gap-4 sm:gap-[39px] mt-6 md:mt-[39px]">
      <a href="/estates" data-nav class="gold-gradient-bg flex items-center justify-center h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300" style="font-family:'Lato',sans-serif">View Estates</a>
      <a href="/listings/active" data-nav class="flex items-center justify-center h-[47px] w-[178px] border border-white text-white font-semibold text-[14px] hover:bg-white/10 transition-all duration-300" style="font-family:'Lato',sans-serif">View Listings</a>
    </div>
  </div>
</section>

<!-- SERVICE CARDS -->
<section class="bg-[#09312a]">
  <div class="hidden md:flex max-w-[1440px] mx-auto p-5 md:p-10 lg:p-[60px] items-center justify-between gap-4 lg:gap-0">
    ${['Listings', 'Selling', 'Buying'].map((title, i) => {
      const images = ['listings-card.webp', 'selling-card.webp', 'buying-card.webp'];
      const hrefs = ['/listings/active', '/selling', '/buying'];
      return `<div class="sr" style="transition-delay:${i * 0.15}s"><a href="${hrefs[i]}" data-nav class="img-hover-wrap relative block w-full lg:w-[422px] h-[350px] md:h-[479px] overflow-clip">
        <div class="absolute inset-0 img-hover"><img src="${IMG}/${images[i]}" alt="${title}" class="w-full h-full object-cover" /></div>
        <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(90deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)),linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 43.111%)"></div>
        <div class="absolute top-0 left-0 px-[20px] py-[16px]"><div class="flex flex-col"><h3 class="font-heading text-[36px] md:text-[50px] text-white leading-[44px] md:leading-[60px] text-center" style="font-weight:400">${title}</h3><div class="gold-line-hover gold-gradient-bg mt-2"></div></div></div>
      </a></div>`;
    }).join('')}
  </div>
  <div class="md:hidden px-5 py-10 flex flex-col gap-4">
    ${['Listings', 'Selling', 'Buying'].map((title, i) => {
      const images = ['listings-card.webp', 'selling-card.webp', 'buying-card.webp'];
      const hrefs = ['/listings/active', '/selling', '/buying'];
      return `<a href="${hrefs[i]}" data-nav class="relative block w-full h-[250px] overflow-clip"><img src="${IMG}/${images[i]}" alt="${title}" class="w-full h-full object-cover" /><div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(90deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)),linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 43.111%)"></div><div class="absolute top-0 left-0 px-[20px] py-[16px]"><h3 class="font-heading text-[36px] text-white leading-[44px]" style="font-weight:400">${title}</h3></div></a>`;
    }).join('')}
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="relative overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/homepage-testimonial-bg.webp)"></div>
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-24 lg:py-[150px]">
    <div class="sr max-w-[900px] mx-auto text-center"><h2 class="font-heading text-[36px] md:text-[50px] gold-gradient-text leading-[44px] md:leading-[60px]" style="font-weight:400">Testimonials</h2></div>
    <div class="mt-10 md:mt-14 lg:mt-[60px] max-w-[800px] mx-auto" data-testimonials>
      <div class="relative min-h-[320px] sm:min-h-[280px] md:min-h-[260px] flex items-center overflow-hidden">
        <div class="test-item w-full flex flex-col items-center text-center">
          <img src="${IMG}/stars.svg" alt="5 stars" width="135" height="18" class="mb-6 md:mb-8" />
          <p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal" style="font-family:'Lato',sans-serif">" We recently worked with Aspen to purchase a recreational RV lot, and the experience was absolutely fantastic. Aspen was knowledgeable, responsive, and incredibly helpful throughout the entire process. Her knowledge of the RV resort made a big difference\u2014she helped us navigate all the little details that come with buying an RV lot. Aspen was always available to answer questions and made sure everything was handled efficiently and professionally. Thanks to Aspen, we now have the perfect spot to relax and enjoy the outdoors. We couldn\u2019t be happier and highly recommend her to anyone looking for a reliable and experienced realtor in the Sundre area! "</p>
          <p class="mt-6 md:mt-8 text-white text-[14px] md:text-[16px] leading-[24px] font-normal" style="font-family:'Lato',sans-serif">Patti Lang</p>
        </div>
        <div class="test-item w-full flex flex-col items-center text-center" style="display:none">
          <img src="${IMG}/stars.svg" alt="5 stars" width="135" height="18" class="mb-6 md:mb-8" />
          <p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal" style="font-family:'Lato',sans-serif">" Aspen made the entire process of selling our family ranch seamless and stress-free. Her understanding of the rural Alberta market is unmatched, and she positioned our property perfectly to attract the right buyers. Within weeks, we had multiple offers above asking price. Her professionalism, communication, and genuine care for her clients sets her apart from anyone else in the industry. We are so grateful for her guidance. "</p>
          <p class="mt-6 md:mt-8 text-white text-[14px] md:text-[16px] leading-[24px] font-normal" style="font-family:'Lato',sans-serif">Brayden &amp; Kayla M.</p>
        </div>
        <div class="test-item w-full flex flex-col items-center text-center" style="display:none">
          <img src="${IMG}/stars.svg" alt="5 stars" width="135" height="18" class="mb-6 md:mb-8" />
          <p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal" style="font-family:'Lato',sans-serif">" Working with Aspen was a game-changer for us. As first-time acreage buyers, we had a lot of questions and concerns. Aspen guided us through every step with patience and expertise. She found us the perfect property that we didn\u2019t even know existed. Her local connections and deep knowledge of the area made all the difference. We couldn\u2019t recommend her more highly to anyone looking in the Sundre area. "</p>
          <p class="mt-6 md:mt-8 text-white text-[14px] md:text-[16px] leading-[24px] font-normal" style="font-family:'Lato',sans-serif">Mark &amp; Jennifer H.</p>
        </div>
      </div>
      <div class="flex items-center justify-center gap-6 mt-8 md:mt-10">
        <button class="test-prev shrink-0 w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Previous"><img src="${IMG}/arrow-left.svg" alt="Previous" width="24" height="24" /></button>
        <div class="flex gap-2"><button class="test-dot w-2 h-2 rounded-full gold-gradient-bg" aria-label="Testimonial 1"></button><button class="test-dot w-2 h-2 rounded-full bg-white/20" aria-label="Testimonial 2"></button><button class="test-dot w-2 h-2 rounded-full bg-white/20" aria-label="Testimonial 3"></button></div>
        <button class="test-next shrink-0 w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Next"><img src="${IMG}/arrow-left.svg" alt="Next" width="24" height="24" class="scale-x-[-1]" /></button>
      </div>
    </div>
  </div>
</section>

<!-- FEATURED LISTINGS -->
<section class="bg-[#09312a]" data-listings-slider>
  <div class="max-w-[1440px] mx-auto py-10 md:py-[60px] px-5 md:px-10 lg:px-[60px] flex flex-col items-center gap-8 md:gap-[60px]">
    <div class="w-full overflow-hidden" data-cms-listings="featured">
      <div class="listing-page flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-4 lg:gap-0">
        ${[{p:'$1,200,000',a:'33289 Lakeview Court, Sundre, AB',img:'featured-1.webp',b:'For Sale'},{p:'$1,350,000',a:'22034 Lakeview Drive, Sundre, AB',img:'featured-2.webp',b:'For Sale'},{p:'$1,200,000',a:'33291 Lakeview Court, Sundre, AB',img:'featured-3.webp',b:'For Sale'}].map(l => `
        <div class="img-hover-wrap w-full md:w-[calc(50%-12px)] lg:w-[422px] shrink-0">
          <div class="relative w-full h-[200px] md:h-[238px] overflow-clip"><div class="absolute inset-0 img-hover"><img src="${IMG}/${l.img}" alt="${l.a}" class="w-full h-full object-cover" /></div><div class="absolute top-0 left-0 p-[8px] z-10"><div class="gold-gradient-bg px-[12px] md:px-[16px] py-[4px] md:py-[6px]"><span class="text-[#09312a] text-[14px] md:text-[16px] leading-[24px] font-normal" style="font-family:'Lato',sans-serif">${l.b}</span></div></div></div>
          <div class="py-[12px] md:py-[16px] border-b border-[#daaf3a]"><p class="gold-gradient-text text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-heading" style="font-weight:400">${l.p}</p><p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]" style="font-family:'Lato',sans-serif">${l.a}</p></div>
        </div>`).join('')}
      </div>
      <div class="listing-page flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-4 lg:gap-0" style="display:none">
        ${[{p:'$985,000',a:'14422 Mountain View Road, Olds, AB',img:'featured-1.webp',b:'For Sale'},{p:'$1,475,000',a:'78901 Range Road 54, Sundre, AB',img:'featured-2.webp',b:'Sold'},{p:'$2,100,000',a:'55123 Foothills Drive, Sundre, AB',img:'featured-3.webp',b:'For Sale'}].map(l => `
        <div class="img-hover-wrap w-full md:w-[calc(50%-12px)] lg:w-[422px] shrink-0">
          <div class="relative w-full h-[200px] md:h-[238px] overflow-clip"><div class="absolute inset-0 img-hover"><img src="${IMG}/${l.img}" alt="${l.a}" class="w-full h-full object-cover" /></div><div class="absolute top-0 left-0 p-[8px] z-10"><div class="gold-gradient-bg px-[12px] md:px-[16px] py-[4px] md:py-[6px]"><span class="text-[#09312a] text-[14px] md:text-[16px] leading-[24px] font-normal" style="font-family:'Lato',sans-serif">${l.b}</span></div></div></div>
          <div class="py-[12px] md:py-[16px] border-b border-[#daaf3a]"><p class="gold-gradient-text text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-heading" style="font-weight:400">${l.p}</p><p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]" style="font-family:'Lato',sans-serif">${l.a}</p></div>
        </div>`).join('')}
      </div>
    </div>
    <div class="hidden md:flex items-center justify-center gap-[28px]">
      <button class="ls-prev w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Previous"><img src="${IMG}/arrow-left.svg" alt="Previous" width="24" height="24" /></button>
      <a href="/listings/active" data-nav class="text-white text-[14px] font-normal border-b border-white/40 pb-[2px] hover:text-[#daaf3a] hover:border-[#daaf3a] transition-all duration-300" style="font-family:'Lato',sans-serif">View All Listings</a>
      <button class="ls-next w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Next"><img src="${IMG}/arrow-left.svg" alt="Next" width="24" height="24" class="scale-x-[-1]" /></button>
    </div>
    <a href="/listings/active" data-nav class="md:hidden gold-gradient-bg flex items-center justify-center h-[52px] w-full text-[#09312a] font-semibold text-[14px] tracking-wider transition-all duration-300" style="font-family:'Lato',sans-serif">View All Listings</a>
  </div>
</section>

<!-- ABOUT SECTION -->
<section class="bg-[#113d35] border-t border-b border-[#daaf3a]">
  <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-stretch">
    <div class="sr sr-left w-full lg:w-[696px] shrink-0"><div class="img-hover-wrap relative w-full h-[300px] sm:h-[400px] lg:h-[652px] overflow-hidden"><div class="absolute inset-0 img-hover"><img src="${IMG}/about-image.webp" alt="Aspen Muraski" class="w-full h-full object-cover" /></div></div></div>
    <div class="flex-1 flex flex-col justify-center px-5 md:px-10 lg:pl-[96px] lg:pr-[60px] py-10 md:py-16 lg:py-0">
      <div class="sr sr-right lg:w-[588px]">
        <h2 class="font-heading text-[32px] sm:text-[42px] md:text-[50px] gold-gradient-text leading-[1.2] md:leading-[60px]" style="font-weight:400">Meet Aspen Muraski</h2>
        <div class="mt-5 md:mt-[25.565px]">
          <p class="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal" style="font-family:'Lato',sans-serif">Based in Sundre and serving the greater Mountain View County area, Aspen pairs deep local knowledge with a strategic approach to real estate. She knows that successful outcomes come from thoughtful pricing and smart marketing that puts a property in front of the right audience.</p>
          <p class="mt-4 text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal" style="font-family:'Lato',sans-serif">With a focus on acreages, farms, and residential homes, Aspen understands the nuances of rural real estate and manages each transaction with professionalism, care, and attention to detail. Her goal is simple: to make sure every property is handled with precision and sold with confidence.</p>
        </div>
        <a href="/about" data-nav class="inline-flex items-center justify-center mt-6 md:mt-[38px] gold-gradient-bg h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300" style="font-family:'Lato',sans-serif">Learn More</a>
      </div>
    </div>
  </div>
</section>

<!-- CONTACT SECTION (Homepage) -->
<section class="relative overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/homepage-contact-bg.webp)"></div>
  <div class="absolute inset-0 bg-black/60"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
    <div class="sr"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">Get in Touch with Aspen</h2></div>
    <div class="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-[100px] mt-8 md:mt-[53px]">
      <div class="sr flex-1 min-w-0">
        <form class="flex flex-col gap-6 md:gap-[28px]" onsubmit="event.preventDefault()">
          <div class="flex flex-col gap-[12px]">
            <input type="text" placeholder="Name" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/50" style="font-family:'Lato',sans-serif" />
            <input type="email" placeholder="Email" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/50" style="font-family:'Lato',sans-serif" />
            <input type="tel" placeholder="Phone" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/50" style="font-family:'Lato',sans-serif" />
            <textarea placeholder="Message" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal resize-none h-[120px] md:h-[141px] placeholder:text-white/50" style="font-family:'Lato',sans-serif"></textarea>
          </div>
          <div class="flex items-start gap-[11px]"><div class="pt-[2px] shrink-0"><span class="w-[16px] h-[16px] shrink-0 flex items-center justify-center bg-white inline-block"></span></div><p class="text-white text-[11px] md:text-[12px] leading-[18px] md:leading-[20px]" style="font-family:'Lato',sans-serif">I agree to be contacted by Aspen Muraski via call, email, and text for real estate services. To opt out, you can reply &apos;stop&apos; at any time or reply &apos;help&apos; for assistance. You can also click the unsubscribe link in the emails. Message and data rates may apply. Message frequency may vary. <a href="/privacy" data-nav class="underline hover:text-[#daaf3a] transition-colors">Privacy Policy</a>.</p></div>
          <button type="submit" class="gold-gradient-bg flex items-center justify-center h-[47px] w-full text-[#09312a] font-semibold text-[14px] tracking-wider transition-all duration-300" style="font-family:'Lato',sans-serif">Submit</button>
        </form>
      </div>
      <div class="sr sr-right flex-1 min-w-0">
        <div class="pt-0 lg:pt-[10px]">
          <div class="flex flex-col gap-[16px]"><h3 class="font-heading text-[28px] md:text-[34px] gold-gradient-text leading-[36px] md:leading-[42px]" style="font-weight:400">Contact Details</h3><div class="h-[1px] gold-gradient-bg"></div></div>
          <div class="mt-8 md:mt-[63px] flex flex-col gap-[24px] md:gap-[34px]">
            <div class="flex flex-col gap-[10px] md:gap-[14px]"><p class="font-heading text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] gold-gradient-text" style="font-weight:400">Aspen Muraski</p><div class="flex flex-col"><p class="text-white text-[15px] md:text-[16px] leading-[24px]" style="font-family:'Lato',sans-serif">403-703-3909</p><a href="mailto:Aspen@SundreRealEstate.com" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Aspen@SundreRealEstate.com</a><a href="https://SundreRealEstate.com" target="_blank" rel="noopener noreferrer" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">SundreRealEstate.com</a></div></div>
            <div class="flex flex-col gap-[10px] md:gap-[14px]"><p class="font-heading text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] gold-gradient-text" style="font-weight:400">Remax House of Real Estate</p><p class="text-white text-[15px] md:text-[16px] leading-[24px]" style="font-family:'Lato',sans-serif">4034 16 Street SW, Calgary, AB, T2T 4H4</p></div>
            <a href="https://instagram.com/aspenmuraski_real_estate" target="_blank" rel="noopener noreferrer" class="w-[40px] h-[40px] border border-[#daaf3a] rounded-full flex items-center justify-center transition-all duration-300" aria-label="Instagram"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><defs><linearGradient id="igGold" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#daaf3a"/><stop offset="25%" stop-color="#e8c860"/><stop offset="50%" stop-color="#ffebaf"/><stop offset="75%" stop-color="#c9a84c"/><stop offset="100%" stop-color="#9d7500"/></linearGradient></defs><rect x="0.5" y="0.5" width="13" height="13" rx="3" stroke="url(#igGold)" stroke-width="1"/><circle cx="7" cy="7" r="3.5" stroke="url(#igGold)" stroke-width="1"/><circle cx="10.5" cy="3.5" r="1" fill="url(#igGold)"/></svg></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}
