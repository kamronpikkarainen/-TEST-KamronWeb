import { useRef } from 'react';
import useReveal from '../lib/useReveal';
import SectionEyebrow from './SectionEyebrow';

/**
 * Chapter 4.5 — the trust gap the rest of the site left open. Two case
 * studies prove the work; this proves there's an accountable person
 * behind it. No invented years-in-business or client counts — just the
 * operating model (one person, direct line, no handoffs), which is
 * already true of everything else on this site (the CTA phone number
 * rings to the same person who builds the site).
 */
export default function Operator() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section ref={root} className="relative px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionEyebrow>Who builds it</SectionEyebrow>

        <div className="reveal glass glass-iridescent noise relative flex flex-col items-center gap-6 rounded-3xl p-8 text-center sm:flex-row sm:items-start sm:gap-8 sm:p-10 sm:text-left">
          <div
            className="btn-liquid flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-black tracking-tight sm:h-20 sm:w-20 sm:text-xl"
            aria-hidden="true"
          >
            KP
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-ink">Kamron Pikkarainen — Raleigh, NC</h3>
            <p className="mt-3 text-sm leading-relaxed text-mute sm:text-base">
              One person owns every part of your build — design, code, and launch. No account
              managers, no outsourced dev shop, no handoffs. The phone number on this site rings
              to the same person who writes the code.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute sm:text-base">
              That's also why the exclusivity model exists: one person can only actually be
              accountable to one client per niche, per city, at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
