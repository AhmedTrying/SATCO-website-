import type { Metadata } from "next";
import { leadershipExampleBios, leadershipExampleCopy } from "@satco/shared";
import { leadership, leadershipPage } from "@/content/leadership";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: leadershipPage.title,
  description: leadershipPage.subline,
};

const members = [...leadership].sort((a, b) => a.order - b.order);

/*
 * Option B (OPT-05): one profile per row, portrait and text alternating sides.
 * Compact editorial rows: a fixed 280px portrait (220px on phones) with a thin
 * bronze frame offset toward the text, the text column capped
 * for reading, and the first biography paragraph set as a lead.
 */
export default function LeadershipPage() {
  return (
    <>
      <PageHeader
        title={leadershipPage.title}
        headingId="leadership-h"
        lead={leadershipPage.subline}
      />
      <Container className="py-[clamp(2.5rem,5vw,4.5rem)]">
        {members.length === 0 ? (
          <p role="status" className="text-stone-700">{leadershipPage.pendingNote}</p>
        ) : (
          <ol className="mx-auto my-0 max-w-[1120px] list-none divide-y divide-stone-200 p-0">
            {members.map((member, index) => {
              const reverse = index % 2 === 1;
              const paragraphs = member.bio?.trim()
                ? member.bio.split(/\n\s*\n/)
                : leadershipExampleBios[member.id] ?? [];
              return (
                <li key={member.id} className="py-[clamp(2.25rem,4vw,3.5rem)] first:pt-0 last:pb-0">
                  <Reveal>
                    <article
                      aria-labelledby={member.id + "-name"}
                      className={cn(
                        "grid items-center gap-8 md:gap-[clamp(2.5rem,5vw,4.5rem)]",
                        reverse
                          ? "md:grid-cols-[minmax(0,1fr)_280px]"
                          : "md:grid-cols-[280px_minmax(0,1fr)]",
                      )}
                    >
                      {/* Portrait with a bronze frame offset toward the text */}
                      <div className={cn("relative w-[220px] md:w-[280px]", reverse && "md:order-2")}>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 translate-y-3 rounded-md border border-bronze-300",
                            reverse
                              ? "translate-x-3 md:-translate-x-3 rtl:-translate-x-3 md:rtl:translate-x-3"
                              : "translate-x-3 rtl:-translate-x-3",
                          )}
                        />
                        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[linear-gradient(160deg,var(--stone-100),var(--sand))]">
                          {member.photo ? (
                            <Picture
                              image={member.photo}
                              sizes="280px"
                              className="block h-full w-full"
                              imgClassName="h-full w-full object-cover"
                            />
                          ) : (
                            <>
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 240 300"
                                className="absolute inset-x-[16%] bottom-0 text-stone-300"
                                fill="currentColor"
                              >
                                <circle cx="120" cy="112" r="46" />
                                <path d="M28 300v-38a92 92 0 0 1 184 0v38Z" />
                              </svg>
                              <p className="absolute inset-x-3 top-4 m-0 text-center text-[11.5px] tracking-[0.06em] text-stone-600">
                                {leadershipExampleCopy.portraitPending}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className={cn("min-w-0", reverse && "md:order-1")}>
                        <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-bronze-800" />
                        <h2
                          id={member.id + "-name"}
                          className="mb-2 mt-0 font-display text-[clamp(1.5rem,2.3vw,2rem)] font-bold leading-[1.15] tracking-[-0.02em] text-strong"
                        >
                          {member.name}
                        </h2>
                        <p className="mb-5 mt-0 text-[15px] font-semibold leading-[1.5] text-bronze-800">
                          {member.title}
                        </p>
                        <div className="flex max-w-[66ch] flex-col gap-3.5 text-[15.5px] leading-[1.75] text-stone-700">
                          {paragraphs.map((paragraph, paragraphIndex) => (
                            <p
                              key={paragraphIndex}
                              className={cn(
                                "m-0",
                                paragraphIndex === 0 && "text-[16.5px] leading-[1.7] text-stone-800",
                              )}
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        )}
      </Container>
    </>
  );
}
