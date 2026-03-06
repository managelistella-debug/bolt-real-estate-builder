import { IMG } from '../shared';

const mktgServices = [
  { label:'Captivating', title:'Property Photography', description:"Aspen's skilled photographers expertly capture the unique character and allure of your property. With a meticulous eye and years of experience, they create stunning visuals for print and online, showcasing your home's elegance to perfection.", image:`${IMG}/photography.webp` },
  { label:'Cinematic', title:'Videography Services', description:"With refined videography expertise, Aspen presents your property through immersive video tours. These professionally crafted videos create a compelling visual journey, allowing buyers to experience the ambiance and flow of your home, sparking immediate interest.", image:`${IMG}/videography.webp` },
  { label:'Exclusive', title:'Open House Experiences', description:"Aspen orchestrates exceptional open houses and private viewings, inviting discerning buyers to experience your property's charm through insightful presentations and neighborhood highlights, helping buyers envision life in their future home.", image:`${IMG}/open-houses.webp` },
  { label:'Influential', title:'Digital Showcasing', description:"Aspen elevates your property's visibility through prime placements on leading real estate platforms nationwide. Exposure on prominent sites like Realtor.ca positions your home before an expansive, targeted audience of interested buyers.", image:`${IMG}/digital-showcasing.webp` },
  { label:'Refined', title:'Print Marketing', description:"Aspen utilizes high-quality postcards, brochures, and direct mail to capture attention within the community. With carefully crafted designs and a strategic local reach, she ensures your property garners interest from serious buyers right from the initial market launch.", image:`${IMG}/print-marketing.webp` },
  { label:'Expansive', title:'Social Media Reach', description:"Aspen broadens your listing's presence through a powerful combination of organic posts and paid social media ads. With tailored campaigns on Instagram and Facebook, she connects your property with engaged buyers actively seeking their next home.", image:`${IMG}/social-media-reach.webp` },
  { label:'Optimized', title:'Email Campaigns', description:"Aspen leverages a vast network of agents, brokers, and eager buyers in a finely tuned email campaign. Through direct outreach, your listing reaches well-qualified local contacts, ensuring your property is seen by those most likely to act promptly.", image:`${IMG}/email-campaigns.webp` },
  { label:'Comprehensive', title:'Floor Plan Visuals', description:"Aspen provides meticulously designed floor plans that allow potential buyers to understand the layout of your property. These detailed visuals offer a comprehensive view, simplifying decision-making and helping buyers envision themselves in the space.", image:`${IMG}/floor-plans.webp` },
];

const sellingSteps = [
  { n:'01', t:'Consultation', d:"A personalized conversation to understand your goals, timeline, and property. Aspen evaluates your home and creates a tailored selling strategy built around your needs." },
  { n:'02', t:'Pricing Strategy', d:"Leveraging market data, comparable sales, and deep local expertise, Aspen positions your property at the optimal price point — attracting serious buyers while maximizing your return." },
  { n:'03', t:'Preparation', d:"From staging guidance to professional photography, Aspen ensures your property makes an unforgettable first impression. Every detail is refined to highlight your home's best features." },
  { n:'04', t:'Marketing Launch', d:"Your property is showcased through a multi-channel campaign — professional photography, video tours, social media, email outreach, and premier listing placements that reach the right audience." },
  { n:'05', t:'Negotiation', d:"With a sharp eye for detail and a strategic approach, Aspen navigates offers and negotiations to secure the best possible terms. She protects your interests at every turn." },
  { n:'06', t:'Closing', d:"Aspen manages every detail from accepted offer to final signature — coordinating inspections, paperwork, and deadlines so you can close with complete confidence." },
];

export function sellingPage(): string {
  return `
<section class="relative w-full min-h-[85svh] md:min-h-0 md:h-[600px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/selling-hero.webp)"></div>
  <div class="absolute inset-0 bg-black/45"></div>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 md:px-10 lg:px-[60px] text-center pt-[80px] pb-[40px] md:pt-[99px] md:pb-0">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[64px] lg:text-[74px] leading-[1.13] lg:leading-[84px] text-white max-w-[900px] text-center" style="font-weight:400">Selling with Aspen</h1>
    <p class="hero-fade hero-fade-delay2 mt-6 md:mt-[39px] text-white text-[14px] md:text-[16px] max-w-[696px] leading-[24px] font-normal text-center" style="font-family:'Lato',sans-serif">From strategic pricing to refined marketing, Aspen delivers a tailored approach that positions your property in front of the right buyers — ensuring a confident, seamless sale.</p>
    <div class="hero-fade hero-fade-delay3 flex flex-col sm:flex-row items-center gap-4 sm:gap-[39px] mt-6 md:mt-[39px]"><a href="#marketing-approach" class="gold-gradient-bg flex items-center justify-center h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300" style="font-family:'Lato',sans-serif">Our Approach</a></div>
  </div>
</section>

<section id="marketing-approach" class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
    <div class="sr"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">Aspen&apos;s Marketing Approach</h2><p class="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] max-w-[700px]" style="font-family:'Lato',sans-serif">A comprehensive, multi-channel strategy designed to showcase your property to the right audience and maximize its value.</p></div>
    <div class="sr mt-10 md:mt-14 lg:mt-[70px]" data-mktg-slider data-mktg-items='${JSON.stringify(mktgServices)}'>
      <div class="flex flex-col lg:flex-row gap-0 border border-[rgba(218,175,58,0.2)]">
        <div class="relative w-full lg:w-[55%] aspect-[16/9] lg:aspect-auto lg:h-[520px] overflow-hidden bg-[#113d35]"><img class="mktg-img w-full h-full object-cover" src="${mktgServices[0].image}" alt="${mktgServices[0].title}" /><div class="absolute inset-0 bg-black/15"></div><div class="absolute bottom-4 left-5 md:bottom-6 md:left-6 z-10"><span class="mktg-counter font-heading text-[14px] text-white/60 tracking-normal" style="font-weight:400">01 / ${String(mktgServices.length).padStart(2,'0')}</span></div></div>
        <div class="flex-1 flex flex-col justify-between bg-[#113d35] p-6 md:p-8 lg:p-10 xl:p-[60px] min-h-[300px] lg:min-h-0">
          <div class="flex-1 flex flex-col justify-center">
            <span class="mktg-label gold-gradient-text font-heading text-[14px] md:text-[16px] tracking-normal" style="font-weight:400">${mktgServices[0].label}</span>
            <h3 class="mktg-title font-heading text-[28px] md:text-[34px] lg:text-[40px] text-white leading-[1.15] mt-2 md:mt-3" style="font-weight:400">${mktgServices[0].title}</h3>
            <div class="w-[50px] h-[2px] gold-gradient-bg mt-5 md:mt-6 mb-5 md:mb-6"></div>
            <p class="mktg-desc text-white/75 text-[14px] md:text-[15px] lg:text-[16px] leading-[22px] md:leading-[26px]" style="font-family:'Lato',sans-serif">${mktgServices[0].description}</p>
          </div>
          <div class="flex items-center justify-between mt-8 lg:mt-10">
            <div class="mktg-dots flex gap-[6px]">${mktgServices.map((_,i) => `<button class="${i===0?'h-[3px] w-[24px] gold-gradient-bg':'h-[3px] w-[12px] bg-white/20 hover:bg-white/40'} transition-all duration-400" aria-label="Slide ${i+1}"></button>`).join('')}</div>
            <div class="flex gap-3">
              <button class="mktg-prev w-[44px] h-[44px] md:w-[52px] md:h-[52px] border border-[#daaf3a] flex items-center justify-center hover:bg-[rgba(218,175,58,0.1)] transition-colors duration-300" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="#daaf3a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <button class="mktg-next w-[44px] h-[44px] md:w-[52px] md:h-[52px] border border-[#daaf3a] flex items-center justify-center hover:bg-[rgba(218,175,58,0.1)] transition-colors duration-300" aria-label="Next"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="scale-x-[-1]"><path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="#daaf3a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bg-[#113d35] border-t border-b border-[#daaf3a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
    <div class="sr text-center max-w-[700px] mx-auto mb-10 md:mb-14 lg:mb-[70px]"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">The Selling Process</h2><p class="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px]" style="font-family:'Lato',sans-serif">A clear, structured approach from first conversation to final closing — so you always know what&apos;s next.</p></div>
    <div class="relative max-w-[700px] mx-auto lg:mx-0 lg:ml-[10%]">
      <div class="absolute left-[21px] md:left-[27px] top-0 bottom-0 w-[1px] bg-white/10 pointer-events-none"></div>
      ${sellingSteps.map((s, i) => `
      <div class="sr relative flex gap-5 md:gap-8 lg:gap-10">
        <div class="flex flex-col items-center shrink-0"><div class="relative w-[44px] h-[44px] md:w-[56px] md:h-[56px] flex items-center justify-center shrink-0"><div class="absolute inset-0 rounded-full" style="border:1px solid ${i < 2 ? '#daaf3a' : 'rgba(255,255,255,0.15)'}"></div><div class="rounded-full" style="width:${i < 2 ? 12 : 6}px;height:${i < 2 ? 12 : 6}px;background:${i < 2 ? 'linear-gradient(90deg,#daaf3a 0%,#e8c860 25%,#ffebaf 50%,#c9a84c 75%,#9d7500 100%)' : 'rgba(255,255,255,0.2)'}"></div></div><div class="w-[1px] flex-1 min-h-[40px]"></div></div>
        <div class="pb-10 md:pb-14 lg:pb-16 pt-2 md:pt-3">
          <span class="font-heading text-[13px] md:text-[14px] tracking-normal uppercase ${i < 2 ? 'gold-gradient-text' : 'text-white/30'}" style="font-weight:400">Step ${s.n}</span>
          <h3 class="font-heading text-[24px] md:text-[30px] lg:text-[36px] leading-[1.2] mt-1 md:mt-2 ${i < 2 ? 'text-white' : 'text-white/40'}" style="font-weight:400">${s.t}</h3>
          <p class="text-[14px] md:text-[15px] lg:text-[16px] leading-[22px] md:leading-[26px] mt-3 md:mt-4 max-w-[520px] ${i < 2 ? 'text-white/70' : 'text-white/25'}" style="font-family:'Lato',sans-serif">${s.d}</p>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="relative overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/selling-cta-bg.webp)"></div>
  <div class="absolute inset-0 bg-black/60"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-20 lg:py-[120px]">
    <div class="max-w-[800px] mx-auto text-center">
      <div class="sr"><h2 class="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]" style="font-weight:400">Ready to Sell Your Property?</h2></div>
      <div class="sr"><p class="mt-5 md:mt-8 text-white/80 text-[14px] md:text-[16px] lg:text-[18px] leading-[22px] md:leading-[28px] max-w-[600px] mx-auto" style="font-family:'Lato',sans-serif">Schedule a complimentary property consultation with Aspen to discuss your goals, review your property&apos;s market position, and outline a personalized selling strategy.</p></div>
      <div class="sr"><div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 md:mt-12"><a href="/contact" data-nav class="gold-gradient-bg flex items-center justify-center h-[52px] w-[240px] text-[#09312a] font-semibold text-[14px] md:text-[15px] tracking-wide transition-all duration-300" style="font-family:'Lato',sans-serif">Request a Consultation</a><a href="tel:4037033909" class="flex items-center justify-center h-[52px] w-[240px] border border-white text-white font-semibold text-[14px] md:text-[15px] hover:bg-white/10 transition-all duration-300" style="font-family:'Lato',sans-serif">Call 403-703-3909</a></div></div>
    </div>
  </div>
</section>`;
}
