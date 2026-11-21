// Scene 3 — Forest Picnic. A sunny meadow: a big apple tree, a checked
// picnic blanket with a basket, a kite, butterflies, mushrooms and a
// small pond with a duck.
import { SCENE_WIDTH, SCENE_HEIGHT } from './config.js';

export const PICNIC_DIFFERENCES = [
  { id: 'kite-tail', label: 'kite tail', x: 450, y: 110, r: 22 },
  { id: 'butterfly-colour', label: 'blue butterfly', x: 200, y: 120, r: 16 },
  { id: 'mushroom-spots', label: 'mushroom spots', x: 520, y: 280, r: 18 },
  { id: 'duck-missing', label: 'the duck', x: 520, y: 312, r: 18 },
  { id: 'blanket-check', label: 'blanket checks', x: 300, y: 275, r: 24 },
  { id: 'tree-apples', label: 'tree apples', x: 95, y: 130, r: 20 },
  { id: 'sun-rays', label: 'sun rays', x: 90, y: 50, r: 28 },
];

function cloud(ctx, x, y, scale) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 18 * scale, y + 4 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.arc(x - 18 * scale, y + 5 * scale, 11 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function butterfly(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x - 7, y - 4, 8, 6, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 7, y - 4, 8, 6, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - 6, y + 5, 6, 5, 0.4, 0, Math.PI * 2);
  ctx.ellipse(x + 6, y + 5, 6, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x, y + 8);
  ctx.stroke();
}

function mushroom(ctx, x, y, withSpots) {
  ctx.fillStyle = '#f7ead0';
  ctx.fillRect(x - 4, y, 8, 14);
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.arc(x, y, 14, Math.PI, 0);
  ctx.fill();
  if (withSpots) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 6, y - 6, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 9, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 2, y - 3, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPicnic(ctx, random, applied) {
  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, '#a8d8f0');
  sky.addColorStop(1, '#dff3e3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_WIDTH, 200);

  const sunX = 90;
  const sunY = 50;
  if (!applied.has('sun-rays')) {
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(angle) * 32, sunY + Math.sin(angle) * 32);
      ctx.lineTo(sunX + Math.cos(angle) * 43, sunY + Math.sin(angle) * 43);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
  ctx.fill();

  cloud(ctx, 300, 48, 1);
  cloud(ctx, 480, 70, 0.8);

  const meadow = ctx.createLinearGradient(0, 200, 0, SCENE_HEIGHT);
  meadow.addColorStop(0, '#7cc46a');
  meadow.addColorStop(1, '#5aa84e');
  ctx.fillStyle = meadow;
  ctx.fillRect(0, 200, SCENE_WIDTH, SCENE_HEIGHT - 200);

  ctx.fillStyle = '#6e4520';
  ctx.fillRect(78, 150, 22, 80);
  ctx.fillStyle = '#3f9e5f';
  ctx.beginPath();
  ctx.arc(88, 110, 58, 0, Math.PI * 2);
  ctx.arc(48, 140, 36, 0, Math.PI * 2);
  ctx.arc(130, 140, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2f7d43';
  ctx.beginPath();
  ctx.arc(70, 90, 26, 0, Math.PI * 2);
  ctx.arc(112, 96, 24, 0, Math.PI * 2);
  ctx.fill();
  if (!applied.has('tree-apples')) {
    ctx.fillStyle = '#d94f3d';
    ctx.beginPath();
    ctx.arc(62, 118, 6, 0, Math.PI * 2);
    ctx.arc(95, 130, 6, 0, Math.PI * 2);
    ctx.arc(122, 112, 6, 0, Math.PI * 2);
    ctx.arc(84, 96, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(450, 78);
  ctx.lineTo(430, 108);
  ctx.lineTo(470, 108);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#e87fa8';
  ctx.fill();
  ctx.fillStyle = '#7fb3e8';
  ctx.beginPath();
  ctx.moveTo(430, 108);
  ctx.lineTo(450, 78);
  ctx.lineTo(450, 108);
  ctx.closePath();
  ctx.fill();
  if (!applied.has('kite-tail')) {
    ctx.strokeStyle = '#2e2a26';
    ctx.beginPath();
    ctx.moveTo(450, 108);
    ctx.lineTo(446, 140);
    ctx.stroke();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.moveTo(446, 122);
    ctx.lineTo(452, 128);
    ctx.lineTo(440, 130);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(447, 138);
    ctx.lineTo(453, 144);
    ctx.lineTo(441, 146);
    ctx.closePath();
    ctx.fill();
  }

  butterfly(ctx, 200, 120, applied.has('butterfly-colour') ? '#ff8c42' : '#5a8de8');
  butterfly(ctx, 380, 100, '#e87fa8');

  const checkA = applied.has('blanket-check') ? '#5a8de8' : '#d94f3d';
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      ctx.fillStyle = (row + col) % 2 === 0 ? checkA : '#f7ead0';
      ctx.fillRect(230 + col * 25, 250 + row * 14, 25, 14);
    }
  }
  ctx.strokeStyle = '#8a5a28';
  ctx.lineWidth = 2;
  ctx.strokeRect(230, 250, 150, 56);

  ctx.fillStyle = '#8a5a28';
  ctx.beginPath();
  ctx.moveTo(288, 244);
  ctx.lineTo(332, 244);
  ctx.lineTo(326, 268);
  ctx.lineTo(294, 268);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6e4520';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(296, 244);
  ctx.quadraticCurveTo(310, 228, 324, 244);
  ctx.stroke();
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.arc(304, 240, 5, 0, Math.PI * 2);
  ctx.arc(318, 240, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5a8de8';
  ctx.beginPath();
  ctx.ellipse(520, 312, 52, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(520, 312, 40, 10, 0, 0.2, Math.PI - 0.2);
  ctx.stroke();
  if (!applied.has('duck-missing')) {
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.ellipse(520, 306, 11, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(530, 300, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.moveTo(536, 300);
    ctx.lineTo(542, 302);
    ctx.lineTo(536, 304);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1c2733';
    ctx.beginPath();
    ctx.arc(531, 298, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  mushroom(ctx, 520, 280, !applied.has('mushroom-spots'));
  mushroom(ctx, 556, 292, true);

  for (let index = 0; index < 10; index += 1) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(180 + random() * 200, 210 + random() * 100, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  void random;
}
