"use client";

import ScrollReveal from "../ScrollReveal";

const sections = [
  {
    label: "Professional Background",
    title: "Built on Experience",
    content: [
      "Aspen\u2019s career in real estate is rooted in a genuine passion for connecting people with the right property. Over the years, she has developed a reputation for being thorough, strategic, and deeply committed to her clients\u2019 success.",
      "Her experience spans residential homes, working farms, expansive acreages, and estate properties throughout Mountain View County and the surrounding areas. Every transaction she manages reflects her dedication to getting the details right \u2014 from initial consultation to final closing.",
    ],
  },
  {
    label: "Specialization",
    title: "Why Estates & Ranch Properties",
    content: [
      "Rural real estate requires a specialized understanding that goes far beyond a standard home sale. Aspen chose to focus on acreages, farms, and estate properties because she understands the unique complexities that come with land \u2014 from zoning and water rights to soil quality and access roads.",
      "Her deep familiarity with Mountain View County\u2019s landscape, communities, and market trends gives her clients a distinct advantage. Whether purchasing a sprawling ranch or selling a family homestead, Aspen brings insight that only comes from years of local experience.",
    ],
  },
  {
    label: "Philosophy",
    title: "Values That Guide Every Transaction",
    content: [
      "Aspen believes that real estate is about more than buying and selling property \u2014 it\u2019s about trust, transparency, and building relationships that last well beyond closing day.",
      "Her approach is simple: listen carefully, act with integrity, and always put her clients\u2019 interests first. She values clear communication, honest pricing, and a commitment to making every client feel confident and supported throughout the process. Her goal is simple: to make sure every property is handled with precision and sold with confidence.",
    ],
  },
];

export default function AboutStory() {
  return (
    <section className="relative bg-[#113d35] border-t border-b border-[#daaf3a] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {sections.map((section) => (
            <ScrollReveal key={section.title} delay={0.05}>
              <div className="border border-[rgba(218,175,58,0.25)] p-6 md:p-8 lg:p-10 h-full">
                {/* Label */}
                <span
                  className="gold-gradient-text font-heading text-[13px] md:text-[15px] tracking-normal"
                  style={{ fontWeight: 400 }}
                >
                  {section.label}
                </span>

                {/* Title */}
                <h2
                  className="font-heading text-[24px] md:text-[26px] lg:text-[30px] text-white leading-[1.15] mt-2 md:mt-3"
                  style={{ fontWeight: 400 }}
                >
                  {section.title}
                </h2>

                {/* Gold accent */}
                <div className="w-[50px] h-[2px] gold-gradient-bg mt-5 md:mt-6 mb-5 md:mb-7" />

                {/* Content paragraphs */}
                {section.content.map((paragraph, j) => (
                  <p
                    key={j}
                    className={`text-white/70 text-[14px] md:text-[15px] leading-[24px] md:leading-[26px] ${
                      j > 0 ? "mt-4" : ""
                    }`}
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
