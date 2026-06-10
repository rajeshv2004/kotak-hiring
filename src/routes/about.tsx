import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Heart, ShieldCheck, Trophy, Sprout, Check } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kotak Insurance Careers" },
      {
        name: "description",
        content:
          "Learn about Kotak Mahindra Life Insurance: 99.5% claim settlement, 372+ branches, 25+ years of trust. Discover our Advisory Agent program.",
      },
      { property: "og:title", content: "About Kotak Insurance Careers" },
      {
        property: "og:description",
        content: "India's most trusted life insurance brand and the Advisory Agent program.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: Heart, title: "Customer First", text: "Every decision, every product, every interaction is built around the customer's best interest." },
  { icon: ShieldCheck, title: "Integrity", text: "We believe in transparent, ethical practices in everything we do." },
  { icon: Trophy, title: "Excellence", text: "We set high standards and hold ourselves accountable to deliver them every single time." },
  { icon: Sprout, title: "Growth", text: "We invest in our people because we know that when our agents grow, our customers grow." },
];

const STATS = [
  { v: "99.5%", l: "Claim Settlement" },
  { v: "372+", l: "Branches Nationwide" },
  { v: "1 Lakh+", l: "Trusted Agents" },
  { v: "25+ Years", l: "Of Excellence" },
];

const ELIGIBILITY = [
  ["Age 21 to 55 years", "Graduate or above"],
  ["Class 10 pass minimum", "Prior sales experience"],
  ["Indian resident", "Existing client network"],
  ["Basic smartphone / computer", "Strong communication skills"],
];

function About() {
  return (
    <div>
      <section className="hero-gradient pt-28 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#E8192C] rounded-full blur-3xl blob" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#0A4DA0] rounded-full blur-3xl blob" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-white"
          >
            About Kotak Insurance Careers
          </motion.h1>
        </div>
      </section>

      {/* Company section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A4E]">
              India's Most Trusted Life Insurance Brand
            </h2>
            <div className="w-14 h-0.5 bg-[#E8192C] mt-3" />
            <p className="mt-6 text-foreground/80 leading-relaxed">
              Kotak Mahindra Life Insurance Company Limited is one of India's leading life
              insurance providers with over 25 years of excellence. With a claim settlement
              ratio of 99.5% for FY 2025-26 and a network of 372+ branches across India,
              Kotak is the preferred partner for millions of Indian families.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Our Advisory Agent program is one of the most rewarding career paths in India's
              financial services sector. We offer complete training, strong brand backing,
              and unlimited earning potential to every agent who joins us.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-8 hero-gradient text-white relative overflow-hidden"
            style={{ boxShadow: "var(--shadow-card-hover)" }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#E8192C] opacity-30 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-2 gap-6">
              {STATS.map((s) => (
                <div key={s.l}>
                  <div className="text-3xl md:text-4xl font-extrabold">{s.v}</div>
                  <div className="text-sm text-white/80 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#EBF4FF]">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading title="Our Values" subtitle="The principles that guide every interaction." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl p-6 border border-border transition-shadow hover:shadow-xl"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="w-11 h-11 rounded-lg bg-[#003087]/10 text-[#003087] flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-bold text-[#1A1A4E]">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eligibility table */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading title="Eligibility & Requirements" subtitle="Who can apply and what gives you an edge." />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 rounded-2xl border border-border overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="grid grid-cols-2 bg-[#1A1A4E] text-white">
              <div className="px-6 py-4 font-semibold">Minimum Requirements</div>
              <div className="px-6 py-4 font-semibold border-l border-white/15">Preferred Qualifications</div>
            </div>
            {ELIGIBILITY.map(([a, b], i) => (
              <div key={i} className={`grid grid-cols-2 text-sm md:text-base ${i % 2 ? "bg-[#EBF4FF]" : "bg-white"}`}>
                <div className="px-6 py-4 flex items-center gap-2"><Check size={16} className="text-[#E8192C]" />{a}</div>
                <div className="px-6 py-4 flex items-center gap-2 border-l border-border"><Check size={16} className="text-[#003087]" />{b}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Training */}
      <section className="py-20 bg-[#EBF4FF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHeading title="Our Training Program" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-foreground/80 leading-relaxed"
          >
            Every new agent receives a structured onboarding program: 2-week IRDA certification
            training, product knowledge sessions, sales process training, and ongoing mentorship.
            The certification training is fully covered by Kotak.
          </motion.p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["IRDA Certified", "Product Training", "Sales Mentorship"].map((p) => (
              <span key={p} className="px-4 py-2 rounded-full bg-[#003087] text-white text-sm font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
