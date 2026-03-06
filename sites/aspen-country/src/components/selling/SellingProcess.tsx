"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ScrollReveal from "../ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "A personalized conversation to understand your goals, timeline, and property. Aspen evaluates your home and creates a tailored selling strategy built around your needs.",
  },
  {
    number: "02",
    title: "Pricing Strategy",
    description:
      "Leveraging market data, comparable sales, and deep local expertise, Aspen positions your property at the optimal price point — attracting serious buyers while maximizing your return.",
  },
  {
    number: "03",
    title: "Preparation",
    description:
      "From staging guidance to professional photography, Aspen ensures your property makes an unforgettable first impression. Every detail is refined to highlight your home's best features.",
  },
  {
    number: "04",
    title: "Marketing Launch",
    description:
      "Your property is showcased through a multi-channel campaign — professional photography, video tours, social media, email outreach, and premier listing placements that reach the right audience.",
  },
  {
    number: "05",
    title: "Negotiation",
    description:
      "With a sharp eye for detail and a strategic approach, Aspen navigates offers and negotiations to secure the best possible terms. She protects your interests at every turn.",
  },
  {
    number: "06",
    title: "Closing",
    description:
      "Aspen manages every detail from accepted offer to final signature — coordinating inspections, paperwork, and deadlines so you can close with complete confidence.",
  },
];

function ProcessStep({
  step,
  isActive,
  stepRef,
}: {
  step: (typeof steps)[0];
  isActive: boolean;
  stepRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={stepRef} className="relative flex gap-5 md:gap-8 lg:gap-10">
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0">
        {/* Node */}
        <div className="relative w-[44px] h-[44px] md:w-[56px] md:h-[56px] flex items-center justify-center shrink-0">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isActive ? "#daaf3a" : "rgba(255,255,255,0.15)",
            }}
          />
          {/* Inner fill */}
          <div
            className="rounded-full transition-all duration-500 ease-out"
            style={{
              width: isActive ? 12 : 6,
              height: isActive ? 12 : 6,
              background: isActive
                ? "linear-gradient(90deg, #daaf3a 0%, #e8c860 25%, #ffebaf 50%, #c9a84c 75%, #9d7500 100%)"
                : "rgba(255,255,255,0.2)",
            }}
          />
        </div>

        {/* Spacer for line (line is rendered separately) */}
        <div className="w-[1px] flex-1 min-h-[40px]" />
      </div>

      {/* Content */}
      <div className="pb-10 md:pb-14 lg:pb-16 pt-2 md:pt-3">
        {/* Step number */}
        <span
          className={`font-heading text-[13px] md:text-[14px] tracking-normal uppercase transition-all duration-500 ${
            isActive ? "gold-gradient-text" : "text-white/30"
          }`}
          style={{ fontWeight: 400 }}
        >
          Step {step.number}
        </span>

        {/* Title */}
        <h3
          className={`font-heading text-[24px] md:text-[30px] lg:text-[36px] leading-[1.2] mt-1 md:mt-2 transition-colors duration-500 ${
            isActive ? "text-white" : "text-white/40"
          }`}
          style={{ fontWeight: 400 }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          className={`text-[14px] md:text-[15px] lg:text-[16px] leading-[22px] md:leading-[26px] mt-3 md:mt-4 max-w-[520px] transition-colors duration-500 ${
            isActive ? "text-white/70" : "text-white/25"
          }`}
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function SellingProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [timelineHeight, setTimelineHeight] = useState(0);

  // Track scroll progress through the timeline section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.6", "end 0.4"],
  });

  // Smooth spring for the line progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Get the full height of the timeline for the line
  useEffect(() => {
    const updateHeight = () => {
      if (timelineRef.current) {
        setTimelineHeight(timelineRef.current.scrollHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Convert progress to pixel height
  const lineHeight = useTransform(smoothProgress, [0, 1], [0, timelineHeight]);

  // Determine which step is active based on scroll
  const updateActiveStep = useCallback(() => {
    const viewportCenter = window.innerHeight * 0.5;
    let closest = -1;
    let closestDist = Infinity;

    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const stepCenter = rect.top + rect.height * 0.3;
      const dist = Math.abs(stepCenter - viewportCenter);
      if (dist < closestDist && rect.top < viewportCenter + 100) {
        closestDist = dist;
        closest = i;
      }
    });

    setActiveStep(closest);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateActiveStep, { passive: true });
    updateActiveStep();
    return () => window.removeEventListener("scroll", updateActiveStep);
  }, [updateActiveStep]);

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    []
  );

  return (
    <section className="bg-[#113d35] border-t border-b border-[#daaf3a]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
        {/* Section Heading */}
        <ScrollReveal>
          <div className="text-center max-w-[700px] mx-auto mb-10 md:mb-14 lg:mb-[70px]">
            <h2
              className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              The Selling Process
            </h2>
            <p
              className="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              A clear, structured approach from first conversation to final
              closing — so you always know what&apos;s next.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div
          ref={sectionRef}
          className="relative max-w-[700px] mx-auto lg:mx-0 lg:ml-[10%]"
        >
          {/* Background track line */}
          <div
            className="absolute left-[21px] md:left-[27px] top-0 bottom-0 w-[1px] bg-white/10 pointer-events-none"
          />

          {/* Animated gold progress line */}
          <motion.div
            className="absolute left-[21px] md:left-[27px] top-0 w-[1px] pointer-events-none origin-top"
            style={{
              height: lineHeight,
              background:
                "linear-gradient(180deg, #daaf3a 0%, #e8c860 40%, #ffebaf 60%, #c9a84c 80%, #9d7500 100%)",
            }}
          />

          <div ref={timelineRef}>
            {steps.map((step, i) => (
              <ProcessStep
                key={step.number}
                step={step}
                isActive={i <= activeStep}
                stepRef={setStepRef(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
