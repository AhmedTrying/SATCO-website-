import Image from "next/image";
import Link from "next/link";

import { contactPage } from "@/content/contact";
import { footerColumns } from "@/content/navigation";
import { footerContent, site } from "@/content/site";
import { Emblem } from "@/components/ui/Emblem";
import { Year } from "@/components/ui/Year";

const columnTitle =
  "mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-bronze-300";
const footerLink =
  "text-[14px] leading-[1.45] text-stone-200 no-underline transition-colors hover:text-white";

function LinkedInIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 items-center justify-center rounded-[2px] bg-stone-100 font-sans text-[15px] font-bold leading-none tracking-[-0.04em] text-stone-950"
    >
      in
    </span>
  );
}

export function Footer() {
  const directionsHref = contactPage.mapEmbedUrl
    ? contactPage.mapEmbedUrl.replace("&output=embed", "").replace("?output=embed", "")
    : "/contact";

  return (
    <footer id="site-footer">
      <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(26rem,0.88fr)]">
        <div className="on-dark bg-stone-950 px-[var(--container-x)] py-[clamp(2.5rem,3.5vw,3.5rem)] text-stone-200 lg:min-h-[440px]">
          <div className="mx-auto flex h-full w-full max-w-[58rem] flex-col lg:mx-0">
            <div className="inline-flex items-center gap-4 self-start">
              <Emblem size={44} disc="var(--bronze-300)" land="var(--stone-400)" />
              <span className="font-display text-[clamp(1.5rem,2vw,2rem)] font-bold tracking-[0.18em] text-white">
                {site.name}
              </span>
            </div>

            <p className="mb-0 mt-5 max-w-[31rem] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.65] text-stone-400">
              {footerContent.tagline}
            </p>

            <nav
              aria-label="Footer"
              className="mt-[clamp(2.25rem,3vw,3rem)] grid gap-x-8 gap-y-8 sm:grid-cols-3"
            >
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h2 className={columnTitle}>{column.title}</h2>
                  <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className={footerLink}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="relative isolate min-h-[430px] overflow-hidden bg-[#edd7b8] px-[var(--container-x)] py-[clamp(2.5rem,3.5vw,3.5rem)] text-stone-950 lg:min-h-[440px]">
          <Image
            src="/images/footer-riyadh-skyline.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="-z-20 object-contain object-right-bottom"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(245_229_199/0.98)_0%,rgb(245_229_199/0.86)_39%,rgb(245_229_199/0.2)_72%,transparent_100%)]"
          />

          <div className="relative z-10 max-w-[31rem]">
            <div aria-hidden="true" className="mb-5 h-[3px] w-14 bg-bronze-700" />
            <h2 className="m-0 font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-bronze-800">
              {footerContent.officeLabel}
            </h2>

            <address className="mt-6 not-italic">
              <p className="m-0 text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.6] text-stone-900">
                {site.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <div aria-hidden="true" className="my-5 h-px w-24 bg-bronze-700/65" />
              <a
                href={`mailto:${site.contact.email}`}
                className="font-display text-[clamp(1.3rem,2vw,1.8rem)] font-bold leading-tight tracking-[-0.02em] text-bronze-800 no-underline transition-colors hover:text-bronze-950"
              >
                {site.contact.email}
              </a>
            </address>

            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 border-b border-bronze-700 pb-1 font-display text-[15px] font-semibold text-bronze-800 no-underline transition-colors hover:text-bronze-950"
            >
              {footerContent.directionsLabel}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="on-dark border-t border-white/20 bg-stone-950 text-stone-300">
        <div className="mx-auto flex max-w-[var(--container-max)] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-[var(--container-x)] py-4">
          <p className="m-0 text-[13px] text-stone-400">
            © <Year /> {site.copyrightHolder} All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="m-0 text-[13px] text-stone-500">{site.establishedLine}</p>
            <a
              href={footerContent.linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={footerContent.linkedinAriaLabel}
              className="inline-flex items-center gap-3 text-sm font-medium text-stone-200 no-underline transition-colors hover:text-white"
            >
              <LinkedInIcon />
              <span>{footerContent.linkedinLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
