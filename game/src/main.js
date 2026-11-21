// Boot and the one loop: input is read every frame, the world advances
// in fixed 1/60 s steps, and the renderer paints what is there. The game
// moves between five screens: title, play, paused, scene done and all done.
//
// ?seed=N is accepted for future scene shuffles and ignored today.
// ?shot=start|play|end (with &scene=N) stages that scene instead of
// running the loop, paints it twice and sets window.__shotReady so a
// screenshot tool knows the frame is settled.
import { STEP_SECONDS } from './config.js';
import { createAudio } from './audio.js';
import { createInput, ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART, ACTION_SCENE_1, ACTION_SCENE_2, ACTION_SCENE_3 } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import {
  SCREEN_ALL_DONE,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_SCENE_DONE,
  SCREEN_TITLE,
  createWorld,
  markAt,
  readBest,
  restartScene,
  sceneState,
  startScene,
  switchScene,
  tick,
  togglePause,
  useHint,
} from './world.js';

/** The longest frame the loop catches up on; a longer stall is dropped. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const sceneParam = Number.parseInt(params.get('scene') ?? '0', 10);
const sceneIndex = Number.isInteger(sceneParam) && sceneParam >= 0 && sceneParam <= 2 ? sceneParam : 0;

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
world.best = readBest();
const renderer = createRenderer(canvas);
const audio = createAudio();

function runShot(name) {
  stageShot(name, sceneIndex, world);
  let painted = 0;
  function paint() {
    renderer.draw(world);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, world, {
    onGesture() {
      audio.unlock();
    },
    onPanelClick(hit) {
      if (world.screen !== SCREEN_PLAY) return;
      const result = markAt(world, hit.x, hit.y);
      if (result === 'found') audio.found();
      else if (result === 'wrong') audio.wrong();
      else audio.click();
      if (world.screen === SCREEN_SCENE_DONE) audio.sceneComplete();
      else if (world.screen === SCREEN_ALL_DONE) audio.gameComplete();
    },
  });
  let accumulator = 0;
  let last = performance.now();

  function announce(message) {
    status.textContent = message;
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_MUTE) {
      const muted = audio.toggleMute();
      announce(muted ? 'Sound off.' : 'Sound on.');
    }
    if (actions & ACTION_HINT) {
      if (useHint(world)) audio.hint();
      announce(world.message);
    }
    if (actions & ACTION_RESTART && world.screen === SCREEN_PLAY) {
      restartScene(world);
      announce(world.message);
    }
    if (actions & ACTION_SCENE_1) switchScene(world, 0);
    if (actions & ACTION_SCENE_2) switchScene(world, 1);
    if (actions & ACTION_SCENE_3) switchScene(world, 2);
    if (actions & ACTION_PAUSE) {
      togglePause(world);
      announce(world.message);
    }
    if (actions & ACTION_CONFIRM) {
      if (world.screen === SCREEN_TITLE) {
        startScene(world, 0);
        audio.click();
        announce(world.message);
      } else if (world.screen === SCREEN_SCENE_DONE) {
        const next = (world.sceneIndex + 1) % 3;
        startScene(world, next);
        announce(world.message);
      } else if (world.screen === SCREEN_ALL_DONE) {
        const fresh = createWorld();
        fresh.best = world.best;
        Object.assign(world, fresh);
        startScene(world, 0);
        announce(world.message);
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    while (accumulator >= STEP_SECONDS) {
      tick(world, STEP_SECONDS);
      accumulator -= STEP_SECONDS;
    }
    renderer.draw(world);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && world.screen === SCREEN_PLAY) {
      togglePause(world);
      announce(world.message);
    }
  });

  announce('Spot the difference. Press Space or click Start to play.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
