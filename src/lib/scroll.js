// Shared handle to the live Lenis instance so buttons anywhere on the page
// can drive the same smooth scroll (or fall back to native).
let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
