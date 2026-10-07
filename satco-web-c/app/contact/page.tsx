import type { Metadata } from "next";
import { contactPage } from "@/content/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeSplit } from "@/components/contact/OfficeSplit";

export const metadata: Metadata = {
  title: "Contact us",
  description: contactPage.subline,
};

/* Contact (FIX-33) — offices from content/offices.ts.
   Option C (FIX-30): "split screen" — the form on the left half and the live
   map edge to edge on the right half, as tall as the form, with a floating
   office card (Riyadh · Al Jubail). A and B use their own layouts. */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={contactPage.title}
        headingId="contact-h"
        lead={contactPage.subline}
      />
      <OfficeSplit
        heading={contactPage.details.heading}
        form={
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-[clamp(1.5rem,3.2vw,2.5rem)] shadow-sm">
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
    </>
  );
}
