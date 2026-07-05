/**
 * The single source of truth for lighting across the whole page.
 *
 * One photographed scene: a warm key light from the upper-left, a faint
 * cool fill from the lower-right, and a white rim from behind-right.
 * Every 3D element uses these exact lights, and every 2D "lit" surface
 * (card sheens, glares, shadows) mimics the same direction — highlights
 * upper-left, shadows lower-right (see .key-sheen in index.css).
 */

// Warm key — ~3800K tungsten-ish, upper-left, casts the scene's shadows.
export const KEY_LIGHT = {
  position: [-4.5, 5.5, 6],
  intensity: 2.4,
  color: '#FFD9A8',
};

// Cool ambient fill from the lower-right so shadows never go pure black.
export const FILL_LIGHT = {
  position: [4, -2, 4],
  intensity: 0.5,
  color: '#BCD3FF',
};

// White rim from behind-right to separate objects from the dark backdrop.
export const RIM_LIGHT = {
  position: [3, 4, -5],
  intensity: 1.4,
  color: '#FFFFFF',
};

export const AMBIENT = { intensity: 0.22, color: '#9DB0C8' };

// The CSS equivalent of the key light direction, for 2D glares.
export const CSS_KEY_ORIGIN = { x: '25%', y: '15%' };
