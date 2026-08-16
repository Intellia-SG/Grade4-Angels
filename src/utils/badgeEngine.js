export const BADGES = [
  {
    id: 'angle_explorer',
    label: '🏅 Angle Explorer',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete?.wonder && s.phaseComplete?.story,
  },
  {
    id: 'angle_builder',
    label: '🥈 Angle Builder',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete?.every(Boolean),
  },
  {
    id: 'geometry_champion',
    label: '🥇 Geometry Champion',
    description: 'Score 80%+ in Practice phase (80+ correct answers)',
    condition: (s) => {
      const results = Object.values(s.worldScores || {});
      if (results.length === 0) return false;
      const totalCorrect = results.reduce((sum, r) => sum + (r ? r.score : 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_protractor',
    label: '💎 Perfect Protractor',
    description: 'Score 10/10 in any world',
    condition: (s) => {
      const results = Object.values(s.worldScores || {});
      return results.some(r => r && r.score === 10);
    },
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => (s.maxStreak || 0) >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 5 phases',
    condition: (s) => s.phaseComplete && Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_eye',
    label: '🎯 Sharp Eye',
    description: 'Complete Station B without any wrong readings',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'world_traveler',
    label: '🌍 World Traveler',
    description: 'Complete all 10 landmark worlds with a passing score',
    condition: (s) => {
      const keys = Object.keys(s.worldScores || {});
      if (keys.length < 10) return false;
      return Object.values(s.worldScores || {}).every(r => r && r.score >= 5);
    },
  },
];

export function checkBadges(state) {
  const currentBadges = state.badges || [];
  return BADGES
    .filter(b => !currentBadges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}
