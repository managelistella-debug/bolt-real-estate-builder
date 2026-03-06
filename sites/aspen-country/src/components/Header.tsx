"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Buying", href: "/buying" },
  { label: "Selling", href: "/selling" },
  { label: "Estates/Ranch Properties", href: "/estates" },
  { label: "Active Listings", href: "/listings/active" },
  { label: "Sold", href: "/listings/sold" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#09312a]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-[#09312a]"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-10 lg:px-[60px] h-[70px] md:h-[99px]">
          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/header-logo.svg"
              alt="Aspen Muraski Real Estate"
              width={139}
              height={76}
              className="w-[100px] md:w-[139px] h-auto object-contain"
            />
          </a>

          {/* Desktop Nav + Actions */}
          <div className="hidden xl:flex items-center">
            <nav className="flex items-center gap-[30px]">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative group flex items-center gap-[4px] text-white text-[14px] font-normal leading-[20px] py-[2px] hover:text-[#daaf3a] transition-colors duration-300 cursor-pointer"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#daaf3a] group-hover:w-full transition-all duration-300 ease-out" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-[43px] ml-[127px]">
              <a
                href="tel:4037033909"
                className="gold-gradient-bg flex items-center justify-center h-[47px] w-[134px] text-[#31443a] text-[14px] font-semibold transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Call Aspen
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-[52px] h-[47px] bg-[#113d35] border border-solid border-[#daaf3a] hover:bg-[#1a5248] transition-colors duration-300 cursor-pointer"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col items-center justify-center gap-[7px]">
                  <span className="block w-[22px] h-[1px] gold-gradient-bg" />
                  <span className="block w-[22px] h-[1px] gold-gradient-bg" />
                  <span className="block w-[22px] h-[1px] gold-gradient-bg" />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden flex items-center justify-center w-[44px] h-[40px] md:w-[52px] md:h-[47px] bg-[#113d35] border border-solid border-[#daaf3a] cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-center justify-center gap-[6px] md:gap-[7px]">
              <span
                className={`block w-[20px] md:w-[22px] h-[1px] gold-gradient-bg transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[7px] md:translate-y-[8px]" : ""
                }`}
              />
              <span
                className={`block w-[20px] md:w-[22px] h-[1px] gold-gradient-bg transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-[20px] md:w-[22px] h-[1px] gold-gradient-bg transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[7px] md:-translate-y-[8px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Expanded Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[60] bg-[#09312a] overflow-hidden"
          >
            <div className="flex h-full">
              {/* Left: Image (desktop only) */}
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.1,
                }}
                className="hidden lg:block relative w-[50%] h-full"
              >
                <Image
                  src="/images/expanded-menu.webp"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
              </motion.div>

              {/* Right: Nav items */}
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.1,
                }}
                className="flex-1 flex flex-col h-full overflow-y-auto"
              >
                {/* Close button */}
                <div className="flex justify-end px-5 md:px-10 lg:px-[60px] pt-4 md:pt-6 shrink-0">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-white text-[14px] hover:text-[#daaf3a] transition-colors duration-300 cursor-pointer"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Close Menu
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 3L13 13M13 3L3 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 flex flex-col justify-center px-5 md:px-10 lg:px-[60px] xl:px-[80px] py-4">
                  {navItems.map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3 + i * 0.06,
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      onClick={() => setMenuOpen(false)}
                      className="group border-b border-white/10 py-[clamp(10px,2vh,20px)] cursor-pointer"
                    >
                      <span
                        className="font-heading text-[clamp(18px,2.5vh,28px)] text-white group-hover:text-[#daaf3a] transition-colors duration-300"
                        style={{ fontWeight: 400 }}
                      >
                        {item.label}
                      </span>
                    </motion.a>
                  ))}

                  {/* Contact Aspen button in menu */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + navItems.length * 0.06,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="mt-[clamp(16px,2vh,40px)]"
                  >
                    <a
                      href="tel:4037033909"
                      onClick={() => setMenuOpen(false)}
                      className="gold-gradient-bg inline-flex items-center justify-center h-[52px] px-10 text-[#09312a] font-semibold text-[14px] md:text-[15px] transition-all duration-300 cursor-pointer"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Call Aspen
                    </a>
                  </motion.div>
                </nav>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
