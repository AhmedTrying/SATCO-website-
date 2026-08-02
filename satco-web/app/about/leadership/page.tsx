import type { Metadata } from "next";
import { leadership, leadershipPage } from "@/content/leadership";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Key people & leadership",
  description: leadershipPage.subline,
};

/*
 * Leadership — content TBD (plan §12 Q2): CMS-ready placeholder grid. The
 * placeholders stay honest (status note + skeleton bars + pending caption) but
 * carry the finished card frame: portrait block with a quiet silhouette instead
 * of hazard-stripe "PHOTO" tiles, staggered reveals matching the home rhythm.
 */
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
            <li key={i} className="h-full">
              <Reveal delay={(i % 3) * 70} className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
                  {/* Portrait placeholder — dignified silhouette on a soft
                      stone wash; swaps for the member photo when content lands */}
                  <div
                    aria-hidden="true"
                    className="relative flex aspect-[4/5] items-end justify-center overflow-hidden bg-[linear-gradient(180deg,var(--stone-50),var(--stone-200))]"
                  >
                    <svg
                      viewBox="0 0 96 96"
                      className="w-[58%] translate-y-[6%] text-stone-300"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="48" cy="34" r="16" />
                      <path d="M14 96c2.5-21 16-31 34-31s31.5 10 34 31z" />
                    </svg>
                  </div>
                  <div className="px-6 pb-6 pt-5">
                    {/* name / role skeleton bars */}
                    <div aria-hidden="true" className="mb-2.5 h-3 w-[64%] rounded-[3px] bg-stone-200" />
                    <div aria-hidden="true" className="mb-4 h-2.5 w-[42%] rounded-[3px] bg-stone-100" />
                    <p className="m-0 text-[13px] text-stone-600">Content coming soon</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
