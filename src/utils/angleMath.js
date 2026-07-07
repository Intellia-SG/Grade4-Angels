import { shuffleArray } from './shuffle';

export function getAngleDegrees(px, py, cx, cy) {
  // Screen Y increases downwards, so we do cy - py to get Cartesian Y (upwards)
  const rad = Math.atan2(cy - py, px - cx);
  let deg = rad * (180 / Math.PI);
  if (deg < 0) deg += 360;
  return Math.round(deg);
}

export function snapToDegrees(deg, step = 5) {
  const snaps = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  for (let s of snaps) {
    if (Math.abs(deg - s) < 3.5) {
      return s === 360 ? 0 : s;
    }
  }
  return Math.round(deg / step) * step;
}

export function classifyAngle(deg) {
  const d = (Math.round(deg) + 360) % 360;
  if (d === 0) return 'zero';
  if (d > 0 && d < 90) return 'acute';
  if (d === 90) return 'right';
  if (d > 90 && d < 180) return 'obtuse';
  if (d === 180) return 'straight';
  if (d > 180 && d < 360) return 'reflex';
  return 'zero';
}

export function generateAngleDistractors(correct, type = 'degrees') {
  if (type === 'type') {
    const types = ['acute', 'right', 'obtuse', 'straight', 'reflex'];
    const filtered = types.filter(t => t !== correct);
    const shuffled = shuffleArray(filtered).slice(0, 3);
    return shuffleArray([correct, ...shuffled]);
  }

  // Generate numeric degree distractors
  const distractors = new Set();
  
  // Try neat offsets first
  const offsets = [-30, -20, -10, 10, 20, 30, -15, 15, -45, 45];
  const shuffledOffsets = shuffleArray(offsets);
  
  for (let offset of shuffledOffsets) {
    const d = (correct + offset + 360) % 360;
    if (d !== correct && d > 0 && d < 360 && distractors.size < 3) {
      // Ensure we don't accidentally cross boundary types if correct is right/straight
      if (correct === 90 && (d < 60 || d > 120)) continue;
      if (correct === 180 && (d < 150 || d > 210)) continue;
      distractors.add(d);
    }
  }
  
  // Fill remaining spaces with random multiples of 10 or 5
  while (distractors.size < 3) {
    const d = (Math.floor(Math.random() * 34) + 1) * 10; // 10 to 340
    if (d !== correct) {
      distractors.add(d);
    }
  }
  
  return shuffleArray([correct, ...Array.from(distractors)]);
}
