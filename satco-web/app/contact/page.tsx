import type { Metadata } from "next";
import { contactPage } from "@/content/contact";
import { site } from "@/content/site";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact us",
  description: contactPage.subline,
};

const detailLabel =
  "mb-[5px] text-[12.5px] font-semibold uppercase tracking-[0.06em] text-bronze-700";

/* Contact — details are design-prototype placeholders (plan §12 Q6). */
export default function ContactPage() {
  const d = contactPage.details;
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
        title={contactPage.title}
        headingId="contact-h"
        lead={contactPage.subline}
      />
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3.5rem,7vw,6rem)]">
        <Reveal>
          <ContactForm />
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-surface p-7">
            <h2 className="mb-5 mt-0 font-display text-[clamp(1.4rem,2.4vw,1.7rem)] font-bold text-strong">
              {d.heading}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
              <li>
                <div className={detailLabel}>{d.officeLabel}</div>
                <div className="text-[15px] leading-[1.55] text-stone-700">
                  {site.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </li>
              <li>
                <div className={detailLabel}>{d.phoneLabel}</div>
                <a
                  href={`tel:${d.phone.replace(/\s/g, "")}`}
                  className="text-[15px] font-medium text-bronze-800 no-underline hover:underline"
                >
                  {d.phone}
                </a>
              </li>
              <li>
                <div className={detailLabel}>{d.emailLabel}</div>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-[15px] font-medium text-bronze-800 no-underline hover:underline"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <div className={detailLabel}>{d.hoursLabel}</div>
                <div className="text-[15px] text-stone-700">{d.hours}</div>
              </li>
            </ul>
          </div>
          <div
            role="img"
            aria-label={contactPage.mapLabel}
            className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-lg border border-border bg-[repeating-linear-gradient(135deg,var(--stone-100),var(--stone-100)_14px,var(--stone-50)_14px,var(--stone-50)_28px)]"
          >
            <div className="text-center">
              <div
                aria-hidden="true"
                className="mx-auto mb-3 h-4 w-4 -rotate-45 rounded-[50%_50%_50%_0] bg-bronze-800"
              />
              <div className="font-mono text-xs tracking-[0.04em] text-stone-500">
                {contactPage.mapCaption}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
