/**
 * The single source of truth for lighting across the whole page.
 *
 * Liquid-glass light theme: one bright white studio scene. The KEY is a
 * cool-white light from the upper-left; the FILL is a faint blue bounce
 * from the lower-right. Every 3D element uses this rig, and every 2D
 * "lit" surface mimics the same direction — white gloss enters from the
 * upper-left (.key-sheen in index.css), soft slate shadows fall
 * lower-right.
 */

// White key from the upper-left — drives the sparkle on the glass.
export const KEY_LIGHT = {
  position: [-4.5, 6, 6],
  intensity: 1.9,
  color: '#FFFFFF',
};

// Cool blue bounce fill so glass shadow sides stay airy, never grey.
export const FILL_LIGHT = {
  position: [4, -2, 4],
  intensity: 0.55,
  color: '#BFD6FF',
};

// Low warm kicker from behind-right — the faint amber edge the
// reference glass slices carry.
export const RIM_LIGHT = {
  position: [3, 4, -5],
  intensity: 0.7,
  color: '#FFE2BC',
};

export const AMBIENT = { intensity: 0.85, color: '#FFFFFF' };

// The CSS equivalent of the key light direction, for 2D glosses.
export const CSS_KEY_ORIGIN = { x: '25%', y: '15%' };
