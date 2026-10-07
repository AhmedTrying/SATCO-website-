"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/*
 * OPT-04 (Option C): the footer's Riyadh skyline continuing up into the home
 * contact band. On large screens the footer covers its box with the artwork,
 * anchored bottom-right; when the footer is shorter than the artwork, the
 * artwork's top is cropped. This layer re-draws the same artwork at the same
 * size and position (bottom aligned with the footer's bottom), so the cropped
 * top shows in the band above as one continuous piece. When the footer is
 * taller than the artwork nothing is cropped, and this layer falls entirely
 * below the band (clipped away). Same opacity, blend, grayscale and mask as
 * the footer layer in components/layout/Footer.tsx; keep them in sync.
 */
export function SkylineContinuation() {
  const [footerHeight, setFooterHeight] = useState<number | null>(null);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new ResizeObserver(() => setFooterHeight(footer.offsetHeight));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (footerHeight === null) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute end-0 -z-20 hidden aspect-[3/2] w-[55%] [mask-image:linear-gradient(to_right,transparent_0%,black_42%)] lg:block"
      style={{ bottom: -footerHeight }}
    >
      <Image
        src="/images/footer-riyadh-skyline.webp"
        alt=""
        fill
        sizes="55vw"
        className="object-cover object-right-bottom opacity-[0.13] mix-blend-screen grayscale"
      />
    </div>
  );
}
