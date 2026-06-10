import { motion } from "framer-motion";
import { FileText, GraduationCap, TrendingUp } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    icon: FileText,
    title: "Apply Online",
    text: "Fill the simple form. Takes under 5 minutes.",
  },
  {
    icon: GraduationCap,
    title: "Training & Onboarding",
    text: "Complete the IRDA-certified training program. We guide you every step of the way.",
  },
  {
    icon: TrendingUp,
    title: "Start Earning",
    text: "Get your licence, start advising clients, and watch your earnings grow.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading title="Your Journey Starts Here" />

        <div className="mt-14 grid gap-10 md:grid-cols-3 relative">
          {/* connector line on desktop */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#E8192C]/30 via-[#003087]/30 to-[#E8192C]/30" />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative text-center"
              >
                <div className="relative mx-auto w-16 h-16 rounded-full bg-[#E8192C] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  {i + 1}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-[#003087]">
                    <Icon size={16} />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-[#1A1A4E]">{s.title}</h3>
                <p className="mt-2 text-muted-foreground max-w-xs mx-auto">{s.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
