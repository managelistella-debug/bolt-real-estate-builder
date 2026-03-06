import { IMG } from '../shared';

export function aboutPage(): string {
  return `
<section class="bg-[#09312a]">
  <div class="h-[70px] md:h-[99px]"></div>
  <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-stretch">
    <div class="w-full lg:w-[50%] shrink-0"><div class="img-hover-wrap relative w-full h-[400px] sm:h-[500px] lg:h-[700px] overflow-hidden"><div class="absolute inset-0 img-hover"><img src="${IMG}/about-image.webp" alt="Aspen Muraski" class="w-full h-full object-cover" /></div></div></div>
    <div class="flex-1 flex flex-col justify-center px-5 md:px-10 lg:pl-[80px] lg:pr-[60px] py-10 md:py-16 lg:py-[80px]">
      <div class="hero-fade hero-fade-delay1">
        <span class="text-white font-heading text-[14px] md:text-[16px]" style="font-weight:400">Meet Your Realtor</span>
        <h1 class="font-heading text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] gold-gradient-text leading-[1.1] mt-3 md:mt-4" style="font-weight:400">Aspen Muraski</h1>
        <div class="w-[60px] h-[2px] gold-gradient-bg mt-6 md:mt-8 mb-6 md:mb-8"></div>
        <p class="text-white/80 text-[15px] md:text-[17px] leading-[24px] md:leading-[28px] max-w-[520px]" style="font-family:'Lato',sans-serif">Based in Mountain View County, Aspen pairs deep local knowledge with a strategic approach to real estate. She knows that successful outcomes come from thoughtful pricing and smart marketing that puts a property in front of the right audience.</p>
        <p class="mt-5 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] max-w-[520px]" style="font-family:'Lato',sans-serif">With a focus on acreages, farms, and residential homes, Aspen understands the nuances of rural real estate and manages each transaction with professionalism, care, and attention to detail.</p>
      </div>
    </div>
  </div>
</section>

<section class="relative bg-[#113d35] border-t border-b border-[#daaf3a] overflow-hidden">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[100px]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      ${[
        {label:'Professional Background',title:'Built on Experience',content:["Aspen's career in real estate is rooted in a genuine passion for connecting people with the right property. Over the years, she has developed a reputation for being thorough, strategic, and deeply committed to her clients' success.","Her experience spans residential homes, working farms, expansive acreages, and estate properties throughout Mountain View County and the surrounding areas. Every transaction she manages reflects her dedication to getting the details right — from initial consultation to final closing."]},
        {label:'Specialization',title:'Why Estates & Ranch Properties',content:["Rural real estate requires a specialized understanding that goes far beyond a standard home sale. Aspen chose to focus on acreages, farms, and estate properties because she understands the unique complexities that come with land — from zoning and water rights to soil quality and access roads.","Her deep familiarity with Mountain View County's landscape, communities, and market trends gives her clients a distinct advantage. Whether purchasing a sprawling ranch or selling a family homestead, Aspen brings insight that only comes from years of local experience."]},
        {label:'Philosophy',title:'Values That Guide Every Transaction',content:["Aspen believes that real estate is about more than buying and selling property — it's about trust, transparency, and building relationships that last well beyond closing day.","Her approach is simple: listen carefully, act with integrity, and always put her clients' interests first. She values clear communication, honest pricing, and a commitment to making every client feel confident and supported throughout the process. Her goal is simple: to make sure every property is handled with precision and sold with confidence."]}
      ].map(s => `
      <div class="sr"><div class="border border-[rgba(218,175,58,0.25)] p-6 md:p-8 lg:p-10 h-full">
        <span class="gold-gradient-text font-heading text-[13px] md:text-[15px] tracking-normal" style="font-weight:400">${s.label}</span>
        <h2 class="font-heading text-[24px] md:text-[26px] lg:text-[30px] text-white leading-[1.15] mt-2 md:mt-3" style="font-weight:400">${s.title}</h2>
        <div class="w-[50px] h-[2px] gold-gradient-bg mt-5 md:mt-6 mb-5 md:mb-7"></div>
        ${s.content.map((p,j) => `<p class="text-white/70 text-[14px] md:text-[15px] leading-[24px] md:leading-[26px] ${j > 0 ? 'mt-4' : ''}" style="font-family:'Lato',sans-serif">${p}</p>`).join('')}
      </div></div>`).join('')}
    </div>
  </div>
</section>

<section class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[100px]">
    <div class="sr max-w-[900px] mx-auto text-center"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">What Clients Say</h2></div>
    <div class="mt-10 md:mt-14 lg:mt-[60px] max-w-[800px] mx-auto" data-testimonials>
      <div class="relative min-h-[300px] sm:min-h-[260px] md:min-h-[240px] flex items-center overflow-hidden">
        ${[
          {q:"We recently worked with Aspen to purchase a recreational RV lot, and the experience was absolutely fantastic. Aspen was knowledgeable, responsive, and incredibly helpful throughout the entire process. Her knowledge of the RV resort made a big difference—she helped us navigate all the little details that come with buying an RV lot.",a:"Patti Lang"},
          {q:"Aspen made the entire process of selling our family ranch seamless and stress-free. Her understanding of the rural Alberta market is unmatched, and she positioned our property perfectly to attract the right buyers. Within weeks, we had multiple offers above asking price.",a:"Brayden & Kayla M."},
          {q:"Working with Aspen was a game-changer for us. As first-time acreage buyers, we had a lot of questions and concerns. Aspen guided us through every step with patience and expertise. She found us the perfect property that we didn't even know existed.",a:"Mark & Jennifer H."}
        ].map((t, i) => `
        <div class="test-item w-full text-center" ${i > 0 ? 'style="display:none"' : ''}>
          <div class="flex items-center justify-center gap-1 mb-6 md:mb-8">${Array(5).fill('<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#starGrad)"/><defs><linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#daaf3a"/><stop offset="50%" stop-color="#ffebaf"/><stop offset="100%" stop-color="#c9a84c"/></linearGradient></defs></svg>').join('')}</div>
          <p class="text-white/80 text-[15px] md:text-[17px] leading-[24px] md:leading-[30px] italic" style="font-family:'Lato',sans-serif">&ldquo;${t.q}&rdquo;</p>
          <p class="mt-6 md:mt-8 font-heading text-[16px] md:text-[18px] gold-gradient-text" style="font-weight:400">${t.a}</p>
        </div>`).join('')}
      </div>
      <div class="flex items-center justify-center gap-6 mt-8 md:mt-10">
        <button class="test-prev shrink-0 w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Previous"><img src="${IMG}/arrow-left.svg" alt="Previous" width="24" height="24" /></button>
        <div class="flex gap-2"><button class="test-dot w-2 h-2 rounded-full gold-gradient-bg"></button><button class="test-dot w-2 h-2 rounded-full bg-white/20"></button><button class="test-dot w-2 h-2 rounded-full bg-white/20"></button></div>
        <button class="test-next shrink-0 w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Next"><img src="${IMG}/arrow-left.svg" alt="Next" width="24" height="24" class="scale-x-[-1]" /></button>
      </div>
    </div>
  </div>
</section>

<section class="relative overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/about-cta-bg.webp)"></div>
  <div class="absolute inset-0 bg-black/55"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-20 lg:py-[120px]">
    <div class="max-w-[700px] mx-auto text-center">
      <div class="sr"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">Connect with Aspen</h2></div>
      <div class="sr"><p class="mt-5 md:mt-8 text-white/80 text-[14px] md:text-[16px] lg:text-[18px] leading-[22px] md:leading-[28px] max-w-[560px] mx-auto" style="font-family:'Lato',sans-serif">Ready to start your real estate journey? Whether buying, selling, or simply exploring your options, Aspen is here to help.</p></div>
      <div class="sr"><div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 md:mt-12">
        <a href="/contact" data-nav class="gold-gradient-bg flex items-center justify-center h-[52px] w-[220px] text-[#09312a] font-semibold text-[14px] md:text-[15px] tracking-wide transition-all duration-300" style="font-family:'Lato',sans-serif">Get in Touch</a>
        <a href="tel:4037033909" class="flex items-center justify-center h-[52px] w-[220px] border border-white text-white font-semibold text-[14px] md:text-[15px] hover:bg-white/10 transition-all duration-300" style="font-family:'Lato',sans-serif">Call 403-703-3909</a>
      </div></div>
    </div>
  </div>
</section>`;
}
