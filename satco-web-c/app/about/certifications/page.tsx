import type { Metadata } from "next";
import {
  certificateCopy,
  certificateDetails,
  certificationBodies,
  credentialLogos,
  formatCertificateDate,
  leedCertificates,
  type CertificationBodyId,
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

export const metadata: Metadata = {
  title: "Classifications, licenses & certifications",
  description:
    "SATCO's Category 1 government classifications, GACAR Part 151 license, ISO management-system certifications, and LEED Silver certificate.",
};

const iso = certifications.filter((c) => c.group === "iso");
const leed = certifications.filter((c) => c.group === "leed");

// Issuers in first-appearance order, each with the standards it certifies.
const bodies = iso.reduce<{ id: CertificationBodyId; standards: string[] }[]>((list, cert) => {
  const detail = certificateDetails[cert.code];
  if (!detail) return list;
  const standard = cert.code.split(":")[0];
  const entry = list.find((b) => b.id === detail.issuer);
  if (entry) entry.standards.push(standard);
  else list.push({ id: detail.issuer, standards: [standard] });
  return list;
}, []);

const cell = "block px-[clamp(1.25rem,2.5vw,1.75rem)] py-1 md:table-cell md:py-4 md:align-middle";
const label = "mb-0.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-600 md:hidden";
const textLink =
  "inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-bronze-800 no-underline transition-colors hover:text-bronze-700 hover:underline";

/*
 * Option C — credentials register.
 * FIX-23: classifications and the license share one card (two panes, no
 * decorative photo), so nothing is left empty under the classifications.
 * FIX-24: the three certification bodies lead as a logo strip ("Certified
 * by"), then a register lists every certificate with its issuer, validity and
 * links to view or download the real certificate (from satco.sa). LEED is a
 * register row too, with its real certificate (supplied 2026-10-01): shown as
 * "Certified August 2025" (it has no expiry) and downloadable as the PDF.
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
        {/* Classifications + license: one card, two panes */}
        <Reveal>
          <div className="grid overflow-hidden rounded-lg border border-border bg-surface md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <section aria-labelledby="cert-g1" className="p-[clamp(1.5rem,3vw,2.25rem)]">
              <h2 id="cert-g1" className="mb-2 mt-0 font-display text-[1.2rem] font-bold text-strong">
                {page.classificationsHeading}
              </h2>
              <p className="mb-5 mt-0 text-sm leading-[1.5] text-stone-600">{page.classificationsLead}</p>
              <ul className="m-0 grid list-none gap-x-6 gap-y-3 p-0 sm:grid-cols-2">
                {classifications[0].activities.map((activity) => (
                  <li key={activity} className="flex items-start gap-2.5 text-[14.5px] leading-[1.45] text-stone-700">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="mt-[3px] h-4 w-4 flex-none text-bronze-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8.5 6.5 12 13 4.5" />
                    </svg>
                    {activity}
                  </li>
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="cert-g2"
              className="border-t border-border bg-sand p-[clamp(1.5rem,3vw,2.25rem)] md:border-s md:border-t-0"
            >
              <h2 id="cert-g2" className="mb-4 mt-0 font-display text-[1.2rem] font-bold text-strong">
                {page.licensesHeading}
              </h2>
              {licenses.map((license) => {
                const logo = credentialLogos.license[license.name];
                return (
                  <div key={license.name}>
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- static export, issuing authority logo
                      <img src={logo.src} alt={logo.alt} className="mb-4 h-12 w-auto" />
                    ) : null}
                    <div className="mb-1 font-display text-base font-bold text-strong">{license.name}</div>
                    <p className="m-0 text-[14px] leading-[1.6] text-stone-700">{license.scope}</p>
                  </div>
                );
              })}
            </section>
          </div>
        </Reveal>

        {/* Certified by — issuer logo strip */}
        <section aria-labelledby="cert-bodies-h" className="mt-[clamp(2.5rem,5vw,3.5rem)]">
          <Reveal>
            <div className="mb-5 flex items-center gap-4">
              <h2
                id="cert-bodies-h"
                className="m-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-bronze-700"
              >
                {certificateCopy.bodiesHeading}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
          </Reveal>
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {bodies.map(({ id, standards }, i) => {
              const body = certificationBodies[id];
              return (
                <li key={id}>
                  <Reveal delay={i * 70} className="h-full">
                    <div className="flex h-full items-center gap-4 rounded-lg border border-border bg-surface px-5 py-4">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static export, issuer logo */}
                      <img src={body.logo} alt={body.name} className="h-12 w-[104px] flex-none object-contain object-left" />
                      <div className="min-w-0">
                        <p className="m-0 text-[13px] font-semibold leading-[1.4] text-strong">{standards.join(" · ")}</p>
                        <p className="m-0 text-[12px] leading-[1.4] text-stone-600">{body.accreditation}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
            {/* LEED's certifier, from the certificate itself (FIX-24) */}
            {leed.map((cert, i) => {
              const leedDetail = leedCertificates[cert.code];
              if (!leedDetail) return null;
              return (
                <li key={cert.code}>
                  <Reveal delay={(bodies.length + i) * 70} className="h-full">
                    <div className="flex h-full items-center gap-4 rounded-lg border border-border bg-surface px-5 py-4">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static export, USGBC badge */}
                      <img
                        src={credentialLogos.leed.src}
                        alt={credentialLogos.leed.alt}
                        width={104}
                        height={200}
                        className="h-12 w-auto flex-none rounded-[2px]"
                      />
                      <div className="min-w-0">
                        <p className="m-0 text-[13px] font-semibold leading-[1.4] text-strong">
                          {cert.code}
                        </p>
                        <p className="m-0 text-[12px] leading-[1.4] text-stone-600">{leedDetail.certifiedBy}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Register */}
        <Reveal>
          <section
            aria-labelledby="cert-iso-h"
            className="mt-[clamp(2.5rem,5vw,3.5rem)] overflow-hidden rounded-lg border border-border bg-surface"
          >
            <div className="px-[clamp(1.25rem,2.5vw,1.75rem)] pb-4 pt-[clamp(1.5rem,3vw,2rem)]">
              <h2 id="cert-iso-h" className="mb-1 mt-0 font-display text-[1.3rem] font-bold text-strong">
                {page.isoHeading}
              </h2>
              <p className="m-0 text-sm text-stone-600">{page.isoLead}</p>
            </div>
            <table className="w-full border-collapse text-start">
              <thead className="hidden border-t border-border bg-sand text-[11.5px] font-semibold uppercase tracking-[0.1em] text-stone-600 md:table-header-group">
                <tr>
                  <th scope="col" className={cell + " text-start font-semibold"}>{certificateCopy.registerCertificate}</th>
                  <th scope="col" className={cell + " text-start font-semibold"}>{certificateCopy.registerIssuer}</th>
                  <th scope="col" className={cell + " text-start font-semibold"}>{certificateCopy.registerValid}</th>
                  <th scope="col" className={cell}>
                    <span className="sr-only">{certificateCopy.registerCertificate} links</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...iso, ...leed].map((cert) => {
                  const detail = certificateDetails[cert.code];
                  const leedDetail = leedCertificates[cert.code];
                  const body = detail ? certificationBodies[detail.issuer] : undefined;
                  const file = detail?.file ?? leedDetail?.file;
                  const full = file ? `/certificates/${file}.jpg` : undefined;
                  // LEED downloads as the original PDF; ISO as the cropped JPG.
                  const download = leedDetail ? `/certificates/${leedDetail.file}.pdf` : full;
                  const downloadType = leedDetail ? "PDF" : "JPG";
                  return (
                    <tr key={cert.code} className="block border-t border-border py-4 md:table-row md:py-0">
                      <th scope="row" className={cell + " text-start font-normal"}>
                        <span className="block font-display text-[0.98rem] font-bold text-strong">{cert.code}</span>
                        <span className="block text-[13px] leading-[1.45] text-stone-600">{cert.title}</span>
                      </th>
                      <td className={cell}>
                        <span className={label}>{certificateCopy.registerIssuer}</span>
                        {body ? (
                          <span className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element -- static export, issuer logo */}
                            <img src={body.logo} alt="" className="h-8 w-[64px] flex-none object-contain object-left" />
                            <span className="text-[14px] text-stone-800">{body.name}</span>
                          </span>
                        ) : cert.group === "leed" ? (
                          <span className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element -- static export, USGBC badge */}
                            <img
                              src={credentialLogos.leed.src}
                              alt={credentialLogos.leed.alt}
                              width={104}
                              height={200}
                              className="h-16 w-auto flex-none rounded-[2px]"
                            />
                            <span className="text-[14px] text-stone-800">{credentialLogos.leed.issuer}</span>
                          </span>
                        ) : (
                          <span className="text-[14px] text-stone-600">—</span>
                        )}
                      </td>
                      <td className={cell}>
                        {leedDetail ? (
                          /* LEED prints an award month, not an expiry */
                          <>
                            <span className={label}>{certificateCopy.certified}</span>
                            <span className="text-[14px] text-stone-800">
                              <span className="hidden md:inline">{certificateCopy.certified} </span>
                              {leedDetail.certified}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className={label}>{certificateCopy.registerValid}</span>
                            <span className="text-[14px] text-stone-800">
                              {detail ? formatCertificateDate(detail.validUntil) : "—"}
                            </span>
                          </>
                        )}
                      </td>
                      <td className={cell + " md:text-end"}>
                        {full ? (
                          <span className="inline-flex flex-wrap gap-x-5 gap-y-1 text-[13.5px]">
                            <a href={full} target="_blank" rel="noopener" className={textLink}>
                              {certificateCopy.view}
                              <span className="sr-only">
                                {" "}
                                {cert.code} {certificateCopy.newTab}
                              </span>
                              <span aria-hidden="true">↗</span>
                            </a>
                            <a href={download} download className={textLink}>
                              {certificateCopy.download}
                              <span className="sr-only">
                                {" "}
                                {cert.code} certificate ({downloadType})
                              </span>
                            </a>
                          </span>
                        ) : (
                          <span className="text-[13px] text-stone-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="cert-ongoing-h" className="mt-10 max-w-[76ch] border-s-2 border-bronze-500 ps-6">
            <h2 id="cert-ongoing-h" className="mb-2 mt-0 font-display text-[1.05rem] font-bold text-strong">
              {page.ongoingHeading}
            </h2>
            <p className="m-0 text-[15px] leading-[1.65] text-stone-600">{page.ongoing}</p>
          </section>
        </Reveal>
      </Container>
    </>
  );
}
