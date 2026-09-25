import { Container } from "@/components/layout/Container";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";

/** Sand page header band: breadcrumb + h1 + lead paragraph (design pattern). */
export function PageHeader({
  crumbs,
  title,
  headingId,
  lead,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  headingId: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-sand">
      <Container className="pb-[clamp(2.5rem,5vw,3.5rem)] pt-[clamp(2.5rem,5vw,4rem)]">
        <Breadcrumbs items={crumbs} />
        <h1
          id={headingId}
          className="m-0 font-display text-4xl font-bold leading-[1.1] tracking-[-0.015em] text-strong"
        >
          {title}
        </h1>
        {lead ? (
          <p className="mb-0 mt-4 max-w-[68ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6] text-stone-700">
            {lead}
          </p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
