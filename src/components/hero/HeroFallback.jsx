/**
 * CSS-only stand-in for the 3D glass sculpture. Used for reduced-motion
 * and low-power visitors, and as the loading state while the WebGL
 * chunk lazy-loads. Same subject — frosted capsule stack with prismatic
 * blobs glowing through — no WebGL required.
 */
export default function HeroFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden="true">
      {/* Prismatic blobs behind the glass */}
      <div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-[62%] -translate-y-[58%] rounded-full opacity-70"
        style={{ background: 'radial-gradient(circle, #35C8E8, rgba(53,200,232,0) 65%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-[15%] -translate-y-[30%] rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle, #3E6FF0, rgba(62,111,240,0) 65%)', filter: 'blur(45px)' }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-[95%] -translate-y-[5%] rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, #F0A8C8, rgba(240,168,200,0) 65%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-[0%] -translate-y-[85%] rounded-full opacity-45"
        style={{ background: 'radial-gradient(circle, #E8B06A, rgba(232,176,106,0) 65%)', filter: 'blur(35px)' }}
      />

      {/* Frosted capsule stack, exploded like the reference board */}
      <div className="relative flex items-center">
        {[
          { w: 'w-24 sm:w-28', h: 'h-56 sm:h-72', x: '-translate-x-10 sm:-translate-x-14', op: 'opacity-70', z: 'z-10' },
          { w: 'w-28 sm:w-32', h: 'h-64 sm:h-80', x: '', op: 'opacity-90', z: 'z-20' },
          { w: 'w-24 sm:w-28', h: 'h-56 sm:h-72', x: 'translate-x-10 sm:translate-x-14', op: 'opacity-70', z: 'z-10' },
        ].map((pill, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={`glass glass-iridescent key-sheen absolute left-1/2 top-1/2 ${pill.w} ${pill.h} ${pill.x} ${pill.op} ${pill.z} -translate-y-1/2 rounded-full`}
            style={{ marginLeft: i === 1 ? '-4rem' : '-3.5rem' }}
          />
        ))}
        {/* Spacer to give the absolute pills room */}
        <div className="h-80 w-72 sm:h-96 sm:w-80" />
      </div>

      {/* Soft ground shadow */}
      <div
        className="absolute bottom-6 left-1/2 h-6 w-64 -translate-x-1/2 rounded-[50%] opacity-30"
        style={{ background: 'radial-gradient(ellipse, #2A3A5C, transparent 70%)', filter: 'blur(14px)' }}
      />
    </div>
  );
}
