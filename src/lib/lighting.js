/**
 * The single source of truth for lighting across the whole page.
 *
 * One photographed scene: a warm studio KEY from the upper-left, a cool
 * FILL from the lower-right, a white RIM from behind-right. Every 3D
 * element uses this exact rig, and every 2D "lit" surface (card sheens,
 * glares, shadows) mimics the same direction — highlights upper-left,
 * shadows lower-right (see .key-sheen in index.css).
 */

// Warm key — ~3800K, upper-left. A real spotlight (not a directional):
// its inverse-square falloff paints a natural pool of light on the
// floor, and every specular highlight in the scene comes from here.
export const KEY_LIGHT = {
  position: [-4.5, 5.5, 6],
  intensity: 520,
  color: '#FFD9A8',
  angle: 0.68,
  penumbra: 1,
  decay: 2,
};

// Cool fill from the lower-right so the shadow side keeps visible detail
// — depth comes from the key/fill contrast, never from opacity tricks.
export const FILL_LIGHT = {
  position: [4, -2, 4],
  intensity: 0.65,
  color: '#BCD3FF',
};

// White rim from behind-right to separate objects from the dark backdrop.
export const RIM_LIGHT = {
  position: [2.5, 5, -4.5],
  intensity: 2.2,
  color: '#FFFFFF',
};

export const AMBIENT = { intensity: 0.25, color: '#9DB0C8' };

// The CSS equivalent of the key light direction, for 2D glares.
export const CSS_KEY_ORIGIN = { x: '25%', y: '15%' };
