import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export function TestimonialCard({ t, delay = 0 }: { t: Testimonial; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="glass-card p-6 md:p-7 text-white"
    >
      <Quote size={28} className="text-[#E8192C] mb-3" />
      <p className="text-white/90 leading-relaxed text-[15px]">"{t.quote}"</p>
      <div className="mt-5 pt-5 border-t border-white/15">
        <div className="font-semibold text-white">{t.name}</div>
        <div className="text-sm text-white/70">{t.role}</div>
      </div>
    </motion.div>
  );
}
