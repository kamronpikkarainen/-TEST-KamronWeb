/**
 * Draws the studio monitor screen for the 3D hero: faint code on a dark
 * panel with a glowing "RALEIGH, NC / WEBSITES" headline and a call
 * button — the same read as the reference render. Returned as a canvas
 * so it can drive both the map and emissiveMap of the screen material.
 */
export function drawStudioScreen(width = 1024, height = 640) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Dark screen with a subtle warm vignette.
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#0E1512');
  bg.addColorStop(1, '#0A0F0C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  const glow = ctx.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, width * 0.6);
  glow.addColorStop(0, 'rgba(255, 196, 120, 0.10)');
  glow.addColorStop(1, 'rgba(255, 196, 120, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Faint code lines behind the headline.
  ctx.font = '500 15px ui-monospace, "SF Mono", Menlo, monospace';
  ctx.textBaseline = 'top';
  const code = [
    '<section class="hero">',
    '  const city = "Raleigh, NC";',
    '  build(site, { niche, city });',
    '  // one client per niche',
    '  return leads.map(book);',
    '  ship({ days: 10, flat: true });',
    '</section>',
  ];
  code.forEach((line, i) => {
    ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 205, 140, 0.32)' : 'rgba(150, 200, 165, 0.22)';
    ctx.fillText(line, 44, 40 + i * 30);
  });
  code.forEach((line, i) => {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(150, 200, 165, 0.16)' : 'rgba(255, 205, 140, 0.20)';
    ctx.fillText(line, width - 430, 300 + i * 30);
  });

  // Glowing headline.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255, 190, 110, 0.9)';
  ctx.shadowBlur = 34;
  ctx.fillStyle = '#FFE6B8';
  ctx.font = '800 78px Inter, system-ui, sans-serif';
  ctx.fillText('RALEIGH, NC', width / 2, height * 0.42);
  ctx.fillText('WEBSITES', width / 2, height * 0.42 + 84);
  ctx.shadowBlur = 0;

  // Call button pill.
  const bw = 190;
  const bh = 54;
  const bx = width / 2 - bw / 2;
  const by = height * 0.42 + 150;
  ctx.beginPath();
  ctx.moveTo(bx + bh / 2, by);
  ctx.arcTo(bx + bw, by, bx + bw, by + bh, bh / 2);
  ctx.arcTo(bx + bw, by + bh, bx, by + bh, bh / 2);
  ctx.arcTo(bx, by + bh, bx, by, bh / 2);
  ctx.arcTo(bx, by, bx + bw, by, bh / 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 214, 150, 0.16)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 214, 150, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#FFE6B8';
  ctx.font = '700 22px Inter, system-ui, sans-serif';
  ctx.fillText('Book a call', width / 2, by + bh / 2 + 1);

  // A few gold sparks near the headline.
  ctx.fillStyle = 'rgba(255, 214, 150, 0.7)';
  for (let i = 0; i < 18; i += 1) {
    const x = width * 0.5 + (Math.random() - 0.5) * width * 0.7;
    const y = height * 0.45 + (Math.random() - 0.5) * height * 0.5;
    ctx.fillRect(x, y, 2 + Math.random() * 2, 2 + Math.random() * 2);
  }

  return canvas;
}
