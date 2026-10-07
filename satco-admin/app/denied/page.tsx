import Link from "next/link";

export default function DeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
      <div className="card max-w-md p-6 text-center">
        <div className="text-3xl" aria-hidden="true">
          ⚠
        </div>
        <h1 className="mt-2 text-lg font-semibold text-strong">
          You don&rsquo;t have access to that
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your account doesn&rsquo;t include this page. An admin can grant it under
          Users &amp; access.
        </p>
        <Link href="/overview" className="btn btn-primary mt-4">
          Back to overview
        </Link>
      </div>
    </div>
  );
}
