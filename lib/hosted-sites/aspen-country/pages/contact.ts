import { IMG } from '../shared';

export function contactPage(): string {
  return `
<section class="relative w-full h-[50svh] md:h-[400px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/contact-banner.webp)"></div>
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 md:px-10 lg:px-[60px] text-center pt-[70px] md:pt-[99px]">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white max-w-[800px] text-center" style="font-weight:400">Get in Touch</h1>
    <p class="hero-fade hero-fade-delay2 mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] max-w-[500px] leading-[24px] font-normal text-center" style="font-family:'Lato',sans-serif">Have a question or ready to start your real estate journey? Aspen would love to hear from you.</p>
  </div>
</section>

<section class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
    <div class="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-[100px]">
      <div class="sr flex-1 min-w-0">
        <div>
          <h2 class="font-heading text-[28px] md:text-[36px] lg:text-[42px] gold-gradient-text leading-[1.2]" style="font-weight:400">Send a Message</h2>
          <div class="w-[50px] h-[2px] gold-gradient-bg mt-4 md:mt-5 mb-8 md:mb-10"></div>
          <div class="mb-6 md:mb-8">
            <p class="text-white/50 text-[12px] md:text-[13px] uppercase tracking-[0.1em] mb-3" style="font-family:'Lato',sans-serif">What can we help you with?</p>
            <div class="flex flex-wrap gap-2 md:gap-3">
              <button type="button" class="gold-gradient-bg px-4 md:px-5 py-2.5 md:py-3 text-[13px] md:text-[14px] font-medium text-[#09312a] transition-all duration-300" style="font-family:'Lato',sans-serif">General Inquiry</button>
              <button type="button" class="border border-[rgba(218,175,58,0.3)] text-white/70 hover:border-[#daaf3a] hover:text-white px-4 md:px-5 py-2.5 md:py-3 text-[13px] md:text-[14px] font-medium transition-all duration-300" style="font-family:'Lato',sans-serif">Inquire About a Property</button>
              <button type="button" class="border border-[rgba(218,175,58,0.3)] text-white/70 hover:border-[#daaf3a] hover:text-white px-4 md:px-5 py-2.5 md:py-3 text-[13px] md:text-[14px] font-medium transition-all duration-300" style="font-family:'Lato',sans-serif">Inquire About Selling</button>
            </div>
          </div>
          <form class="flex flex-col gap-[12px]" onsubmit="event.preventDefault()">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              <input type="text" placeholder="Full Name" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40" style="font-family:'Lato',sans-serif" />
              <input type="email" placeholder="Email Address" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40" style="font-family:'Lato',sans-serif" />
            </div>
            <input type="tel" placeholder="Phone Number" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40" style="font-family:'Lato',sans-serif" />
            <textarea placeholder="Your Message" class="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal resize-none h-[140px] md:h-[160px] placeholder:text-white/40" style="font-family:'Lato',sans-serif"></textarea>
            <div class="flex items-start gap-[11px] mt-2"><div class="pt-[2px] shrink-0"><span class="w-[16px] h-[16px] shrink-0 flex items-center justify-center bg-white inline-block"></span></div><p class="text-white/60 text-[11px] md:text-[12px] leading-[18px] md:leading-[20px]" style="font-family:'Lato',sans-serif">I agree to be contacted by Aspen Muraski via call, email, and text for real estate services. To opt out, you can reply &apos;stop&apos; at any time or reply &apos;help&apos; for assistance. Message and data rates may apply. <a href="/privacy" data-nav class="underline hover:text-[#daaf3a] transition-colors">Privacy Policy</a>.</p></div>
            <button type="submit" class="gold-gradient-bg flex items-center justify-center h-[52px] w-full text-[#09312a] font-semibold text-[14px] md:text-[15px] tracking-wider transition-all duration-300 mt-2" style="font-family:'Lato',sans-serif">Send Message</button>
          </form>
        </div>
      </div>

      <div class="sr sr-right lg:w-[400px] shrink-0 flex">
        <div class="flex flex-col w-full">
          <h3 class="font-heading text-[28px] md:text-[34px] gold-gradient-text leading-[1.2]" style="font-weight:400">Contact Details</h3>
          <div class="h-[1px] gold-gradient-bg mt-4 md:mt-5"></div>
          <div class="mt-8 md:mt-10"><p class="font-heading text-[18px] md:text-[20px] gold-gradient-text leading-[28px]" style="font-weight:400">Aspen Muraski</p><div class="flex flex-col mt-3 gap-1"><a href="tel:4037033909" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">403-703-3909</a><a href="mailto:Aspen@SundreRealEstate.com" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">Aspen@SundreRealEstate.com</a><a href="https://SundreRealEstate.com" target="_blank" rel="noopener noreferrer" class="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300" style="font-family:'Lato',sans-serif">SundreRealEstate.com</a></div></div>
          <div class="mt-8 md:mt-10"><p class="font-heading text-[18px] md:text-[20px] gold-gradient-text leading-[28px]" style="font-weight:400">Remax House of Real Estate</p><p class="text-white text-[15px] md:text-[16px] leading-[24px] mt-3" style="font-family:'Lato',sans-serif">4034 16 Street SW, Calgary, AB, T2T 4H4</p></div>
          <div class="mt-8 md:mt-10"><p class="text-white/50 text-[12px] md:text-[13px] uppercase tracking-[0.1em] mb-4" style="font-family:'Lato',sans-serif">Follow Along</p><a href="https://instagram.com/aspenmuraski_real_estate" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 text-white text-[14px] md:text-[15px] hover:text-[#daaf3a] transition-colors duration-300 group" style="font-family:'Lato',sans-serif"><span class="w-[40px] h-[40px] border border-[rgba(218,175,58,0.3)] rounded-full flex items-center justify-center group-hover:border-[#daaf3a] transition-colors duration-300"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><defs><linearGradient id="igGoldC" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#daaf3a"/><stop offset="25%" stop-color="#e8c860"/><stop offset="50%" stop-color="#ffebaf"/><stop offset="75%" stop-color="#c9a84c"/><stop offset="100%" stop-color="#9d7500"/></linearGradient></defs><rect x="0.5" y="0.5" width="13" height="13" rx="3" stroke="url(#igGoldC)" stroke-width="1"/><circle cx="7" cy="7" r="3.5" stroke="url(#igGoldC)" stroke-width="1"/><circle cx="10.5" cy="3.5" r="1" fill="url(#igGoldC)"/></svg></span>@aspenmuraski_real_estate</a></div>
          <div class="mt-8 md:mt-10 border border-[rgba(218,175,58,0.15)] overflow-hidden flex-1"><iframe src="https://www.google.com/maps?q=4034+16+Street+SW,+Calgary,+AB,+T2T+4H4&output=embed" width="100%" height="100%" style="border:0;min-height:200px" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Office Location"></iframe></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}
