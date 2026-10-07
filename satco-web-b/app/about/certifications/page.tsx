import type { Metadata } from "next";
import {
  certificateCopy,
  certificateDetails,
  certificationBodies,
  credentialLogos,
  formatCertificateDate,
  leedCertificates,
} from "@satco/shared";
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

const card =
  "h-full rounded-lg border border-border bg-surface px-7 py-[30px] transition-[border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:border-bronze-200 hover:shadow-xs";
const textLink =
  "inline-flex items-center gap-1.5 font-semibold text-bronze-800 no-underline transition-colors hover:text-bronze-700 hover:underline";

/*
 * Option B — certificate gallery.
 * FIX-23: the two lead cards size to their content (the decorative tower photo
 * that stretched them is gone; the four classifications sit in a 2×2 grid).
 * FIX-24: each ISO certificate shows the real certificate (from satco.sa),
 * opens full size, downloads, and names its issuer with the issuer's logo and
 * the validity date. LEED shows its real certificate too (supplied 2026-10-01),
 * downloadable as the original PDF.
 */
export default function CertificationsPage() {
  return (
    <>
      <PageHeader
        title="Classifications, licenses & certifications"
        headingId="cert-h"
        lead={page.intro[0]}
      >
        <p className="mb-0 mt-3 max-w-[68ch] text-[15px] leading-[1.65] text-stone-600">
          {page.intro[1]}
        </p>
      </PageHeader>
      <Container className="py-[clamp(3.5rem,7vw,6rem)]">
        <div className="mb-[22px] grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Reveal className="h-full">
            <section aria-labelledby="cert-g1" className={card}>
              <h2 id="cert-g1" className="mb-2 mt-0 font-display text-[1.2rem] font-bold text-strong">
                {page.classificationsHeading}
              </h2>
              <p className="mb-5 mt-0 text-sm leading-[1.5] text-stone-600">{page.classificationsLead}</p>
              <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2">
                {classifications[0].activities.map((activity) => (
                  <li
                    key={activity}
                    className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-[14.5px] text-stone-700 transition-colors duration-[var(--dur-base)] hover:border-bronze-200"
                  >
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
          <Reveal delay={70} className="h-full">
            <section aria-labelledby="cert-g2" className={card}>
              <h2 id="cert-g2" className="mb-2 mt-0 font-display text-[1.2rem] font-bold text-strong">
                {page.licensesHeading}
              </h2>
              {licenses.map((license) => {
                const logo = credentialLogos.license[license.name];
                return (
                  <div
                    key={license.name}
                    className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-md border border-border p-4 transition-colors duration-[var(--dur-base)] hover:border-bronze-200"
                  >
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- static export, issuing authority logo
                      <img src={logo.src} alt={logo.alt} className="h-12 w-auto flex-none" />
                    ) : (
                      <CertPlaceholder label="LICENSE" size="md" />
                    )}
                    <div className="min-w-[200px] flex-1">
                      <div className="mb-1 font-display text-base font-bold text-strong">{license.name}</div>
                      <p className="m-0 text-[13.5px] leading-[1.55] text-body">{license.scope}</p>
                    </div>
                  </div>
                );
              })}
            </section>
          </Reveal>
        </div>

        <section
          aria-labelledby="cert-iso-h"
          className="rounded-lg border border-border bg-surface p-[clamp(1.75rem,3vw,2.25rem)]"
        >
          <Reveal>
            <h2 id="cert-iso-h" className="mb-1 mt-0 font-display text-[1.3rem] font-bold text-strong">
              {page.isoHeading}
            </h2>
            <p className="mb-7 mt-0 text-sm text-stone-600">{page.isoLead}</p>
          </Reveal>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-9 p-0 md:grid-cols-3 lg:grid-cols-5">
            {iso.map((cert, i) => {
              const detail = certificateDetails[cert.code];
              const body = detail ? certificationBodies[detail.issuer] : undefined;
              const full = detail ? `/certificates/${detail.file}.jpg` : undefined;
              const headingId = `cert-${cert.code.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
              return (
                <li key={cert.code} className="h-full">
                  <Reveal delay={(i % 5) * 60} className="h-full">
                    <article aria-labelledby={headingId} className="flex h-full flex-col">
                      {detail && body && full ? (
                        // Decorative duplicate of the "View" link below.
                        <a
                          href={full}
                          target="_blank"
                          rel="noopener"
                          tabIndex={-1}
                          aria-hidden="true"
                          className="block overflow-hidden rounded-md border border-border bg-white shadow-xs transition-[translate,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-md"
                        >
                          <picture>
                            <source type="image/webp" srcSet={`/certificates/${detail.file}-480.webp`} />
                            <img
                              src={`/certificates/${detail.file}-480.jpg`}
                              alt=""
                              width={480}
                              height={679}
                              loading="lazy"
                              className="block h-auto w-full"
                            />
                          </picture>
                        </a>
                      ) : (
                        <CertPlaceholder label="CERT" size="lg" />
                      )}
                      <h3 id={headingId} className="mb-0.5 mt-4 font-display text-[0.95rem] font-bold text-strong">
                        {cert.code}
                      </h3>
                      <p className="m-0 text-[13px] leading-[1.45] text-stone-600">{cert.title}</p>
                      {detail && body ? (
                        <div className="mt-auto pt-4">
                          <div className="flex items-center gap-3 border-t border-border pt-3">
                            {/* eslint-disable-next-line @next/next/no-img-element -- static export, issuer logo */}
                            <img
                              src={body.logo}
                              alt={`${certificateCopy.issuedBy} ${body.name}`}
                              className="h-9 w-[76px] flex-none object-contain object-left"
                            />
                            <p className="m-0 text-[12px] leading-[1.35] text-stone-600">
                              {certificateCopy.validUntil}
                              <span className="block font-semibold text-stone-800">
                                {formatCertificateDate(detail.validUntil)}
                              </span>
                            </p>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                            <a href={full} target="_blank" rel="noopener" className={textLink}>
                              View
                              <span className="sr-only">
                                {" "}
                                {cert.code} certificate {certificateCopy.newTab}
                              </span>
                              <span aria-hidden="true">↗</span>
                            </a>
                            <a href={full} download className={textLink}>
                              {certificateCopy.download}
                              <span className="sr-only"> {cert.code} certificate (JPG)</span>
                            </a>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>

        {leed.map((cert) => {
          const detail = leedCertificates[cert.code];
          const full = detail ? `/certificates/${detail.file}.jpg` : undefined;
          const pdf = detail ? `/certificates/${detail.file}.pdf` : undefined;
          return (
            <Reveal key={cert.code}>
              {/* FIX-24: the real LEED certificate (landscape) beside its details,
                  in the same view / download pattern as the ISO gallery. */}
              <section
                aria-labelledby="cert-leed-h"
                className="relative mt-[22px] grid items-center gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-6 overflow-hidden rounded-lg border border-bronze-100 bg-bronze-50 p-[clamp(1.75rem,3vw,2.25rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,340px)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -end-7 -top-9 select-none text-[9rem] leading-none text-bronze-100"
                >
                  ◆
                </span>
                <div className="relative min-w-0">
                  <div className="mb-3 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export, USGBC badge */}
                    <img
                      src={credentialLogos.leed.src}
                      alt={credentialLogos.leed.alt}
                      width={104}
                      height={200}
                      className="h-[60px] w-auto flex-none rounded-[3px] shadow-xs"
                    />
                    <p className="m-0 text-sm text-stone-600">{page.leedLead}</p>
                  </div>
                  <h2 id="cert-leed-h" className="mb-1.5 mt-0 font-display text-[1.15rem] font-bold text-strong">
                    {cert.code}
                  </h2>
                  <p className="m-0 max-w-[60ch] text-[14.5px] leading-[1.6] text-stone-700">{cert.title}</p>
                  {detail && full && pdf ? (
                    <>
                      <div className="mt-4 flex max-w-[60ch] flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-bronze-100 pt-4 text-[13px] leading-[1.45]">
                        <p className="m-0">
                          <span className="block font-semibold text-stone-800">
                            {detail.project} · {detail.location}
                          </span>
                          <span className="block text-stone-600">{detail.ratingSystem}</span>
                        </p>
                        <p className="m-0 text-stone-600">
                          {certificateCopy.certified}
                          <span className="block font-semibold text-stone-800">{detail.certified}</span>
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                        <a href={full} target="_blank" rel="noopener" className={textLink}>
                          View
                          <span className="sr-only">
                            {" "}
                            {cert.code} certificate {certificateCopy.newTab}
                          </span>
                          <span aria-hidden="true">↗</span>
                        </a>
                        <a href={pdf} download className={textLink}>
                          {certificateCopy.download}
                          <span className="sr-only"> {cert.code} certificate (PDF)</span>
                        </a>
                      </div>
                    </>
                  ) : null}
                </div>
                {detail && full ? (
                  // Decorative duplicate of the "View" link.
                  <a
                    href={full}
                    target="_blank"
                    rel="noopener"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="relative block overflow-hidden rounded-md border border-bronze-100 bg-white shadow-sm transition-[translate,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-md"
                  >
                    <picture>
                      <source type="image/webp" srcSet={`/certificates/${detail.file}-480.webp`} />
                      <img
                        src={`/certificates/${detail.file}-480.jpg`}
                        alt=""
                        width={detail.thumb.width}
                        height={detail.thumb.height}
                        loading="lazy"
                        className="block h-auto w-full"
                      />
                    </picture>
                  </a>
                ) : null}
              </section>
            </Reveal>
          );
        })}

        {/* FIX-25 (Option B only): no "Ongoing compliance" block. The copy
            (page.ongoingHeading / page.ongoing) stays in the shared content. */}
      </Container>
    </>
  );
}
