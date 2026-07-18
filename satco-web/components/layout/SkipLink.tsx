/** First element in tab order — visible only while focused (plan §9). */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed start-2.5 top-2.5 z-[300] -translate-y-[160%] rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white no-underline transition-transform hover:text-white focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
