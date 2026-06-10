import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  invert = false,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  invert?: boolean;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`max-w-3xl ${alignCls}`}
    >
      {eyebrow && (
        <div
          className={`inline-block text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 rounded-full ${
            invert ? "bg-white/15 text-white" : "bg-red/10 text-red"
          }`}
          style={invert ? {} : { backgroundColor: "rgba(232,25,44,0.10)", color: "#E8192C" }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={`section-heading-underline text-3xl md:text-4xl font-bold ${
          invert ? "text-white" : ""
        }`}
        style={invert ? { color: "#fff" } : {}}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg ${invert ? "text-white/80" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
