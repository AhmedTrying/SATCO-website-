"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { HomeContent } from "@satco/shared";

import { saveHome } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { TextArea, TextInput } from "@/components/form/fields";
import { homeSchema } from "@/lib/content-schemas";
import { useSave } from "@/lib/use-save";

export function HomeCopyEditor({
  initial,
  canEdit,
}: {
  initial: HomeContent;
  canEdit: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<HomeContent>({
    defaultValues: initial,
    resolver: zodResolver(homeSchema),
  });
  const save = useSave();

  return (
    <form
      onChange={save.markDirty}
      onSubmit={handleSubmit((data) =>
        save.run(async () => {
          const res = await saveHome(data);
          if (res.ok) reset(data);
          return res;
        }),
      )}
    >
      <fieldset disabled={!canEdit} className="space-y-6">
        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">Hero</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Eyebrow"
              registration={register("hero.eyebrow")}
              error={errors.hero?.eyebrow}
            />
            <TextInput
              label="Explore label"
              registration={register("hero.explore")}
              error={errors.hero?.explore}
            />
          </div>
          <div className="mt-3">
            <TextArea
              label="Headline"
              rows={2}
              registration={register("hero.headline")}
              error={errors.hero?.headline}
            />
          </div>
          <div className="mt-3">
            <TextInput
              label="Region label (a11y)"
              registration={register("hero.regionLabel")}
              error={errors.hero?.regionLabel}
            />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">Stat band heading</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Eyebrow"
              registration={register("statBand.eyebrow")}
              error={errors.statBand?.eyebrow}
            />
            <TextInput
              label="Heading"
              registration={register("statBand.heading")}
              error={errors.statBand?.heading}
            />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">Who we are</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Eyebrow"
              registration={register("whoWeAre.eyebrow")}
              error={errors.whoWeAre?.eyebrow}
            />
            <TextInput
              label="Heading"
              registration={register("whoWeAre.heading")}
              error={errors.whoWeAre?.heading}
            />
          </div>
          <div className="mt-3">
            <TextArea
              label="Body (verbatim copy)"
              rows={4}
              registration={register("whoWeAre.body")}
              error={errors.whoWeAre?.body}
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <TextInput
              label="CTA"
              registration={register("whoWeAre.cta")}
              error={errors.whoWeAre?.cta}
            />
            <TextInput
              label="Image card value"
              registration={register("whoWeAre.imageCard.value")}
            />
            <TextInput
              label="Image card label"
              registration={register("whoWeAre.imageCard.label")}
            />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">Careers teaser</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Eyebrow"
              registration={register("careersTeaser.eyebrow")}
              error={errors.careersTeaser?.eyebrow}
            />
            <TextInput
              label="Heading"
              registration={register("careersTeaser.heading")}
              error={errors.careersTeaser?.heading}
            />
          </div>
          <div className="mt-3">
            <TextArea
              label="Body (verbatim copy)"
              rows={3}
              registration={register("careersTeaser.body")}
              error={errors.careersTeaser?.body}
            />
          </div>
          <div className="mt-3">
            <TextInput
              label="CTA"
              registration={register("careersTeaser.cta")}
              error={errors.careersTeaser?.cta}
            />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">Contact teaser</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextArea
              label="Heading"
              rows={2}
              registration={register("contactTeaser.heading")}
              error={errors.contactTeaser?.heading}
            />
            <TextInput
              label="CTA"
              registration={register("contactTeaser.cta")}
              error={errors.contactTeaser?.cta}
            />
          </div>
        </section>
      </fieldset>

      <SaveBar state={save.state} dirty={isDirty} canEdit={canEdit} error={save.error} />
    </form>
  );
}
