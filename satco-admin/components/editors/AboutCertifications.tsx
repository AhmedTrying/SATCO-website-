"use client";

import { useState } from "react";

import type {
  Certification,
  CertificationsPageCopy,
  Classification,
  License,
} from "@satco/shared";

import { saveCertifications } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { StringList } from "@/components/form/StringList";
import { useSave } from "@/lib/use-save";

export function AboutCertifications({
  page,
  classifications,
  licenses,
  certifications,
  canEdit,
}: {
  page: CertificationsPageCopy;
  classifications: Classification[];
  licenses: License[];
  certifications: Certification[];
  canEdit: boolean;
}) {
  const [intro, setIntro] = useState<string[]>(page.intro);
  const [cls, setCls] = useState<Classification[]>(classifications);
  const [lic, setLic] = useState<License[]>(licenses);
  const [certs, setCerts] = useState<Certification[]>(certifications);
  const [dirty, setDirty] = useState(false);
  const save = useSave();
  const touch = () => {
    setDirty(true);
    save.markDirty();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const res = await saveCertifications({
            certificationsPage: { ...page, intro },
            classifications: cls,
            licenses: lic,
            certifications: certs,
          });
          if (res.ok) setDirty(false);
          return res;
        });
      }}
    >
      <fieldset disabled={!canEdit} className="space-y-4">
        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">
            Intro (one entry per paragraph)
          </h2>
          <StringList
            values={intro}
            onChange={(v) => {
              setIntro(v);
              touch();
            }}
            multiline
            addLabel="Add paragraph"
          />
        </section>

        <section className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">
              Government classifications
            </h2>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => {
                setCls([...cls, { category: "", activities: [""] }]);
                touch();
              }}
            >
              + Add classification
            </button>
          </div>
          <div className="space-y-3">
            {cls.map((c, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <input
                    className="input"
                    aria-label={`Classification ${i + 1} category`}
                    value={c.category}
                    placeholder="Category 1"
                    onChange={(e) => {
                      setCls(
                        cls.map((x, idx) =>
                          idx === i ? { ...x, category: e.target.value } : x,
                        ),
                      );
                      touch();
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost px-2 text-error"
                    aria-label={`Remove classification ${i + 1}`}
                    onClick={() => {
                      setCls(cls.filter((_, idx) => idx !== i));
                      touch();
                    }}
                  >
                    ✕
                  </button>
                </div>
                <StringList
                  label="Activities"
                  values={c.activities}
                  onChange={(activities) => {
                    setCls(cls.map((x, idx) => (idx === i ? { ...x, activities } : x)));
                    touch();
                  }}
                  addLabel="Add activity"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">Licenses</h2>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => {
                setLic([...lic, { name: "", scope: "" }]);
                touch();
              }}
            >
              + Add license
            </button>
          </div>
          <div className="space-y-3">
            {lic.map((l, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <input
                    className="input"
                    aria-label={`License ${i + 1} name`}
                    value={l.name}
                    placeholder="GACAR Part 151"
                    onChange={(e) => {
                      setLic(
                        lic.map((x, idx) =>
                          idx === i ? { ...x, name: e.target.value } : x,
                        ),
                      );
                      touch();
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost px-2 text-error"
                    aria-label={`Remove license ${i + 1}`}
                    onClick={() => {
                      setLic(lic.filter((_, idx) => idx !== i));
                      touch();
                    }}
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  className="textarea"
                  rows={2}
                  aria-label={`License ${i + 1} scope`}
                  value={l.scope}
                  onChange={(e) => {
                    setLic(
                      lic.map((x, idx) =>
                        idx === i ? { ...x, scope: e.target.value } : x,
                      ),
                    );
                    touch();
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">
              Certifications (ISO / LEED)
            </h2>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => {
                setCerts([...certs, { code: "", title: "", group: "iso" }]);
                touch();
              }}
            >
              + Add certification
            </button>
          </div>
          <p className="mb-3 text-xs text-muted">
            Certificate images (docx comment #28) are attached via the Media library
            when the scans arrive — leave the image key blank until then.
          </p>
          <div className="space-y-3">
            {certs.map((c, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="input"
                    aria-label={`Certification ${i + 1} code`}
                    value={c.code}
                    placeholder="ISO 9001:2015"
                    onChange={(e) => {
                      setCerts(
                        certs.map((x, idx) =>
                          idx === i ? { ...x, code: e.target.value } : x,
                        ),
                      );
                      touch();
                    }}
                  />
                  <select
                    className="select"
                    aria-label={`Certification ${i + 1} group`}
                    value={c.group}
                    onChange={(e) => {
                      setCerts(
                        certs.map((x, idx) =>
                          idx === i
                            ? { ...x, group: e.target.value as Certification["group"] }
                            : x,
                        ),
                      );
                      touch();
                    }}
                  >
                    <option value="iso">ISO</option>
                    <option value="leed">LEED</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-ghost px-2 text-error"
                    aria-label={`Remove certification ${i + 1}`}
                    onClick={() => {
                      setCerts(certs.filter((_, idx) => idx !== i));
                      touch();
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2">
                  <textarea
                    className="textarea"
                    rows={2}
                    aria-label={`Certification ${i + 1} title`}
                    value={c.title}
                    placeholder="Quality Management"
                    onChange={(e) => {
                      setCerts(
                        certs.map((x, idx) =>
                          idx === i ? { ...x, title: e.target.value } : x,
                        ),
                      );
                      touch();
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </fieldset>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save certifications"
      />
    </form>
  );
}
