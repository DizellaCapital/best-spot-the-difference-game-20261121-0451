// Scene 2 — Night Market. A night bazaar under string lights: a moon,
// stars, three striped stalls, paper lanterns, a cat asleep on a roof,
// jars and baskets of fruit on the cobbles.
import { SCENE_WIDTH, SCENE_HEIGHT } from './config.js';

export const MARKET_DIFFERENCES = [
  { id: 'moon-crater', label: 'moon crater', x: 480, y: 50, r: 24 },
  { id: 'star-missing', label: 'a bright star', x: 150, y: 40, r: 12 },
  { id: 'lantern-colour', label: 'paper lantern', x: 380, y: 80, r: 20 },
  { id: 'awning-stripe', label: 'stall awning', x: 115, y: 130, r: 24 },
  { id: 'cat-missing', label: 'the cat', x: 295, y: 118, r: 18 },
  { id: 'jar-extra', label: 'an extra jar', x: 330, y: 240, r: 16 },
  { id: 'basket-fruit', label: 'basket fruit', x: 490, y: 250, r: 18 },
];

function star(ctx, x, y, size, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff6c9';
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.28, y - size * 0.28);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.28, y + size * 0.28);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.28, y + size * 0.28);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.28, y - size * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

function stall(ctx, x, baseY, awningA, awningB) {
  ctx.fillStyle = '#6e4520';
  ctx.fillRect(x, baseY, 8, 96);
  ctx.fillRect(x + 102, baseY, 8, 96);
  ctx.fillStyle = '#8a5a28';
  ctx.fillRect(x, baseY + 58, 110, 10);
  for (let index = 0; index < 5; index += 1) {
    ctx.fillStyle = index % 2 === 0 ? awningA : awningB;
    ctx.beginPath();
    ctx.moveTo(x + index * 22, baseY);
    ctx.lineTo(x + index * 22 + 22, baseY);
    ctx.lineTo(x + index * 22 + 22, baseY + 26);
    ctx.quadraticCurveTo(x + index * 22 + 11, baseY + 34, x + index * 22, baseY + 26);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#f7ead0';
  ctx.fillRect(x + 6, baseY + 68, 98, 58);
  ctx.fillStyle = '#3a2a18';
  ctx.fillRect(x + 6, baseY + 68, 98, 4);
}

function lantern(ctx, x, y, colour) {
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x, y - 12);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 14, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(x - 5, y - 20, 10, 4);
  ctx.fillRect(x - 5, y + 16, 10, 4);
}

function cat(ctx, x, y) {
  ctx.fillStyle = '#2e2a26';
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 13, y - 6, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 8, y - 11);
  ctx.lineTo(x + 10, y - 18);
  ctx.lineTo(x + 13, y - 11);
  ctx.closePath();
  ctx.moveTo(x + 14, y - 12);
  ctx.lineTo(x + 17, y - 18);
  ctx.lineTo(x + 19, y - 11);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 15, y + 2);
  ctx.quadraticCurveTo(x - 24, y - 6, x - 18, y - 12);
  ctx.stroke();
}

export function drawMarket(ctx, random, applied) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#16233f');
  sky.addColorStop(1, '#2c3e63');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_WIDTH, 260);

  star(ctx, 60, 30, 5, 0.9);
  star(ctx, 120, 70, 4, 0.7);
  if (!applied.has('star-missing')) star(ctx, 150, 40, 7, 1);
  star(ctx, 230, 34, 4, 0.8);
  star(ctx, 350, 60, 5, 0.7);
  star(ctx, 540, 30, 4, 0.8);
  star(ctx, 420, 26, 3, 0.6);
  for (let index = 0; index < 14; index += 1) {
    ctx.fillStyle = 'rgba(255,246,201,0.7)';
    ctx.beginPath();
    ctx.arc(20 + random() * 560, 14 + random() * 90, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#fdf3d0';
  ctx.beginPath();
  ctx.arc(480, 50, 24, 0, Math.PI * 2);
  ctx.fill();
  if (!applied.has('moon-crater')) {
    ctx.fillStyle = '#e3d5a8';
    ctx.beginPath();
    ctx.arc(472, 44, 5, 0, Math.PI * 2);
    ctx.arc(488, 58, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#0e1526';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.quadraticCurveTo(300, 64, 600, 20);
  ctx.stroke();
  for (let index = 0; index < 12; index += 1) {
    const t = index / 11;
    const x = t * 600;
    const y = 16 + (64 - 16) * 2 * t * (1 - t) * 2 - 8;
    ctx.fillStyle = ['#ff5a5a', '#ffd94d', '#7fe3ff', '#ff9ad5'][index % 4];
    ctx.beginPath();
    ctx.arc(x, y + 12, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  stall(ctx, 60, 130, '#d94f3d', '#f7ead0');
  stall(ctx, 240, 130, '#3f9e5f', '#f7ead0');
  stall(ctx, 430, 130, '#7a4fc0', '#f7ead0');
  if (applied.has('awning-stripe')) {
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.moveTo(60, 130);
    ctx.lineTo(82, 130);
    ctx.lineTo(82, 156);
    ctx.quadraticCurveTo(71, 164, 60, 156);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(104, 130);
    ctx.lineTo(126, 130);
    ctx.lineTo(126, 156);
    ctx.quadraticCurveTo(115, 164, 104, 156);
    ctx.closePath();
    ctx.fill();
  }

  lantern(ctx, 200, 92, '#ff5a5a');
  lantern(ctx, 380, 80, applied.has('lantern-colour') ? '#2ec4b6' : '#ff5a5a');

  if (!applied.has('cat-missing')) cat(ctx, 295, 118);

  ctx.fillStyle = '#c98f4e';
  ctx.fillRect(0, 260, SCENE_WIDTH, SCENE_HEIGHT - 260);
  ctx.fillStyle = '#a87a3e';
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 12; col += 1) {
      ctx.strokeStyle = 'rgba(90,60,20,0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(col * 52 + (row % 2) * 26 - 26, 268 + row * 22, 50, 20);
    }
  }

  const jarColours = ['#e87fa8', '#7fb3e8', '#e8b23f'];
  for (let index = 0; index < 3; index += 1) {
    const x = 258 + index * 26;
    ctx.fillStyle = jarColours[index];
    ctx.beginPath();
    ctx.ellipse(x, 246, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6e4520';
    ctx.fillRect(x - 6, 230, 12, 5);
  }
  if (applied.has('jar-extra')) {
    ctx.fillStyle = '#9ad5a8';
    ctx.beginPath();
    ctx.ellipse(330, 246, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6e4520';
    ctx.fillRect(324, 230, 12, 5);
  }

  ctx.fillStyle = '#8a5a28';
  ctx.beginPath();
  ctx.moveTo(462, 262);
  ctx.lineTo(518, 262);
  ctx.lineTo(510, 288);
  ctx.lineTo(470, 288);
  ctx.closePath();
  ctx.fill();
  const fruit = applied.has('basket-fruit') ? '#58d68d' : '#d94f3d';
  for (let index = 0; index < 5; index += 1) {
    ctx.fillStyle = fruit;
    ctx.beginPath();
    ctx.arc(472 + index * 9, 258 - (index % 2) * 6, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#3f9e5f';
  ctx.beginPath();
  ctx.ellipse(120, 300, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.arc(120, 288, 8, 0, Math.PI * 2);
  ctx.fill();
  void random;
}
