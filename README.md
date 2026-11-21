[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![make.fun rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/DizellaCapital/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![make.fun reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/DizellaCapital/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

# Spot the Difference — 3 Scenes, 7 Differences Each

A complete spot the difference game that runs offline in a desktop browser
from its own static files: two near-identical pictures side by side, gold
rings on the differences found, several still unfound, and a counter of how
many remain. Three hand-drawn vector scenes — **Sunset Harbour**, **Night
Market** and **Forest Picnic** — each with 7 differences that are fair but
not obvious, a par time of 1:30 per scene, 3 hints per scene, strikes,
a score with time bonus, keyboard play (arrows + Space, H hint, P pause,
M mute, 1/2/3 scene select) and synthesized WebAudio sounds (no files).

`game/` is plain static files (`game/index.html` + ES modules under
`game/src/`, one file per job: config, random, three scene painters,
world state, input, audio, render, screenshot staging and boot).
`main.ts` copies `game/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the vendored make.fun library.

Play it locally with `node serve.ts`, then open http://localhost:8080.

Entry for the [make.fun bounty](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
"Make the best spot the difference game" — $50, top 10 paid $5 each.
