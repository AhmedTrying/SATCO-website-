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
  "text-[14px] leading-[1.45] text-stone-300 no-underline transition-colors hover:text-white";

function LinkedInIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 items-center justify-center rounded-[2px] bg-bronze-300 font-sans text-[15px] font-bold leading-none tracking-[-0.04em] text-stone-950"
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
    <footer
      id="site-footer"
      className="on-dark relative isolate overflow-hidden bg-[#181512] text-stone-200"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 end-0 -z-20 w-full [mask-image:linear-gradient(to_bottom,transparent_35%,black_100%)] lg:w-[55%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_42%)]"
      >
        <Image
          src="/images/footer-riyadh-skyline.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain object-right-bottom opacity-[0.13] mix-blend-screen grayscale lg:object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#181512]/65"
      />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-x)] pt-[clamp(2.75rem,4vw,4rem)]">
        <div className="grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 xl:grid-cols-[minmax(14rem,0.78fr)_minmax(34rem,1.6fr)_minmax(18rem,0.9fr)]">
          <div>
            <div className="inline-flex items-center gap-3.5">
              <Emblem size={42} disc="var(--bronze-300)" land="var(--stone-400)" />
              <span className="font-display text-[clamp(1.45rem,1.8vw,1.85rem)] font-bold tracking-[0.18em] text-white">
                {site.name}
              </span>
            </div>
            <p className="mb-0 mt-5 max-w-[25rem] text-[15px] leading-[1.65] text-stone-400">
              {footerContent.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="grid gap-x-8 gap-y-8 sm:grid-cols-3">
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

          <div className="max-w-[25rem]">
            <div aria-hidden="true" className="mb-4 h-[3px] w-12 bg-bronze-300" />
            <h2 className="m-0 font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-bronze-300">
              {footerContent.officeLabel}
            </h2>
            <address className="mt-5 not-italic">
              <p className="m-0 text-[15px] leading-[1.55] text-stone-300">
                {site.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-4 inline-block font-display text-[clamp(1.2rem,1.6vw,1.5rem)] font-bold leading-tight tracking-[-0.015em] text-bronze-200 no-underline transition-colors hover:text-white"
              >
                {site.contact.email}
              </a>
            </address>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 border-b border-bronze-300 pb-1 font-display text-[14px] font-semibold text-bronze-300 no-underline transition-colors hover:text-white"
            >
              {footerContent.directionsLabel}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-white/15 py-5">
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
              className="inline-flex items-center gap-3 text-sm font-medium text-stone-300 no-underline transition-colors hover:text-white"
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
