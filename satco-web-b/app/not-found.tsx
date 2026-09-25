import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Section labelledBy="nf-h1" className="min-h-[50vh]">
      <Container>
        <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-bronze-800">
          404
        </p>
        <h1
          id="nf-h1"
          className="mt-3 font-display text-4xl font-bold tracking-[-0.01em] text-strong"
        >
          Page not found
        </h1>
        <p className="mt-4 max-w-[var(--measure)] text-muted">
          The page you are looking for doesn&rsquo;t exist or has moved.
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-[7px] font-semibold text-primary no-underline hover:text-primary-hover hover:underline"
          >
            Return to the homepage{" "}
            <span aria-hidden="true" className="rtl:-scale-x-100">
              →
            </span>
          </Link>
        </p>
      </Container>
    </Section>
  );
}
