import { useRef } from 'react';
import useReveal from '../lib/useReveal';
import carolinaShot from '../assets/portfolio/carolina-climate.webp';
import greenedgeShot from '../assets/portfolio/greenedge.webp';

/**
 * Chapter 5 — the work. Two stacked case-study cards. No invented
 * metrics or testimonials here (matching the rest of the site's
 * content rule) — each card's supporting copy describes what was
 * actually built (the standing Kamron Web promises: fixed timeline,
 * one clear call to action, direct contact routing), not unverified
 * outcome numbers for that specific client.
 */

const CASES = [
  {
    title: 'GreenEdge Lawn Co.',
    tag: 'Lawn care · Triangle, NC',
    badge: 'Live client',
    badgeClass: 'btn-liquid text-white',
    shot: greenedgeShot,
    shotAlt: 'GreenEdge Lawn Co. landing page',
    // [PLACEHOLDER — point this at the real, live GreenEdge site.]
    href: 'https://greenedgelawnco.com',
    description:
      'Design and build, end to end. Made to turn "lawn care near me" into scheduled quotes.',
    built: [
      'One quote form, not a dead-end contact page',
      'Live on a fixed 14-day timeline',
      'Loads clean on mobile, where these searches happen',
    ],
  },
  {
    title: 'Carolina Climate',
    tag: 'HVAC · Raleigh, NC',
    badge: 'Concept build',
    badgeClass: 'glass text-mute',
    shot: carolinaShot,
    shotAlt: 'Carolina Climate HVAC landing page',
    // [PLACEHOLDER — swap for a custom domain if/when Carolina Climate
    // becomes a real client; this is the GitHub Pages demo mirror.]
    href: 'https://kamronpikkarainen.github.io/-TEST-KamronWeb/demos/carolina-climate/',
    description:
      'Design and build, end to end. Made to turn "24/7 emergency HVAC" searches into an answered call, not a voicemail.',
    built: [
      'Click-to-call front and center, above the fold',
      'Financing and warranty terms up where buyers look first',
      'Built to the same 14-day, flat-rate timeline',
    ],
  },
];

export default function Portfolio() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section ref={root} id="work" className="relative scroll-mt-24 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="reveal mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            The work
          </p>
          <h2 className="reveal text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            Built to win work. <span className="text-mute">Not design awards.</span>
          </h2>
        </div>

        <div className="mt-14 flex flex-col gap-6">
          {CASES.map((c) => (
            <WorkCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ title, tag, badge, badgeClass, shot, shotAlt, href, description, built }) {
  const Tag = href ? 'a' : 'div';
  // No target="_blank": from a file:// context (like the downloaded
  // single-file build) browsers silently block target="_blank" popups
  // to remote https:// origins — a same-tab navigation always works.
  const linkProps = href ? { href } : {};

  return (
    <Tag
      {...linkProps}
      className="reveal glass glass-iridescent relative block overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(50,70,110,0.35)]"
    >
      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative min-h-[260px] overflow-hidden bg-ink/5">
          <img src={shot} alt={shotAlt} className="absolute inset-0 h-full w-full object-cover object-top" />
        </div>

        <div className="flex flex-col justify-between p-7 sm:p-9">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-ink">{title}</h3>
              <span
                className={`${badgeClass} rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider`}
              >
                {badge}
              </span>
            </div>
            <p className="mt-1 text-xs text-mute">{tag}</p>
            <p className="mt-5 text-sm leading-relaxed text-mute">{description}</p>
          </div>
          <ul className="mt-6 space-y-2.5">
            {built.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-xs text-mute">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Tag>
  );
}
