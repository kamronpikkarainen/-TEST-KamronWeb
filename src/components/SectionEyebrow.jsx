/**
 * Shared section label — flanking tick marks around the uppercase
 * eyebrow text, used across sections so they read as one consistent
 * design language.
 */
export default function SectionEyebrow({ children, reveal = true, className = '' }) {
  return (
    <div className={`${reveal ? 'reveal ' : ''}mb-4 flex items-center justify-center gap-3 ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-ink/20 sm:w-10" />
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mute">{children}</p>
      <span aria-hidden="true" className="h-px w-8 bg-ink/20 sm:w-10" />
    </div>
  );
}
