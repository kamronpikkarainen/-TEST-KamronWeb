/**
 * CSS-only stand-in for the 3D hero scene. Used for reduced-motion and
 * low-power visitors, and as the loading state while the WebGL chunk
 * lazy-loads. Same subject (GreenEdge browser mockup), same lighting
 * story — highlight upper-left, shadow lower-right — just no WebGL.
 */
export default function HeroFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div
        className="relative w-[78%] max-w-[560px]"
        style={{
          transform: 'perspective(1400px) rotateY(-10deg) rotateX(5deg)',
        }}
      >
        {/* Soft ground shadow, cast down-right by the upper-left key light */}
        <div className="absolute -bottom-10 left-[12%] h-8 w-[84%] rounded-[50%] bg-black/60 blur-2xl" />

        <div className="key-sheen relative overflow-hidden rounded-xl border border-white/10 bg-[#1a212b] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="mx-auto rounded-full bg-white/5 px-6 py-1 text-[10px] text-mute">
              greenedgelawn.co
            </span>
          </div>
          {/* Page */}
          <div className="rounded-lg bg-gradient-to-b from-[#0d2416] to-[#081a10] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-[#eaf5e2]">GreenEdge</div>
                <div className="text-[9px] font-semibold tracking-widest text-accent">
                  LAWN CO.
                </div>
              </div>
              <div className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-[#0a1a0e]">
                Get a quote
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="text-lg font-extrabold leading-tight text-[#f2f8ee] sm:text-xl">
                  A sharper lawn,
                  <br />
                  handled.
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-[#9fb3a4]">
                  Mowing, treatments, and cleanups across the Triangle.
                </p>
                <div className="mt-3 inline-block rounded-full bg-accent px-4 py-1.5 text-[10px] font-bold text-[#0a1a0e]">
                  Book my yard
                </div>
              </div>
              <div className="hidden flex-1 overflow-hidden rounded-lg sm:block">
                <div
                  className="h-full min-h-[110px] w-full"
                  style={{
                    background:
                      'repeating-linear-gradient(100deg, #1d5c31 0 14%, #174a27 14% 28%)',
                  }}
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {['Weekly mowing', 'Fertilization', 'Seasonal cleanup'].map((s) => (
                <div key={s} className="rounded-lg border border-white/10 bg-white/5 p-2.5">
                  <div className="mb-2 h-3 w-3 rounded-full bg-accent" />
                  <div className="text-[9px] font-bold text-[#eaf5e2]">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
