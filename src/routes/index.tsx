import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight, TrendingUp } from "lucide-react";
import { StatsCounter } from "@/components/StatsCounter";
import { HowItWorks } from "@/components/HowItWorks";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCard, type Testimonial } from "@/components/TestimonialCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kotak Insurance Careers — Shape India's Financial Future" },
      {
        name: "description",
        content:
          "Become a Kotak Life Insurance Advisory Agent. IRDA-certified training, flexible hours, unlimited earning potential. Hiring across India.",
      },
      { property: "og:title", content: "Kotak Insurance Careers — Hiring Across India" },
      {
        property: "og:description",
        content:
          "Join India's most trusted life insurance brand. Build a rewarding career as an Advisory Agent.",
      },
    ],
  }),
  component: Home,
});

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I joined Kotak 4 years ago with zero insurance experience. Today I lead a team of 12 and earn more than I ever did in a corporate job.",
    name: "Ramesh Kumar, Chennai",
    role: "Senior Advisory Agent, 4 Years",
  },
  {
    quote:
      "The training program at Kotak is exceptional. Within 3 months I had my IRDA licence and my first 10 clients. The flexibility is unmatched.",
    name: "Priya Nair, Bangalore",
    role: "Advisory Agent, 2 Years",
  },
  {
    quote:
      "Kotak gave me the tools, the brand, and the support. My clients trust me because they trust Kotak first. That trust is my biggest asset.",
    name: "Mohammed Farouk, Hyderabad",
    role: "Advisory Agent, 3 Years",
  },
];

const BENEFITS = [
  {
    title: "Unlimited Earning Potential",
    text:
      "Your income grows as your portfolio grows. No ceiling on commissions. Top agents earn 15–20 lakhs/year.",
  },
  {
    title: "World-Class Training",
    text:
      "Complete IRDA-certified training program, product knowledge, sales tools, and mentorship from day one.",
  },
  {
    title: "Flexible Work Schedule",
    text:
      "Work at your own pace. Be your own boss. No fixed office hours. Manage your time, manage your success.",
  },
  {
    title: "Kotak Brand Power",
    text:
      "Sell with confidence backed by a brand trusted by millions. 99.5% claim settlement ratio speaks for itself.",
  },
];

function Home() {
  return (
    <div>
      <Hero />
      <StatsCounter />

      {/* Why Join */}
      <section className="bg-[#EBF4FF] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Why Build Your Career With Us?"
            subtitle="Real reasons agents choose Kotak — and stay."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-7 border border-border transition-shadow hover:shadow-xl"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="w-11 h-11 rounded-lg bg-[#E8192C]/10 text-[#E8192C] flex items-center justify-center font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-[#1A1A4E]">{b.title}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Testimonials */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#E8192C] rounded-full blur-3xl blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0A4DA0] rounded-full blur-3xl blob" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <SectionHeading
            invert
            title="Voices From Our Agent Family"
            subtitle="Stories from agents building their futures with Kotak."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} t={t} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#EBF4FF] py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-4 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A4E]">
            Ready to Start Your Insurance Career?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Thousands of agents across India are already building their futures with Kotak. Your turn starts today.
          </p>
          <Link to="/careers" hash="apply" className="btn-primary text-base mt-8 px-7 py-3.5">
            Apply Now — It's Free
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function Hero() {
  const heroWords = "Shape India's Financial Future With Kotak".split(" ");
  return (
    <section className="hero-gradient relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#E8192C] opacity-20 rounded-full blur-3xl blob" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#0A4DA0] opacity-30 rounded-full blur-3xl blob" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl blob" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full bg-[#E8192C]/20 text-white border border-[#E8192C]/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8192C] animate-pulse" />
            Now Hiring | Across India
          </motion.div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
            {heroWords.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: "easeOut" }}
                className="inline-block mr-[0.25em]"
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-5 text-white/80 text-lg max-w-xl"
          >
            Join India's most trusted insurance brand as a Life Insurance Advisory Agent.
            Build your career, earn without limits, and protect millions of Indian families.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/careers" className="btn-primary pulse-cta">
              View Open Positions
              <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-outline-white">Learn More</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85"
          >
            {["IRDAI Regulated", "Training Provided", "Flexible Hours"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Check size={16} className="text-[#E8192C]" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="relative glass-card p-7 md:p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/70">Monthly Earning Potential</div>
                <div className="mt-1 text-3xl md:text-4xl font-extrabold">
                  ₹25,000 – ₹1,50,000<span className="text-[#E8192C]">+</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#E8192C] flex items-center justify-center shadow-lg">
                <TrendingUp size={22} />
              </div>
            </div>

            <div className="mt-6 flex items-end gap-2 h-32">
              {[35, 50, 42, 65, 78, 70, 92].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.07, ease: "easeOut" }}
                  className="flex-1 rounded-md bg-gradient-to-t from-[#E8192C] to-[#ff5a6c]"
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                { v: "₹0", l: "Joining Fee" },
                { v: "2 Wks", l: "Training" },
                { v: "∞", l: "Income Ceiling" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-white/5 border border-white/10 py-3">
                  <div className="text-lg font-bold">{s.v}</div>
                  <div className="text-[11px] text-white/70 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
