import { fallbackSrc, srcSetFor } from "@/lib/images";
import type { ImageRef } from "@/lib/types";

/**
 * Responsive <picture> over the pre-generated variants (webp + jpg fallback).
 * `image.src` is the variant base name, e.g. "airport-1".
 */
export function Picture({
  image,
  sizes = "100vw",
  className,
  imgClassName,
  style,
  priority,
}: {
  image: ImageRef;
  /** sizes attribute, e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes?: string;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
  /** Eagerly load (hero/LCP imagery); everything else lazy-loads */
  priority?: boolean;
}) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcSetFor(image.src, "webp")} sizes={sizes} />
      <img
        src={fallbackSrc(image.src)}
        srcSet={srcSetFor(image.src, "jpg")}
        sizes={sizes}
        alt={image.alt}
        className={imgClassName}
        style={style}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
