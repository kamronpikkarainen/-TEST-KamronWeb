/**
 * The page-wide stage every section sits on: silver ground, blueprint
 * grid with square intersection nodes, and soft prismatic blobs that
 * glow through the frosted panels above them. Fixed, zero-JS, cheap.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-base" />
      <div className="grid-lines absolute inset-0 opacity-80" />
      {/* Prismatic blobs — cyan / azure / violet / blush / amber */}
      <div
        className="absolute left-[48%] top-[22%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-45"
        style={{
          background: 'radial-gradient(circle, #35C8E8 0%, rgba(53,200,232,0) 65%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="absolute left-[30%] top-[45%] h-[26rem] w-[26rem] rounded-full opacity-35"
        style={{
          background: 'radial-gradient(circle, #3E6FF0 0%, rgba(62,111,240,0) 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute right-[8%] top-[60%] h-[28rem] w-[28rem] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #8B7CF7 0%, rgba(139,124,247,0) 65%)',
          filter: 'blur(85px)',
        }}
      />
      <div
        className="absolute left-[12%] top-[10%] h-[20rem] w-[20rem] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, #F0A8C8 0%, rgba(240,168,200,0) 65%)',
          filter: 'blur(75px)',
        }}
      />
      <div
        className="absolute right-[22%] top-[28%] h-[14rem] w-[14rem] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #E8B06A 0%, rgba(232,176,106,0) 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Bright core behind the hero, like the reference's lit center */}
      <div
        className="absolute left-1/2 top-[30%] h-[40rem] w-[52rem] -translate-x-1/2 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(64px)',
        }}
      />
    </div>
  );
}
