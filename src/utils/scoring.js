export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? (hintsUsed > 0 ? 7 : 10) : (hintsUsed > 0 ? 5 : 7);
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3; // Gold
  if (correct >= 7) return 2; // Silver
  if (correct >= 5) return 1; // Bronze
  return 0; // Try again
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function calcTotalStars(worldScores) {
  return Object.values(worldScores).reduce((sum, ws) => sum + (ws !== null ? calcStars(ws.score, ws.total) : 0), 0);
}
