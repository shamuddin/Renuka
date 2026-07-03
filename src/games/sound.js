// Tiny Web Audio helpers so games have satisfying feedback. All optional —
// wrapped in try/catch so a blocked AudioContext never breaks a game.
let ac = null;
function ctx() {
  if (!ac) {
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      ac = null;
    }
  }
  return ac;
}

export function blip(freq = 660, dur = 0.12, type = 'sine', vol = 0.15) {
  const a = ctx();
  if (!a) return;
  try {
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(a.destination);
    const t = a.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch { /* ignore */ }
}

export function chime(freqs = [523, 659, 784, 1047]) {
  freqs.forEach((f, i) => setTimeout(() => blip(f, 0.4, 'sine', 0.18), i * 110));
}
