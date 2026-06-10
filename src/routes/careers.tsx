import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { JOBS } from "@/lib/jobs";
import { JobCard } from "@/components/JobCard";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Open Positions — Kotak Insurance Careers" },
      {
        name: "description",
        content:
          "Explore open Life Insurance Advisory Agent positions across India. Apply online in under 5 minutes.",
      },
      { property: "og:title", content: "Open Positions at Kotak Insurance" },
      {
        property: "og:description",
        content: "Insurance Advisory Agent, Senior Advisor, and Women-Special part-time roles — apply today.",
      },
    ],
  }),
  component: Careers,
});

function Careers() {
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#apply") {
      setTimeout(() => {
        document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const handleApply = (jobTitle: string) => {
    setSelectedPosition(jobTitle);
    setTimeout(() => {
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div>
      <PageHero
        title="Open Positions"
        subtitle="Join our growing network of advisory agents."
      />

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Current Openings"
            subtitle="Three flexible career paths, all backed by Kotak's brand and training."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {JOBS.map((job, i) => (
              <JobCard key={job.id} job={job} delay={i * 0.08} onApply={handleApply} />
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="py-20 bg-[#EBF4FF] scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeading
            title="Submit Your Application"
            subtitle="Fill the form below. Our team will contact you within 2 business days."
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <ApplicationForm variant="full" defaultPosition={selectedPosition} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="hero-gradient pt-28 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#E8192C] rounded-full blur-3xl blob" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-white"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-white/80 text-lg max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
