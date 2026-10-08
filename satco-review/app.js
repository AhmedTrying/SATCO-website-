/* SATCO A/B/C review board. No dependencies, no build. See README.md. */
(() => {
  "use strict";

  const OPTIONS = ["A", "B", "C"];
  const DECISIONS = ["A", "B", "C", "Mix", "Defer"];
  const STORAGE_KEY = "satco-review-v1";
  const DEFAULT_REVIEWERS = [
    { id: "bandar", name: "Bandar" },
    { id: "tamer", name: "Tamer" },
    { id: "tarek", name: "Tarek" },
  ];
  const items = window.SATCO_REVIEW_ITEMS || [];

  // ---------- origins ----------
  const query = new URLSearchParams(location.search);
  const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  const origins = {
    A: query.get("a") || (isLocal ? "http://localhost:3000" : "https://satco-website-a.vercel.app"),
    B: query.get("b") || (isLocal ? "http://localhost:3001" : "https://satco-website-b.vercel.app"),
    C: query.get("c") || (isLocal ? "http://localhost:3002" : "https://satco-website-c.vercel.app"),
  };

  // ---------- state ----------
  function emptyState() {
    return {
      version: 1,
      reviewers: DEFAULT_REVIEWERS.map((r) => ({ ...r })),
      items: {},
      ui: { index: 0, mode: "single", device: "desktop", option: "A", focus: false },
      updatedAt: null,
    };
  }

  function normalize(raw) {
    const s = emptyState();
    if (!raw || typeof raw !== "object") return s;
    if (Array.isArray(raw.reviewers) && raw.reviewers.length) {
      s.reviewers = raw.reviewers
        .filter((r) => r && typeof r.name === "string" && r.name.trim())
        .map((r, i) => ({ id: typeof r.id === "string" && r.id ? r.id : `r${i}`, name: r.name.trim() }));
    }
    if (raw.items && typeof raw.items === "object") {
      for (const [id, e] of Object.entries(raw.items)) {
        if (!e || typeof e !== "object") continue;
        const votes = {};
        for (const [rid, v] of Object.entries(e.votes || {})) if (OPTIONS.includes(v)) votes[rid] = v;
        s.items[id] = {
          votes,
          decision: DECISIONS.includes(e.decision) ? e.decision : null,
          notes: typeof e.notes === "string" ? e.notes : "",
        };
      }
    }
    if (raw.ui && typeof raw.ui === "object") {
      s.ui.index = Number.isInteger(raw.ui.index) ? Math.min(Math.max(raw.ui.index, 0), items.length - 1) : 0;
      s.ui.mode = raw.ui.mode === "side" ? "side" : "single";
      s.ui.device = raw.ui.device === "mobile" ? "mobile" : "desktop";
      s.ui.option = OPTIONS.includes(raw.ui.option) ? raw.ui.option : "A";
      s.ui.focus = Boolean(raw.ui.focus);
    }
    s.updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : null;
    return s;
  }

  let storageOk = true;
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalize(JSON.parse(raw)) : emptyState();
    } catch {
      storageOk = false;
      return emptyState();
    }
  }
  let state = load();

  function persist(touch = true) {
    if (touch) state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      if (storageOk) toast("Browser storage unavailable — export before closing");
      storageOk = false;
    }
  }

  function entry(id) {
    return state.items[id] || (state.items[id] = { votes: {}, decision: null, notes: "" });
  }
  const current = () => items[state.ui.index];
  const decidedCount = () => items.filter((it) => state.items[it.id]?.decision).length;

  // ---------- DOM ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else if (k === "dataset") Object.assign(node.dataset, v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    for (const c of [].concat(children)) if (c != null) node.append(c);
    return node;
  };

  const rail = $("#rail");
  const stage = $("#stage");
  const summary = $("#summary");
  const toastEl = $("#toast");
  const envBadge = $("#env");
  const progressEl = $("#progress");

  envBadge.textContent = isLocal ? "Local · :3000 / :3001 / :3002" : "Vercel";
  envBadge.dataset.env = isLocal ? "local" : "vercel";
  envBadge.title = `A ${origins.A}\nB ${origins.B}\nC ${origins.C}`;

  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  // ---------- urls ----------
  function pathFor(item, option) {
    const p = typeof item.path === "string" ? item.path : item.path?.[option] ?? "/";
    return p;
  }
  function urlFor(item, option, bust) {
    const url = new URL(pathFor(item, option), origins[option]);
    if (bust) url.searchParams.set("r", String(bust));
    return url.toString();
  }

  // ---------- frames (built once, reused for every item) ----------
  const framesEl = el("div", { class: "frames", id: "frames" });
  const frames = {};
  for (const o of OPTIONS) {
    const iframe = el("iframe", {
      title: `Option ${o}`,
      loading: "eager",
      allow: "fullscreen",
      referrerpolicy: "no-referrer-when-downgrade",
    });
    const url = el("span", { class: "url" });
    const open = el("a", { target: "_blank", rel: "noopener", text: "Open ↗", title: "Open this option in a new tab" });
    const label = el("div", { class: "frame-label" }, [
      el("b", { text: o }),
      el("span", { text: `Option ${o}` }),
      url,
      el("button", { type: "button", text: "Reload", title: "Reload this frame", onclick: () => reload([o]) }),
      open,
    ]);
    const body = el("div", { class: "frame-body" }, [iframe]);
    const wrap = el("div", { class: "frame", dataset: { option: o } }, [label, body]);
    wrap.addEventListener("click", (e) => {
      // Clicking a frame's label in side-by-side selects that option.
      if (e.target.closest("a, button")) return;
      if (state.ui.mode === "side") setOption(o);
    });
    frames[o] = { iframe, url, open, wrap, src: "" };
    framesEl.append(wrap);
  }

  function setFrameSrc(o, item, bust) {
    const f = frames[o];
    const src = urlFor(item, o, bust);
    f.url.textContent = src.replace(origins[o], "");
    f.open.href = src;
    if (f.src === src) return; // same URL: don't force a reload
    f.src = src;
    f.iframe.src = src;
  }

  function loadFrames(item, bust) {
    for (const o of OPTIONS) setFrameSrc(o, item, bust);
  }

  function reload(which = OPTIONS) {
    const item = current();
    const bust = Date.now();
    for (const o of which) {
      frames[o].src = "";
      setFrameSrc(o, item, bust);
    }
  }

  // Scale factor for side-by-side so three real desktop layouts fit the stage.
  const LABEL_H = 28;
  function fit() {
    if (!framesEl.isConnected) return;
    const gap = 12;
    const W = framesEl.clientWidth;
    const H = framesEl.clientHeight;
    const k = Math.max(0.1, Math.min((W - 2 * gap) / (3 * 1440), (H - LABEL_H) / 900));
    const km = Math.max(0.1, Math.min((W - 2 * gap) / (3 * 390), (H - LABEL_H) / 844, 1));
    framesEl.style.setProperty("--k", k.toFixed(4));
    framesEl.style.setProperty("--km", km.toFixed(4));
  }
  new ResizeObserver(fit).observe(document.body);

  // ---------- rendering ----------
  function renderProgress() {
    const done = decidedCount();
    progressEl.innerHTML = "";
    progressEl.append(
      el("progress", { max: items.length, value: done }),
      el("span", { text: `${done} / ${items.length} decided` }),
    );
  }

  function renderRail() {
    rail.innerHTML = "";
    let group = null;
    items.forEach((item, i) => {
      if (item.group !== group) {
        group = item.group;
        rail.append(el("h2", { text: group }));
      }
      const d = state.items[item.id]?.decision || "";
      rail.append(
        el(
          "button",
          {
            type: "button",
            class: "rail-item",
            "aria-current": i === state.ui.index ? "true" : null,
            onclick: () => goTo(i),
          },
          [
            el("span", { class: "n", text: String(i + 1).padStart(2, "0") }),
            el("span", { class: "t", text: item.title }),
            el("span", { class: "d", dataset: { v: d }, text: d || "·" }),
          ],
        ),
      );
    });
  }

  function segment(cls, defs, value, onPick) {
    const seg = el("div", { class: `seg ${cls}`, role: "group" });
    for (const d of defs) {
      seg.append(
        el(
          "button",
          { type: "button", "aria-pressed": String(d.value === value), onclick: () => onPick(d.value), title: d.title || null },
          [d.label, d.key ? el("kbd", { text: d.key }) : null],
        ),
      );
    }
    return seg;
  }

  function renderStage() {
    const item = current();
    const idx = state.ui.index;
    const e = entry(item.id);
    stage.innerHTML = "";

    // head
    const hintParts = [];
    if (item.motion) hintParts.push(el("span", { class: "motion", text: "Motion — press R to replay. " }));
    if (item.hint) hintParts.push(item.hint);
    const head = el("div", { class: "stage-head" }, [
      el("div", {}, [
        el("p", { class: "kicker" }, [
          `${item.group} · ${String(idx + 1).padStart(2, "0")} / ${items.length}`,
          item.ref ? el("span", { class: "ref", text: item.ref }) : null,
        ]),
        el("h1", { text: item.title }),
        hintParts.length ? el("p", { class: "hint" }, hintParts) : null,
      ]),
      el("div", { class: "stage-controls" }, [
        segment(
          "options",
          OPTIONS.map((o, i) => ({ value: o, label: o, key: String(i + 1) })),
          state.ui.mode === "single" ? state.ui.option : null,
          setOption,
        ),
        segment(
          "mode",
          [
            { value: "single", label: "Single", key: "S" },
            { value: "side", label: "Side by side", key: "S" },
          ],
          state.ui.mode,
          setMode,
        ),
        segment(
          "device",
          [
            { value: "desktop", label: "Desktop", key: "M" },
            { value: "mobile", label: "Mobile", key: "M" },
          ],
          state.ui.device,
          setDevice,
        ),
        el("button", { type: "button", class: "btn", onclick: () => reload(), title: "Reload all three frames" }, ["Reload", el("kbd", { text: "R" })]),
        el("button", { type: "button", class: "btn", disabled: idx === 0, onclick: () => goTo(idx - 1) }, [el("kbd", { text: "←" }), "Prev"]),
        el("button", { type: "button", class: "btn", disabled: idx === items.length - 1, onclick: () => goTo(idx + 1) }, ["Next", el("kbd", { text: "→" })]),
      ]),
    ]);

    // what differs
    const differs = el(
      "div",
      { class: "differs" },
      OPTIONS.map((o) =>
        el(
          "button",
          {
            type: "button",
            class: "differ",
            "aria-pressed": String(state.ui.mode === "single" && state.ui.option === o),
            onclick: () => setOption(o),
          },
          [el("b", { text: o }), el("span", { text: item.differs?.[o] || "Same as A." })],
        ),
      ),
    );

    // frames
    framesEl.dataset.mode = state.ui.mode;
    framesEl.dataset.device = state.ui.device;
    for (const o of OPTIONS) frames[o].wrap.dataset.active = String(o === state.ui.option);

    // decision strip
    const votes = el("div", { class: "votes" });
    for (const r of state.reviewers) {
      const v = e.votes[r.id] || "";
      votes.append(
        el(
          "button",
          {
            type: "button",
            class: "vote",
            dataset: { v },
            title: `${r.name}: click to cycle A → B → C → none`,
            onclick: () => {
              const next = OPTIONS[(OPTIONS.indexOf(e.votes[r.id] || "") + 1) % (OPTIONS.length + 1)] || null;
              if (next) e.votes[r.id] = next;
              else delete e.votes[r.id];
              persist();
              renderStage();
            },
          },
          [r.name, el("b", { text: v || "–" })],
        ),
      );
    }
    const decisions = el("div", { class: "decisions" });
    for (const d of DECISIONS) {
      decisions.append(
        el("button", {
          type: "button",
          class: "btn",
          dataset: { v: d },
          "aria-pressed": String(e.decision === d),
          text: d,
          onclick: () => {
            e.decision = e.decision === d ? null : d;
            persist();
            renderStage();
            renderRail();
            renderProgress();
          },
        }),
      );
    }
    let notesTimer = 0;
    const notes = el("textarea", {
      placeholder: "e.g. B's layout with C's photos; Tarek wants the heading smaller",
      "aria-label": "Notes",
      oninput: (ev) => {
        e.notes = ev.target.value;
        clearTimeout(notesTimer);
        notesTimer = setTimeout(() => persist(), 300);
      },
    });
    notes.value = e.notes;
    const decide = el("div", { class: "decide" }, [
      el("div", {}, [el("h3", { text: "Opinions" }), votes]),
      el("div", {}, [el("h3", { text: "Decision" }), decisions]),
      el("div", { class: "notes" }, [el("h3", {}, ["Notes", el("span", { text: "autosaved" })]), notes]),
    ]);

    stage.append(head, differs, framesEl, decide);
    fit();
  }

  function renderAll() {
    document.body.dataset.focus = String(state.ui.focus);
    renderRail();
    renderStage();
    renderProgress();
    loadFrames(current());
  }

  // ---------- actions ----------
  function goTo(i) {
    if (i < 0 || i >= items.length) return;
    state.ui.index = i;
    const item = items[i];
    if (item.motion && state.ui.mode === "side") state.ui.mode = "single";
    persist(false);
    renderAll();
    const active = rail.querySelector('[aria-current="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }
  function setOption(o) {
    state.ui.option = o;
    state.ui.mode = "single";
    persist(false);
    renderStage();
  }
  function setMode(m) {
    state.ui.mode = m;
    persist(false);
    renderStage();
  }
  function setDevice(d) {
    state.ui.device = d;
    persist(false);
    renderStage();
  }
  function toggleFocus() {
    state.ui.focus = !state.ui.focus;
    persist(false);
    document.body.dataset.focus = String(state.ui.focus);
    $("#btn-focus").setAttribute("aria-pressed", String(state.ui.focus));
    fit();
  }

  // ---------- summary ----------
  function voteOf(e, rid) {
    return e?.votes?.[rid] || "";
  }
  function renderSummary() {
    const date = new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" });
    const counts = { A: 0, B: 0, C: 0, Mix: 0, Defer: 0, open: 0 };
    for (const it of items) {
      const d = state.items[it.id]?.decision;
      if (d) counts[d] += 1;
      else counts.open += 1;
    }
    summary.innerHTML = "";
    const table = el("table", { class: "sum" }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { text: "#" }),
          el("th", { text: "Section" }),
          ...state.reviewers.map((r) => el("th", { text: r.name })),
          el("th", { text: "Decision" }),
          el("th", { text: "Notes" }),
        ]),
      ]),
      el(
        "tbody",
        {},
        items.map((it, i) => {
          const e = state.items[it.id];
          return el("tr", {}, [
            el("td", { class: "n", text: String(i + 1) }),
            el("td", { class: "t" }, [
              el("button", { type: "button", text: it.title, onclick: () => { closeSummary(); goTo(i); } }),
              el("small", { text: it.group }),
            ]),
            ...state.reviewers.map((r) => el("td", { class: "v", dataset: { v: voteOf(e, r.id) }, text: voteOf(e, r.id) || "–" })),
            el("td", { class: "v", dataset: { v: e?.decision || "" }, text: e?.decision || "pending" }),
            el("td", { class: "notes", text: e?.notes || "" }),
          ]);
        }),
      ),
    ]);
    summary.append(
      el("div", { class: "summary-inner" }, [
        el("div", { class: "summary-head" }, [
          el("div", {}, [
            el("h1", { text: "Decisions — SATCO website A / B / C" }),
            el("p", { text: `${date} · ${state.reviewers.map((r) => r.name).join(", ")}` }),
          ]),
          el("div", { class: "bar-actions" }, [
            el("button", { type: "button", class: "btn", text: "Print", onclick: () => window.print() }),
            el("button", { type: "button", class: "btn", text: "Copy Markdown", onclick: copyMarkdown }),
            el("button", { type: "button", class: "btn", text: "Export Markdown", onclick: exportMarkdown }),
            el("button", { type: "button", class: "btn primary", onclick: closeSummary }, ["Back to board", el("kbd", { text: "Esc" })]),
          ]),
        ]),
        el(
          "div",
          { class: "totals" },
          [
            ...DECISIONS.map((d) => el("div", { class: "total" }, [el("b", { text: String(counts[d]) }), el("span", { text: d })])),
            el("div", { class: "total" }, [el("b", { text: String(counts.open) }), el("span", { text: "pending" })]),
          ],
        ),
        table,
      ]),
    );
  }
  function openSummary() {
    renderSummary();
    summary.hidden = false;
    $("#btn-summary").setAttribute("aria-pressed", "true");
  }
  function closeSummary() {
    summary.hidden = true;
    $("#btn-summary").setAttribute("aria-pressed", "false");
  }
  function toggleSummary() {
    summary.hidden ? openSummary() : closeSummary();
  }

  // ---------- export / import ----------
  function download(name, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = el("a", { href: url, download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const today = () => new Date().toISOString().slice(0, 10);

  function exportJson() {
    persist();
    download(`satco-review-${today()}.json`, JSON.stringify(state, null, 2), "application/json");
    toast("JSON exported");
  }

  function markdown() {
    const esc = (s) => String(s || "").replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
    const head = ["#", "Section", ...state.reviewers.map((r) => r.name), "Decision", "Notes"];
    const lines = [
      `## Round 2 decisions (meeting ${today()})`,
      "",
      `Recorded with the A/B/C review board (\`satco-review/\`). Reviewers: ${state.reviewers.map((r) => r.name).join(", ")}.`,
      "",
      `| ${head.join(" | ")} |`,
      `|${head.map(() => "---").join("|")}|`,
    ];
    const counts = { A: 0, B: 0, C: 0, Mix: 0, Defer: 0, pending: 0 };
    items.forEach((it, i) => {
      const e = state.items[it.id];
      const d = e?.decision || "";
      counts[d || "pending"] += 1;
      lines.push(
        `| ${i + 1} | ${esc(`${it.group} · ${it.title}`)} | ${state.reviewers.map((r) => voteOf(e, r.id) || "–").join(" | ")} | ${d || "pending"} | ${esc(e?.notes)} |`,
      );
    });
    lines.push("", `Totals: A ${counts.A} · B ${counts.B} · C ${counts.C} · Mix ${counts.Mix} · Defer ${counts.Defer} · pending ${counts.pending}`, "");
    return lines.join("\n");
  }
  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown());
      toast("Markdown copied");
    } catch {
      toast("Clipboard blocked — use Export Markdown");
    }
  }
  function exportMarkdown() {
    download(`satco-review-${today()}.md`, markdown(), "text/markdown");
    toast("Markdown exported");
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = normalize(JSON.parse(String(reader.result)));
        if (!confirm(`Replace the current board state with “${file.name}”?`)) return;
        state = next;
        persist(false);
        renderAll();
        if (!summary.hidden) renderSummary();
        toast("Imported");
      } catch {
        toast("That file is not a review-board export");
      }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (!confirm("Clear every opinion, decision and note on this board? Export first if you need them.")) return;
    const reviewers = state.reviewers;
    state = emptyState();
    state.reviewers = reviewers;
    persist();
    renderAll();
    toast("Board reset");
  }

  // ---------- reviewers dialog ----------
  const dlg = $("#settings");
  function openSettings() {
    const list = $(".reviewer-list", dlg);
    list.innerHTML = "";
    const addRow = (name = "") => {
      const input = el("input", { type: "text", value: name, placeholder: "Reviewer name", maxlength: "40" });
      const row = el("div", { class: "reviewer-row" }, [
        input,
        el("button", { type: "button", class: "btn", text: "Remove", onclick: () => row.remove() }),
      ]);
      list.append(row);
      return input;
    };
    state.reviewers.forEach((r) => addRow(r.name));
    $("#add-reviewer").onclick = () => addRow("").focus();
    dlg.showModal();
  }
  $("#settings-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const names = [...dlg.querySelectorAll(".reviewer-row input")].map((i) => i.value.trim()).filter(Boolean);
    if (!names.length) return;
    // Keep ids stable for unchanged names so recorded votes survive renames of others.
    const byName = new Map(state.reviewers.map((r) => [r.name.toLowerCase(), r.id]));
    const used = new Set();
    state.reviewers = names.map((name, i) => {
      let id = byName.get(name.toLowerCase());
      if (!id || used.has(id)) id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`;
      used.add(id);
      return { id, name };
    });
    persist();
    dlg.close();
    renderStage();
    toast("Reviewers updated");
  });
  $("#settings-cancel").addEventListener("click", () => dlg.close());

  // ---------- top bar ----------
  $("#btn-summary").addEventListener("click", toggleSummary);
  $("#btn-settings").addEventListener("click", openSettings);
  $("#btn-export-md").addEventListener("click", exportMarkdown);
  $("#btn-export-json").addEventListener("click", exportJson);
  $("#btn-reset").addEventListener("click", resetAll);
  $("#btn-focus").addEventListener("click", toggleFocus);
  $("#import").addEventListener("change", (ev) => {
    const file = ev.target.files?.[0];
    if (file) importJson(file);
    ev.target.value = "";
  });

  // ---------- keyboard ----------
  document.addEventListener("keydown", (ev) => {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const t = ev.target;
    if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.isContentEditable)) {
      if (ev.key === "Escape") t.blur();
      return;
    }
    if (dlg.open) return;
    const k = ev.key;
    if (k === "Escape") return toggleSummary();
    if (!summary.hidden) return;
    if (k === "1" || k === "2" || k === "3") return setOption(OPTIONS[Number(k) - 1]);
    if (k === "ArrowRight" || k === "PageDown") return goTo(state.ui.index + 1);
    if (k === "ArrowLeft" || k === "PageUp") return goTo(state.ui.index - 1);
    if (k === "Home") return goTo(0);
    if (k === "End") return goTo(items.length - 1);
    const lk = k.toLowerCase();
    if (lk === "s") return setMode(state.ui.mode === "side" ? "single" : "side");
    if (lk === "m") return setDevice(state.ui.device === "mobile" ? "desktop" : "mobile");
    if (lk === "r") return reload();
    if (lk === "f") return toggleFocus();
  });

  // Keyboard focus falls into a frame once the presenter clicks inside it; clicking
  // anywhere on the chrome takes it back so the shortcuts work again.
  document.addEventListener("mousedown", (ev) => {
    if (!ev.target.closest("iframe") && document.activeElement?.tagName === "IFRAME") document.activeElement.blur();
  });

  // Debug / scripting hook (read-only use): window.satcoReview.markdown()
  window.satcoReview = { markdown, state: () => JSON.parse(JSON.stringify(state)), origins };

  // ---------- boot ----------
  $("#btn-focus").setAttribute("aria-pressed", String(state.ui.focus));
  renderAll();
  if (!storageOk) toast("Browser storage unavailable — export before closing");
})();
