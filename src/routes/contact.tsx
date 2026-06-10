import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, Clock, MapPin, ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ApplicationForm } from "@/components/ApplicationForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kotak Insurance Careers" },
      {
        name: "description",
        content:
          "Get in touch with the Kotak Insurance careers team. Email, phone, and a quick application form.",
      },
      { property: "og:title", content: "Get In Touch — Kotak Insurance Careers" },
      {
        property: "og:description",
        content: "Reach our careers team or submit a quick application directly.",
      },
    ],
  }),
  component: Contact,
});

const FAQS = [
  {
    q: "How long does the selection process take?",
    a: "Our team typically reaches out within 2 business days of receiving your application. The full process from application to licence takes approximately 3-4 weeks.",
  },
  {
    q: "Is there any fee to become an agent?",
    a: "No. There is absolutely no joining fee. Kotak covers all training and certification costs for selected candidates.",
  },
  {
    q: "Do I need prior insurance experience?",
    a: "No prior experience is required. Our training program is designed for freshers and career changers alike.",
  },
  {
    q: "Can I work part-time?",
    a: "Yes. Many of our agents start part-time and transition to full-time as their client base grows.",
  },
];

function Contact() {
  return (
    <div>
      <section className="hero-gradient pt-28 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-[#E8192C] rounded-full blur-3xl blob" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-white"
          >
            Get In Touch
          </motion.h1>
          <p className="mt-3 text-white/80">We typically respond within 2 business days.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* Left: contact details + FAQ */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-border p-7"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <h2 className="text-2xl font-bold text-[#1A1A4E]">Reach Our Careers Team</h2>
              <div className="w-12 h-0.5 bg-[#E8192C] mt-2" />
              <ul className="mt-6 space-y-4 text-sm">
                <ContactRow icon={Mail} label="Email" value="careers@kotakinsurance.com" />
                <ContactRow icon={Phone} label="Phone" value="1800-209-8800 (Toll Free)" />
                <ContactRow icon={Clock} label="Working Hours" value="Mon–Sat, 9:00 AM – 6:00 PM" />
                <ContactRow
                  icon={MapPin}
                  label="Headquarters"
                  value="Kotak Mahindra Life Insurance, 8th Floor, BKC, Bandra East, Mumbai — 400051"
                />
              </ul>
            </motion.div>

            <div className="mt-10">
              <SectionHeading align="left" title="Frequently Asked" />
              <div className="mt-6 space-y-3">
                {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
              </div>
            </div>
          </div>

          {/* Right: quick application */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-[#1A1A4E]">Quick Application</h2>
              <div className="w-12 h-0.5 bg-[#E8192C] mt-2" />
              <p className="mt-2 text-muted-foreground">Prefer to apply directly? Fill this short form.</p>
              <div className="mt-6">
                <ApplicationForm variant="compact" submitLabel="Send Application" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({
  icon: Icon, label, value,
}: { icon: typeof Mail; label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#EBF4FF] text-[#003087] flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-[#1A1A4E] font-medium">{value}</div>
      </div>
    </li>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-xl border border-border overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left px-5 py-4 hover:bg-[#EBF4FF]/60 transition"
      >
        <span className="font-medium text-[#1A1A4E]">{q}</span>
        <ChevronDown
          size={18}
          className={`text-[#003087] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-sm text-muted-foreground">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
