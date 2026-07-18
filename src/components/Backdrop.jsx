/**
 * The page-wide stage: a light, calm ground with a few very soft
 * prismatic glows — the quiet, airy look of the CTA section, applied to
 * the whole site. No blueprint grid, no light shafts, no busy detail.
 *
 * Each blob sets --blob-blur (its desktop radius) as a custom property
 * rather than an inline `filter`, specifically so the `(hover: none),
 * (pointer: coarse)` rule in index.css can override it with a lighter
 * --blob-blur-mobile value on touch devices — an inline `filter` would
 * out-specificity any stylesheet rule and make that override a no-op.
 * A handful of large blurred circles sitting under several live
 * backdrop-filter panels is a real performance/stability cost on
 * mobile Safari, not just a style choice.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base" />
      <div
        className="backdrop-blob absolute left-[46%] top-[22%] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #35C8E8 0%, rgba(53,200,232,0) 65%)',
          '--blob-blur': '100px',
          '--blob-blur-mobile': '44px',
        }}
      />
      <div
        className="backdrop-blob absolute left-[26%] top-[54%] h-[36rem] w-[36rem] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, #3E6FF0 0%, rgba(62,111,240,0) 65%)',
          '--blob-blur': '110px',
          '--blob-blur-mobile': '48px',
        }}
      />
      <div
        className="backdrop-blob absolute right-[8%] top-[66%] h-[38rem] w-[38rem] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #8B7CF7 0%, rgba(139,124,247,0) 65%)',
          '--blob-blur': '110px',
          '--blob-blur-mobile': '48px',
        }}
      />
      <div
        className="backdrop-blob absolute left-[14%] top-[8%] h-[26rem] w-[26rem] rounded-full opacity-[0.16]"
        style={{
          background: 'radial-gradient(circle, #F0A8C8 0%, rgba(240,168,200,0) 65%)',
          '--blob-blur': '90px',
          '--blob-blur-mobile': '40px',
        }}
      />
    </div>
  );
}
