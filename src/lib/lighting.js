/**
 * The single source of truth for lighting across the whole page.
 *
 * One photographed scene: a warm key light from the upper-left, a faint
 * cool fill from the lower-right, and a white rim from behind-right.
 * Every 3D element uses these exact lights, and every 2D "lit" surface
 * (card sheens, glares, shadows) mimics the same direction — highlights
 * upper-left, shadows lower-right (see .key-sheen in index.css).
 */

// Warm key — ~3800K tungsten-ish, upper-left. Every specular highlight
// in the scene (browser chrome streak, slab bevels) comes from here.
export const KEY_LIGHT = {
  position: [-4.5, 5.5, 6],
  intensity: 2.6,
  color: '#FFD9A8',
};

// Cool fill from the lower-right so the shadow side keeps visible detail
// — depth comes from the key/fill contrast, never from opacity tricks.
export const FILL_LIGHT = {
  position: [4, -2, 4],
  intensity: 0.7,
  color: '#BCD3FF',
};

// White rim from behind-right to separate objects from the dark backdrop.
export const RIM_LIGHT = {
  position: [3, 4, -5],
  intensity: 1.6,
  color: '#FFFFFF',
};

export const AMBIENT = { intensity: 0.3, color: '#9DB0C8' };

// The CSS equivalent of the key light direction, for 2D glares.
export const CSS_KEY_ORIGIN = { x: '25%', y: '15%' };
