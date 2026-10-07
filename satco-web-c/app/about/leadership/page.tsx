import type { Metadata } from "next";
import { leadershipDocument, leadershipExampleBios, leadershipExampleCopy } from "@satco/shared";
import { leadership, leadershipPage } from "@/content/leadership";
import { LeadershipProfileCard } from "@/components/about/LeadershipCard";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Key people & leadership",
  description: leadershipPage.subline,
};

/*
 * Option C — FIX-22: exactly the people in Bandar's Leadership document, in
 * its order and under its two headings (Chairman, Leadership Team), with its
 * names, titles and biographies verbatim (@satco/shared leadership-example).
 * Every person uses the same card; no numbering. Portraits come from the
 * dashboard entry with the same id once they are supplied.
 */
const photoById = new Map(leadership.map((member) => [member.id, member.photo]));

const groups = leadershipDocument.groups.map((group) => ({
  id: group.id,
  heading: group.heading,
  people: group.memberIds.map((id) => ({
    id,
    ...leadershipDocument.members[id],
    bio: leadershipExampleBios[id] ?? [],
    photo: photoById.get(id),
  })),
}));

const portraitsPending = groups.some((group) => group.people.some((person) => !person.photo));

export default function LeadershipPage() {
  return (
    <>
      <PageHeader
        title={leadershipPage.title}
        headingId="leadership-h"
        lead={leadershipPage.subline}
      />

      <Container className="py-[clamp(3rem,6vw,5.5rem)]">
        {portraitsPending ? (
          <p className="mb-8 mt-0 text-[13.5px] text-stone-600">{leadershipExampleCopy.portraitsPendingNote}</p>
        ) : null}

        {groups.map((group, groupIndex) => (
          <section
            key={group.id}
            aria-labelledby={`${group.id}-h`}
            className={groupIndex > 0 ? "mt-[clamp(3rem,6vw,4.5rem)]" : undefined}
          >
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <h2
                  id={`${group.id}-h`}
                  className="m-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-bronze-700"
                >
                  {group.heading}
                </h2>
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
              </div>
            </Reveal>
            <ul className="m-0 grid list-none gap-[22px] p-0 lg:grid-cols-2">
              {group.people.map((person, index) => (
                <li
                  key={person.id}
                  // A lone card (the Chairman) is centred at the same width as the
                  // two-column cards below, so every card keeps one size.
                  className={
                    group.people.length === 1
                      ? "lg:col-span-2 lg:mx-auto lg:w-[calc((100%-22px)/2)]"
                      : "h-full"
                  }
                >
                  <Reveal delay={(index % 2) * 80} className="h-full">
                    <LeadershipProfileCard {...person} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
