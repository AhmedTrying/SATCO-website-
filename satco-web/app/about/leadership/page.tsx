import type { Metadata } from "next";
import { leadership, leadershipPage } from "@/content/leadership";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Key people & leadership",
  description: leadershipPage.subline,
};

/* Leadership — content TBD (plan §12 Q2): CMS-ready placeholder grid. */
export default function LeadershipPage() {
  const placeholders = Array.from({
    length: Math.max(leadershipPage.placeholderCount - leadership.length, 0),
  });
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/about" },
          { label: "Key people & leadership" },
        ]}
        title={leadershipPage.title}
        headingId="lead-h"
        lead={leadershipPage.subline}
      />
      <Container className="py-[clamp(3.5rem,7vw,6rem)]">
        <Reveal>
          <div
            role="status"
            className="mb-9 flex max-w-[640px] items-center gap-3 rounded-md border border-bronze-100 bg-bronze-50 px-5 py-4"
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 flex-none rounded-[50%] bg-bronze-500" />
            <p className="m-0 text-[14.5px] text-stone-700">{leadershipPage.pendingNote}</p>
          </div>
        </Reveal>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px] p-0">
          {placeholders.map((_, i) => (
            <li key={i}>
              <Reveal delay={(i % 3) * 60}>
                <div className="rounded-lg border border-border bg-surface p-7 text-center">
                  <div
                    aria-hidden="true"
                    className="mx-auto mb-[18px] flex h-24 w-24 items-center justify-center rounded-[50%] border border-border bg-[repeating-linear-gradient(135deg,var(--stone-100),var(--stone-100)_8px,var(--stone-50)_8px,var(--stone-50)_16px)] font-mono text-[11px] text-stone-400"
                  >
                    PHOTO
                  </div>
                  <div aria-hidden="true" className="mx-auto mb-2.5 h-3 w-[60%] rounded-[3px] bg-stone-200" />
                  <div aria-hidden="true" className="mx-auto mb-4 h-2.5 w-[44%] rounded-[3px] bg-stone-100" />
                  <p className="m-0 text-[13px] text-stone-600">Content coming soon</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
