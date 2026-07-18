import { PageHeader } from "./PageHeader";

export function Placeholder({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="card flex items-center gap-3 p-5 text-sm text-muted">
        <span className="badge badge-stone">{phase}</span>
        This screen is being built in {phase}.
      </div>
    </>
  );
}
