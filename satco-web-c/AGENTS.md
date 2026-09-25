# ⚠ This is OPTION C of the SATCO site (`satco-web-c`, port 3002)

Option A = `satco-web/` (the original). B and C started as exact copies of A and receive
only the client's small per-option edits. Before editing, confirm with the user that the change
targets **Option C**. Log every intentional difference from A in `docs/VARIANTS.md`.
Content (copy, images in the content bundle) is shared with A — it's synced from
`satco-web/content/generated` on dev/build; don't hand-edit `content/generated/*.json` here.
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
