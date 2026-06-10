import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { syncToSheets } from "@/lib/sync-to-sheets.functions";
import { JOBS } from "@/lib/jobs";

const phoneRx = /^[6-9]\d{9}$/;

const fullSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().regex(phoneRx, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().trim().min(2, "City is required").max(100),
  position: z.string().min(1, "Select a position"),
  experience: z.string().min(1, "Select your experience"),
  education: z.string().min(1, "Select your education"),
  message: z.string().max(300, "Max 300 characters").optional().or(z.literal("")),
});

const compactSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(phoneRx, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().trim().min(2).max(100),
  position: z.string().min(1, "Select a position"),
});

type FullValues = z.infer<typeof fullSchema>;
type CompactValues = z.infer<typeof compactSchema>;

const EXPERIENCE = ["Fresher", "0-1 yr", "1-3 yrs", "3-5 yrs", "5+ yrs"];
const EDUCATION = ["10th", "12th", "Graduate", "Post Graduate"];

export function ApplicationForm({
  variant = "full",
  defaultPosition,
  submitLabel,
}: {
  variant?: "full" | "compact";
  defaultPosition?: string;
  submitLabel?: string;
}) {
  const isCompact = variant === "compact";
  const schema = isCompact ? compactSchema : fullSchema;
  const sync = useServerFn(syncToSheets);
  const [success, setSuccess] = useState<{ name: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FullValues | CompactValues>({
    resolver: zodResolver(schema as never),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      city: "",
      position: defaultPosition ?? "",
      ...(isCompact ? {} : { experience: "", education: "", message: "" }),
    } as never,
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      position: values.position,
      experience: (values as FullValues).experience ?? "",
      education: (values as FullValues).education ?? "",
      message: (values as FullValues).message ?? "",
    };

    try {
      const { error } = await supabase.from("applications").insert([payload]);
      if (error) throw error;
    } catch (e) {
      console.error(e);
      toast.error("Could not save your application. Please try again.");
      return;
    }

    try {
      const result = await sync({ data: payload });
      console.log("SYNC RESULT:", result);
    } catch (e) {
      // Sheets sync failed but DB row saved — still a successful application
      console.error("Sheets sync failed:", e);
    }

    toast.success("Application submitted! We'll contact you within 2 business days.");
    setSuccess({ name: payload.full_name });
    reset();
    if (defaultPosition) setValue("position", defaultPosition);
  });

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-border p-8 md:p-10 text-center"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-emerald-600" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-[#1A1A4E]">
          Thank You, {success.name}!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Your application has been received. Our team will contact you within 2 business days.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn-secondary"
          >
            Back to Top
          </button>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="btn-primary"
          >
            Submit Another Application
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-border p-6 md:p-8 grid gap-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full Name" error={errors.full_name?.message}>
          <input className="input-base" placeholder="Your full name" {...register("full_name")} />
        </Field>
        <Field label="Email Address" error={errors.email?.message}>
          <input type="email" className="input-base" placeholder="you@example.com" {...register("email")} />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input
            inputMode="numeric"
            maxLength={10}
            className="input-base"
            placeholder="10-digit mobile"
            {...register("phone")}
          />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <input className="input-base" placeholder="e.g. Mumbai" {...register("city")} />
        </Field>
        <Field label="Position Applying For" error={errors.position?.message} className={isCompact ? "md:col-span-2" : ""}>
          <select className="input-base" {...register("position")}>
            <option value="">Select a position</option>
            {JOBS.map((j) => (
              <option key={j.id} value={j.title}>{j.title}</option>
            ))}
          </select>
        </Field>

        {!isCompact && (
          <>
            <Field label="Years of Experience" error={(errors as Record<string, { message?: string }>).experience?.message}>
              <select className="input-base" {...register("experience" as never)}>
                <option value="">Select experience</option>
                {EXPERIENCE.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Highest Education" error={(errors as Record<string, { message?: string }>).education?.message}>
              <select className="input-base" {...register("education" as never)}>
                <option value="">Select education</option>
                {EDUCATION.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </Field>
          </>
        )}
      </div>

      {!isCompact && (
        <Field label="Why do you want to join Kotak? (optional)" error={(errors as Record<string, { message?: string }>).message?.message}>
          <textarea
            rows={3}
            maxLength={300}
            className="input-base resize-none"
            placeholder="Tell us in a few sentences..."
            {...register("message" as never)}
          />
        </Field>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full md:w-auto md:self-end mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {submitLabel ?? (isCompact ? "Send Application" : "Submit Application")}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-[#1A1A4E] mb-1.5">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-[#E8192C]">{error}</span>}
    </label>
  );
}
