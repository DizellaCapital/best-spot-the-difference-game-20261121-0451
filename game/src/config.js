// Layout and tuning constants for Spot the Difference: 3 Scenes.
// The game renders on one fixed 1280x480 canvas: a HUD bar, two scene
// panels side by side, and a bottom bar with progress dots and scores.
export const VIEW_WIDTH = 1280;
export const VIEW_HEIGHT = 480;

export const HUD_HEIGHT = 54;
export const LABEL_HEIGHT = 20;
export const PANEL_Y = 78;
export const PANEL_HEIGHT = 336;
export const PANEL_WIDTH = 600;
export const PANEL_GAP = 48;
export const PANEL_LEFT_X = 16;
export const PANEL_RIGHT_X = PANEL_LEFT_X + PANEL_WIDTH + PANEL_GAP;
export const BOTTOM_Y = 424;

export const SCENE_WIDTH = PANEL_WIDTH;
export const SCENE_HEIGHT = PANEL_HEIGHT;

export const DIFFERENCES_PER_SCENE = 7;
export const HINTS_PER_SCENE = 3;
export const PAR_SECONDS = 90;
export const POINTS_PER_FIND = 100;
export const POINTS_PER_STRIKE = 25;
export const BONUS_PER_SECOND_UNDER_PAR = 5;
export const MAX_STRIKES = 3;
export const HINT_PULSE_SECONDS = 3;
export const WRONG_FLASH_SECONDS = 0.6;

export const BEST_KEY = 'spot-the-difference-3-scenes-best';

/** The fixed simulation step the main loop advances the world by. */
export const STEP_SECONDS = 1 / 60;

// Scene catalogue: title, subtitle, par time and the fixed seed that
// drives each scene's decorative randomness, so every run paints the
// same picture byte for byte.
export const SCENES = [
  { id: 'harbour', title: 'Sunset Harbour', par: PAR_SECONDS, seed: 101 },
  { id: 'market', title: 'Night Market', par: PAR_SECONDS, seed: 202 },
  { id: 'picnic', title: 'Forest Picnic', par: PAR_SECONDS, seed: 303 },
];

export const FONT_FAMILY = "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif";

export const COLOURS = {
  background: '#141c2e',
  hudText: '#f5edd8',
  gold: '#f2b705',
  goldDark: '#c78d02',
  panelBorder: '#2c3a55',
  panelLabel: '#d8cfae',
  foundRing: '#f2b705',
  foundRingInner: '#fff3c4',
  hintRing: '#7fe3ff',
  wrong: '#ff5a5a',
  button: '#f2b705',
  buttonText: '#241a02',
  buttonDisabled: '#5a5344',
  dotFound: '#58d68d',
  dotEmpty: '#3a4763',
  message: '#ffe9a8',
};
