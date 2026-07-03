import { CatmullRomCurve3, Vector3 } from 'three';
import { chapters } from '../data/story.js';

// The journey weaves gently side-to-side while rising — an emotional ascent.
// Islands march into -z; the camera follows a smooth spline through them.
const SPACING = 14; // z distance between islands
const SWAY = 9; // side-to-side amplitude
const RISE = 1.15; // how much each island climbs

export const islandPositions = chapters.map((_, i) => [
  Math.sin(i * 0.8) * SWAY,
  i * RISE,
  -i * SPACING,
]);

// midpoint of the journey (used to center the sea)
export const journeyMidZ = (-(chapters.length - 1) * SPACING) / 2;

const targetPts = islandPositions.map((p) => new Vector3(p[0], p[1] + 0.9, p[2]));

// camera sits back (+z) and just above each island, drifting to the opposite
// side of the sway for a parallaxed, cinematic feel. A gentle (not steep)
// downward angle keeps the island centered in frame.
const camPts = islandPositions.map((p, i) => {
  const side = Math.cos(i * 0.8) * 3.2;
  return new Vector3(p[0] + side, p[1] + 2.7, p[2] + 12);
});

// the glowing ribbon floats just above the island tops
const pathPts = islandPositions.map((p) => new Vector3(p[0], p[1] + 1.1, p[2]));

export const camCurve = new CatmullRomCurve3(camPts, false, 'catmullrom', 0.4);
export const targetCurve = new CatmullRomCurve3(targetPts, false, 'catmullrom', 0.4);
export const pathCurve = new CatmullRomCurve3(pathPts, false, 'catmullrom', 0.4);

export const clamp01 = (v) => Math.max(0, Math.min(1, v));

// The intro owns the first slice of scroll; the island journey starts after it,
// so island 0 (the proposal) gets its own moment instead of hiding under the intro.
export const INTRO_LEAD = 0.07;
export const journeyT = (scroll) =>
  clamp01((scroll - INTRO_LEAD) / (1 - INTRO_LEAD));

// current chapter index + how centred we are on it (0..1)
export function chapterFocus(scroll, count) {
  const seg = journeyT(scroll) * (count - 1);
  const idx = Math.round(seg);
  const centered = 1 - Math.min(1, Math.abs(seg - idx) * 2.4);
  return { idx, centered };
}
