"use client";

import { useState } from "react";
import ScrollReveal from "@/components/aspen/ScrollReveal";

export default function Contact() {
  const [agreed, setAgreed] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden">
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/homepage-contact-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
        <ScrollReveal>
          <h2
            className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
            style={{ fontWeight: 400 }}
          >
            Get in Touch with Aspen
          </h2>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-[100px] mt-8 md:mt-[53px]">
          <ScrollReveal delay={0.1} className="flex-1 min-w-0">
            <form
              className="flex flex-col gap-6 md:gap-[28px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-[12px]">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/50"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/50"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/50"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
                <textarea
                  placeholder="Message"
                  className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal resize-none h-[120px] md:h-[141px] placeholder:text-white/50"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
              </div>

              <div className="flex items-start gap-[11px]">
                <div className="pt-[2px] shrink-0">
                  <button
                    type="button"
                    onClick={() => setAgreed(!agreed)}
                    className={`w-[16px] h-[16px] shrink-0 flex items-center justify-center transition-all duration-200 ${
                      agreed ? "bg-[#daaf3a]" : "bg-white"
                    }`}
                  >
                    {agreed && (
                      <svg
                        className="w-3 h-3 text-[#09312a]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
                <p
                  className="text-white text-[11px] md:text-[12px] leading-[18px] md:leading-[20px]"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  I agree to be contacted by Aspen Muraski via call, email, and
                  text for real estate services. To opt out, you can reply
                  &apos;stop&apos; at any time or reply &apos;help&apos; for
                  assistance. You can also click the unsubscribe link in the
                  emails. Message and data rates may apply. Message frequency may
                  vary.{" "}
                  <a
                    href="/privacy"
                    className="underline hover:text-[#daaf3a] transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <button
                type="submit"
                className="gold-gradient-bg flex items-center justify-center h-[47px] w-full text-[#09312a] font-semibold text-[14px] tracking-wider transition-all duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Submit
              </button>
            </form>
          </ScrollReveal>

          <ScrollReveal delay={0.25} direction="right" className="flex-1 min-w-0">
            <div className="pt-0 lg:pt-[10px]">
              <div className="flex flex-col gap-[16px]">
                <h3
                  className="font-heading text-[28px] md:text-[34px] gold-gradient-text leading-[36px] md:leading-[42px]"
                  style={{ fontWeight: 400 }}
                >
                  Contact Details
                </h3>
                <div className="h-[1px] gold-gradient-bg" />
              </div>

              <div className="mt-8 md:mt-[63px] flex flex-col gap-[24px] md:gap-[34px]">
                <div className="flex flex-col gap-[10px] md:gap-[14px]">
                  <p
                    className="font-heading text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] gold-gradient-text"
                    style={{ fontWeight: 400 }}
                  >
                    Aspen Muraski
                  </p>
                  <div className="flex flex-col">
                    <p
                      className="text-white text-[15px] md:text-[16px] leading-[24px]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      403-703-3909
                    </p>
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
                  </div>
                </div>

                <div className="flex flex-col gap-[10px] md:gap-[14px]">
                  <p
                    className="font-heading text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] gold-gradient-text"
                    style={{ fontWeight: 400 }}
                  >
                    Remax House of Real Estate
                  </p>
                  <p
                    className="text-white text-[15px] md:text-[16px] leading-[24px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    4034 16 Street SW, Calgary, AB, T2T 4H4
                  </p>
                </div>

                <a
                  href="https://instagram.com/aspenmuraski_real_estate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[40px] h-[40px] border border-[#daaf3a] rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="igGold" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#daaf3a" />
                        <stop offset="25%" stopColor="#e8c860" />
                        <stop offset="50%" stopColor="#ffebaf" />
                        <stop offset="75%" stopColor="#c9a84c" />
                        <stop offset="100%" stopColor="#9d7500" />
                      </linearGradient>
                    </defs>
                    <rect x="0.5" y="0.5" width="13" height="13" rx="3" stroke="url(#igGold)" strokeWidth="1" />
                    <circle cx="7" cy="7" r="3.5" stroke="url(#igGold)" strokeWidth="1" />
                    <circle cx="10.5" cy="3.5" r="1" fill="url(#igGold)" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
