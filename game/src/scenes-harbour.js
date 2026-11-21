// Scene 1 — Sunset Harbour. Flat vector harbour at dawn: sun, clouds,
// birds, a striped lighthouse, three roofed houses, two sailboats, a sea
// band and a sandy beach. drawHarbour paints the scene; every difference
// is a small deliberate change the right panel applies on top.
import { SCENE_WIDTH, SCENE_HEIGHT } from './config.js';

export const HARBOUR_DIFFERENCES = [
  { id: 'sun-rays', label: 'sun rays', x: 505, y: 52, r: 30 },
  { id: 'bird-missing', label: 'a bird', x: 200, y: 85, r: 16 },
  { id: 'cloud-extra', label: 'an extra cloud', x: 320, y: 55, r: 26 },
  { id: 'lighthouse-stripe', label: 'lighthouse stripe', x: 52, y: 150, r: 22 },
  { id: 'house-roof', label: 'middle roof', x: 240, y: 198, r: 26 },
  { id: 'boat-sail', label: 'red sail', x: 420, y: 232, r: 26 },
  { id: 'fish-orange', label: 'orange fish', x: 250, y: 312, r: 18 },
];

function sky(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, '#ffcf8f');
  gradient.addColorStop(1, '#ffeec2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCENE_WIDTH, 200);
}

function sun(ctx, applied) {
  const x = 505;
  const y = 52;
  if (!applied.has('sun-rays')) {
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * 34, y + Math.sin(angle) * 34);
      ctx.lineTo(x + Math.cos(angle) * 46, y + Math.sin(angle) * 46);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();
}

function cloud(ctx, x, y, scale) {
  ctx.fillStyle = '#fff8ea';
  ctx.beginPath();
  ctx.arc(x, y, 18 * scale, 0, Math.PI * 2);
  ctx.arc(x + 20 * scale, y + 4 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.arc(x - 20 * scale, y + 5 * scale, 13 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function bird(ctx, x, y) {
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.quadraticCurveTo(x - 4, y - 7, x, y);
  ctx.quadraticCurveTo(x + 4, y - 7, x + 10, y);
  ctx.stroke();
}

function lighthouse(ctx, applied) {
  const x = 30;
  const top = 95;
  const height = 105;
  const width = 44;
  ctx.fillStyle = '#f4f1e6';
  ctx.fillRect(x, top, width, height);
  const stripe = applied.has('lighthouse-stripe') ? '#3f7fbf' : '#d94f3d';
  ctx.fillStyle = stripe;
  ctx.fillRect(x, top + 26, width, 22);
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(x, top + 70, width, 22);
  ctx.fillStyle = '#8c2f24';
  ctx.beginPath();
  ctx.moveTo(x - 4, top);
  ctx.lineTo(x + width / 2, top - 22);
  ctx.lineTo(x + width + 4, top);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(x + 14, top - 16, 16, 14);
  ctx.fillStyle = '#5a4632';
  ctx.fillRect(x + width / 2 - 3, top + 92, 6, 8);
}

function house(ctx, x, baseY, body, roof) {
  ctx.fillStyle = body;
  ctx.fillRect(x, baseY, 60, 42);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x - 6, baseY);
  ctx.lineTo(x + 30, baseY - 26);
  ctx.lineTo(x + 66, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x + 24, baseY + 20, 12, 22);
  ctx.fillStyle = '#ffe9a8';
  ctx.fillRect(x + 8, baseY + 10, 10, 10);
  ctx.fillRect(x + 42, baseY + 10, 10, 10);
}

function sailboat(ctx, x, y, sail, hull) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x + 18, y - 52, 4, 52);
  ctx.fillStyle = sail;
  ctx.beginPath();
  ctx.moveTo(x + 22, y - 52);
  ctx.lineTo(x + 22, y - 6);
  ctx.lineTo(x + 52, y - 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 62, y);
  ctx.lineTo(x + 50, y + 14);
  ctx.lineTo(x + 10, y + 14);
  ctx.closePath();
  ctx.fill();
}

function fish(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 13, y);
  ctx.lineTo(x + 22, y - 6);
  ctx.lineTo(x + 22, y + 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1c2733';
  ctx.beginPath();
  ctx.arc(x - 6, y - 1, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

export function drawHarbour(ctx, random, applied) {
  sky(ctx);
  sun(ctx, applied);
  cloud(ctx, 90, 45, 1);
  cloud(ctx, 270, 70, 0.8);
  cloud(ctx, 430, 35, 0.9);
  if (applied.has('cloud-extra')) cloud(ctx, 320, 55, 0.7);
  bird(ctx, 150, 60);
  if (!applied.has('bird-missing')) bird(ctx, 200, 85);
  bird(ctx, 330, 55);

  const sea = ctx.createLinearGradient(0, 200, 0, 268);
  sea.addColorStop(0, '#3f8fbf');
  sea.addColorStop(1, '#2a6d9e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 200, SCENE_WIDTH, 68);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  for (let index = 0; index < 5; index += 1) {
    const y = 214 + index * 11;
    ctx.beginPath();
    for (let x = 0; x <= SCENE_WIDTH; x += 24) {
      const wave = Math.sin((x + index * 40) / 46) * 3;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  lighthouse(ctx, applied);
  house(ctx, 110, 205, '#f7ead0', '#a35d2e');
  house(ctx, 210, 205, '#f7ead0', applied.has('house-roof') ? '#e87fa8' : '#3f7fbf');
  house(ctx, 310, 205, '#f7ead0', '#7a4fc0');

  sailboat(ctx, 388, 238, applied.has('boat-sail') ? '#ffd94d' : '#d94f3d', '#c0392b');
  sailboat(ctx, 478, 244, '#ffffff', '#3f7fbf');

  ctx.fillStyle = '#f2dcae';
  ctx.fillRect(0, 268, SCENE_WIDTH, SCENE_HEIGHT - 268);
  ctx.fillStyle = '#d9c08a';
  ctx.fillRect(0, 268, SCENE_WIDTH, 4);

  fish(ctx, 180, 300, '#4fb3e8');
  if (!applied.has('fish-orange')) fish(ctx, 250, 312, '#ff8c42');

  ctx.fillStyle = '#b07a3f';
  ctx.fillRect(88, 292, 26, 26);
  ctx.strokeStyle = '#8a5a28';
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 292, 26, 26);
  ctx.beginPath();
  ctx.moveTo(88, 292);
  ctx.lineTo(114, 318);
  ctx.moveTo(114, 292);
  ctx.lineTo(88, 318);
  ctx.stroke();

  ctx.fillStyle = '#a0662c';
  ctx.beginPath();
  ctx.ellipse(330, 306, 14, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(318, 290, 24, 6);

  ctx.fillStyle = '#8a5a28';
  ctx.fillRect(428, 282, 6, 36);
  ctx.fillStyle = '#6e4520';
  ctx.beginPath();
  ctx.arc(40, 324, 12, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(560, 322, 14, Math.PI, 0);
  ctx.fill();
  void random;
}
