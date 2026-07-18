"use client";

import { useEffect, useId, useRef, useState } from "react";
import { contactPage } from "@/content/contact";

/*
 * Accessible contact form against a typed submit seam — the backend is
 * undecided (plan §11.3/§12 Q8: third-party form vs Supabase vs relay), so
 * submit() currently simulates success. The inquiry-type selector implements
 * the routing proposal from docx comment #22 and is marked as pending sign-off.
 */

export interface ContactSubmission {
  name: string;
  email: string;
  organization: string;
  inquiry: string;
  message: string;
}

// TODO(backend): replace with the chosen provider (plan §11.3) — the component
// contract stays identical.
async function submit(data: ContactSubmission): Promise<void> {
  void data;
}

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const fieldClass =
  "w-full rounded-sm border bg-surface px-3.5 py-3 text-[15px] text-strong focus:border-bronze-800";
const labelClass = "mb-1.5 block text-sm font-semibold text-strong";

export function ContactForm() {
  const id = useId();
  const f = contactPage.form;
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [inquiry, setInquiry] = useState(contactPage.inquiryOptions[0].value);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const routesTo =
    contactPage.inquiryOptions.find((o) => o.value === inquiry)?.routesTo ?? "";

  // Focus management runs after commit so the targets exist in the DOM
  useEffect(() => {
    const key = (["name", "email", "message"] as const).find((k) => errors[k]);
    if (key) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${key}"]`)
        ?.focus();
    }
  }, [errors]);

  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values: ContactSubmission = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      organization: String(data.get("organization") ?? "").trim(),
      inquiry,
      message: String(data.get("message") ?? "").trim(),
    };
    const nextErrors: Errors = {};
    if (!values.name) nextErrors.name = f.nameError;
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      nextErrors.email = f.emailError;
    if (!values.message) nextErrors.message = f.messageError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSent(false);
      return;
    }
    await submit(values);
    form.reset();
    setInquiry(contactPage.inquiryOptions[0].value);
    setSent(true);
  };

  const errorProps = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${id}-${key}-err` : undefined,
    style: { borderColor: errors[key] ? "var(--error)" : "var(--stone-500)" },
  });

  return (
    <div>
      <h2 className="mb-[22px] mt-0 font-display text-[clamp(1.4rem,2.4vw,1.7rem)] font-bold text-strong">
        {f.heading}
      </h2>
      {sent && (
        <div
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="mb-[22px] flex items-start gap-3 rounded-md border border-[#C9DBBB] bg-[#EEF3E9] px-[18px] py-4"
        >
          <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 flex-none rounded-[50%] bg-success" />
          <p className="m-0 text-[14.5px] leading-[1.55] text-[#2F5122]">{f.successMessage}</p>
        </div>
      )}
      <p className="mb-3 mt-0 text-[13px] text-stone-600">{f.requiredNote}</p>
      <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>
            {f.nameLabel} <span aria-hidden="true" className="text-bronze-700">*</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
            {...errorProps("name")}
          />
          {errors.name && (
            <span id={`${id}-name-err`} className="mt-1 block text-[12.5px] text-error">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>
            {f.emailLabel} <span aria-hidden="true" className="text-bronze-700">*</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            {...errorProps("email")}
          />
          {errors.email && (
            <span id={`${id}-email-err`} className="mt-1 block text-[12.5px] text-error">
              {errors.email}
            </span>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-org`} className={labelClass}>
            {f.orgLabel}
          </label>
          <input
            id={`${id}-org`}
            name="organization"
            type="text"
            autoComplete="organization"
            className={fieldClass}
            style={{ borderColor: "var(--stone-500)" }}
          />
        </div>
        <div>
          <label htmlFor={`${id}-inquiry`} className={labelClass}>
            {f.inquiryLabel}
          </label>
          <select
            id={`${id}-inquiry`}
            name="inquiry"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
            aria-describedby={`${id}-route`}
            className={fieldClass}
            style={{ borderColor: "var(--stone-500)" }}
          >
            {contactPage.inquiryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p id={`${id}-route`} className="mb-0 mt-2 text-[12.5px] text-stone-600">
            {f.routePrefix}{" "}
            <strong className="font-semibold text-bronze-800">{routesTo}</strong>
          </p>
          {/* Routing proposal — docx comment #22, pending Bandar's sign-off */}
          <p className="mb-0 mt-[5px] text-[11.5px] italic text-stone-600">{f.proposalNote}</p>
        </div>
        <div>
          <label htmlFor={`${id}-message`} className={labelClass}>
            {f.messageLabel} <span aria-hidden="true" className="text-bronze-700">*</span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            required
            rows={5}
            className={`${fieldClass} resize-y`}
            {...errorProps("message")}
          />
          {errors.message && (
            <span id={`${id}-message-err`} className="mt-1 block text-[12.5px] text-error">
              {errors.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 self-start rounded-sm border-none bg-primary px-[26px] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {f.submitLabel}{" "}
          <span aria-hidden="true" className="rtl:-scale-x-100">
            →
          </span>
        </button>
      </form>
    </div>
  );
}
