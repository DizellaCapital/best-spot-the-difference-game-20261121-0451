// Game state: three scenes, each with its own finds, strikes, hints and
// clock. The world knows nothing about drawing; render.js paints it.
import {
  BEST_KEY,
  BONUS_PER_SECOND_UNDER_PAR,
  DIFFERENCES_PER_SCENE,
  HINTS_PER_SCENE,
  HINT_PULSE_SECONDS,
  MAX_STRIKES,
  POINTS_PER_FIND,
  POINTS_PER_STRIKE,
  SCENES,
  WRONG_FLASH_SECONDS,
} from './config.js';
import { HARBOUR_DIFFERENCES } from './scenes-harbour.js';
import { MARKET_DIFFERENCES } from './scenes-market.js';
import { PICNIC_DIFFERENCES } from './scenes-picnic.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_SCENE_DONE = 'scene-done';
export const SCREEN_ALL_DONE = 'all-done';

export const SCENE_DIFFERENCES = [HARBOUR_DIFFERENCES, MARKET_DIFFERENCES, PICNIC_DIFFERENCES];

function freshSceneState() {
  return {
    found: new Set(),
    strikes: 0,
    hintsLeft: HINTS_PER_SCENE,
    elapsed: 0,
    score: 0,
    hintId: null,
    hintUntil: 0,
    wrongAt: null,
    wrongUntil: 0,
    completed: false,
    timeBonus: 0,
  };
}

export function createWorld() {
  const world = {
    screen: SCREEN_TITLE,
    sceneIndex: 0,
    scenes: SCENES.map(() => freshSceneState()),
    totalScore: 0,
    now: 0,
    message: 'Find 7 differences in each scene.',
    crosshair: { x: 300, y: 168, panel: 'right', visible: false },
    best: 0,
  };
  return world;
}

export function sceneDifferences(world) {
  return SCENE_DIFFERENCES[world.sceneIndex];
}

export function sceneState(world) {
  return world.scenes[world.sceneIndex];
}

export function remainingToFind(world) {
  return DIFFERENCES_PER_SCENE - sceneState(world).found.size;
}

export function totalFound(world) {
  return world.scenes.reduce((sum, scene) => sum + scene.found.size, 0);
}

/**
 * The score the HUD shows. A completed scene's points already live in
 * totalScore, so they are not added a second time.
 */
export function displayScore(world) {
  const state = sceneState(world);
  return state.completed ? world.totalScore : world.totalScore + state.score;
}

export function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

export function startScene(world, index) {
  world.sceneIndex = index;
  world.screen = SCREEN_PLAY;
  world.message = `Scene ${index + 1} of 3 — find ${DIFFERENCES_PER_SCENE} differences.`;
}

export function restartScene(world) {
  world.scenes[world.sceneIndex] = freshSceneState();
  world.screen = SCREEN_PLAY;
  world.message = 'Scene restarted. Find 7 differences.';
}

export function switchScene(world, index) {
  if (index === world.sceneIndex) return;
  world.sceneIndex = index;
  const state = sceneState(world);
  world.screen = state.completed ? SCREEN_SCENE_DONE : SCREEN_PLAY;
  world.message = state.completed
    ? 'Scene already complete — pick another scene or replay it.'
    : `Scene ${index + 1} of 3 — find ${DIFFERENCES_PER_SCENE} differences.`;
}

export function tick(world, seconds) {
  world.now += seconds;
  if (world.screen !== SCREEN_PLAY) return;
  const state = sceneState(world);
  state.elapsed += seconds;
  if (state.hintId !== null && world.now >= state.hintUntil) state.hintId = null;
  if (state.wrongAt !== null && world.now >= state.wrongUntil) state.wrongAt = null;
}

/** Mark a point in scene coordinates. Returns 'found' | 'wrong' | 'none'. */
export function markAt(world, x, y) {
  if (world.screen !== SCREEN_PLAY) return 'none';
  const state = sceneState(world);
  const differences = sceneDifferences(world);
  for (const difference of differences) {
    const dx = x - difference.x;
    const dy = y - difference.y;
    if (dx * dx + dy * dy > difference.r * difference.r) continue;
    // Clicking a difference already found is a soft no-op, never a
    // strike: the player is re-tapping a gold ring, not guessing.
    if (state.found.has(difference.id)) {
      world.message = `Already found: ${difference.label}.`;
      return 'none';
    }
    state.found.add(difference.id);
    state.score += POINTS_PER_FIND;
    world.message = `Found: ${difference.label}! ${remainingToFind(world)} to go.`;
    if (state.found.size === DIFFERENCES_PER_SCENE) completeScene(world);
    return 'found';
  }
  state.strikes += 1;
  state.score = Math.max(0, state.score - POINTS_PER_STRIKE);
  state.wrongAt = { x, y };
  state.wrongUntil = world.now + WRONG_FLASH_SECONDS;
  world.message =
    state.strikes >= MAX_STRIKES
      ? 'That was not one — 3 strikes! Hint: use H for a hint.'
      : 'Not a difference — that is a strike.';
  return 'wrong';
}

function completeScene(world) {
  const state = sceneState(world);
  const scene = SCENES[world.sceneIndex];
  state.completed = true;
  state.timeBonus = Math.max(0, Math.round(scene.par - state.elapsed)) * BONUS_PER_SECOND_UNDER_PAR;
  state.score += state.timeBonus;
  world.totalScore += state.score;
  const allDone = world.scenes.every((item) => item.completed);
  world.screen = allDone ? SCREEN_ALL_DONE : SCREEN_SCENE_DONE;
  if (allDone && world.totalScore > world.best) {
    world.best = world.totalScore;
    saveBest(world.best);
  }
  world.message = allDone
    ? `All 3 scenes complete! Total ${world.totalScore} points.`
    : `Scene complete! +${state.timeBonus} time bonus.`;
}

export function useHint(world) {
  if (world.screen !== SCREEN_PLAY) return false;
  const state = sceneState(world);
  if (state.hintsLeft <= 0) {
    world.message = 'No hints left in this scene.';
    return false;
  }
  const remaining = sceneDifferences(world).filter((item) => !state.found.has(item.id));
  if (remaining.length === 0) return false;
  state.hintsLeft -= 1;
  state.hintId = remaining[0].id;
  state.hintUntil = world.now + HINT_PULSE_SECONDS;
  world.message = `Hint: look for ${remaining[0].label}.`;
  return true;
}

export function togglePause(world) {
  if (world.screen === SCREEN_PLAY) {
    world.screen = SCREEN_PAUSED;
    world.message = 'Paused. Press P or click Resume to continue.';
  } else if (world.screen === SCREEN_PAUSED) {
    world.screen = SCREEN_PLAY;
    world.message = 'Playing.';
  }
}

export function starsFor(world) {
  const strikes = world.scenes.reduce((sum, scene) => sum + scene.strikes, 0);
  const totalTime = world.scenes.reduce((sum, scene) => sum + scene.elapsed, 0);
  if (strikes === 0 && totalTime <= 240) return 3;
  if (strikes <= 3 && totalTime <= 360) return 2;
  return 1;
}
