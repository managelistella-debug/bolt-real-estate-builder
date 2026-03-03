"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Users,
  FileText,
  Palette,
  Code2,
  BarChart3,
  Check,
  Zap,
  Layers,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
   Reusable animation wrappers
   ──────────────────────────────────────────────────────────────────────────── */

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Dashboard mockup (pure CSS)
   ──────────────────────────────────────────────────────────────────────────── */

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="rounded-xl border border-white/10 bg-[#141414] overflow-hidden shadow-2xl shadow-[#DAFF07]/5">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center text-xs text-white/30">
            HeadlessCMS Dashboard
          </div>
        </div>
        <div className="flex">
          <div className="w-44 border-r border-white/5 p-3 space-y-1 hidden sm:block">
            {["Dashboard", "Listings", "Blogs", "CRM", "Pages", "Settings"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`px-3 py-1.5 rounded-md text-xs ${
                    i === 0
                      ? "bg-[#DAFF07] text-black font-medium"
                      : "text-white/40"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </div>
          <div className="flex-1 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 rounded bg-white/10" />
              <div className="h-7 w-20 rounded bg-[#DAFF07]/20 flex items-center justify-center text-[10px] text-[#DAFF07]">
                + New
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-lg bg-white/5 p-3 space-y-2">
                  <div className="h-16 rounded bg-white/5" />
                  <div className="h-3 w-3/4 rounded bg-white/10" />
                  <div className="h-2 w-1/2 rounded bg-white/5" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white/5 p-3 h-20" />
              <div className="rounded-lg bg-white/5 p-3 h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Scroll-responsive marquee
   ──────────────────────────────────────────────────────────────────────────── */

function ScrollMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-300, 0]);

  const row =
    "LISTINGS \u00b7 CRM \u00b7 BLOGS \u00b7 TEMPLATES \u00b7 API \u00b7 SEO \u00b7 DOMAINS \u00b7 ANALYTICS \u00b7 ";
  const row2 =
    "WEBSITES \u00b7 LEADS \u00b7 CONTENT \u00b7 MEDIA \u00b7 WEBHOOKS \u00b7 MULTI-TENANT \u00b7 ";

  return (
    <section
      ref={ref}
      className="py-14 overflow-hidden border-y border-white/5 select-none"
    >
      <motion.div
        style={{ x: x1 }}
        className="flex gap-8 text-5xl md:text-7xl font-black text-white/[0.03] whitespace-nowrap"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i}>{row}</span>
        ))}
      </motion.div>
      <motion.div
        style={{ x: x2 }}
        className="mt-4 flex gap-8 text-5xl md:text-7xl font-black text-white/[0.03] whitespace-nowrap"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i}>{row2}</span>
        ))}
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Horizontal-scroll workflow section
   ──────────────────────────────────────────────────────────────────────────── */

const steps = [
  {
    n: "01",
    title: "Choose your template",
    body: "Start with a professionally designed real estate template. Every pixel is crafted for conversion.",
    accent: "#DAFF07",
  },
  {
    n: "02",
    title: "Customize everything",
    body: "Drag, drop, and tweak. Colors, fonts, layouts — make it unmistakably yours.",
    accent: "#07DAFF",
  },
  {
    n: "03",
    title: "Add your listings",
    body: "Import from MLS or add manually. Rich media, virtual tours, and IDX integration built in.",
    accent: "#FF07DA",
  },
  {
    n: "04",
    title: "Capture every lead",
    body: "Smart forms, automated follow-ups, and a built-in CRM to track every prospect to close.",
    accent: "#DAFF07",
  },
  {
    n: "05",
    title: "Launch & grow",
    body: "One-click publish with custom domain. SEO-optimized. Analytics from day one.",
    accent: "#07DAFF",
  },
];

function HorizontalScroll() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);

  return (
    <section ref={wrap} className="relative h-[300vh] bg-[#0A0A0A]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-16 mb-12">
          <FadeIn>
            <p className="text-[#DAFF07] text-sm font-medium tracking-wider uppercase mb-3">
              How it works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white max-w-xl">
              From zero to launched in five&nbsp;steps
            </h2>
          </FadeIn>
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-6 md:pl-16">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative flex-shrink-0 w-[320px] md:w-[400px] rounded-2xl border border-white/[0.06] bg-[#111] p-8 hover:border-white/20 transition-colors"
            >
              <span
                className="text-7xl font-black opacity-10"
                style={{ color: s.accent }}
              >
                {s.n}
              </span>
              <h3 className="mt-4 text-2xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 text-white/45 leading-relaxed">{s.body}</p>
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: s.accent }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Feature data
   ──────────────────────────────────────────────────────────────────────────── */

const features = [
  {
    icon: Building2,
    title: "Listing Management",
    body: "Showcase properties with rich media galleries, virtual tours, and smart filtering. Import from MLS or manage manually.",
    wide: true,
  },
  {
    icon: Users,
    title: "Built-in CRM",
    body: "Track leads from first click to closing. Automated follow-ups, pipeline views, and contact management.",
    wide: false,
  },
  {
    icon: FileText,
    title: "Blog Engine",
    body: "SEO-optimized content publishing with templates, scheduling, and a rich editor your team will love.",
    wide: false,
  },
  {
    icon: Palette,
    title: "Template Library",
    body: "Dozens of real estate templates. Full visual customization — no code required.",
    wide: true,
  },
  {
    icon: Code2,
    title: "Headless API",
    body: "Full REST API for developers who want total control. Build custom frontends powered by our CMS.",
    wide: false,
  },
  {
    icon: BarChart3,
    title: "Analytics & SEO",
    body: "Understand your traffic, optimize pages, and dominate local search results.",
    wide: false,
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   Testimonial data
   ──────────────────────────────────────────────────────────────────────────── */

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Broker, Mitchell Realty",
    quote:
      "We switched from WordPress and saw our lead capture rate double in the first month. The CRM alone is worth it.",
  },
  {
    name: "James Chen",
    role: "Team Lead, Pacific Homes",
    quote:
      "The headless API let our dev team build exactly what we wanted while the agents manage content themselves.",
  },
  {
    name: "Maria Rodriguez",
    role: "Solo Agent, Austin TX",
    quote:
      "I had my site live in under an hour. The templates are gorgeous and the blog drives serious organic traffic.",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   Pricing data
   ──────────────────────────────────────────────────────────────────────────── */

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For solo agents getting started",
    items: [
      "1 website",
      "Up to 25 listings",
      "Basic CRM",
      "HeadlessCMS subdomain",
      "Community support",
    ],
    cta: "Get started",
    pop: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    desc: "For growing teams and brokerages",
    items: [
      "Unlimited websites",
      "Unlimited listings",
      "Full CRM + automation",
      "Custom domain",
      "Priority support",
      "Blog engine",
      "Analytics dashboard",
    ],
    cta: "Start free trial",
    pop: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large brokerages and franchises",
    items: [
      "Everything in Pro",
      "Headless API access",
      "Multi-tenant management",
      "White-label option",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    pop: false,
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const mockupY = useTransform(heroProgress, [0, 1], [0, -80]);
  const mockupScale = useTransform(heroProgress, [0, 0.6], [1, 0.92]);

  return (
    <main className="bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-[#DAFF07] flex items-center justify-center">
              <Layers className="h-4 w-4 text-black" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              HeadlessCMS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="hover:text-white transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#DAFF07] px-4 py-2 text-sm font-medium text-black hover:bg-[#c8ec06] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-8 overflow-hidden"
      >
        {/* Background: radial glow + dot grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#DAFF07_0%,_transparent_50%)] opacity-[0.07]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Copy */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DAFF07]/30 bg-[#DAFF07]/10 px-4 py-1.5 text-xs font-medium text-[#DAFF07]">
              <Zap className="h-3 w-3" />
              Now with headless API &amp; multi-tenant support
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08]"
          >
            The CMS built for
            <br />
            <span className="text-[#DAFF07]">real&nbsp;estate</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed"
          >
            Build stunning agent websites, manage listings, capture leads, and
            grow your brokerage — all from one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-lg bg-[#DAFF07] px-7 py-3.5 text-sm font-semibold text-black hover:bg-[#c8ec06] transition-all"
            >
              Start building free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 rounded-lg border border-white/15 px-7 py-3.5 text-sm text-white/60 hover:border-white/30 hover:text-white transition-all"
            >
              See how it works
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard mockup — parallax layer */}
        <motion.div
          style={{ y: mockupY, scale: mockupScale }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.65,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="relative z-10 mt-16 w-full max-w-5xl px-6"
        >
          <DashboardMockup />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[#DAFF07]/10 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <FadeIn>
            <p className="text-center text-sm text-white/25 mb-10">
              Trusted by brokerages and agents nationwide
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,400+", label: "Websites launched" },
              { value: "180K", label: "Listings managed" },
              { value: "94%", label: "Client retention" },
              { value: "3.2M", label: "Leads captured" },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1} className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{s.value}</div>
                <div className="mt-1 text-sm text-white/35">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scrolling marquee ──────────────────────────────────────────── */}
      <ScrollMarquee />

      {/* ── Features bento ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-[#DAFF07] text-sm font-medium tracking-wider uppercase mb-3">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-white/35 max-w-2xl mx-auto text-lg">
              Purpose-built tools for real estate professionals. No plugins, no
              patchwork — just a platform that works.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FadeIn
                key={f.title}
                delay={i * 0.08}
                className={f.wide ? "md:col-span-2" : ""}
              >
                <div className="group h-full rounded-2xl border border-white/[0.06] bg-[#111] p-8 hover:border-[#DAFF07]/20 hover:bg-[#131313] transition-all duration-300">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DAFF07]/10 text-[#DAFF07] group-hover:bg-[#DAFF07]/15 transition-colors">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-white/40 leading-relaxed">{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Horizontal-scroll workflow ──────────────────────────────────── */}
      <div id="how-it-works">
        <HorizontalScroll />
      </div>

      {/* ── Developer / API showcase ───────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <p className="text-[#DAFF07] text-sm font-medium tracking-wider uppercase mb-3">
                Developer friendly
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Headless by design, beautiful by default
              </h2>
              <p className="mt-6 text-white/40 text-lg leading-relaxed">
                Use our stunning templates out of the box, or go fully headless.
                The REST API gives you complete control over content while your
                team manages everything through the dashboard.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Full REST API with tenant isolation",
                  "Webhook-driven revalidation",
                  "Custom domain mapping",
                  "Multi-tenant architecture",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-white/55"
                  >
                    <Check className="h-4 w-4 text-[#DAFF07] flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <ScaleIn delay={0.15}>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-white/30 text-xs">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-2">api-example.ts</span>
                </div>
                <pre className="text-white/60 overflow-x-auto leading-relaxed">
                  <code>{`const res = await fetch(
  'https://api.headlesscms.io/v1/listings',
  {
    headers: {
      'X-Tenant': 'your-site-id',
      'Authorization': 'Bearer <token>'
    }
  }
);

const { listings, total } = await res.json();
// → { listings: [...], total: 42 }`}</code>
                </pre>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-24 md:py-32 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-[#DAFF07] text-sm font-medium tracking-wider uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Loved by agents everywhere
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.12}>
                <div className="h-full flex flex-col rounded-2xl border border-white/[0.06] bg-[#111] p-8">
                  <p className="text-white/55 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-white/30">{t.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-[#DAFF07] text-sm font-medium tracking-wider uppercase mb-3">
              Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-white/35 max-w-xl mx-auto text-lg">
              Start free, upgrade when you&apos;re ready.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.1}>
                <div
                  className={`relative h-full flex flex-col rounded-2xl border p-8 ${
                    p.pop
                      ? "border-[#DAFF07]/40 bg-[#DAFF07]/[0.03]"
                      : "border-white/[0.06] bg-[#111]"
                  }`}
                >
                  {p.pop && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#DAFF07] px-4 py-1 text-xs font-semibold text-black">
                      Most popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{p.price}</span>
                    {p.period && (
                      <span className="text-white/30">{p.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-white/35">{p.desc}</p>
                  <ul className="mt-8 space-y-3 flex-1">
                    {p.items.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-white/55"
                      >
                        <Check className="h-4 w-4 text-[#DAFF07] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                      p.pop
                        ? "bg-[#DAFF07] text-black hover:bg-[#c8ec06]"
                        : "border border-white/10 text-white hover:border-white/20"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#DAFF07_0%,_transparent_70%)] opacity-[0.05] pointer-events-none" />
        <FadeIn className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Ready to build your real&nbsp;estate empire?
          </h2>
          <p className="mt-6 text-white/40 text-lg">
            Join thousands of agents and brokerages already growing with
            HeadlessCMS. Free to start, no credit card required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-lg bg-[#DAFF07] px-8 py-4 text-base font-semibold text-black hover:bg-[#c8ec06] transition-all"
            >
              Get started for free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-[#DAFF07] flex items-center justify-center">
                  <Layers className="h-4 w-4 text-black" />
                </div>
                <span className="text-[15px] font-semibold tracking-tight">
                  HeadlessCMS
                </span>
              </div>
              <p className="mt-4 text-sm text-white/25 leading-relaxed">
                The all-in-one platform for real estate websites, CRM, and
                content management.
              </p>
            </div>
            {[
              {
                heading: "Product",
                links: ["Features", "Pricing", "Templates", "API Docs"],
              },
              {
                heading: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                heading: "Legal",
                links: ["Privacy", "Terms", "Security"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm font-semibold text-white/50">
                  {col.heading}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/25 hover:text-white/50 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} HeadlessCMS. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-white/20 hover:text-white/40 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-xs text-white/20 hover:text-white/40 transition-colors"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-xs text-white/20 hover:text-white/40 transition-colors"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
