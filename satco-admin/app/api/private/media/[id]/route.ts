import { promises as fs } from "node:fs";
import path from "node:path";

import { get } from "@vercel/blob";
import { roleCan } from "@satco/shared";

import { adapters } from "@/lib/adapters";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function downloadHeaders(filename: string, mimeType: string, size?: number): HeadersInit {
  const downloadName = filename.replace(/["\r\n]/g, "-");
  return {
    "Cache-Control": "private, no-store",
    "Content-Disposition": `attachment; filename="${downloadName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
    "Content-Type": mimeType || "application/octet-stream",
    ...(size ? { "Content-Length": String(size) } : {}),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!roleCan(session.role, "downloadCv")) {
    return Response.json({ error: "You do not have access to this file." }, { status: 403 });
  }

  const media = await adapters.media.get((await params).id);
  if (!media || media.bucket !== "private-uploads") {
    return Response.json({ error: "File not found." }, { status: 404 });
  }

  if (isBlobUrl(media.path)) {
    const result = await get(media.path, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return Response.json({ error: "File not found." }, { status: 404 });
    }
    return new Response(result.stream, {
      headers: downloadHeaders(media.filename, media.mimeType, result.blob.size),
    });
  }

  const storedFilename = `${media.id}-${path.basename(media.filename)}`;
  const filePath = path.join(process.cwd(), "data", "private-uploads", storedFilename);
  try {
    const bytes = await fs.readFile(filePath);
    return new Response(new Uint8Array(bytes), {
      headers: downloadHeaders(media.filename, media.mimeType, bytes.byteLength),
    });
  } catch {
    return Response.json(
      {
        error:
          "This CV was uploaded before cloud storage was enabled and is no longer available on the server. Ask the applicant to upload it again.",
      },
      { status: 410 },
    );
  }
}
