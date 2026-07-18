import type { Metadata } from "next";
import {
  certifications,
  certificationsPage as page,
  classifications,
  licenses,
} from "@/content/certifications";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CertPlaceholder } from "@/components/about/CertPlaceholder";

export const metadata: Metadata = {
  title: "Classifications, licenses & certifications",
  description:
    "SATCO's Category 1 government classifications, GACAR Part 151 license, ISO management-system certifications, and LEED Silver certificate.",
};

const iso = certifications.filter((c) => c.group === "iso");
const leed = certifications.filter((c) => c.group === "leed");

export default function CertificationsPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/about" },
          { label: "Classifications, licenses & certifications" },
        ]}
        title="Classifications, licenses & certifications"
        headingId="cert-h"
        lead={page.intro[0]}
      >
        <p className="mb-0 mt-3 max-w-[68ch] text-[15px] leading-[1.65] text-stone-600">
          {page.intro[1]}
        </p>
      </PageHeader>
      <Container className="py-[clamp(3.5rem,7vw,6rem)]">
        <div className="mb-[22px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px]">
          <Reveal>
            <section
              aria-labelledby="cert-g1"
              className="h-full rounded-lg border border-border bg-surface px-7 py-[30px]"
            >
              <h2 id="cert-g1" className="mb-2 mt-0 font-display text-[1.2rem] font-bold text-strong">
                {page.classificationsHeading}
              </h2>
              <p className="mb-5 mt-0 text-sm leading-[1.5] text-stone-600">
                {page.classificationsLead}
              </p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {classifications[0].activities.map((activity) => (
                  <li key={activity} className="flex items-center gap-3 text-[14.5px] text-stone-700">
                    <span
                      aria-hidden="true"
                      className="flex-none rounded-[100px] border border-bronze-200 bg-bronze-50 px-2 py-[3px] font-display text-[10px] font-bold tracking-[0.04em] text-bronze-800"
                    >
                      CAT 1
                    </span>
                    {activity}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section
              aria-labelledby="cert-g2"
              className="h-full rounded-lg border border-border bg-surface px-7 py-[30px]"
            >
              <h2 id="cert-g2" className="mb-2 mt-0 font-display text-[1.2rem] font-bold text-strong">
                {page.licensesHeading}
              </h2>
              {licenses.map((license) => (
                <div
                  key={license.name}
                  className="mt-5 flex items-start gap-4 rounded-md border border-border p-4"
                >
                  <CertPlaceholder label="LICENSE" size="md" />
                  <div>
                    <div className="mb-1 font-display text-base font-bold text-strong">
                      {license.name}
                    </div>
                    <p className="m-0 text-[13.5px] leading-[1.55] text-body">{license.scope}</p>
                  </div>
                </div>
              ))}
            </section>
          </Reveal>
        </div>

        <Reveal>
          <section
            aria-labelledby="cert-iso-h"
            className="rounded-lg border border-border bg-surface p-[clamp(1.75rem,3vw,2.25rem)]"
          >
            <h2 id="cert-iso-h" className="mb-1 mt-0 font-display text-[1.3rem] font-bold text-strong">
              {page.isoHeading}
            </h2>
            <p className="mb-6 mt-0 text-sm text-stone-600">{page.isoLead}</p>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-0">
              {iso.map((cert) => (
                <li
                  key={cert.code}
                  className="flex items-center gap-3.5 rounded-[10px] border border-border p-4"
                >
                  <CertPlaceholder label="CERT" />
                  <div>
                    <div className="font-display text-[0.95rem] font-bold text-strong">{cert.code}</div>
                    <div className="mt-0.5 text-[13px] text-stone-600">{cert.title}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {leed.map((cert) => (
          <Reveal key={cert.code}>
            <section
              aria-labelledby="cert-leed-h"
              className="mt-[22px] flex flex-wrap items-center gap-5 rounded-lg border border-bronze-100 bg-bronze-50 p-[clamp(1.75rem,3vw,2.25rem)]"
            >
              <CertPlaceholder label="LEED CERT" size="lg" />
              <div className="min-w-[300px] flex-1">
                <p className="mb-1.5 mt-0 text-sm text-stone-600">{page.leedLead}</p>
                <h2 id="cert-leed-h" className="mb-1.5 mt-0 font-display text-[1.15rem] font-bold text-strong">
                  {cert.code}
                </h2>
                <p className="m-0 max-w-[60ch] text-[14.5px] leading-[1.6] text-stone-700">
                  {cert.title}
                </p>
              </div>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <section aria-labelledby="cert-ongoing-h" className="mt-[22px] max-w-[76ch]">
            <h2
              id="cert-ongoing-h"
              className="mb-2 mt-8 font-display text-[1.05rem] font-bold text-strong"
            >
              {page.ongoingHeading}
            </h2>
            <p className="m-0 text-[15px] leading-[1.65] text-stone-600">{page.ongoing}</p>
          </section>
        </Reveal>
      </Container>
    </>
  );
}
