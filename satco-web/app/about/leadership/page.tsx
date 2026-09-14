import type { Metadata } from "next";
import { leadership, leadershipPage } from "@/content/leadership";
import {
  ExecutiveLeadershipCard,
  FunctionalLeadershipCard,
  PrincipalLeadershipCard,
} from "@/components/about/LeadershipCard";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Key people & leadership",
  description: leadershipPage.subline,
};

const orderedLeadership = [...leadership].sort((a, b) => a.order - b.order);
const principals = orderedLeadership.filter((member) => member.level === "principal");
const executives = orderedLeadership.filter((member) => member.level === "executive");
const functionalLeaders = orderedLeadership.filter(
  (member) => member.level === "functional" || !member.level,
);

function displayNumber(order: number) {
  return String(order).padStart(2, "0");
}

function EmptyLeadership() {
  const placeholders = Array.from({ length: leadershipPage.placeholderCount });

  return (
    <Container className="py-[clamp(3.5rem,7vw,6rem)]">
      <Reveal>
        <div
          role="status"
          className="mb-9 flex max-w-[640px] items-center gap-3 rounded-md border border-bronze-100 bg-bronze-50 px-5 py-4"
        >
          <span aria-hidden="true" className="h-2.5 w-2.5 flex-none rounded-full bg-bronze-500" />
          <p className="m-0 text-[14.5px] text-stone-700">{leadershipPage.pendingNote}</p>
        </div>
      </Reveal>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px] p-0">
        {placeholders.map((_, index) => (
          <li key={index} className="overflow-hidden rounded-lg border border-border bg-surface">
            <div aria-hidden="true" className="aspect-[4/3] bg-stone-100" />
            <div className="p-6">
              <div aria-hidden="true" className="mb-3 h-3 w-2/3 rounded-sm bg-stone-200" />
              <div aria-hidden="true" className="h-2.5 w-2/5 rounded-sm bg-stone-100" />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default function LeadershipPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/about" },
          { label: "Key people & leadership" },
        ]}
        title={leadershipPage.title}
        headingId="leadership-h"
        lead={leadershipPage.subline}
      />

      {orderedLeadership.length === 0 ? (
        <EmptyLeadership />
      ) : (
        <>
          {principals.length > 0 ? (
            <section aria-labelledby="principal-leadership-h" className="bg-surface">
              <Container className="py-[clamp(3.75rem,7vw,6.5rem)]">
                <Reveal>
                  <div className="mb-[clamp(2rem,4vw,3.25rem)] grid gap-5 sm:grid-cols-[minmax(0,0.7fr)_minmax(280px,1.3fr)] sm:items-end">
                    <Eyebrow>{leadershipPage.featuredEyebrow}</Eyebrow>
                    <h2
                      id="principal-leadership-h"
                      className="m-0 max-w-[22ch] font-display text-[clamp(1.9rem,4vw,3.35rem)] font-bold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:balance]"
                    >
                      {leadershipPage.featuredHeading}
                    </h2>
                  </div>
                </Reveal>
                <ul className="m-0 grid list-none gap-[22px] p-0 lg:grid-cols-2">
                  {principals.map((member, index) => (
                    <li key={member.id} className="h-full">
                      <Reveal delay={index * 90} className="h-full">
                        <PrincipalLeadershipCard
                          member={member}
                          number={displayNumber(member.order)}
                        />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null}

          {executives.length > 0 ? (
            <section aria-labelledby="executive-leadership-h" className="border-y border-border bg-sand">
              <Container className="py-[clamp(3.75rem,7vw,6rem)]">
                <Reveal>
                  <div className="mb-9 flex items-end justify-between gap-6 border-b border-stone-300 pb-5">
                    <h2
                      id="executive-leadership-h"
                      className="m-0 font-display text-[clamp(1.55rem,3vw,2.2rem)] font-bold leading-[1.12] tracking-[-0.02em] text-strong"
                    >
                      {leadershipPage.executiveHeading}
                    </h2>
                    <span aria-hidden="true" className="hidden h-px w-24 bg-bronze-500 sm:block" />
                  </div>
                </Reveal>
                <ul className="m-0 grid list-none gap-[18px] p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {executives.map((member, index) => (
                    <li key={member.id} className="h-full">
                      <Reveal delay={(index % 4) * 70} className="h-full">
                        <ExecutiveLeadershipCard
                          member={member}
                          number={displayNumber(member.order)}
                        />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null}

          {functionalLeaders.length > 0 ? (
            <section aria-labelledby="functional-leadership-h" className="bg-surface">
              <Container className="grid gap-[clamp(2rem,5vw,5rem)] py-[clamp(3.75rem,7vw,6rem)] lg:grid-cols-[minmax(240px,0.65fr)_minmax(0,1.35fr)]">
                <Reveal>
                  <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
                    <Eyebrow className="mb-4">{leadershipPage.functionalEyebrow}</Eyebrow>
                    <h2
                      id="functional-leadership-h"
                      className="mb-4 mt-0 max-w-[16ch] font-display text-[clamp(1.65rem,3vw,2.35rem)] font-bold leading-[1.1] tracking-[-0.025em] text-strong"
                    >
                      {leadershipPage.functionalHeading}
                    </h2>
                    <p className="m-0 max-w-[42ch] text-[15px] leading-[1.7] text-stone-600">
                      {leadershipPage.functionalSubline}
                    </p>
                  </div>
                </Reveal>
                <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
                  {functionalLeaders.map((member, index) => (
                    <li key={member.id} className="h-full">
                      <Reveal delay={(index % 4) * 55} className="h-full">
                        <FunctionalLeadershipCard
                          member={member}
                          number={displayNumber(member.order)}
                        />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null}
        </>
      )}
    </>
  );
}
