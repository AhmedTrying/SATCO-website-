"use client";

import {
  DESIGN_SECTION_IDS,
  GLOBAL_STYLE_IDS,
  createEmptyDesignSelection,
  normalizeDesignSelection,
  type DesignOption,
  type DesignSectionId,
  type DesignSelectionConfig,
  type GlobalStyleId,
} from "@satco/shared";
import { useEffect, useMemo, useReducer, useState } from "react";

import { Emblem } from "@/components/ui/Emblem";
import {
  designSections,
  designSelectionCopy as copy,
  globalStyleDefinitions,
  type GlobalStyleDefinition,
} from "@/content/design-selection";

import { PreviewSite, SectionPreview } from "./PreviewSite";
import styles from "./design-selection.module.css";

const STORAGE_KEY = "satco-design-selection-v1";

type ViewMode = "selection" | "comparison" | "preview" | "approval";
type DeviceMode = "desktop" | "tablet" | "mobile";
type ActivePanel = "global" | DesignSectionId;

interface HistoryState {
  past: DesignSelectionConfig[];
  present: DesignSelectionConfig;
}

type HistoryAction =
  | { type: "load"; config: DesignSelectionConfig }
  | { type: "choose-section"; id: DesignSectionId; option: DesignOption }
  | { type: "choose-global"; id: GlobalStyleId; option: DesignOption }
  | { type: "comment"; id: DesignSectionId; comment: string }
  | { type: "reset-section"; id: DesignSectionId }
  | { type: "reset-all" }
  | { type: "saved"; timestamp: string }
  | { type: "undo" };

function push(state: HistoryState, next: DesignSelectionConfig): HistoryState {
  return {
    past: [...state.past.slice(-49), state.present],
    present: next,
  };
}

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  if (action.type === "load") return { past: [], present: action.config };
  if (action.type === "undo") {
    const previous = state.past.at(-1);
    return previous
      ? { past: state.past.slice(0, -1), present: previous }
      : state;
  }
  if (action.type === "saved") {
    return { ...state, present: { ...state.present, updatedAt: action.timestamp } };
  }
  if (action.type === "comment") {
    return {
      ...state,
      present: {
        ...state.present,
        sections: {
          ...state.present.sections,
          [action.id]: { ...state.present.sections[action.id], comment: action.comment },
        },
      },
    };
  }
  if (action.type === "choose-section") {
    return push(state, {
      ...state.present,
      sections: {
        ...state.present.sections,
        [action.id]: { ...state.present.sections[action.id], choice: action.option },
      },
      updatedAt: null,
    });
  }
  if (action.type === "choose-global") {
    return push(state, {
      ...state.present,
      global: { ...state.present.global, [action.id]: action.option },
      updatedAt: null,
    });
  }
  if (action.type === "reset-section") {
    return push(state, {
      ...state.present,
      sections: {
        ...state.present.sections,
        [action.id]: { choice: null, comment: "" },
      },
      updatedAt: null,
    });
  }
  return push(state, createEmptyDesignSelection());
}

function optionLabel(option: DesignOption | null): string {
  return option ? copy.optionLabels[option] : copy.pending;
}

function DeviceControls({
  device,
  onChange,
}: {
  device: DeviceMode;
  onChange: (device: DeviceMode) => void;
}) {
  return (
    <div className={styles.deviceControls} role="group" aria-label={copy.devicePreview}>
      {(["desktop", "tablet", "mobile"] as DeviceMode[]).map((id) => (
        <button
          type="button"
          key={id}
          aria-pressed={device === id}
          onClick={() => onChange(id)}
        >
          <span aria-hidden="true" className={styles.deviceIcon} data-device={id} />
          {copy.devices[id]}
        </button>
      ))}
    </div>
  );
}

function PreviewFrame({
  device,
  label,
  children,
}: {
  device: DeviceMode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.previewStage}>
      <div className={styles.previewBrowser} data-device={device}>
        <div className={styles.previewBrowserBar}>
          <span className={styles.browserDots} aria-hidden="true"><i /><i /><i /></span>
          <span>{label}</span>
          <small>{copy.devices[device]}</small>
        </div>
        <div className={styles.previewViewport}>{children}</div>
      </div>
    </div>
  );
}

function SelectionCard({
  option,
  title,
  detail,
  selected,
  onSelect,
}: {
  option: DesignOption;
  title: string;
  detail: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.selectionCard}
      data-selected={selected || undefined}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className={styles.selectionCardTop}>
        <strong>{copy.optionLabels[option]}</strong>
        <span>{selected ? `✓ ${copy.selected}` : copy.select}</span>
      </span>
      <b>{title}</b>
      <small>{detail}</small>
    </button>
  );
}

function SectionWorkspace({
  id,
  config,
  view,
  device,
  dispatch,
  onCompare,
}: {
  id: DesignSectionId;
  config: DesignSelectionConfig;
  view: "selection" | "comparison";
  device: DeviceMode;
  dispatch: React.Dispatch<HistoryAction>;
  onCompare: () => void;
}) {
  const definition = designSections.find((section) => section.id === id)!;
  const decision = config.sections[id];
  const activeOption = decision.choice ?? "option1";

  return (
    <section className={styles.workspacePanel} aria-labelledby={`workspace-${id}`}>
      <div className={styles.workspaceHeading}>
        <div>
          <p>{definition.number} · {copy.websiteSection}</p>
          <h1 id={`workspace-${id}`}>{definition.label}</h1>
          <span>{definition.description}</span>
        </div>
        {view === "selection" ? (
          <button type="button" className={styles.secondaryButton} onClick={onCompare}>
            {copy.compareSideBySide}
          </button>
        ) : null}
      </div>

      <div className={styles.choiceGrid}>
        <SelectionCard
          option="option1"
          title={definition.option1Label}
          detail={copy.option1Detail}
          selected={decision.choice === "option1"}
          onSelect={() => dispatch({ type: "choose-section", id, option: "option1" })}
        />
        <SelectionCard
          option="option2"
          title={definition.option2Label}
          detail={copy.option2Detail}
          selected={decision.choice === "option2"}
          onSelect={() => dispatch({ type: "choose-section", id, option: "option2" })}
        />
      </div>

      {view === "comparison" ? (
        <div className={styles.comparisonGrid}>
          {(["option1", "option2"] as DesignOption[]).map((option) => (
            <div key={option} className={styles.comparisonColumn}>
              <div className={styles.comparisonLabel}>
                <strong>{copy.optionLabels[option]}</strong>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "choose-section", id, option })}
                  data-selected={decision.choice === option || undefined}
                >
                  {decision.choice === option ? `✓ ${copy.selected}` : copy.selectThisOption}
                </button>
              </div>
              <PreviewFrame device={device} label={`${definition.label} · ${copy.optionLabels[option]}`}>
                <SectionPreview id={id} option={option} config={config} />
              </PreviewFrame>
            </div>
          ))}
        </div>
      ) : (
        <>
          {!decision.choice ? <p className={styles.fallbackNotice}>{copy.fallbackNotice}</p> : null}
          <PreviewFrame device={device} label={`${definition.label} · ${copy.optionLabels[activeOption]}`}>
            <SectionPreview id={id} option={activeOption} config={config} />
          </PreviewFrame>
        </>
      )}

      <div className={styles.commentPanel}>
        <div>
          <label htmlFor={`comment-${id}`}>{copy.managementComment}</label>
          <span>{copy.commentHelp}</span>
        </div>
        <textarea
          id={`comment-${id}`}
          value={decision.comment}
          placeholder={copy.commentPlaceholder}
          onChange={(event) => dispatch({ type: "comment", id, comment: event.target.value })}
          rows={4}
        />
        <button
          type="button"
          className={styles.textButton}
          disabled={!decision.choice && !decision.comment}
          onClick={() => dispatch({ type: "reset-section", id })}
        >
          {copy.resetSection}
        </button>
      </div>
    </section>
  );
}

function GlobalStyleSample({ id, option }: { id: GlobalStyleId; option: DesignOption }) {
  if (id === "colors") {
    return <div className={styles.paletteSample} data-option={option}><i /><i /><i /><i /></div>;
  }
  if (id === "typography") {
    return <div className={styles.typeSample} data-option={option}><strong>SATCO</strong><span>{copy.preview.typeSample}</span></div>;
  }
  if (id === "buttons") {
    return <div className={styles.buttonSample} data-option={option}><span>{copy.sampleAction} →</span></div>;
  }
  if (id === "cards") {
    return <div className={styles.cardSample} data-option={option}><i /><strong>01</strong><span>{copy.sampleCard}</span></div>;
  }
  return <div className={styles.backgroundSample} data-option={option}><i /><i /><i /></div>;
}

function GlobalStyleRow({
  definition,
  config,
  dispatch,
}: {
  definition: GlobalStyleDefinition;
  config: DesignSelectionConfig;
  dispatch: React.Dispatch<HistoryAction>;
}) {
  return (
    <article className={styles.globalStyleRow}>
      <div className={styles.globalStyleIntro}>
        <h2>{definition.label}</h2>
        <p>{definition.description}</p>
      </div>
      <div className={styles.globalOptions}>
        {(["option1", "option2"] as DesignOption[]).map((option) => {
          const selected = config.global[definition.id] === option;
          const content = definition.options[option];
          return (
            <button
              type="button"
              key={option}
              data-selected={selected || undefined}
              aria-pressed={selected}
              onClick={() => dispatch({ type: "choose-global", id: definition.id, option })}
            >
              <GlobalStyleSample id={definition.id} option={option} />
              <span><b>{content.title}</b><small>{content.detail}</small></span>
              <em>{selected ? `✓ ${copy.selected}` : copy.optionLabels[option]}</em>
            </button>
          );
        })}
      </div>
    </article>
  );
}

function GlobalStyleWorkspace({
  config,
  dispatch,
}: {
  config: DesignSelectionConfig;
  dispatch: React.Dispatch<HistoryAction>;
}) {
  return (
    <section className={styles.workspacePanel} aria-labelledby="global-style-title">
      <div className={styles.workspaceHeading}>
        <div>
          <p>{copy.globalDesign}</p>
          <h1 id="global-style-title">{copy.globalStyle}</h1>
          <span>{copy.globalStyleIntro}</span>
        </div>
      </div>
      <div className={styles.sharedStyleNote}>
        <strong>{copy.sharedFoundation}</strong>
        <p>{copy.sharedFoundationBody}</p>
      </div>
      <div className={styles.globalStyleList}>
        {globalStyleDefinitions.map((definition) => (
          <GlobalStyleRow
            key={definition.id}
            definition={definition}
            config={config}
            dispatch={dispatch}
          />
        ))}
      </div>
    </section>
  );
}

function MixedPreview({ config, device }: { config: DesignSelectionConfig; device: DeviceMode }) {
  return (
    <section className={styles.workspacePanel} aria-labelledby="final-preview-title">
      <div className={styles.workspaceHeading}>
        <div>
          <p>{copy.liveWebsite}</p>
          <h1 id="final-preview-title">{copy.finalPreviewTitle}</h1>
          <span>{copy.finalPreviewBody}</span>
        </div>
      </div>
      <p className={styles.fallbackNotice}>{copy.fallbackNotice}</p>
      <PreviewFrame device={device} label={copy.finalPreviewTitle}>
        <PreviewSite config={config} />
      </PreviewFrame>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className={styles.summaryRow}><span>{label}</span><i /><strong>{value}</strong></div>;
}

function ApprovalSummary({
  config,
  completedSections,
}: {
  config: DesignSelectionConfig;
  completedSections: number;
}) {
  const complete = completedSections === DESIGN_SECTION_IDS.length;
  const comments = designSections.filter((section) => config.sections[section.id].comment.trim());
  return (
    <section className={styles.approvalPage} aria-labelledby="approval-title">
      <div className={styles.approvalBrand}>
        <div><Emblem size={42} disc="var(--bronze-800)" land="var(--stone-500)" /><strong>SATCO</strong></div>
        <span>{copy.finalKicker}</span>
      </div>
      <h1 id="approval-title">{copy.finalTitle}</h1>
      <div className={styles.approvalStatus} data-complete={complete || undefined}>
        <strong>{complete ? copy.completeTitle : copy.incompleteTitle}</strong>
        <p>{complete ? copy.completeBody : copy.incompleteBody}</p>
      </div>

      <div className={styles.summaryColumns}>
        <section>
          <h2>{copy.globalTitle}</h2>
          {globalStyleDefinitions.map((definition) => (
            <SummaryRow
              key={definition.id}
              label={definition.label}
              value={optionLabel(config.global[definition.id])}
            />
          ))}
        </section>
        <section>
          <h2>{copy.sectionsTitle}</h2>
          {designSections.map((section) => (
            <SummaryRow
              key={section.id}
              label={section.label}
              value={optionLabel(config.sections[section.id].choice)}
            />
          ))}
        </section>
      </div>

      {comments.length ? (
        <section className={styles.summaryComments}>
          <h2>{copy.commentsTitle}</h2>
          {comments.map((section) => (
            <article key={section.id}>
              <strong>{section.label} · {optionLabel(config.sections[section.id].choice)}</strong>
              <p>{config.sections[section.id].comment}</p>
            </article>
          ))}
        </section>
      ) : null}

      <footer className={styles.summaryFooter}>
        <span>{copy.generatedInBrowser}</span>
        <strong>{config.updatedAt ? new Date(config.updatedAt).toLocaleString("en-GB") : copy.notSavedYet}</strong>
      </footer>
    </section>
  );
}

function ResetDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onCancel]);

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={onCancel}>
      <div
        className={styles.resetDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className={styles.warningMark} aria-hidden="true">!</span>
        <h2 id="reset-title">{copy.resetTitle}</h2>
        <p>{copy.resetBody}</p>
        <div>
          <button type="button" className={styles.secondaryButton} autoFocus onClick={onCancel}>{copy.cancel}</button>
          <button type="button" className={styles.dangerButton} onClick={onConfirm}>{copy.confirmReset}</button>
        </div>
      </div>
    </div>
  );
}

export function DesignSelectionApp() {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: createEmptyDesignSelection(),
  });
  const [hydrated, setHydrated] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>("hero");
  const [view, setView] = useState<ViewMode>("selection");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [showReset, setShowReset] = useState(false);
  const [status, setStatus] = useState("");

  const config = history.present;
  const completedSections = useMemo(
    () => DESIGN_SECTION_IDS.filter((id) => config.sections[id].choice).length,
    [config.sections],
  );
  const completedGlobal = useMemo(
    () => GLOBAL_STYLE_IDS.filter((id) => config.global[id]).length,
    [config.global],
  );
  const percent = Math.round((completedSections / DESIGN_SECTION_IDS.length) * 100);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) dispatch({ type: "load", config: normalizeDesignSelection(JSON.parse(stored)) });
      } catch {
        setStatus(copy.storageUnavailable);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      window.setTimeout(() => setStatus(copy.storageUnavailable), 0);
    }
  }, [config, hydrated]);

  const save = () => {
    const timestamp = new Date().toISOString();
    dispatch({ type: "saved", timestamp });
    setStatus(copy.saved);
    window.setTimeout(() => setStatus(""), 2200);
  };

  const exportDecision = () => {
    const exportConfig: DesignSelectionConfig = {
      ...config,
      updatedAt: config.updatedAt ?? new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportConfig, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `satco-design-selection-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(copy.exported);
    window.setTimeout(() => setStatus(""), 2200);
  };

  const chooseSection = (id: DesignSectionId) => {
    setActivePanel(id);
    if (view === "preview" || view === "approval") setView("selection");
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div className={styles.selectorApp} data-hydrated={hydrated || undefined}>
      <header className={styles.selectorHeader}>
        <div className={styles.selectorIdentity}>
          <Emblem size={34} disc="var(--bronze-800)" land="var(--stone-500)" />
          <div>
            <span>{copy.eyebrow}</span>
            <strong>{copy.productName}</strong>
          </div>
        </div>
        <nav className={styles.viewTabs} aria-label={copy.viewModes}>
          {(["selection", "comparison", "preview", "approval"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-current={view === mode ? "page" : undefined}
              onClick={() => setView(mode)}
            >
              {copy.views[mode]}
            </button>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <button type="button" className={styles.iconButton} disabled={!history.past.length} onClick={() => dispatch({ type: "undo" })} title={copy.undo}>
            <span aria-hidden="true">↶</span><span>{copy.undoShort}</span>
          </button>
          <button type="button" className={styles.secondaryButton} onClick={exportDecision}>{copy.export}</button>
          <button type="button" className={styles.primaryButton} onClick={save}>{copy.save}</button>
        </div>
      </header>

      <div className={styles.selectorBody}>
        <aside className={styles.selectorRail}>
          <div className={styles.progressCard}>
            <div><strong>{completedSections} / {DESIGN_SECTION_IDS.length}</strong><span>{percent}%</span></div>
            <progress max={DESIGN_SECTION_IDS.length} value={completedSections}>{percent}%</progress>
            <p>{completedSections} {copy.progressSuffix}</p>
          </div>
          <nav aria-label={copy.sectionNavigation}>
            <button
              type="button"
              className={styles.railLink}
              data-active={activePanel === "global" && view !== "approval" || undefined}
              onClick={() => { setActivePanel("global"); setView("selection"); }}
            >
              <span>00</span><b>{copy.globalStyle}</b><small>{completedGlobal}/{GLOBAL_STYLE_IDS.length}</small>
            </button>
            {designSections.map((section) => {
              const selected = config.sections[section.id].choice;
              return (
                <button
                  type="button"
                  key={section.id}
                  className={styles.railLink}
                  data-active={activePanel === section.id && view !== "preview" && view !== "approval" || undefined}
                  data-complete={Boolean(selected) || undefined}
                  onClick={() => chooseSection(section.id)}
                >
                  <span>{section.number}</span><b>{section.label}</b>
                  <small>{selected ? copy.optionLabels[selected].replace("Option ", "") : "·"}</small>
                </button>
              );
            })}
          </nav>
          <button type="button" className={styles.summaryLink} data-active={view === "approval" || undefined} onClick={() => setView("approval")}>
            <span aria-hidden="true">✓</span><b>{copy.views.approval}</b>
          </button>
          <button type="button" className={styles.resetAllButton} onClick={() => setShowReset(true)}>{copy.resetAll}</button>
        </aside>

        <div className={styles.selectorMain}>
          <div className={styles.mobileProgress}>
            <span>{completedSections}/{DESIGN_SECTION_IDS.length} · {percent}%</span>
            <progress max={DESIGN_SECTION_IDS.length} value={completedSections}>{percent}%</progress>
          </div>
          {view !== "approval" ? <DeviceControls device={device} onChange={setDevice} /> : null}
          {view === "preview" ? (
            <MixedPreview config={config} device={device} />
          ) : view === "approval" ? (
            <ApprovalSummary config={config} completedSections={completedSections} />
          ) : activePanel === "global" ? (
            <GlobalStyleWorkspace config={config} dispatch={dispatch} />
          ) : (
            <SectionWorkspace
              id={activePanel}
              config={config}
              view={view}
              device={device}
              dispatch={dispatch}
              onCompare={() => setView("comparison")}
            />
          )}
        </div>
      </div>

      <div className={styles.liveStatus} role="status" aria-live="polite">{status}</div>
      {showReset ? (
        <ResetDialog
          onCancel={() => setShowReset(false)}
          onConfirm={() => { dispatch({ type: "reset-all" }); setShowReset(false); setStatus(copy.resetComplete); }}
        />
      ) : null}
      {view === "approval" ? (
        <div className={styles.printActions}>
          <button type="button" onClick={() => window.print()}>{copy.print}</button>
        </div>
      ) : null}
    </div>
  );
}
