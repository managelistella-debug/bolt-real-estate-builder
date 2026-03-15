"use client";

import Image from "next/image";

const footerNav = [
  { label: "Home", href: "/" },
  { label: "Estates/Ranch Properties", href: "/estates" },
  { label: "Active", href: "/listings/active" },
  { label: "Sold", href: "/listings/sold" },
  { label: "Buying", href: "/buying" },
  { label: "Selling", href: "/selling" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 md:gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/footer-logo.svg"
            alt="Aspen Muraski Real Estate"
            width={234}
            height={128}
            className="w-[180px] md:w-[234px] h-auto object-contain"
          />
          <Image
            src="/images/remax-logo.png"
            alt="RE/MAX House of Real Estate"
            width={157}
            height={65}
            className="h-[50px] md:h-[65px] w-auto object-contain"
          />
        </div>

        <div className="mt-8 md:mt-[55px]" />

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-10">
          <div className="w-full sm:w-[360px] text-center lg:text-left">
            <p
              className="font-heading text-[18px] md:text-[20px] leading-[28px] gold-gradient-text mb-3 md:mb-[14px]"
              style={{ fontWeight: 400 }}
            >
              Aspen Muraski
            </p>
            <div className="flex flex-col items-center lg:items-start">
              <a
                href="tel:4037033909"
                className="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                403-703-3909
              </a>
              <a
                href="mailto:Aspen@SundreRealEstate.com"
                className="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Aspen@SundreRealEstate.com
              </a>
              <a
                href="https://SundreRealEstate.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-[15px] md:text-[16px] leading-[24px] hover:text-[#daaf3a] transition-colors duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                SundreRealEstate.com
              </a>
              <a
                href="https://instagram.com/aspenmuraski_real_estate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-[15px] md:text-[16px] leading-[24px] underline hover:text-[#daaf3a] transition-colors duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                @aspenmuraski_real_estate
              </a>
            </div>
          </div>

          <nav className="flex flex-wrap items-start lg:items-end gap-x-[14px] md:gap-x-[18px] gap-y-2 md:gap-y-3 lg:self-end">
            {footerNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white text-[13px] md:text-[14px] leading-[20px] hover:text-[#daaf3a] transition-colors duration-300 border-b border-white py-[2px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-6 md:mt-10 flex justify-center lg:justify-end">
          <a
            href="/privacy"
            className="text-white/40 text-[8px] leading-[12px] hover:text-white/60 transition-colors duration-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Privacy Policy
          </a>
        </div>

        <div className="mt-4 md:mt-6" />

        <p
          className="text-white/70 text-[8px] leading-[12px] font-light"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Remax House of Real Estate | 4034 &ndash; 16th Street SW, Calgary, AB
          T2T 4H4. Each RE/MAX office is independently owned and operated.
          RE/MAX House of Real Estate fully supports the Equal Housing
          Opportunity laws. RE/MAX House of
          Real Estate make no representations, warranties, or guarantees as to
          the accuracy of the information contained herein, including square
          footage, lot size, or other information concerning the condition,
          suitability, or features of the property. All material is intended for
          informational purposes only and has been obtained from public records,
          MLS, or other sources believed to be reliable, but not verified. All
          prospective buyers should conduct a careful, independent investigation
          of the information and property, and consult with appropriate
          professionals, such as appraisers, architects, civil engineers, or
          others. | &copy; 2025 RE/MAX House of Real Estate. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
