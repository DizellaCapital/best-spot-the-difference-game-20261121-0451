// Screenshot scenes behind ?shot=start|play|end. Each one stages a real
// game state — never a mock — so a screenshot is what a player actually
// sees: the title screen, a mid-hunt frame with some differences found
// and some still hidden, and the final results screen.
import { SCENE_DIFFERENCES, SCREEN_ALL_DONE, SCREEN_PLAY, SCREEN_TITLE, sceneState } from './world.js';

/** The differences a play shot shows as already found (4 of 7). */
const PLAY_FOUND = [0, 2, 4, 6];
/** The staged clock for a play shot, in seconds. */
const PLAY_ELAPSED = 42;
/** The staged clock for the results shot, in seconds. */
const END_ELAPSED = 88;

/**
 * Set `world` to the named scene and return the screen to draw over it.
 * `sceneIndex` picks the scene for play shots; any other name is start.
 */
export function stageShot(name, sceneIndex, world) {
  world.sceneIndex = sceneIndex;
  world.best = 2220;
  if (name !== 'play' && name !== 'end') {
    world.screen = SCREEN_TITLE;
    world.message = 'Find 7 differences in each scene.';
    return;
  }
  if (name === 'end') {
    world.scenes.forEach((scene, index) => {
      scene.found = new Set(SCENE_DIFFERENCES[index].map((item) => item.id));
      scene.completed = true;
      scene.elapsed = END_ELAPSED;
      scene.score = 700 + 40;
      scene.hintsLeft = 2;
      scene.strikes = 0;
    });
    world.totalScore = 2220;
    world.screen = SCREEN_ALL_DONE;
    world.message = 'All 3 scenes complete! Total 2220 points.';
    return;
  }
  const state = sceneState(world);
  const differences = SCENE_DIFFERENCES[sceneIndex];
  PLAY_FOUND.forEach((position) => state.found.add(differences[position].id));
  state.elapsed = PLAY_ELAPSED;
  state.score = 400;
  state.hintsLeft = 3;
  state.strikes = 0;
  world.totalScore = sceneIndex * 740;
  world.screen = SCREEN_PLAY;
  world.message = 'Found 4 of 7 — 3 to go. Keep hunting!';
}
