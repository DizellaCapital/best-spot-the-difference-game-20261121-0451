// Optional WebAudio bleeps: no sound files, everything is synthesized
// with oscillators, so the game stays a handful of static files.
export function createAudio() {
  let context = null;
  let muted = false;

  function ensureContext() {
    if (context === null) {
      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    }
    if (context.state === 'suspended') void context.resume();
    return context;
  }

  function tone(frequency, startAt, duration, type, volume) {
    const audio = ensureContext();
    if (audio === null || muted) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audio.currentTime + startAt);
    gain.gain.setValueAtTime(0.0001, audio.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + startAt + duration);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(audio.currentTime + startAt);
    oscillator.stop(audio.currentTime + startAt + duration + 0.05);
  }

  return {
    unlock() {
      ensureContext();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    click() {
      tone(660, 0, 0.06, 'sine', 0.08);
    },
    found() {
      tone(523.25, 0, 0.12, 'sine', 0.16);
      tone(783.99, 0.09, 0.2, 'sine', 0.16);
    },
    wrong() {
      tone(160, 0, 0.18, 'sawtooth', 0.08);
      tone(110, 0.08, 0.22, 'sawtooth', 0.08);
    },
    hint() {
      tone(880, 0, 0.1, 'triangle', 0.12);
      tone(1174.66, 0.08, 0.14, 'triangle', 0.12);
    },
    sceneComplete() {
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        tone(frequency, index * 0.11, 0.22, 'triangle', 0.15);
      });
    },
    gameComplete() {
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((frequency, index) => {
        tone(frequency, index * 0.12, 0.3, 'triangle', 0.15);
      });
    },
  };
}
