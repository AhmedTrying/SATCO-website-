import type { Metadata } from "next";
import { contactPage } from "@/content/contact";
import { site } from "@/content/site";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact us",
  description: contactPage.subline,
};

const detailLabel =
  "mb-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-bronze-300";

/** Decorative line icon for a details row (labels carry the meaning). */
function DetailIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 flex-none text-bronze-300"
    >
      {children}
    </svg>
  );
}

const darkLink =
  "text-[15px] font-medium text-white no-underline transition-colors duration-[var(--dur-fast)] hover:text-bronze-200 hover:underline";

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
      <Container className="grid grid-cols-1 items-start gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
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
        <div className="flex flex-col gap-6">
          <Reveal delay={120}>
            {/* Details panel: atmospheric Riyadh image (licensed stock — neutral
                alt, no SATCO claim) melting into a dark card via the gradient. */}
            <div className="on-dark overflow-hidden rounded-lg bg-stone-950 shadow-md">
              <div className="relative h-[clamp(200px,20vw,280px)] overflow-hidden">
                <Parallax strength={22} scale={1.12} className="h-full">
                  <Picture
                    image={{
                      src: "riyadh-2",
                      alt: "Al Faisaliyah Tower and the Riyadh skyline",
                    }}
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="block h-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </Parallax>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(29_26_22/0.05),rgb(29_26_22/0.25)_55%,var(--stone-950))]"
                />
              </div>
              <div className="p-[clamp(1.5rem,2.6vw,2rem)]">
                <h2 className="mb-5 mt-0 font-display text-[clamp(1.4rem,2.4vw,1.7rem)] font-bold text-white">
                  {d.heading}
                </h2>
                <ul className="m-0 flex list-none flex-col divide-y divide-white/10 p-0">
                  <li className="flex gap-4 py-[18px] first:pt-0 last:pb-0">
                    <DetailIcon>
                      <path d="M20.5 10.2c0 6.6-8.5 12.3-8.5 12.3S3.5 16.8 3.5 10.2a8.5 8.5 0 0 1 17 0z" />
                      <circle cx="12" cy="10.2" r="2.8" />
                    </DetailIcon>
                    <div>
                      <div className={detailLabel}>{d.officeLabel}</div>
                      <div className="text-[15px] leading-[1.55] text-stone-200">
                        {site.contact.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-4 py-[18px] first:pt-0 last:pb-0">
                    <DetailIcon>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </DetailIcon>
                    <div>
                      <div className={detailLabel}>{d.phoneLabel}</div>
                      <a href={`tel:${d.phone.replace(/\s/g, "")}`} className={darkLink}>
                        {d.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4 py-[18px] first:pt-0 last:pb-0">
                    <DetailIcon>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m4 7.5 8 5.5 8-5.5" />
                    </DetailIcon>
                    <div>
                      <div className={detailLabel}>{d.emailLabel}</div>
                      <a href={`mailto:${site.contact.email}`} className={darkLink}>
                        {site.contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4 py-[18px] first:pt-0 last:pb-0">
                    <DetailIcon>
                      <circle cx="12" cy="12" r="8.6" />
                      <path d="M12 7.2V12l3.1 2" />
                    </DetailIcon>
                    <div>
                      <div className={detailLabel}>{d.hoursLabel}</div>
                      <div className="text-[15px] text-stone-200">{d.hours}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            {/* Map placeholder — a designed block (grid + crosshair + pin), still
                a placeholder per plan §12 Q6. Children are presentational under
                role="img"; the aria-label carries the meaning. */}
            <div
              role="img"
              aria-label={contactPage.mapLabel}
              className="relative flex h-[clamp(220px,22vw,280px)] items-center justify-center overflow-hidden rounded-lg border border-border bg-sand"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(var(--stone-200)_1px,transparent_1px),linear-gradient(90deg,var(--stone-200)_1px,transparent_1px)] opacity-70 [background-size:26px_26px]"
              />
              <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-bronze-300/60" />
              <div aria-hidden="true" className="absolute inset-y-0 start-1/2 w-px bg-bronze-300/60" />
              <div
                aria-hidden="true"
                className="relative flex h-[76px] w-[76px] items-center justify-center"
              >
                <span className="absolute inset-0 rounded-full border border-bronze-400/35 motion-safe:animate-pulse" />
                <span className="absolute inset-[15px] rounded-full border border-bronze-400/60" />
                <span className="h-4 w-4 -rotate-45 rounded-[50%_50%_50%_0] bg-bronze-800 shadow-sm rtl:rotate-45 rtl:rounded-[50%_50%_0_50%]" />
              </div>
              <div className="absolute inset-x-0 bottom-3 flex justify-center">
                <span className="rounded-sm border border-border bg-surface/90 px-2.5 py-1 font-mono text-[11.5px] tracking-[0.04em] text-stone-600">
                  {contactPage.mapCaption}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
