import { IMG } from '../shared';

export function privacyPage(): string {
  return `
<section class="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
  <div class="absolute inset-0 parallax-bg" style="background-image:url(${IMG}/sold-banner.webp)"></div>
  <div class="absolute inset-0 bg-[#09312a]/85"></div>
  <div class="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
    <h1 class="hero-fade hero-fade-delay1 font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white" style="font-weight:400">Privacy Policy</h1>
  </div>
</section>
<section class="bg-[#09312a]">
  <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
    <div class="sr max-w-[800px]">
      <div class="text-white/80 text-[15px] md:text-[16px] leading-[26px] md:leading-[28px] space-y-6" style="font-family:'Lato',sans-serif">
        <p class="text-white/50 text-[13px] md:text-[14px]">Last updated: March 2025</p>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">Overview</h2><p>Aspen Muraski, operating under RE/MAX House of Real Estate (4034 &ndash; 16th Street SW, Calgary, AB T2T 4H4), respects your privacy. This policy explains how personal information is collected, used, and protected when you use this website or contact Aspen Muraski for real estate services in Sundre, Mountain View County, and the surrounding Alberta foothills.</p></div>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">Information We Collect</h2><p>When you submit a contact form or inquiry on this website, we may collect the following information:</p><ul class="list-disc list-inside mt-3 space-y-1 text-white/70"><li>Your name</li><li>Email address</li><li>Phone number</li><li>Message content and property inquiry details</li></ul><p class="mt-3">This information is provided voluntarily by you when you choose to contact Aspen Muraski through the website.</p></div>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">How We Use Your Information</h2><p>Personal information collected through this website is used solely for the purpose of responding to your real estate inquiries, providing information about properties, and communicating with you regarding buying, selling, or general real estate services in the Sundre and Mountain View County area.</p></div>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">Consent &amp; Communication</h2><p>By submitting a contact form, you agree to be contacted by Aspen Muraski via call, email, and text for real estate services. To opt out, you can reply &ldquo;stop&rdquo; at any time or reply &ldquo;help&rdquo; for assistance. You can also click the unsubscribe link in any emails. Message and data rates may apply. Message frequency may vary.</p></div>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">Third-Party Services</h2><p>This website may contain links to external services such as Google Maps and Instagram. These services have their own privacy policies and are not controlled by Aspen Muraski or RE/MAX House of Real Estate.</p></div>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">MLS &amp; Property Data</h2><p>Property information displayed on this website, including square footage, lot size, and other listing details, is obtained from public records, MLS, or other sources believed to be reliable. RE/MAX House of Real Estate makes no representations, warranties, or guarantees as to the accuracy of this information. All prospective buyers should conduct independent investigation and consult with appropriate professionals.</p></div>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">Data Protection</h2><p>We take reasonable measures to protect the personal information you provide. Your information is not sold, traded, or shared with unrelated third parties.</p></div>
        <div><h2 class="font-heading text-[22px] md:text-[26px] gold-gradient-text leading-[1.3] mb-3" style="font-weight:400">Contact</h2><p>If you have questions about this privacy policy or how your information is handled, please contact:</p><div class="mt-3 space-y-1"><p class="text-white">Aspen Muraski</p><p>RE/MAX House of Real Estate</p><p><a href="tel:4037033909" class="text-white hover:text-[#daaf3a] transition-colors duration-300">403-703-3909</a></p><p><a href="mailto:Aspen@SundreRealEstate.com" class="text-white hover:text-[#daaf3a] transition-colors duration-300">Aspen@SundreRealEstate.com</a></p></div></div>
        <div class="pt-4 border-t border-white/10"><p class="text-white/40 text-[13px]">Each RE/MAX office is independently owned and operated. &copy; 2026 RE/MAX House of Real Estate. All rights reserved.</p></div>
      </div>
    </div>
  </div>
</section>`;
}
