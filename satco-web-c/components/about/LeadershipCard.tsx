import type { ImageRef } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";

/*
 * Option C leadership card (FIX-22): ONE card style for every person — the
 * portrait, name and title sit in a sand header strip and the full biography
 * is open below (no numbering, nothing hidden behind a click). Deliberately
 * unlike Option B's full-width alternating portrait rows.
 */

function Portrait({ photo }: { photo?: ImageRef }) {
  return (
    <div className="h-[128px] w-[102px] flex-none overflow-hidden rounded-md border border-bronze-200/70 bg-[linear-gradient(160deg,var(--stone-100),var(--bronze-100))]">
      {photo ? (
        <Picture
          image={photo}
          sizes="102px"
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 102 128" className="h-full w-full text-stone-300" fill="currentColor">
          <circle cx="51" cy="50" r="21" />
          <path d="M10 128v-8a41 41 0 0 1 82 0v8Z" />
        </svg>
      )}
    </div>
  );
}

export function LeadershipProfileCard({
  id,
  name,
  title,
  bio,
  photo,
}: {
  id: string;
  name: string;
  title: string;
  bio: readonly string[];
  photo?: ImageRef;
}) {
  const headingId = `${id}-name`;
  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xs"
    >
      <div className="flex items-center gap-5 border-b border-border bg-sand p-[clamp(1.25rem,2.5vw,1.75rem)]">
        <Portrait photo={photo} />
        <div className="min-w-0">
          <span aria-hidden="true" className="mb-3 block h-[3px] w-10 bg-bronze-800" />
          <h3
            id={headingId}
            className="m-0 font-display text-[clamp(1.2rem,1.9vw,1.45rem)] font-bold leading-[1.2] tracking-[-0.015em] text-strong"
          >
            {name}
          </h3>
          <p className="mb-0 mt-2 text-[14.5px] font-semibold leading-[1.45] text-bronze-800">{title}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-[clamp(1.25rem,2.5vw,1.75rem)] text-[15px] leading-[1.75] text-stone-700">
        {bio.map((paragraph, index) => (
          <p key={index} className="m-0">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
