"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "../ScrollReveal";

const inquiryTypes = [
  { label: "General Inquiry", value: "general" },
  { label: "Inquire About a Property", value: "buying" },
  { label: "Inquire About Selling", value: "selling" },
];

export default function ContactSection() {
  const [agreed, setAgreed] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState("general");

  return (
    <section className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-[100px]">
          {/* Left: Form */}
          <ScrollReveal className="flex-1 min-w-0">
            <div>
              <h2
                className="font-heading text-[28px] md:text-[36px] lg:text-[42px] gold-gradient-text leading-[1.2]"
                style={{ fontWeight: 400 }}
              >
                Send a Message
              </h2>
              <div className="w-[50px] h-[2px] gold-gradient-bg mt-4 md:mt-5 mb-8 md:mb-10" />

              {/* Inquiry Type Selector */}
              <div className="mb-6 md:mb-8">
                <p
                  className="text-white/50 text-[12px] md:text-[13px] uppercase tracking-[0.1em] mb-3"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  What can we help you with?
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setActiveInquiry(type.value)}
                      className={`px-4 md:px-5 py-2.5 md:py-3 text-[13px] md:text-[14px] font-medium transition-all duration-300 ${
                        activeInquiry === type.value
                          ? "gold-gradient-bg text-[#09312a]"
                          : "border border-[rgba(218,175,58,0.3)] text-white/70 hover:border-[#daaf3a] hover:text-white"
                      }`}
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <form
                className="flex flex-col gap-[12px]"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                {/* Phone */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />

                {/* Conditional field based on inquiry */}
                {activeInquiry === "buying" && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    type="text"
                    placeholder="Property Address or MLS Number (optional)"
                    className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                )}

                {activeInquiry === "selling" && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    type="text"
                    placeholder="Your Property Address"
                    className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/40"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                )}

                {/* Message */}
                <textarea
                  placeholder="Your Message"
                  className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal resize-none h-[140px] md:h-[160px] placeholder:text-white/40"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />

                {/* Consent */}
                <div className="flex items-start gap-[11px] mt-2">
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
                    className="text-white/60 text-[11px] md:text-[12px] leading-[18px] md:leading-[20px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    I agree to be contacted by Aspen Muraski via call, email,
                    and text for real estate services. To opt out, you can reply
                    &apos;stop&apos; at any time or reply &apos;help&apos; for
                    assistance. Message and data rates may apply.{" "}
                    <a
                      href="/privacy"
                      className="underline hover:text-[#daaf3a] transition-colors"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="gold-gradient-bg flex items-center justify-center h-[52px] w-full text-[#09312a] font-semibold text-[14px] md:text-[15px] tracking-wider transition-all duration-300 mt-2"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Right: Contact Details */}
          <ScrollReveal delay={0.15} direction="right" className="lg:w-[400px] shrink-0 flex">
            <div className="flex flex-col w-full">
              <h3
                className="font-heading text-[28px] md:text-[34px] gold-gradient-text leading-[1.2]"
                style={{ fontWeight: 400 }}
              >
                Contact Details
              </h3>
              <div className="h-[1px] gold-gradient-bg mt-4 md:mt-5" />

              {/* Aspen */}
              <div className="mt-8 md:mt-10">
                <p
                  className="font-heading text-[18px] md:text-[20px] gold-gradient-text leading-[28px]"
                  style={{ fontWeight: 400 }}
                >
                  Aspen Muraski
                </p>
                <div className="flex flex-col mt-3 gap-1">
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
                </div>
              </div>

              {/* Remax */}
              <div className="mt-8 md:mt-10">
                <p
                  className="font-heading text-[18px] md:text-[20px] gold-gradient-text leading-[28px]"
                  style={{ fontWeight: 400 }}
                >
                  Remax House of Real Estate
                </p>
                <p
                  className="text-white text-[15px] md:text-[16px] leading-[24px] mt-3"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  4034 16 Street SW, Calgary, AB, T2T 4H4
                </p>
              </div>

              {/* Social */}
              <div className="mt-8 md:mt-10">
                <p
                  className="text-white/50 text-[12px] md:text-[13px] uppercase tracking-[0.1em] mb-4"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Follow Along
                </p>
                <a
                  href="https://instagram.com/aspenmuraski_real_estate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white text-[14px] md:text-[15px] hover:text-[#daaf3a] transition-colors duration-300 group"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  <span className="w-[40px] h-[40px] border border-[rgba(218,175,58,0.3)] rounded-full flex items-center justify-center group-hover:border-[#daaf3a] transition-colors duration-300">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <defs>
                        <linearGradient
                          id="igGoldContact"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#daaf3a" />
                          <stop offset="25%" stopColor="#e8c860" />
                          <stop offset="50%" stopColor="#ffebaf" />
                          <stop offset="75%" stopColor="#c9a84c" />
                          <stop offset="100%" stopColor="#9d7500" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0.5"
                        y="0.5"
                        width="13"
                        height="13"
                        rx="3"
                        stroke="url(#igGoldContact)"
                        strokeWidth="1"
                      />
                      <circle
                        cx="7"
                        cy="7"
                        r="3.5"
                        stroke="url(#igGoldContact)"
                        strokeWidth="1"
                      />
                      <circle
                        cx="10.5"
                        cy="3.5"
                        r="1"
                        fill="url(#igGoldContact)"
                      />
                    </svg>
                  </span>
                  @aspenmuraski_real_estate
                </a>
              </div>

              {/* Google Map */}
              <div className="mt-8 md:mt-10 border border-[rgba(218,175,58,0.15)] overflow-hidden flex-1">
                <iframe
                  src="https://www.google.com/maps?q=4034+16+Street+SW,+Calgary,+AB,+T2T+4H4&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "200px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RE/MAX House of Real Estate - 4034 16 Street SW, Calgary, AB, T2T 4H4"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
