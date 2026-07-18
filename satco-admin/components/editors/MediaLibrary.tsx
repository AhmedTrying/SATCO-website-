"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import type { MediaBucket, MediaItem } from "@satco/shared";

import { removeMedia, updateMediaAlt, uploadMedia } from "@/app/actions/media";

function readFileBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function MediaCard({
  item,
  canEdit,
}: {
  item: MediaItem;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [alt, setAlt] = useState(item.alt);
  const [, start] = useTransition();
  const [msg, setMsg] = useState<string>();
  const isLogo = item.category === "logo";

  return (
    <div className="card overflow-hidden">
      <div className="flex h-28 items-center justify-center bg-stone-100">
        {item.bucket === "private-uploads" ? (
          <span className="text-xs text-muted">🔒 private file</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.path}
            alt={item.alt}
            className={`max-h-28 max-w-full object-contain ${isLogo ? "grayscale" : ""}`}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="truncate text-xs font-medium text-strong" title={item.filename}>
          {item.filename}
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="badge badge-stone">{item.bucket.replace("-", " ")}</span>
          {item.category && <span className="badge badge-stone">{item.category}</span>}
        </div>
        <div>
          <label className="label text-[0.7rem]">
            Alt text{item.bucket === "public-media" && " (required)"}
          </label>
          <input
            className="input text-xs"
            aria-label="Alt text"
            value={alt}
            disabled={!canEdit}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
        {msg && <div className="text-[0.7rem] text-muted">{msg}</div>}
        {canEdit && (
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-secondary flex-1 py-1 text-xs"
              disabled={alt === item.alt}
              onClick={() =>
                start(async () => {
                  const res = await updateMediaAlt(item.id, alt);
                  setMsg(res.ok ? "Saved" : res.error);
                  if (res.ok) router.refresh();
                })
              }
            >
              Save alt
            </button>
            <button
              type="button"
              className="btn btn-ghost px-2 py-1 text-xs text-error"
              onClick={() =>
                start(async () => {
                  await removeMedia(item.id);
                  router.refresh();
                })
              }
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MediaLibrary({
  initial,
  canEdit,
}: {
  initial: MediaItem[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [bucket, setBucket] = useState<MediaBucket>("public-media");
  const [category, setCategory] = useState<MediaItem["category"]>("photo");
  const [filter, setFilter] = useState<"all" | MediaBucket>("all");
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  const shown =
    filter === "all" ? initial : initial.filter((m) => m.bucket === filter);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    if (bucket === "public-media" && !alt.trim()) {
      setError("Alt text is required for public media (accessibility).");
      return;
    }
    start(async () => {
      const dataBase64 = await readFileBase64(file);
      const res = await uploadMedia({
        filename: file.name,
        alt,
        bucket,
        category,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        dataBase64,
      });
      if (res.ok) {
        setAlt("");
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="space-y-5">
      {canEdit && (
        <form className="card p-4" onSubmit={submit}>
          <h2 className="mb-3 text-sm font-semibold text-strong">Upload</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">File</label>
              <input ref={fileRef} type="file" className="input" aria-label="File" />
            </div>
            <div>
              <label className="label">Alt text (required for public)</label>
              <input
                className="input"
                aria-label="Alt text (required for public)"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image for screen readers"
              />
            </div>
            <div>
              <label className="label">Bucket</label>
              <select
                className="select"
                aria-label="Bucket"
                value={bucket}
                onChange={(e) => setBucket(e.target.value as MediaBucket)}
              >
                <option value="public-media">Public media</option>
                <option value="private-uploads">Private uploads (CVs)</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="select"
                aria-label="Category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as MediaItem["category"])
                }
              >
                <option value="photo">Photo</option>
                <option value="logo">Logo (grayscale)</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          {error && <p className="field-error mt-2">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={pending}
          >
            {pending ? "Uploading…" : "Upload"}
          </button>
        </form>
      )}

      <div className="flex items-center gap-2">
        {(["all", "public-media", "private-uploads"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`btn text-xs ${filter === f ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.replace("-", " ")}
          </button>
        ))}
        <span className="ms-auto text-xs text-muted">{shown.length} assets</span>
      </div>

      {shown.length === 0 ? (
        <div className="card p-6 text-center text-sm text-muted">
          No assets in this bucket yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((m) => (
            <MediaCard key={m.id} item={m} canEdit={canEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
