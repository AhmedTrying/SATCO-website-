import type { Metadata } from "next";
import { contactPage } from "@/content/contact";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeCities } from "@/components/contact/OfficeCities";

export const metadata: Metadata = {
  title: "Contact us",
  description: contactPage.subline,
};

/* Contact (FIX-33) — offices from content/offices.ts.
   Option B — "two cities" (2026-10-04, replaces the office directory): a deep
   bronze-brown header band with Riyadh and Al Jubail side by side, then the
   form beside a map with an office switch. A and C use their own layouts. */
export default function ContactPage() {
  return (
    <OfficeCities
      title={contactPage.title}
      headingId="contact-h"
      lead={contactPage.subline}
      heading={contactPage.details.heading}
      form={
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-[clamp(1.5rem,3.2vw,2.5rem)] shadow-xs">
            {/* Bronze accent rule — decorative; gradient direction flips for RTL */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--bronze-800),var(--bronze-400))] rtl:bg-[linear-gradient(270deg,var(--bronze-800),var(--bronze-400))]"
            />
            <ContactForm />
          </div>
        </Reveal>
      }
    />
  );
}
