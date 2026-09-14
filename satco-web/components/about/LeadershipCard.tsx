import type { LeadershipMember } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts.length > 1 ? parts.at(-1)?.[0] ?? "" : ""}`;
}

function ProfileVisual({
  member,
  dark = false,
  compact = false,
}: {
  member: LeadershipMember;
  dark?: boolean;
  compact?: boolean;
}) {
  if (member.photo) {
    if (compact) {
      return (
        <span className="h-14 w-14 flex-none overflow-hidden rounded-full border border-bronze-200 bg-bronze-50">
          <Picture
            image={member.photo}
            sizes="56px"
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
        </span>
      );
    }

    return (
      <Picture
        image={member.photo}
        sizes="(min-width: 1024px) 34vw, 100vw"
        className="block h-full w-full"
        imgClassName="h-full w-full object-cover"
      />
    );
  }

  if (compact) {
    return (
      <span
        aria-hidden="true"
        className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-bronze-200 bg-bronze-50 font-expanded text-[15px] font-semibold tracking-[0.08em] text-bronze-800 transition-colors duration-[var(--dur-base)] group-hover:border-bronze-400 group-hover:bg-bronze-100"
      >
        {initials(member.name)}
      </span>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-full min-h-[210px] overflow-hidden",
        dark ? "bg-stone-900 text-white" : "bg-sand text-bronze-900",
      )}
    >
      <span
        className={cn(
          "absolute -end-[9%] -top-[42%] aspect-square h-[132%] rounded-full border",
          dark ? "border-white/10" : "border-bronze-800/10",
        )}
      />
      <span
        className={cn(
          "absolute -end-[1%] -top-[28%] aspect-square h-[104%] rounded-full border",
          dark ? "border-bronze-400/25" : "border-bronze-700/15",
        )}
      />
      <span className="absolute bottom-0 end-[9%] top-0 w-px bg-bronze-500/40 transition-transform duration-[700ms] ease-[var(--ease-out-expo)] group-hover:-translate-x-3 rtl:group-hover:translate-x-3" />
      <span
        className={cn(
          "absolute bottom-[-0.12em] start-6 font-expanded text-[clamp(5.5rem,10vw,8.5rem)] font-semibold leading-none tracking-[-0.08em] transition-transform duration-[700ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-1",
          dark ? "text-white/12" : "text-bronze-900/10",
        )}
      >
        {initials(member.name)}
      </span>
      <span className="absolute start-6 top-6 h-1 w-10 bg-bronze-500" />
    </div>
  );
}

export function PrincipalLeadershipCard({
  member,
  number,
}: {
  member: LeadershipMember;
  number: string;
}) {
  return (
    <article className="group grid h-full min-h-[360px] overflow-hidden rounded-xl border border-stone-800 bg-stone-950 shadow-sm sm:grid-cols-[minmax(180px,0.9fr)_minmax(210px,1.1fr)]">
      <ProfileVisual member={member} dark />
      <div className="on-dark relative flex flex-col justify-between p-[clamp(1.5rem,3vw,2.25rem)]">
        <div className="flex items-start justify-between gap-4">
          {member.department ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bronze-300">
              {member.department}
            </span>
          ) : null}
          <span aria-hidden="true" className="font-expanded text-[12px] tracking-[0.12em] text-stone-500">
            {number}
          </span>
        </div>
        <div className="mt-16">
          <h3 className="mb-2 mt-0 max-w-[14ch] font-display text-[clamp(1.55rem,3vw,2.15rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            {member.name}
          </h3>
          <p className="m-0 text-[15px] leading-[1.5] text-stone-300">{member.title}</p>
          {member.bio ? (
            <p className="mb-0 mt-5 max-w-[40ch] border-t border-white/10 pt-5 text-[13.5px] leading-[1.65] text-stone-400">
              {member.bio}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ExecutiveLeadershipCard({
  member,
  number,
}: {
  member: LeadershipMember;
  number: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[translate,border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-bronze-300 hover:shadow-md">
      <div className="aspect-[8/5] overflow-hidden">
        <ProfileVisual member={member} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-9 flex items-start justify-between gap-4">
          {member.department ? (
            <span className="max-w-[22ch] text-[10.5px] font-semibold uppercase leading-[1.4] tracking-[0.13em] text-bronze-700">
              {member.department}
            </span>
          ) : null}
          <span aria-hidden="true" className="font-expanded text-[11px] tracking-[0.1em] text-stone-400">
            {number}
          </span>
        </div>
        <h3 className="mb-2 mt-auto font-display text-[1.2rem] font-bold leading-[1.2] tracking-[-0.015em] text-strong">
          {member.name}
        </h3>
        <p className="m-0 text-[13.5px] leading-[1.55] text-stone-600">{member.title}</p>
        {member.bio ? (
          <p className="mb-0 mt-4 border-t border-border pt-4 text-[13px] leading-[1.6] text-stone-600">
            {member.bio}
          </p>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="block h-[3px] w-0 bg-bronze-500 transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-standard)] group-hover:w-full"
      />
    </article>
  );
}

export function FunctionalLeadershipCard({
  member,
  number,
}: {
  member: LeadershipMember;
  number: string;
}) {
  return (
    <article className="group grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-[border-color,box-shadow] duration-[var(--dur-base)] hover:border-bronze-300 hover:shadow-sm sm:gap-5 sm:p-5">
      <ProfileVisual member={member} compact />
      <div className="min-w-0">
        <h3 className="m-0 font-display text-[1rem] font-bold leading-[1.3] text-strong">
          {member.name}
        </h3>
        <p className="mb-0 mt-1 text-[13px] leading-[1.45] text-stone-600">{member.title}</p>
        {member.department ? (
          <p className="mb-0 mt-2 text-[10.5px] font-semibold uppercase leading-[1.35] tracking-[0.11em] text-bronze-700">
            {member.department}
          </p>
        ) : null}
      </div>
      <span aria-hidden="true" className="self-start font-expanded text-[10px] tracking-[0.1em] text-stone-400">
        {number}
      </span>
    </article>
  );
}
