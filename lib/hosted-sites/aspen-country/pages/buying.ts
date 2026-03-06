import { IMG } from '../shared';

const steps = [
  { n:'01', t:'Initial Consultation', d:"We start with a one-on-one conversation to understand your vision — whether it's a family home, a working ranch, or an investment property. Aspen takes the time to learn what matters most to you so every search is focused and efficient.", img:'buying-step-1.webp' },
  { n:'02', t:'Property Search & Discovery', d:"Using deep local knowledge and access to both listed and off-market properties, Aspen curates options that match your criteria. From acreages to residential homes, she ensures you see the right properties — not just every property.", img:'buying-step-2.webp' },
  { n:'03', t:'Due Diligence & Evaluation', d:"Every property is carefully evaluated. Aspen helps you navigate zoning, land titles, water rights, soil conditions, and utility access so there are no surprises. Her expertise in rural properties means nothing gets overlooked.", img:'buying-step-3.webp' },
  { n:'04', t:'Negotiation & Offer', d:"With a strategic approach to pricing and negotiation, Aspen works to secure the best terms on your behalf. She handles the paperwork, coordinates with legal and financial professionals, and keeps you informed every step of the way.", img:'buying-step-4.webp' },
  { n:'05', t:'Closing & Beyond', d:"From the accepted offer through to closing day, Aspen manages every detail to ensure a smooth transaction. And her commitment doesn't end at closing — she remains a trusted resource long after you receive the keys.", img:'buying-step-5.webp' },
];

const expertise = [
  { t:'Due Diligence', d:"Thorough investigation of every property before you commit. Aspen reviews land titles, surveys, environmental reports, and legal encumbrances to ensure you have a complete picture. No detail is too small when it comes to protecting your investment." },
  { t:'Zoning & Land Use', d:"Understanding zoning regulations is critical, especially for rural and agricultural properties. Aspen navigates municipal bylaws, land use designations, and development permits to ensure your intended use aligns with local regulations and future plans." },
  { t:'Acreage Considerations', d:"Buying acreage is different from purchasing a residential home. Aspen evaluates soil quality, topography, access roads, fencing, and property boundaries. She understands the unique considerations that come with rural properties and helps you make confident decisions." },
  { t:'Water Rights & Utilities', d:"Water access can make or break a rural property purchase. Aspen investigates water rights, well permits, septic systems, and utility availability — including power, gas, and internet connectivity — so you know exactly what you're getting before closing." },
];

export function buyingPage(): string {
  return `
<section class="relative w-full min-h-[85svh] md:min-h-0 md:h-[600px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/buying-hero.webp)"></div>
  <div class="absolute inset-0 bg-black/45"></div>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 md:px-10 lg:px-[60px] text-center pt-[80px] pb-[40px] md:pt-[99px] md:pb-0">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[64px] lg:text-[74px] leading-[1.13] lg:leading-[84px] text-white max-w-[900px] text-center" style="font-weight:400">Buying with Aspen</h1>
    <p class="hero-fade hero-fade-delay2 mt-6 md:mt-[39px] text-white text-[14px] md:text-[16px] max-w-[696px] leading-[24px] font-normal text-center" style="font-family:'Lato',sans-serif">Whether you're looking for a sprawling acreage, a working ranch, or the perfect residential property, Aspen brings expert guidance to every step of your buying journey.</p>
    <div class="hero-fade hero-fade-delay3"><a href="#buying-process" class="gold-gradient-bg flex items-center justify-center h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300 mt-6 md:mt-[39px]" style="font-family:'Lato',sans-serif">Get Started</a></div>
  </div>
</section>

<section id="buying-process" class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
    <div class="sr"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">Your Buying Journey</h2><p class="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] max-w-[700px]" style="font-family:'Lato',sans-serif">Aspen guides you through every stage of the buying process with expertise, transparency, and personal attention to detail.</p></div>
    <div class="mt-10 md:mt-16 lg:mt-[80px] flex gap-8 xl:gap-[60px]" data-step-accordion>
      <div class="flex-1 flex flex-col gap-2 md:gap-4">
        ${steps.map((s, i) => `
        <div class="sr step-item relative border-l-[2px] transition-colors duration-500 pl-6 md:pl-8 py-4 md:py-6 ${i === 0 ? 'active border-[#daaf3a]' : 'border-white/20'}">
          <span class="font-heading text-[14px] md:text-[16px] tracking-normal uppercase transition-colors duration-500 ${i === 0 ? 'gold-gradient-text' : 'text-white/40'}" style="font-weight:400">Step ${s.n}</span>
          <h3 class="font-heading text-[22px] md:text-[28px] lg:text-[32px] leading-[1.2] mt-2 transition-colors duration-500 ${i === 0 ? 'text-white' : 'text-white/60'}" style="font-weight:400">${s.t}</h3>
          <div class="step-desc overflow-hidden transition-all duration-400" style="max-height:${i === 0 ? '200px' : '0'}"><p class="text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] mt-3 md:mt-4 max-w-[600px]" style="font-family:'Lato',sans-serif">${s.d}</p></div>
        </div>`).join('')}
      </div>
      <div class="hidden xl:block w-[480px] shrink-0"><div class="sticky top-[130px]"><div class="relative w-full h-[560px] overflow-hidden border border-[rgba(218,175,58,0.2)]"><img src="${IMG}/${steps[0].img}" alt="${steps[0].t}" class="w-full h-full object-cover" /></div></div></div>
    </div>
  </div>
</section>

<section class="bg-[#113d35] border-t border-b border-[#daaf3a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
    <div class="sr text-center max-w-[800px] mx-auto"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">Land &amp; Estate Expertise</h2><p class="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px]" style="font-family:'Lato',sans-serif">Purchasing rural property requires specialized knowledge that goes beyond a standard real estate transaction. Aspen&apos;s deep understanding of land and estate properties ensures every angle is covered.</p></div>
    <div class="mt-10 md:mt-14 lg:mt-[70px] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
      ${expertise.map((e, i) => `<div class="sr"><div class="border border-[rgba(218,175,58,0.2)] bg-[#09312a] p-6 md:p-8 lg:p-10 h-full flex flex-col"><div class="mb-5 md:mb-6"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 4L4 14V36H36V14L20 4Z" stroke="url(#g${i})" stroke-width="1.5" stroke-linejoin="round"/><defs><linearGradient id="g${i}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#daaf3a"/><stop offset="50%" stop-color="#ffebaf"/><stop offset="100%" stop-color="#9d7500"/></linearGradient></defs></svg></div><h3 class="font-heading text-[22px] md:text-[26px] lg:text-[28px] text-white leading-[1.2]" style="font-weight:400">${e.t}</h3><div class="w-[40px] h-[2px] gold-gradient-bg mt-4 mb-4 md:mb-5"></div><p class="text-white/70 text-[14px] md:text-[15px] leading-[22px] md:leading-[24px] flex-1" style="font-family:'Lato',sans-serif">${e.d}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<section class="relative overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/buying-mortgage-bg.webp)"></div>
  <div class="absolute inset-0 bg-black/65"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
    <div class="sr text-center max-w-[700px] mx-auto mb-10 md:mb-14 lg:mb-[70px]"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">Mortgage Calculator</h2><p class="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px]" style="font-family:'Lato',sans-serif">Estimate your monthly mortgage payments. Adjust the values below to see how different scenarios affect your budget.</p></div>
    <div class="sr max-w-[600px] mx-auto">
      <div class="bg-[rgba(9,49,42,0.6)] backdrop-blur-sm border border-[rgba(218,175,58,0.3)] p-6 md:p-8 lg:p-10 text-center">
        <p class="text-white/50 text-[12px] md:text-[13px] uppercase tracking-[0.15em] mb-2" style="font-family:'Lato',sans-serif">Estimated Monthly Payment</p>
        <p class="font-heading text-[36px] md:text-[48px] lg:text-[56px] gold-gradient-text leading-tight" style="font-weight:400">$2,837.15</p>
        <p class="mt-4 text-white/60 text-[14px]" style="font-family:'Lato',sans-serif">Based on $500,000 home price, 20% down, 5.5% rate, 25-year amortization</p>
        <a href="/contact" data-nav class="gold-gradient-bg flex items-center justify-center h-[47px] w-full text-[#09312a] font-semibold text-[14px] transition-all duration-300 mt-8" style="font-family:'Lato',sans-serif">Discuss Your Options with Aspen</a>
      </div>
    </div>
  </div>
</section>`;
}
