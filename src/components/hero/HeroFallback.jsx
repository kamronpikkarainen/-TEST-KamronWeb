/**
 * CSS-only stand-in for the 3D workstation scene. Used for reduced-motion
 * and low-power visitors, and as the loading state while the WebGL chunk
 * lazy-loads. Same subject — glowing monitor, wooden keyboard, gold
 * bonsai — no WebGL required.
 */
export default function HeroFallback() {
  const keys = Array.from({ length: 40 });
  return (
    <div className="relative flex h-full w-full items-end justify-center pb-6" aria-hidden="true">
      {/* warm glow */}
      <div
        className="absolute left-1/2 top-1/3 h-72 w-[30rem] max-w-[80vw] -translate-x-1/2 rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse, rgba(245,200,106,0.35), transparent 70%)', filter: 'blur(50px)' }}
      />

      <div className="relative flex flex-col items-center">
        {/* Monitor */}
        <div className="relative w-[22rem] max-w-[78vw] rounded-xl border border-white/70 bg-[#12100c] p-2 shadow-[0_30px_60px_-24px_rgba(60,45,20,0.6)]">
          <div className="flex min-h-[9rem] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#0E1512] to-[#0A0F0C] px-4">
            <div
              className="text-center text-xl font-extrabold leading-tight sm:text-2xl"
              style={{ color: '#FFE6B8', textShadow: '0 0 18px rgba(255,190,110,0.8)' }}
            >
              RALEIGH, NC
              <br />
              WEBSITES
            </div>
            <div
              className="mt-3 rounded-full border px-4 py-1 text-[10px] font-bold"
              style={{ color: '#FFE6B8', borderColor: 'rgba(255,214,150,0.7)' }}
            >
              Book a call
            </div>
          </div>
          <div className="mx-auto mt-1 h-6 w-8 rounded-b bg-[#202724]" />
        </div>

        {/* Keyboard */}
        <div className="mt-4 grid w-[20rem] max-w-[72vw] grid-cols-10 gap-1 rounded-lg bg-[#43301F] p-2 shadow-[0_18px_40px_-18px_rgba(40,28,12,0.7)]">
          {keys.map((_, i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="h-4 rounded-sm"
              style={{ background: (i * 7) % 13 === 0 || i % 10 === 0 ? '#6E4C30' : '#ECE3D1' }}
            />
          ))}
        </div>
      </div>

      {/* Gold bonsai, left — canopy over trunk over pot */}
      <div className="absolute left-[4%] top-[16%] hidden flex-col items-center sm:flex">
        <div
          className="h-20 w-20 rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 35%, #F5C86A, #C98A3A 70%)', boxShadow: '0 0 22px rgba(233,183,92,0.55)' }}
        />
        <div className="-mt-2 h-10 w-1.5 rounded bg-[#5A3E28]" />
        <div className="-mt-0.5 h-5 w-12 rounded-md bg-[#D89A44]" />
      </div>
    </div>
  );
}
