import {
  DESIGN_SECTION_IDS,
  type DesignOption,
  type DesignSectionId,
  type DesignSelectionConfig,
} from "@satco/shared";

import { Emblem } from "@/components/ui/Emblem";
import { Picture } from "@/components/ui/Picture";
import { designSelectionCopy as copy } from "@/content/design-selection";
import { home } from "@/content/home";
import { footerColumns, primaryNav } from "@/content/navigation";
import { sectors, sectorsIntro } from "@/content/sectors";
import { site } from "@/content/site";
import { statPendingNote, stats } from "@/content/stats";

import styles from "./design-selection.module.css";

type PreviewContext = "page" | "isolated";

function resolved(value: DesignOption | null, fallback: DesignOption = "option1"): DesignOption {
  return value ?? fallback;
}

function OptionButton({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={styles.siteButton} data-light={light || undefined} aria-hidden="true">
      {children}
      <span className={styles.buttonArrow}>→</span>
    </span>
  );
}

function PreviewBrand({ dark }: { dark: boolean }) {
  return (
    <div className={styles.previewBrand}>
      <Emblem
        size={34}
        disc={dark ? "var(--ds-accent-light)" : "var(--ds-accent)"}
        land={dark ? "var(--ds-muted)" : "#8f8570"}
      />
      <span>{site.name}</span>
    </div>
  );
}

function PreviewHeader({ option }: { option: DesignOption }) {
  const dark = option === "option1";
  return (
    <header
      className={`${styles.previewHeader} ${dark ? styles.previewHeaderOne : styles.previewHeaderTwo}`}
    >
      <div className={styles.previewHeaderInner}>
        <PreviewBrand dark={dark} />
        <nav className={styles.previewNav} aria-label={copy.preview.previewNav}>
          {primaryNav.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </nav>
        <span className={styles.previewMenu} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
    </header>
  );
}

function HeroProgress({ light = false }: { light?: boolean }) {
  return (
    <div className={styles.figmaHeroProgress} data-light={light || undefined} aria-hidden="true">
      <span />
    </div>
  );
}

function HeroOption1() {
  const sector = sectors[0];
  return (
    <section className={`${styles.conceptSection} ${styles.figmaHero} ${styles.figmaHeroOne}`}>
      <Picture
        image={sector.hero}
        sizes="100vw"
        priority
        className={styles.sectionPicture}
        imgClassName={styles.coverImage}
      />
      <div className={styles.figmaHeroScrim} />
      <div className={styles.figmaHeroOneContent}>
        <h1>{sector.name}</h1>
        <p>{sector.tagline}</p>
        <div className={styles.figmaHeroActionRow}>
          <div>
            <HeroProgress light />
            <div className={styles.figmaHeroLabels} aria-hidden="true">
              <span>{copy.preview.previousShort}</span>
              <span>{copy.preview.nextShort}</span>
            </div>
          </div>
          <OptionButton>{copy.preview.explore}</OptionButton>
        </div>
      </div>
    </section>
  );
}

function HeroOption2() {
  const sector = sectors[0];
  return (
    <section className={`${styles.conceptSection} ${styles.figmaHero} ${styles.figmaHeroTwo}`}>
      <Picture
        image={sector.hero}
        sizes="100vw"
        priority
        className={styles.sectionPicture}
        imgClassName={styles.coverImage}
      />
      <div className={styles.figmaHeroScrim} />
      <div className={styles.figmaHeroTwoContent}>
        <h1>{sector.name}</h1>
        <p>{sector.tagline}</p>
        <div className={styles.figmaHeroTwoControls} aria-hidden="true">
          <span>{copy.preview.previousShort}</span>
          <span>{copy.preview.nextShort}</span>
        </div>
      </div>
    </section>
  );
}

const STAT_GLYPHS = ["⌂", "◎", "▦", "↗", "⌖", "▱"];

function StatValue({ stat }: { stat: (typeof stats)[number] }) {
  return (
    <>
      <strong>{stat.value === null ? "—" : stat.display}</strong>
      <span>{stat.label}</span>
      {stat.value === null ? (
        <small>{statPendingNote}</small>
      ) : stat.unit ? (
        <small>{stat.unit}</small>
      ) : null}
    </>
  );
}

function StatsOption1() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaStats} ${styles.figmaStatsOne}`}>
      <div className={styles.figmaStatsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.id} className={styles.figmaStatCard}>
            <b className={styles.figmaStatGlyph} aria-hidden="true">{STAT_GLYPHS[index]}</b>
            <StatValue stat={stat} />
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsOption2() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaStats} ${styles.figmaStatsTwo}`}>
      <div className={styles.figmaStatsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.id} className={`${styles.siteCard} ${styles.figmaStatCard}`}>
            <b className={styles.figmaStatGlyph} aria-hidden="true">{STAT_GLYPHS[index]}</b>
            <StatValue stat={stat} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CompanyImage() {
  return (
    <div className={styles.figmaCompanyMedia}>
      <Picture
        image={{ src: "construction-1", alt: copy.preview.communityAlt }}
        sizes="50vw"
        className={styles.sectionPicture}
        imgClassName={styles.coverImage}
      />
      <div className={styles.figmaEstablished}>
        <strong>{copy.preview.establishedPrefix} {site.established}</strong>
        <span>{copy.preview.heritageLine}</span>
      </div>
      <div className={styles.figmaYearsBadge}>
        <strong>50</strong>
        <span>{copy.preview.years}</span>
      </div>
    </div>
  );
}

function CompanyCopy() {
  return (
    <div className={styles.figmaCompanyCopy}>
      <h2>{home.whoWeAre.heading}</h2>
      <p>{home.whoWeAre.body}</p>
      <div className={styles.figmaCompanyFacts}>
        <span><strong>{site.established}</strong>{copy.preview.founded}</span>
        <span><strong>{stats[1].display}</strong>{stats[1].label}</span>
        <span><strong>{stats[5].display}</strong>{stats[5].label}</span>
      </div>
      <OptionButton>{home.whoWeAre.cta}</OptionButton>
    </div>
  );
}

function AboutOption1() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaCompany} ${styles.figmaCompanyOne}`}>
      <CompanyImage />
      <CompanyCopy />
    </section>
  );
}

function AboutOption2() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaCompany} ${styles.figmaCompanyTwo}`}>
      <CompanyImage />
      <CompanyCopy />
    </section>
  );
}

function SectorHeading({ centered = false }: { centered?: boolean }) {
  return (
    <div className={styles.figmaSectorHeading} data-centered={centered || undefined}>
      <p className={styles.previewEyebrow}>{sectorsIntro.eyebrow}</p>
      <h2>{sectorsIntro.heading}</h2>
      <p>{sectorsIntro.subhead}</p>
      <OptionButton>{copy.preview.viewAllSectors}</OptionButton>
    </div>
  );
}

function SectorsOption1() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaSectors} ${styles.figmaSectorsOne}`}>
      <SectorHeading />
      <div className={styles.figmaSectorOverlayGrid}>
        {sectors.slice(0, 3).map((sector) => (
          <article key={sector.slug} className={`${styles.siteCard} ${styles.figmaSectorOverlayCard}`}>
            <Picture
              image={sector.card}
              sizes="33vw"
              className={styles.sectionPicture}
              imgClassName={styles.coverImage}
            />
            <div>
              <h3>{sector.name}</h3>
              <span>{copy.preview.viewSector}</span>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.figmaCarouselControls} aria-hidden="true">
        <i data-active /> <i /> <i /> <i />
        <span>←</span><span>→</span>
      </div>
    </section>
  );
}

function SectorsOption2() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaSectors} ${styles.figmaSectorsTwo}`}>
      <SectorHeading centered />
      <div className={styles.figmaSectorDetailGrid}>
        {sectors.slice(0, 3).map((sector) => (
          <article key={sector.slug} className={`${styles.siteCard} ${styles.figmaSectorDetailCard}`}>
            <Picture
              image={sector.card}
              sizes="33vw"
              className={styles.figmaSectorDetailMedia}
              imgClassName={styles.coverImage}
            />
            <div>
              <h3>{sector.name}</h3>
              <p>{sector.overviewShort}</p>
              <span>{copy.preview.viewSector} →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CareersArtwork() {
  return (
    <div className={styles.figmaCareersArtwork} role="img" aria-label={copy.preview.joinOurTeam}>
      <span className={styles.figmaBinderClip} aria-hidden="true" />
      <div className={styles.figmaPaper}>
        <strong>{copy.preview.joinOurTeam}</strong>
      </div>
      <small><b>50+</b>{copy.preview.years}</small>
    </div>
  );
}

function CareersCopy() {
  return (
    <div className={styles.figmaCareersCopy}>
      <h2>{home.careersTeaser.heading}</h2>
      <p>{home.careersTeaser.body}</p>
      <OptionButton>{home.careersTeaser.cta}</OptionButton>
    </div>
  );
}

function CareersOption1() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaCareers} ${styles.figmaCareersOne}`}>
      <CareersArtwork />
      <CareersCopy />
    </section>
  );
}

function CareersOption2() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaCareers} ${styles.figmaCareersTwo}`}>
      <CareersArtwork />
      <CareersCopy />
    </section>
  );
}

function ContactDetails() {
  return (
    <div className={styles.figmaContactDetails}>
      <span>⌖<small>{site.location}</small></span>
      <span>✉<small>{site.contact.email}</small></span>
    </div>
  );
}

function ContactOption1() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaContact} ${styles.figmaContactOne}`}>
      <Picture
        image={{ src: "riyadh-2", alt: copy.preview.riyadhAlt }}
        sizes="100vw"
        className={styles.sectionPicture}
        imgClassName={styles.coverImage}
      />
      <div className={styles.figmaContactScrim} />
      <div className={styles.figmaContactContent}>
        <h2>{home.contactTeaser.heading}</h2>
        <p>{site.description}</p>
        <OptionButton>{home.contactTeaser.cta}</OptionButton>
        <ContactDetails />
      </div>
    </section>
  );
}

function ContactOption2() {
  return (
    <section className={`${styles.conceptSection} ${styles.figmaContact} ${styles.figmaContactTwo}`}>
      <div className={styles.figmaContactContent}>
        <h2>{home.contactTeaser.heading}</h2>
        <p>{site.description}</p>
        <OptionButton>{home.contactTeaser.cta}</OptionButton>
        <ContactDetails />
      </div>
    </section>
  );
}

function FooterBrand() {
  return (
    <div className={styles.figmaFooterBrand}>
      <PreviewBrand dark />
      <p>{site.description}</p>
    </div>
  );
}

function FooterOption1() {
  return (
    <footer className={`${styles.figmaFooter} ${styles.figmaFooterOne}`}>
      <FooterBrand />
      {footerColumns.slice(0, 2).map((column) => (
        <div key={column.title} className={styles.figmaFooterColumn}>
          <strong>{column.title}</strong>
          {column.links.map((link) => <span key={link.label}>{link.label}</span>)}
        </div>
      ))}
      <div className={styles.figmaFooterColumn}>
        <strong>{copy.preview.contact}</strong>
        <span>{site.location}</span>
        <span>{site.contact.email}</span>
      </div>
      <small>{String.fromCharCode(169)} 2026 {site.copyrightHolder} {copy.preview.rights}</small>
    </footer>
  );
}

function FooterOption2() {
  return (
    <footer className={`${styles.figmaFooter} ${styles.figmaFooterTwo}`}>
      <div className={styles.figmaFooterTwoTop}>
        <PreviewBrand dark />
        <div>
          <span>{copy.preview.company}</span>
          <span>{copy.preview.sectors}</span>
          <span>{copy.preview.careers}</span>
          <span>{copy.preview.contact}</span>
        </div>
      </div>
      <div className={styles.figmaFooterRule}><i /></div>
      <div className={styles.figmaFooterTwoMiddle}>
        <p>{site.location} · {site.contact.email}</p>
        <label>
          <span className="sr-only">{copy.preview.newsletterPlaceholder}</span>
          <input tabIndex={-1} readOnly placeholder={copy.preview.newsletterPlaceholder} />
          <b aria-hidden="true">→</b>
        </label>
      </div>
      <div className={styles.figmaFooterSocials} aria-hidden="true"><i>in</i><i>×</i><i>◎</i><i>▶</i></div>
      <small>{String.fromCharCode(169)} 2026 {site.copyrightHolder} {copy.preview.rights}</small>
    </footer>
  );
}

export function ConceptSection({
  id,
  option,
}: {
  id: DesignSectionId;
  option: DesignOption;
  context?: PreviewContext;
}) {
  if (id === "header") return <PreviewHeader option={option} />;
  if (id === "hero") return option === "option1" ? <HeroOption1 /> : <HeroOption2 />;
  if (id === "stats") return option === "option1" ? <StatsOption1 /> : <StatsOption2 />;
  if (id === "about") return option === "option1" ? <AboutOption1 /> : <AboutOption2 />;
  if (id === "sectors") return option === "option1" ? <SectorsOption1 /> : <SectorsOption2 />;
  if (id === "careers") return option === "option1" ? <CareersOption1 /> : <CareersOption2 />;
  if (id === "contact") return option === "option1" ? <ContactOption1 /> : <ContactOption2 />;
  return option === "option1" ? <FooterOption1 /> : <FooterOption2 />;
}

function themeData(config: DesignSelectionConfig, fallback: DesignOption = "option1") {
  return {
    "data-colors": resolved(config.global.colors, fallback),
    "data-typography": resolved(config.global.typography, fallback),
    "data-buttons": resolved(config.global.buttons, fallback),
    "data-cards": resolved(config.global.cards, fallback),
    "data-background": resolved(config.global.background, fallback),
  };
}

export function SectionPreview({
  id,
  option,
  config,
}: {
  id: DesignSectionId;
  option: DesignOption;
  config: DesignSelectionConfig;
}) {
  return (
    <div className={`${styles.previewSite} ${styles.isolatedPreview}`} {...themeData(config, option)}>
      <ConceptSection id={id} option={option} context="isolated" />
    </div>
  );
}

export function PreviewSite({ config }: { config: DesignSelectionConfig }) {
  return (
    <div className={styles.previewSite} {...themeData(config)}>
      {DESIGN_SECTION_IDS.map((id) => (
        <ConceptSection key={id} id={id} option={resolved(config.sections[id].choice)} />
      ))}
    </div>
  );
}
