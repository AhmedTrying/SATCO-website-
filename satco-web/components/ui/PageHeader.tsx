import { Container } from "@/components/layout/Container";

/** Sand page header band: h1 + lead paragraph (design pattern; no page path — FIX-14). */
export function PageHeader({
  title,
  headingId,
  lead,
  children,
}: {
  title: string;
  headingId: string;
  /** One paragraph, or several (each rendered as its own lead paragraph). */
  lead?: string | string[];
  children?: React.ReactNode;
}) {
  const paragraphs = (Array.isArray(lead) ? lead : [lead]).filter(
    (paragraph): paragraph is string => Boolean(paragraph),
  );
  return (
    <div className="border-b border-border bg-sand">
      <Container className="pb-[clamp(2.5rem,5vw,3.5rem)] pt-[clamp(2.5rem,5vw,4rem)]">
        <h1
          id={headingId}
          className="m-0 font-display text-4xl font-bold leading-[1.1] tracking-[-0.015em] text-strong"
        >
          {title}
        </h1>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="mb-0 mt-4 max-w-[68ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6] text-stone-700"
          >
            {paragraph}
          </p>
        ))}
        {children}
      </Container>
    </div>
  );
}
