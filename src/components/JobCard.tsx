import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";
import type { Job } from "@/lib/jobs";

const badgeColor: Record<Job["typeColor"], string> = {
  red: "bg-[#E8192C] text-white",
  navy: "bg-[#003087] text-white",
  green: "bg-emerald-600 text-white",
};

export function JobCard({
  job,
  delay = 0,
  onApply,
}: {
  job: Job;
  delay?: number;
  onApply: (jobTitle: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl border border-border p-6 md:p-7 flex flex-col"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-[#1A1A4E] leading-snug">{job.title}</h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${badgeColor[job.typeColor]}`}>
          {job.type}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin size={14} />
        {job.location}
      </div>

      <div className="mt-4 text-sm">
        <span className="font-semibold text-[#1A1A4E]">Eligibility: </span>
        <span className="text-muted-foreground">{job.eligibility}</span>
      </div>

      <ul className="mt-4 space-y-2 flex-1">
        {job.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check size={16} className="text-[#E8192C] mt-0.5 shrink-0" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onApply(job.title)}
        className="btn-primary mt-6 w-full"
      >
        Apply for This Role
      </button>
    </motion.article>
  );
}
