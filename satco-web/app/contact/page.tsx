import type { Metadata } from "next";
import { contactPage } from "@/content/contact";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeLocator } from "@/components/contact/OfficeLocator";

export const metadata: Metadata = {
  title: "Contact us",
  description: contactPage.subline,
};

/* Contact (FIX-33) — the aside is an office locator (Riyadh head office,
   Al Jubail branch); the offices themselves live in content/offices.ts. Same page in
   Options A, B and C. */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={contactPage.title}
        headingId="contact-h"
        lead={contactPage.subline}
      />
      {/* FIX-30: the aside stretches to the form's height (lg), so the
          map fills whatever the details leave and both columns end level —
          no empty band beside the map under "Send message". */}
      <Container className="grid grid-cols-1 items-start gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-stretch">
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
        <Reveal delay={120} className="min-w-0">
          <OfficeLocator heading={contactPage.details.heading} />
        </Reveal>
      </Container>
    </>
  );
}
