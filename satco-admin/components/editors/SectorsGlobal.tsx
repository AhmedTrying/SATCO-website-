"use client";

import { useState } from "react";

import type { PendingExperienceCard, SectorsIntroContent } from "@satco/shared";

import { saveSectorsGlobal, saveSectorsIntro } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { useSave } from "@/lib/use-save";

export function SectorsGlobal({
  intro,
  showPendingExperience,
  pendingExperienceCard,
  canEdit,
}: {
  intro: SectorsIntroContent;
  showPendingExperience: boolean;
  pendingExperienceCard: PendingExperienceCard;
  canEdit: boolean;
}) {
  const [i, setI] = useState<SectorsIntroContent>(intro);
  const [introDirty, setIntroDirty] = useState(false);
  const introSave = useSave();

  const [pending, setPending] = useState(showPendingExperience);
  const [card, setCard] = useState<PendingExperienceCard>(pendingExperienceCard);
  const [globalDirty, setGlobalDirty] = useState(false);
  const globalSave = useSave();

  return (
    <div className="space-y-4">
      <form
        className="card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          introSave.run(async () => {
            const res = await saveSectorsIntro(i);
            if (res.ok) setIntroDirty(false);
            return res;
          });
        }}
      >
        <h2 className="mb-3 text-sm font-semibold text-strong">Sectors intro</h2>
        <fieldset disabled={!canEdit} className="space-y-3">
          <div>
            <label className="label">Heading</label>
            <input
              className="input"
              aria-label="Heading"
              value={i.heading}
              onChange={(e) => {
                setI({ ...i, heading: e.target.value });
                setIntroDirty(true);
                introSave.markDirty();
              }}
            />
          </div>
          <div>
            <label className="label">Subhead</label>
            <textarea
              className="textarea"
              rows={2}
              aria-label="Subhead"
              value={i.subhead}
              onChange={(e) => {
                setI({ ...i, subhead: e.target.value });
                setIntroDirty(true);
                introSave.markDirty();
              }}
            />
          </div>
        </fieldset>
        <SaveBar
          state={introSave.state}
          dirty={introDirty}
          canEdit={canEdit}
          error={introSave.error}
          label="Save intro"
        />
      </form>

      <form
        className="card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          globalSave.run(async () => {
            const res = await saveSectorsGlobal({
              showPendingExperience: pending,
              pendingExperienceCard: card,
            });
            if (res.ok) setGlobalDirty(false);
            return res;
          });
        }}
      >
        <h2 className="mb-1 text-sm font-semibold text-strong">
          Selected Experience — publishing switch
        </h2>
        <p className="mb-3 text-xs text-muted">
          Off (locked default) shows the &ldquo;in preparation&rdquo; card for
          Construction / Operations / PPP. Turn on only after the client approves
          publishing the draft experience copy (plan §12 Q4).
        </p>
        <fieldset disabled={!canEdit} className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={pending}
              onChange={(e) => {
                setPending(e.target.checked);
                setGlobalDirty(true);
                globalSave.markDirty();
              }}
            />
            Publish pending Selected Experience copy
          </label>
          <div className="rounded-md border border-border p-3">
            <div className="mb-2 text-xs font-semibold text-muted">
              Interim &ldquo;in preparation&rdquo; card
            </div>
            <div className="space-y-2">
              <input
                className="input"
                value={card.heading}
                aria-label="Interim card heading"
                onChange={(e) => {
                  setCard({ ...card, heading: e.target.value });
                  setGlobalDirty(true);
                  globalSave.markDirty();
                }}
              />
              <textarea
                className="textarea"
                rows={2}
                aria-label="Interim card body"
                value={card.body}
                onChange={(e) => {
                  setCard({ ...card, body: e.target.value });
                  setGlobalDirty(true);
                  globalSave.markDirty();
                }}
              />
              <input
                className="input"
                aria-label="Interim card link label"
                value={card.linkLabel}
                onChange={(e) => {
                  setCard({ ...card, linkLabel: e.target.value });
                  setGlobalDirty(true);
                  globalSave.markDirty();
                }}
              />
            </div>
          </div>
        </fieldset>
        <SaveBar
          state={globalSave.state}
          dirty={globalDirty}
          canEdit={canEdit}
          error={globalSave.error}
          label="Save switch"
        />
      </form>
    </div>
  );
}
