/**
 * Draws a stylized render of the GreenEdge Lawn Co. homepage onto a canvas,
 * used as the screen texture of the 3D browser mockup.
 *
 * [PLACEHOLDER] This is a hand-drawn representation of the real client
 * site. Swap `drawGreenEdgeScreen` for a real screenshot texture of
 * greenedgelawnco's live homepage when one is exported.
 */
export function drawGreenEdgeScreen(width = 1280, height = 832) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const CHROME_H = 64;

  // --- Browser chrome ---
  ctx.fillStyle = '#10151c';
  ctx.fillRect(0, 0, width, CHROME_H);
  const dots = ['#ff5f57', '#febc2e', '#28c840'];
  dots.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(34 + i * 30, CHROME_H / 2, 7, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });
  // URL pill
  roundRect(ctx, 150, 15, width - 300, 34, 17);
  ctx.fillStyle = '#1a222c';
  ctx.fill();
  ctx.fillStyle = '#7a8794';
  ctx.font = '500 17px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('greenedgelawn.co', width / 2, CHROME_H / 2 + 6);

  // --- Page background ---
  const bg = ctx.createLinearGradient(0, CHROME_H, 0, height);
  bg.addColorStop(0, '#0d2416');
  bg.addColorStop(1, '#081a10');
  ctx.fillStyle = bg;
  ctx.fillRect(0, CHROME_H, width, height - CHROME_H);

  // Warm key-light wash from the upper-left, matching the scene lighting.
  const glow = ctx.createRadialGradient(180, 140, 0, 180, 140, 900);
  glow.addColorStop(0, 'rgba(255, 217, 168, 0.10)');
  glow.addColorStop(1, 'rgba(255, 217, 168, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, CHROME_H, width, height - CHROME_H);

  // --- Site nav ---
  ctx.textAlign = 'left';
  ctx.fillStyle = '#eaf5e2';
  ctx.font = '800 26px Inter, system-ui, sans-serif';
  ctx.fillText('GreenEdge', 70, CHROME_H + 62);
  ctx.fillStyle = '#a8f04b';
  ctx.font = '600 15px Inter, system-ui, sans-serif';
  ctx.fillText('LAWN CO.', 70, CHROME_H + 84);

  ctx.fillStyle = '#b9c9bd';
  ctx.font = '500 17px Inter, system-ui, sans-serif';
  ['Services', 'Service area', 'About'].forEach((label, i) => {
    ctx.fillText(label, width - 480 + i * 120, CHROME_H + 70);
  });
  roundRect(ctx, width - 190, CHROME_H + 44, 120, 40, 20);
  ctx.fillStyle = '#a8f04b';
  ctx.fill();
  ctx.fillStyle = '#0a1a0e';
  ctx.font = '700 16px Inter, system-ui, sans-serif';
  ctx.fillText('Get a quote', width - 176, CHROME_H + 70);

  // --- Hero copy ---
  ctx.fillStyle = '#f2f8ee';
  ctx.font = '800 62px Inter, system-ui, sans-serif';
  ctx.fillText('A sharper lawn,', 70, CHROME_H + 220);
  ctx.fillText('handled.', 70, CHROME_H + 290);
  ctx.fillStyle = '#9fb3a4';
  ctx.font = '400 21px Inter, system-ui, sans-serif';
  ctx.fillText('Mowing, treatments, and cleanups', 70, CHROME_H + 340);
  ctx.fillText('across the Triangle.', 70, CHROME_H + 370);

  roundRect(ctx, 70, CHROME_H + 405, 200, 54, 27);
  ctx.fillStyle = '#a8f04b';
  ctx.fill();
  ctx.fillStyle = '#0a1a0e';
  ctx.font = '700 19px Inter, system-ui, sans-serif';
  ctx.fillText('Book my yard', 100, CHROME_H + 439);

  // --- Hero visual: striped lawn panel ---
  const px = 660;
  const py = CHROME_H + 130;
  const pw = width - px - 70;
  const ph = 360;
  roundRect(ctx, px, py, pw, ph, 22);
  ctx.save();
  ctx.clip();
  const stripes = 8;
  for (let i = 0; i < stripes; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#1d5c31' : '#174a27';
    ctx.beginPath();
    ctx.moveTo(px + (i * pw) / stripes, py + ph);
    ctx.lineTo(px + ((i + 1) * pw) / stripes, py + ph);
    ctx.lineTo(px + ((i + 1) * pw) / stripes + 60, py);
    ctx.lineTo(px + (i * pw) / stripes + 60, py);
    ctx.closePath();
    ctx.fill();
  }
  // Sun glare on the lawn, again from the upper-left.
  const lawnGlow = ctx.createLinearGradient(px, py, px + pw, py + ph);
  lawnGlow.addColorStop(0, 'rgba(255, 231, 178, 0.22)');
  lawnGlow.addColorStop(0.5, 'rgba(255, 231, 178, 0)');
  ctx.fillStyle = lawnGlow;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();

  // --- Service cards row ---
  const cards = ['Weekly mowing', 'Fertilization', 'Seasonal cleanup'];
  const cw = (width - 140 - 48) / 3;
  cards.forEach((title, i) => {
    const cx = 70 + i * (cw + 24);
    const cy = CHROME_H + 540;
    roundRect(ctx, cx, cy, cw, 170, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 40, cy + 46, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#a8f04b';
    ctx.fill();
    ctx.fillStyle = '#eaf5e2';
    ctx.font = '700 20px Inter, system-ui, sans-serif';
    ctx.fillText(title, cx + 24, cy + 105);
    ctx.fillStyle = '#8fa295';
    ctx.font = '400 15px Inter, system-ui, sans-serif';
    ctx.fillText('Flat monthly rate.', cx + 24, cy + 133);
  });

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
