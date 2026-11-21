// Pointer and keyboard input. Mouse clicks land on a panel, a HUD
// button or the bottom bar; arrow keys move a crosshair so the whole
// game is playable from the keyboard alone.
import {
  BOTTOM_Y,
  HUD_HEIGHT,
  PANEL_HEIGHT,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_WIDTH,
  PANEL_Y,
  SCENE_HEIGHT,
  SCENE_WIDTH,
} from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_MUTE = 8;
export const ACTION_RESTART = 16;
export const ACTION_SCENE_1 = 32;
export const ACTION_SCENE_2 = 64;
export const ACTION_SCENE_3 = 128;

export function hintButtonRect() {
  return { x: 1000, y: 8, width: 108, height: 38 };
}

export function pauseButtonRect() {
  return { x: 1120, y: 8, width: 110, height: 38 };
}

export function resumeButtonRect() {
  return { x: 540, y: 300, width: 200, height: 48 };
}

export function nextButtonRect() {
  return { x: 540, y: 300, width: 200, height: 48 };
}

export function playAgainButtonRect() {
  return { x: 540, y: 320, width: 200, height: 48 };
}

export function startButtonRect() {
  return { x: 540, y: 320, width: 200, height: 48 };
}

function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

function panelHit(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_HEIGHT) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL_WIDTH) {
    return { panel: 'left', x: x - PANEL_LEFT_X, y: y - PANEL_Y };
  }
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL_WIDTH) {
    return { panel: 'right', x: x - PANEL_RIGHT_X, y: y - PANEL_Y };
  }
  return null;
}

function scenePillHit(x, y) {
  if (y < BOTTOM_Y + 8 || y > BOTTOM_Y + 44) return -1;
  const pills = [
    { x: 470, width: 96 },
    { x: 574, width: 96 },
    { x: 678, width: 96 },
  ];
  for (let index = 0; index < pills.length; index += 1) {
    if (x >= pills[index].x && x <= pills[index].x + pills[index].width) return index;
  }
  return -1;
}

export function createInput(canvas, world, callbacks) {
  let actions = 0;
  const pressed = new Set();

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePoint(point) {
    if (inside(hintButtonRect(), point.x, point.y)) {
      actions |= ACTION_HINT;
      return;
    }
    if (inside(pauseButtonRect(), point.x, point.y)) {
      actions |= ACTION_PAUSE;
      return;
    }
    if (world.screen === 'title' && inside(startButtonRect(), point.x, point.y)) {
      actions |= ACTION_CONFIRM;
      return;
    }
    if (world.screen === 'paused' && inside(resumeButtonRect(), point.x, point.y)) {
      actions |= ACTION_PAUSE;
      return;
    }
    if (world.screen === 'scene-done' && inside(nextButtonRect(), point.x, point.y)) {
      actions |= ACTION_CONFIRM;
      return;
    }
    if (world.screen === 'all-done' && inside(playAgainButtonRect(), point.x, point.y)) {
      actions |= ACTION_CONFIRM;
      return;
    }
    const pill = scenePillHit(point.x, point.y);
    if (pill >= 0) {
      actions |= [ACTION_SCENE_1, ACTION_SCENE_2, ACTION_SCENE_3][pill];
      return;
    }
    const hit = panelHit(point.x, point.y);
    if (hit !== null) {
      world.crosshair.x = hit.x;
      world.crosshair.y = hit.y;
      world.crosshair.panel = hit.panel;
      world.crosshair.visible = false;
      callbacks.onPanelClick(hit);
    }
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    callbacks.onGesture();
    handlePoint(canvasPoint(event));
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    callbacks.onGesture();
    if (key === ' ' || key === 'enter') {
      event.preventDefault();
      if (world.screen === 'play') {
        world.crosshair.visible = true;
        callbacks.onPanelClick({
          panel: world.crosshair.panel,
          x: world.crosshair.x,
          y: world.crosshair.y,
        });
      } else {
        actions |= ACTION_CONFIRM;
      }
      return;
    }
    if (key === 'arrowleft' || key === 'arrowright' || key === 'arrowup' || key === 'arrowdown') {
      event.preventDefault();
      const step = event.shiftKey ? 4 : 14;
      world.crosshair.visible = true;
      if (key === 'arrowleft') world.crosshair.x = Math.max(0, world.crosshair.x - step);
      if (key === 'arrowright') world.crosshair.x = Math.min(SCENE_WIDTH, world.crosshair.x + step);
      if (key === 'arrowup') world.crosshair.y = Math.max(0, world.crosshair.y - step);
      if (key === 'arrowdown') world.crosshair.y = Math.min(SCENE_HEIGHT, world.crosshair.y + step);
      return;
    }
    if (key === 'tab') {
      event.preventDefault();
      world.crosshair.visible = true;
      world.crosshair.panel = world.crosshair.panel === 'left' ? 'right' : 'left';
      return;
    }
    if (key === 'p' || key === 'escape') actions |= ACTION_PAUSE;
    else if (key === 'h') actions |= ACTION_HINT;
    else if (key === 'm') actions |= ACTION_MUTE;
    else if (key === 'r') actions |= ACTION_RESTART;
    else if (key === '1') actions |= ACTION_SCENE_1;
    else if (key === '2') actions |= ACTION_SCENE_2;
    else if (key === '3') actions |= ACTION_SCENE_3;
  });

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    pressed,
  };
}

export { HUD_HEIGHT };
