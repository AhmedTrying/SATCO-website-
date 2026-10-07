import type { Metadata } from "next";
import { careersPage } from "@/content/careers";
import { getJobs } from "@/lib/jobs";
import { Container } from "@/components/layout/Container";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Picture } from "@/components/ui/Picture";
import { JobBoard } from "@/components/careers/JobBoard";

export const metadata: Metadata = {
  title: "Careers",
  description: careersPage.hero.paragraphs[0],
};

/*
 * Careers (Option A) — the client's "Suggested Careers copy" of 2026-10-07,
 * verbatim, in the order it was written: hero with two actions, "Work you can
 * see the value of", "Where you could contribute", "The people we are looking
 * for", the live roles list, "How we hire" and "Register your interest".
 * Employee stories and development/life-at-SATCO detail are to follow once the
 * client has them; nothing is invented here. No PDFs, no email-only workflows
 * (locked). The register CTA goes to the contact form until a dedicated
 * general-application form exists.
 */
const h2Class =
  "mb-5 mt-0 font-display text-[clamp(1.7rem,3.2vw,2.3rem)] font-bold leading-[1.14] tracking-[-0.015em] text-strong";
const bodyClass = "mb-4 mt-0 max-w-[62ch] text-base leading-[1.72] text-stone-700 last:mb-0";

export default async function CareersPage() {
  const jobs = await getJobs();
  const { hero, value, contribute, people, roles, hire, register } = careersPage;
  return (
    <>
      {/* Hero: sand header band (site pattern) with the two actions from the copy */}
      <div className="border-b border-border bg-sand">
        <Container className="pb-[clamp(2.5rem,5vw,3.5rem)] pt-[clamp(2.5rem,5vw,4rem)]">
          <h1
            id="careers-h"
            className="m-0 max-w-[18ch] font-display text-[clamp(2.2rem,4.4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.018em] text-strong [text-wrap:balance]"
          >
            {hero.heading}
          </h1>
          {hero.paragraphs.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 24)}
              className={
                i === 0
                  ? "mb-0 mt-5 max-w-[66ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6] text-stone-700"
                  : "mb-0 mt-3 max-w-[66ch] text-[15.5px] leading-[1.65] text-stone-600"
              }
            >
              {paragraph}
            </p>
          ))}
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="#roles-h">{hero.primaryCta}</ButtonLink>
            <ButtonLink href="#register-interest" variant="secondary">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </Container>
      </div>

      {/* Cinematic band under the header (UCC-reference rhythm). Decorative
          stock imagery — neutral, no SATCO claim — so it is hidden from AT. */}
      <div aria-hidden="true" className="relative overflow-hidden border-b border-border">
        <Parallax strength={40} scale={1.14}>
          <Picture
            image={{ src: "team-2", alt: "" }}
            sizes="100vw"
            imgClassName="w-full object-cover object-[center_40%]"
            style={{ height: "clamp(240px,36vw,440px)" }}
          />
        </Parallax>
      </div>

      {/* Work you can see the value of — text beside layered site imagery */}
      <section aria-labelledby="value-h" className="border-b border-border bg-surface">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(2rem,4vw,3.5rem)] pb-[clamp(4.5rem,8vw,7rem)] pt-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <h2 id="value-h" className={`${h2Class} max-w-[18ch]`}>
              {value.heading}
            </h2>
            <p className={bodyClass}>{value.body}</p>
          </Reveal>
          <Reveal delay={120} className="relative">
            {/* Layered depth (WhoWeAre pattern): the main image drifts up while
                the portrait card drifts the opposite way. Positioning classes
                stay on the outer divs — Parallax owns only the inner transform. */}
            <div className="overflow-hidden rounded-lg">
              <Parallax strength={26} scale={1.1}>
                <Picture
                  image={{
                    src: "team-1",
                    alt: "Engineers reviewing construction drawings on site",
                  }}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  imgClassName="w-full object-cover"
                  style={{ height: "clamp(300px,38vw,460px)" }}
                />
              </Parallax>
            </div>
            <div className="absolute bottom-0 start-0 w-[clamp(150px,30%,210px)] translate-y-[24%] ltr:-translate-x-[6%] rtl:translate-x-[6%]">
              <Parallax strength={-14}>
                <Picture
                  image={{
                    src: "maintenance",
                    alt: "A SATCO technician working at height against a golden sunset",
                  }}
                  sizes="210px"
                  imgClassName="w-full rounded-md object-cover object-[center_30%] shadow-lg"
                  style={{ height: "clamp(190px,26vw,260px)" }}
                />
              </Parallax>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Where you could contribute — the four areas as a card grid */}
      <section aria-labelledby="contribute-h" className="border-b border-border bg-sand">
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <h2 id="contribute-h" className={h2Class}>
              {contribute.heading}
            </h2>
          </Reveal>
          <ul className="m-0 mt-2 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
            {contribute.items.map((item, i) => (
              <li key={item.title} className="h-full">
                <Reveal delay={i * 90} className="h-full">
                  <div className="relative h-full rounded-lg border border-border bg-surface p-6 pt-7 shadow-xs">
                    <span
                      aria-hidden="true"
                      className="absolute start-6 top-0 h-[3px] w-12 bg-bronze-700"
                    />
                    <h3 className="mb-2.5 mt-0 font-display text-[1.12rem] font-bold leading-[1.3] text-strong">
                      {item.title}
                    </h3>
                    <p className="m-0 text-[15px] leading-[1.65] text-stone-700">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The people we are looking for — heading beside the two paragraphs */}
      <section aria-labelledby="people-h" className="border-b border-border bg-surface">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-6 py-[clamp(3.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Reveal>
            <h2 id="people-h" className={`${h2Class} mb-0 max-w-[16ch]`}>
              {people.heading}
            </h2>
            <span aria-hidden="true" className="mt-5 block h-[3px] w-14 bg-bronze-700" />
          </Reveal>
          <Reveal delay={100}>
            {people.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={bodyClass}>
                {paragraph}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Current opportunities — the live roles list */}
      <section aria-labelledby="roles-h" className="bg-bg">
        <Container className="py-[var(--section-y)]">
          <Reveal>
            <h2
              id="roles-h"
              className={`${h2Class} mb-3 scroll-mt-[calc(var(--nav-h)+1.5rem)]`}
            >
              {roles.heading}
            </h2>
            <p className="mb-7 mt-0 max-w-[62ch] text-base leading-[1.65] text-stone-700">
              {roles.intro}
            </p>
          </Reveal>
          <JobBoard jobs={jobs} />
        </Container>
      </section>

      {/* How we hire — one paragraph with a bronze rule */}
      <section aria-labelledby="hire-h" className="border-t border-border bg-sand">
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal className="max-w-[72ch] border-s-[3px] border-bronze-700 ps-6 sm:ps-8">
            <h2 id="hire-h" className={`${h2Class} mb-4`}>
              {hire.heading}
            </h2>
            <p className="m-0 max-w-[68ch] text-base leading-[1.72] text-stone-700">{hire.body}</p>
          </Reveal>
        </Container>
      </section>

      {/* Register your interest — dark band with the single action */}
      <section
        id="register-interest"
        aria-labelledby="register-h"
        className="on-dark relative scroll-mt-[var(--nav-h)] overflow-hidden bg-bronze-950"
      >
        {/* Background drifts slower than the scroll (scale hides the edges) */}
        <Parallax strength={40} scale={1.12} className="absolute inset-0">
          <Picture
            image={{ src: "construction-2", alt: "" }}
            sizes="100vw"
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            style={{ height: "100%", width: "100%" }}
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(29_26_22/0.88),rgb(53_30_3/0.84))]"
        />
        <Container className="relative z-[2] py-[clamp(4rem,8vw,7rem)] text-center">
          <Reveal>
            <h2
              id="register-h"
              className="mb-3.5 mt-0 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-white [text-wrap:balance]"
            >
              {register.heading}
            </h2>
            <p className="mx-auto mb-7 mt-0 max-w-[56ch] text-base leading-[1.6] text-bronze-200">
              {register.body}
            </p>
            <ButtonLink href="/contact" variant="onImage">
              {register.cta}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
