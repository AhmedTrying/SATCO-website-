import { promises as fs } from "node:fs";
import path from "node:path";

import { roleCan } from "@satco/shared";

import { adapters } from "@/lib/adapters";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const storedFilename = `${media.id}-${path.basename(media.filename)}`;
  const filePath = path.join(process.cwd(), "data", "private-uploads", storedFilename);
  try {
    const bytes = await fs.readFile(filePath);
    const downloadName = media.filename.replace(/["\r\n]/g, "-");
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${downloadName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
        "Content-Type": media.mimeType || "application/octet-stream",
      },
    });
  } catch {
    return Response.json({ error: "File not found." }, { status: 404 });
  }
}
