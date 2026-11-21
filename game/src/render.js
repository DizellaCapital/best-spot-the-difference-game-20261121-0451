// Painting: the HUD, the two panels, the markers, the bottom bar and
// the title / pause / complete overlays. Everything is canvas vector
// art — no images, no fonts, no network.
import {
  BOTTOM_Y,
  COLOURS,
  DIFFERENCES_PER_SCENE,
  FONT_FAMILY,
  HUD_HEIGHT,
  LABEL_HEIGHT,
  PANEL_HEIGHT,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_WIDTH,
  PANEL_Y,
  SCENES,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './config.js';
import { createRandom } from './random.js';
import { drawHarbour } from './scenes-harbour.js';
import { drawMarket } from './scenes-market.js';
import { drawPicnic } from './scenes-picnic.js';
import {
  SCENE_DIFFERENCES,
  SCREEN_ALL_DONE,
  SCREEN_PAUSED,
  SCREEN_SCENE_DONE,
  SCREEN_TITLE,
  displayScore,
  remainingToFind,
  sceneState,
  starsFor,
} from './world.js';
import {
  hintButtonRect,
  nextButtonRect,
  pauseButtonRect,
  playAgainButtonRect,
  resumeButtonRect,
  startButtonRect,
} from './input.js';

const SCENE_PAINTERS = [drawHarbour, drawMarket, drawPicnic];

export { SCREEN_TITLE, SCREEN_PAUSED };

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function button(ctx, rect, label, enabled) {
  ctx.fillStyle = enabled ? COLOURS.button : COLOURS.buttonDisabled;
  roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 8);
  ctx.fill();
  ctx.fillStyle = COLOURS.buttonText;
  ctx.font = `bold 15px ${FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 1);
}

function drawPanelFrame(ctx, x, label, isRight) {
  ctx.fillStyle = '#0c1220';
  roundRect(ctx, x - 2, PANEL_Y - 2, PANEL_WIDTH + 4, PANEL_HEIGHT + 4, 10);
  ctx.fill();
  ctx.strokeStyle = COLOURS.panelBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, x - 2, PANEL_Y - 2, PANEL_WIDTH + 4, PANEL_HEIGHT + 4, 10);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.restore();
  ctx.fillStyle = COLOURS.panelLabel;
  ctx.font = `bold 12px ${FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, x + PANEL_WIDTH / 2, PANEL_Y - LABEL_HEIGHT + 4);
  void isRight;
}

function drawSceneInto(ctx, panelX, sceneIndex, applied) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(panelX, PANEL_Y);
  SCENE_PAINTERS[sceneIndex](ctx, createRandom(SCENES[sceneIndex].seed), applied);
  ctx.restore();
}

function goldRing(ctx, x, y, radius, pulse) {
  const r = radius + (pulse ? Math.sin(Date.now() / 180) * 2 : 0);
  ctx.strokeStyle = COLOURS.foundRing;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = COLOURS.foundRingInner;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r - 4, 0, Math.PI * 2);
  ctx.stroke();
}

function hintRing(ctx, x, y, radius, now) {
  const pulse = 1 + 0.12 * Math.sin(now * 6);
  ctx.strokeStyle = COLOURS.hintRing;
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function wrongMark(ctx, x, y) {
  ctx.strokeStyle = COLOURS.wrong;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 9);
  ctx.lineTo(x + 9, y + 9);
  ctx.moveTo(x + 9, y - 9);
  ctx.lineTo(x - 9, y + 9);
  ctx.stroke();
}

function drawHud(ctx, world) {
  const scene = SCENES[world.sceneIndex];
  const state = sceneState(world);
  ctx.fillStyle = '#0e1524';
  ctx.fillRect(0, 0, VIEW_WIDTH, HUD_HEIGHT);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, HUD_HEIGHT - 1, VIEW_WIDTH, 1);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = COLOURS.hudText;
  ctx.font = `bold 21px ${FONT_FAMILY}`;
  ctx.fillText(scene.title, 16, 26);
  ctx.fillStyle = '#9aa7bd';
  ctx.font = `13px ${FONT_FAMILY}`;
  ctx.fillText(`Scene ${world.sceneIndex + 1} of 3 · Par ${formatTime(scene.par)}`, 16, 45);

  ctx.textAlign = 'center';
  ctx.fillStyle = COLOURS.gold;
  ctx.font = `bold 27px ${FONT_FAMILY}`;
  ctx.fillText(`${remainingToFind(world)} to find`, 640, 34);

  ctx.textAlign = 'right';
  ctx.fillStyle = COLOURS.hudText;
  ctx.font = `bold 17px ${FONT_FAMILY}`;
  ctx.fillText(`⏱ ${formatTime(state.elapsed)}`, 986, 26);
  ctx.fillStyle = state.strikes > 0 ? COLOURS.wrong : '#9aa7bd';
  ctx.font = `13px ${FONT_FAMILY}`;
  ctx.fillText(`Strikes: ${state.strikes}`, 986, 45);

  button(ctx, hintButtonRect(), `Hint (${state.hintsLeft})`, state.hintsLeft > 0);
  button(ctx, pauseButtonRect(), world.screen === SCREEN_PAUSED ? 'Resume' : 'Pause', true);
}

function drawBottomBar(ctx, world) {
  const state = sceneState(world);
  ctx.fillStyle = '#0e1524';
  ctx.fillRect(0, BOTTOM_Y, VIEW_WIDTH, VIEW_HEIGHT - BOTTOM_Y);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, BOTTOM_Y, VIEW_WIDTH, 1);

  ctx.textAlign = 'center';
  ctx.fillStyle = COLOURS.message;
  ctx.font = `13px ${FONT_FAMILY}`;
  ctx.fillText(world.message, 640, BOTTOM_Y + 15);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#9aa7bd';
  ctx.font = `13px ${FONT_FAMILY}`;
  ctx.fillText(`Found: ${state.found.size} / ${DIFFERENCES_PER_SCENE}`, 16, BOTTOM_Y + 38);
  for (let index = 0; index < DIFFERENCES_PER_SCENE; index += 1) {
    const x = 116 + index * 22;
    const y = BOTTOM_Y + 34;
    ctx.fillStyle = index < state.found.size ? COLOURS.dotFound : COLOURS.dotEmpty;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    if (index < state.found.size) {
      ctx.strokeStyle = '#0e1524';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 3, y);
      ctx.lineTo(x - 1, y + 2.5);
      ctx.lineTo(x + 3.5, y - 3);
      ctx.stroke();
    }
  }

  const pills = ['1 Harbour', '2 Market', '3 Picnic'];
  for (let index = 0; index < pills.length; index += 1) {
    const x = 470 + index * 104;
    const active = index === world.sceneIndex;
    const done = world.scenes[index].completed;
    ctx.fillStyle = active ? COLOURS.gold : '#232f47';
    roundRect(ctx, x, BOTTOM_Y + 22, 96, 26, 13);
    ctx.fill();
    ctx.fillStyle = active ? COLOURS.buttonText : done ? COLOURS.dotFound : '#c8d2e2';
    ctx.font = `bold 12px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.fillText(pills[index], x + 48, BOTTOM_Y + 39);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = COLOURS.hudText;
  ctx.font = `bold 16px ${FONT_FAMILY}`;
  ctx.fillText(`Score ${displayScore(world)}`, 1264, BOTTOM_Y + 38);
}

function dim(ctx) {
  ctx.fillStyle = 'rgba(10,14,24,0.78)';
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
}

function overlayCard(ctx, title, lines, buttonRect, buttonLabel) {
  dim(ctx);
  ctx.fillStyle = '#1a2438';
  roundRect(ctx, 340, 92, 600, 296, 16);
  ctx.fill();
  ctx.strokeStyle = COLOURS.panelBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, 340, 92, 600, 296, 16);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOURS.gold;
  ctx.font = `bold 30px ${FONT_FAMILY}`;
  ctx.fillText(title, 640, 142);
  ctx.fillStyle = '#d8deea';
  ctx.font = `15px ${FONT_FAMILY}`;
  lines.forEach((line, index) => {
    ctx.fillText(line, 640, 178 + index * 26);
  });
  if (buttonRect !== null) button(ctx, buttonRect, buttonLabel, true);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function draw(world) {
    ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    ctx.fillStyle = COLOURS.background;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    drawHud(ctx, world);
    drawPanelFrame(ctx, PANEL_LEFT_X, 'LEFT — original', false);
    drawPanelFrame(ctx, PANEL_RIGHT_X, 'RIGHT — spot the changes', true);

    const allDiffs = new Set(SCENE_DIFFERENCES[world.sceneIndex].map((item) => item.id));
    drawSceneInto(ctx, PANEL_LEFT_X, world.sceneIndex, new Set());
    drawSceneInto(ctx, PANEL_RIGHT_X, world.sceneIndex, allDiffs);

    ctx.fillStyle = COLOURS.gold;
    ctx.beginPath();
    ctx.arc(640, PANEL_Y + PANEL_HEIGHT / 2, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOURS.buttonText;
    ctx.font = `bold 12px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VS', 640, PANEL_Y + PANEL_HEIGHT / 2 + 1);
    ctx.textBaseline = 'alphabetic';

    const state = sceneState(world);
    const differences = SCENE_DIFFERENCES[world.sceneIndex];
    for (const difference of differences) {
      if (!state.found.has(difference.id)) continue;
      goldRing(ctx, PANEL_LEFT_X + difference.x, PANEL_Y + difference.y, difference.r + 4, false);
      goldRing(ctx, PANEL_RIGHT_X + difference.x, PANEL_Y + difference.y, difference.r + 4, false);
    }
    if (state.hintId !== null) {
      const hinted = differences.find((item) => item.id === state.hintId);
      if (hinted) {
        hintRing(ctx, PANEL_LEFT_X + hinted.x, PANEL_Y + hinted.y, hinted.r + 6, world.now);
        hintRing(ctx, PANEL_RIGHT_X + hinted.x, PANEL_Y + hinted.y, hinted.r + 6, world.now);
      }
    }
    if (state.wrongAt !== null) {
      wrongMark(ctx, PANEL_RIGHT_X + state.wrongAt.x, PANEL_Y + state.wrongAt.y);
      wrongMark(ctx, PANEL_LEFT_X + state.wrongAt.x, PANEL_Y + state.wrongAt.y);
    }
    if (world.crosshair.visible && world.screen === 'play') {
      // Synchronized dual crosshair: the same mirrored point on both
      // panels, so keyboard players see exactly where they are aiming.
      for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
        const x = panelX + world.crosshair.x;
        const y = PANEL_Y + world.crosshair.y;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 18, y);
        ctx.lineTo(x - 7, y);
        ctx.moveTo(x + 7, y);
        ctx.lineTo(x + 18, y);
        ctx.moveTo(x, y - 18);
        ctx.lineTo(x, y - 7);
        ctx.moveTo(x, y + 7);
        ctx.lineTo(x, y + 18);
        ctx.stroke();
      }
    }

    drawBottomBar(ctx, world);

    if (world.screen === SCREEN_TITLE) {
      overlayCard(
        ctx,
        'SPOT THE DIFFERENCE',
        [
          '3 scenes · 7 differences each · hints + timer',
          'Click a difference on either picture — or move with',
          'arrow keys and press Space. H hints, P pauses, M mutes.',
          'Find all 7 in a scene to unlock the next one.',
          world.best > 0 ? `Best total score: ${world.best}` : 'Beat the par time for a bonus!',
        ],
        startButtonRect(),
        'Start playing',
      );
    } else if (world.screen === SCREEN_PAUSED) {
      overlayCard(
        ctx,
        'PAUSED',
        ['Take a breath. The timer is stopped.', 'P or Resume continues the hunt.'],
        resumeButtonRect(),
        'Resume',
      );
    } else if (world.screen === SCREEN_SCENE_DONE) {
      const scene = SCENES[world.sceneIndex];
      overlayCard(
        ctx,
        'SCENE COMPLETE!',
        [
          `${scene.title} — all 7 differences found.`,
          `Scene score ${state.score} (time bonus +${state.timeBonus}) · Total ${world.totalScore}`,
          'The next scene is harder. Ready?',
        ],
        nextButtonRect(),
        'Next scene',
      );
    } else if (world.screen === SCREEN_ALL_DONE) {
      const starCount = starsFor(world);
      const stars = '★'.repeat(starCount) + '☆'.repeat(3 - starCount);
      overlayCard(
        ctx,
        'YOU FOUND THEM ALL!',
        [
          `All 21 differences across 3 scenes. Total score: ${world.totalScore}`,
          `${stars}   Best total: ${world.best}`,
          'Thanks for playing — press Play again for another hunt.',
        ],
        playAgainButtonRect(),
        'Play again',
      );
    }
  }

  return { draw };
}
