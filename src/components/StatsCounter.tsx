import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; prefix?: string; label: string };

const STATS: Stat[] = [
  { value: 1, suffix: " Lakh+", label: "Trusted Agents Nationwide" },
  { value: 99.5, suffix: "%", label: "Claim Settlement Ratio FY25-26" },
  { value: 25, suffix: "+ Years", label: "Of Trust & Excellence" },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(stat.value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  const display = Number.isInteger(stat.value) ? Math.round(val).toString() : val.toFixed(1);

  return (
    <div ref={ref} className="text-center px-6">
      <div className="text-4xl md:text-5xl font-extrabold text-[#1A1A4E]">
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <div className="mt-2 text-sm md:text-base text-muted-foreground">{stat.label}</div>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="bg-white py-14 border-b border-border">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
        style={{ ["--tw-divide-opacity" as never]: 1 }}
      >
        {STATS.map((s, i) => (
          <div key={i} className="py-6 md:py-0 md:border-[#E8192C]/30">
            <Counter stat={s} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
