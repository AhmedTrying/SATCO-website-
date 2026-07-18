import Link from "next/link";
import { footerColumns, footerContactColumn } from "@/content/navigation";
import { site } from "@/content/site";
import { Emblem } from "@/components/ui/Emblem";
import { Year } from "@/components/ui/Year";

const columnTitle =
  "mb-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-bronze-300";
const footLink =
  "text-sm text-stone-300 no-underline transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="on-dark bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-x)] pb-10 pt-[clamp(3.5rem,6vw,5.5rem)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-7 gap-y-9">
          <div className="col-span-full mb-2 max-w-[420px]">
            <div className="mb-4 inline-flex items-center gap-[11px]">
              <Emblem size={30} disc="var(--bronze-300)" land="var(--stone-400)" />
              <span className="font-display text-[21px] font-bold tracking-[0.16em] text-white">
                {site.name}
              </span>
            </div>
            <p className="m-0 text-[14.5px] leading-[1.65] text-stone-400">
              {site.description}
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className={columnTitle}>{col.title}</h2>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={footLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className={columnTitle}>{footerContactColumn.title}</h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {footerContactColumn.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {site.contact.addressLines.map((line) => (
                <li key={line} className="text-sm text-stone-400">
                  {line}
                </li>
              ))}
              <li>
                <a href={`mailto:${site.contact.email}`} className={footLink}>
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-[rgb(180_172_157/0.22)] pt-5.5">
          <p className="m-0 text-[13px] text-stone-400">
            © <Year /> {site.copyrightHolder} All rights reserved.
          </p>
          <p className="m-0 text-[13px] text-stone-400">{site.establishedLine}</p>
        </div>
      </div>
    </footer>
  );
}
