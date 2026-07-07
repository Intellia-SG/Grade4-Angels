import { classifyAngle, generateAngleDistractors } from './angleMath';
import { shuffleArray } from './shuffle';

// Global Landmark World Descriptions
export const WORLDS = [
  { id: 0, name: 'Eiffel Tower, Paris', icon: '🗼', color: '#4CAF50', desc: 'Acute Angles (0°–45°)' },
  { id: 1, name: 'Statue of Liberty, New York', icon: '🗽', color: '#2196F3', desc: 'Right Angles (Exactly 90°)' },
  { id: 2, name: 'Sydney Opera House, Sydney', icon: '⛵', color: '#FF9800', desc: 'Obtuse Angles (95°–175°)' },
  { id: 3, name: 'Pyramids of Giza, Cairo', icon: '🔺', color: '#9C27B0', desc: 'Straight Angles (Exactly 180°)' },
  { id: 4, name: 'Taj Mahal, Agra', icon: '🕌', color: '#E91E63', desc: 'Angle Classifications' },
  { id: 5, name: 'Great Wall of China, Beijing', icon: '🧱', color: '#00BCD4', desc: 'Angle Estimations' },
  { id: 6, name: 'Big Ben, London', icon: '🕰️', color: '#8BC34A', desc: 'Clock Hands & Angles' },
  { id: 7, name: 'Machu Picchu, Cusco', icon: '⛰️', color: '#FF5722', desc: 'Straight Line Sums (180°)' },
  { id: 8, name: 'Colosseum, Rome', icon: '🏟️', color: '#3F51B5', desc: 'Around a Point Sums (360°)' },
  { id: 9, name: 'Burj Khalifa, Dubai', icon: '🏙️', color: '#F44336', desc: 'Reflex Angles (185°–355°)' }
];

export function generateQuestionBank() {
  const bank = [];

  // ----------------------------------------------------
  // WORLD 0: Eiffel Tower, Paris - Acute Angles (0°-45°)
  // ----------------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const deg = 10 + i * 3; // 13° to 40°
    const correctAns = deg;
    const options = generateAngleDistractors(correctAns);
    bank.push({
      id: `Q_0_${i}`,
      world: 0,
      type: 'mcq_degrees',
      degrees: deg,
      questionText: `Look at this sharp incline. Measure or read the acute angle. How many degrees is it?`,
      options,
      correctAnswer: correctAns,
      hint1: "An acute angle is a small turn, smaller than a square corner.",
      hint2: `This angle is less than 45 degrees. Look at the options: ${options.join(', ')}.`,
      explanation: `This angle measures ${deg} degrees. Since it is less than 90 degrees, it is an acute angle.`,
      visual: 'angle'
    });
  }

  // ----------------------------------------------------
  // WORLD 1: Statue of Liberty, New York - Right Angles (90°)
  // ----------------------------------------------------
  const world1Questions = [
    {
      id: 'Q_1_1',
      degrees: 90,
      questionText: "Look at the corner of Lady Liberty's tablet. What is the angle measure of this perfect square corner?",
      options: [90, 45, 180, 360],
      correctAnswer: 90,
      hint1: "The tablet has a rectangular shape.",
      hint2: "Each corner of a rectangle is a right angle.",
      explanation: "A rectangle corner is a right angle, which measures exactly 90 degrees.",
      visual: 'angle'
    },
    {
      id: 'Q_1_2',
      degrees: 85,
      questionText: "A tourist tilts their camera at 85° to take a photo of the statue. Is this angle a perfect right angle?",
      options: ["Yes, it is exactly 90°", "No, it is less than 90° (acute)", "No, it is more than 90° (obtuse)", "No, it is straight"],
      correctAnswer: "No, it is less than 90° (acute)",
      hint1: "Compare 85 degrees to a right angle.",
      hint2: "A right angle is exactly 90 degrees. Is 85 smaller or larger?",
      explanation: "A right angle is exactly 90°. Since 85° is less than 90°, it is an acute angle.",
      visual: 'angle'
    },
    {
      id: 'Q_1_3',
      degrees: 90,
      questionText: "The streets of Manhattan meet in a grid. What angle is formed when two perpendicular streets cross?",
      options: [45, 90, 180, 270],
      correctAnswer: 90,
      hint1: "Perpendicular lines cross to form square corners.",
      hint2: "A square corner is a right angle, measuring exactly 90 degrees.",
      explanation: "Perpendicular streets intersect to form right angles, which are exactly 90 degrees.",
      visual: 'angle'
    },
    {
      id: 'Q_1_4',
      degrees: 95,
      questionText: "A metal support beam inside the crown is set at 95°. Is this angle a perfect right angle?",
      options: ["Yes, it is exactly 90°", "No, it is less than 90° (acute)", "No, it is more than 90° (obtuse)", "No, it is straight"],
      correctAnswer: "No, it is more than 90° (obtuse)",
      hint1: "Right angles must be exactly 90 degrees.",
      hint2: "Since 95 degrees is slightly wider than 90 degrees, what type is it?",
      explanation: "A right angle must be exactly 90°. Since 95° is greater than 90°, it is an obtuse angle.",
      visual: 'angle'
    },
    {
      id: 'Q_1_5',
      degrees: 90,
      questionText: "Look at the window frames in the pedestal. Each pane meets at a square corner. How many degrees is this angle?",
      options: [60, 90, 120, 180],
      correctAnswer: 90,
      hint1: "Window corners are perfect square corners.",
      hint2: "All square corners are right angles.",
      explanation: "A square corner window frame is a right angle, which is always exactly 90 degrees.",
      visual: 'angle'
    },
    {
      id: 'Q_1_6',
      degrees: 89,
      questionText: "An engineer checks a support pillar and measures its angle at 89°. Is this a perfect right angle?",
      options: ["Yes, it is exactly 90°", "No, it is acute", "No, it is obtuse", "No, it is straight"],
      correctAnswer: "No, it is acute",
      hint1: "A perfect right angle cannot be even one degree off.",
      hint2: "Is 89° slightly smaller or larger than 90°?",
      explanation: "Even one degree off is not a right angle! 89° is slightly smaller than 90°, making it an acute angle.",
      visual: 'angle'
    },
    {
      id: 'Q_1_7',
      degrees: 90,
      questionText: "If two diagonal cables on Lady Liberty's structural frame are perpendicular, what is the angle between them?",
      options: [30, 60, 90, 180],
      correctAnswer: 90,
      hint1: "Perpendicular cables cross at right angles.",
      hint2: "What is the degree measure of a right angle?",
      explanation: "Perpendicular lines cross at right angles, which always measure exactly 90 degrees.",
      visual: 'angle'
    },
    {
      id: 'Q_1_8',
      degrees: 105,
      questionText: "A stair step inside the spiral ladder of the Statue of Liberty is tilted at 105°. Is this a right angle?",
      options: ["Yes, it is exactly 90°", "No, it is acute", "No, it is obtuse", "No, it is straight"],
      correctAnswer: "No, it is obtuse",
      hint1: "Right angles are exactly 90 degrees.",
      hint2: "105 degrees is wider than a square corner.",
      explanation: "Since 105° is greater than 90°, it is an obtuse angle, not a right angle.",
      visual: 'angle'
    },
    {
      id: 'Q_1_9',
      degrees: 90,
      questionText: "How many degrees does a quarter-turn represent, like turning from North to East?",
      options: [45, 90, 180, 360],
      correctAnswer: 90,
      hint1: "A full turn around a circle is 360 degrees.",
      hint2: "Divide 360 degrees by 4 to find the quarter-turn.",
      explanation: "A quarter-turn represents one-fourth of a full circle (360° / 4), which is exactly 90 degrees.",
      visual: 'angle'
    },
    {
      id: 'Q_1_10',
      degrees: 75,
      questionText: "The torch arm forms a 75° angle with the vertical support body. Is this a right angle?",
      options: ["Yes, it is exactly 90°", "No, it is acute", "No, it is obtuse", "No, it is straight"],
      correctAnswer: "No, it is acute",
      hint1: "A right angle is exactly 90 degrees.",
      hint2: "75 degrees is smaller than a square corner.",
      explanation: "An angle of 75° is smaller than 90°, making it an acute angle rather than a right angle.",
      visual: 'angle'
    }
  ];

  world1Questions.forEach(q => {
    bank.push({
      ...q,
      world: 1,
      type: 'mcq_right'
    });
  });

  // ----------------------------------------------------
  // WORLD 2: Sydney Opera House - Obtuse Angles (95°–175°)
  // ----------------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const deg = 100 + i * 7; // 107° to 170°
    const correctAns = deg;
    const options = generateAngleDistractors(correctAns);
    bank.push({
      id: `Q_2_${i}`,
      world: 2,
      type: 'mcq_degrees',
      degrees: deg,
      questionText: `The sails of the Opera House flare outwards. Measure this wide turn angle in degrees.`,
      options,
      correctAnswer: correctAns,
      hint1: "An obtuse angle is wider than a right angle (90°) but not yet a flat line.",
      hint2: `This angle is obtuse, so it must be between 90 and 180 degrees.`,
      explanation: `This angle is ${deg} degrees. Since it is wider than 90° and narrower than 180°, it is classified as obtuse.`,
      visual: 'angle'
    });
  }

  // ----------------------------------------------------
  // WORLD 3: Pyramids of Giza, Cairo - Straight Angles (180°)
  // ----------------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const isFlat = i % 2 === 0;
    const deg = isFlat ? 180 : (i % 3 === 0 ? 175 : 185);
    bank.push({
      id: `Q_3_${i}`,
      world: 3,
      type: 'mcq_straight',
      degrees: deg,
      questionText: isFlat 
        ? "Look at the flat desert horizon. What is the measure of a straight angle in degrees?"
        : `An archaeologist measures a stone block incline at ${deg} degrees. Is this a straight angle?`,
      options: isFlat ? [180, 90, 360, 0] : ["Yes, it is exactly 180°", "No, it is not 180°", "No, it is reflex", "No, it is acute"],
      correctAnswer: isFlat ? 180 : (deg === 180 ? "Yes, it is exactly 180°" : "No, it is not 180°"),
      hint1: "A straight angle forms a perfectly flat straight line.",
      hint2: "A straight line angle is exactly 180 degrees (two right angles combined!).",
      explanation: "A straight angle is exactly 180 degrees. It represents a half-turn.",
      visual: 'angle'
    });
  }

  // ----------------------------------------------------
  // WORLD 4: Taj Mahal, Agra - Angle Classifications
  // ----------------------------------------------------
  const classTests = [
    { deg: 45, type: 'acute' }, { deg: 90, type: 'right' }, { deg: 135, type: 'obtuse' },
    { deg: 180, type: 'straight' }, { deg: 60, type: 'acute' }, { deg: 120, type: 'obtuse' },
    { deg: 15, type: 'acute' }, { deg: 170, type: 'obtuse' }, { deg: 90, type: 'right' },
    { deg: 180, type: 'straight' }
  ];
  classTests.forEach((t, idx) => {
    bank.push({
      id: `Q_4_${idx+1}`,
      world: 4,
      type: 'classification',
      degrees: t.deg,
      questionText: `The dome arch makes an angle of ${t.deg} degrees. How would you classify this angle?`,
      options: ['acute', 'right', 'obtuse', 'straight', 'reflex'],
      correctAnswer: t.type,
      hint1: "Check the size: acute is <90°, right is 90°, obtuse is 90°-180°, straight is 180°.",
      hint2: `Is ${t.deg}° smaller than 90°, equal to 90°, or larger?`,
      explanation: `An angle of ${t.deg} degrees is ${t.type} because it fits the definition of that angle type.`,
      visual: 'angle'
    });
  });

  // ----------------------------------------------------
  // WORLD 5: Great Wall of China - Angle Estimations
  // ----------------------------------------------------
  const estimates = [
    { deg: 30, est: 30, choices: [30, 90, 150] },
    { deg: 85, est: 85, choices: [45, 85, 135] },
    { deg: 120, est: 120, choices: [60, 120, 180] },
    { deg: 150, est: 150, choices: [30, 90, 150] },
    { deg: 45, est: 45, choices: [45, 90, 135] },
    { deg: 15, est: 15, choices: [15, 60, 110] },
    { deg: 105, est: 105, choices: [45, 105, 175] },
    { deg: 60, est: 60, choices: [20, 60, 120] },
    { deg: 135, est: 135, choices: [45, 90, 135] },
    { deg: 40, est: 40, choices: [40, 90, 140] }
  ];
  estimates.forEach((t, idx) => {
    bank.push({
      id: `Q_5_${idx+1}`,
      world: 5,
      type: 'estimation',
      degrees: t.deg,
      questionText: `Look at the rampart step angle. Estimate its size from the choices below.`,
      options: t.choices,
      correctAnswer: t.est,
      hint1: "Compare it to a 90-degree corner: is it much smaller (acute) or wider (obtuse)?",
      hint2: "Estimate: if it is halfway to a right angle, it is about 45 degrees.",
      explanation: `By looking at the opening, this angle is closest to ${t.est} degrees.`,
      visual: 'angle'
    });
  });

  // ----------------------------------------------------
  // WORLD 6: Big Ben, London - Clock Hands & Angles
  // ----------------------------------------------------
  const clocks = [
    { time: '3:00', hour: 3, deg: 90, type: 'right' },
    { time: '6:00', hour: 6, deg: 180, type: 'straight' },
    { time: '1:00', hour: 1, deg: 30, type: 'acute' },
    { time: '4:00', hour: 4, deg: 120, type: 'obtuse' },
    { time: '2:00', hour: 2, deg: 60, type: 'acute' },
    { time: '5:00', hour: 5, deg: 150, type: 'obtuse' },
    { time: '9:00', hour: 9, deg: 90, type: 'right' }, // interior angle is 90°
    { time: '10:00', hour: 10, deg: 60, type: 'acute' }, // interior angle is 60°
    { time: '8:00', hour: 8, deg: 120, type: 'obtuse' }, // interior angle is 120°
    { time: '12:00', hour: 12, deg: 0, type: 'zero' } // zero angle
  ];
  clocks.forEach((t, idx) => {
    const isTypeQ = idx % 2 === 0;
    bank.push({
      id: `Q_6_${idx+1}`,
      world: 6,
      type: 'clock_problem',
      clockHour: t.hour,
      questionText: isTypeQ 
        ? `The hands on Big Ben show ${t.time}. What type of angle is formed between the hour and minute hands?`
        : `The hands on Big Ben show ${t.time}. How many degrees is the smaller angle between the hands?`,
      options: isTypeQ ? ['acute', 'right', 'obtuse', 'straight', 'zero'] : [0, 30, 60, 90, 120, 150, 180].filter((val, i, self) => self.indexOf(val) === i),
      correctAnswer: isTypeQ ? t.type : t.deg,
      hint1: "Each hour segment on a clock face represents exactly 30 degrees (360° / 12).",
      hint2: `Multiply the number of hour gaps by 30° to get the total degrees. At ${t.time}, there are gaps of hands.`,
      explanation: `At ${t.time}, the hands are separated by ${t.hour > 6 ? 12 - t.hour : t.hour} numbers, which equals ${t.deg} degrees (a ${t.type} angle).`,
      visual: 'clock'
    });
  });

  // ----------------------------------------------------
  // WORLD 7: Machu Picchu, Cusco - Straight Line Sums (180°)
  // ----------------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const angleA = 30 + i * 12; // 42° to 150°
    const angleB = 180 - angleA;
    const correctAns = angleB;
    const options = generateAngleDistractors(correctAns);
    bank.push({
      id: `Q_7_${i}`,
      world: 7,
      type: 'sum_straight_line',
      angleA,
      angleB: 'x',
      questionText: `Two stone terraces meet on a straight line. If angle a is ${angleA}°, find the missing angle x.`,
      options,
      correctAnswer: correctAns,
      hint1: "Angles on a straight line always add up to exactly 180 degrees.",
      hint2: `Subtract ${angleA} from 180 to find the remaining angle: 180 - ${angleA} = ?`,
      explanation: `Since they lie on a straight line, their sum is 180°. So, x = 180° - ${angleA}° = ${angleB}°.`,
      visual: 'straight_line'
    });
  }

  // ----------------------------------------------------
  // WORLD 8: Colosseum, Rome - Around a Point Sums (360°)
  // ----------------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const angleA = 80 + i * 10; // 90° to 180°
    const angleB = 70 + i * 8;  // 78° to 150°
    const angleC = 360 - angleA - angleB;
    const correctAns = angleC;
    const options = generateAngleDistractors(correctAns);
    bank.push({
      id: `Q_8_${i}`,
      world: 8,
      type: 'sum_around_point',
      angleA,
      angleB,
      angleC: 'y',
      questionText: `Three structural arches meet at a central pillar. If the first two angles are ${angleA}° and ${angleB}°, find the missing angle y.`,
      options,
      correctAnswer: correctAns,
      hint1: "Angles that meet at a point (a full turn) always add up to exactly 360 degrees.",
      hint2: `Add the two known angles: ${angleA} + ${angleB} = ${angleA + angleB}. Then subtract this sum from 360.`,
      explanation: `Angles around a point sum to 360°. So, y = 360° - (${angleA}° + ${angleB}°) = 360° - ${angleA + angleB}° = ${angleC}°.`,
      visual: 'around_point'
    });
  }

  // ----------------------------------------------------
  // WORLD 9: Burj Khalifa, Dubai - Reflex Angles (185°–355°)
  // ----------------------------------------------------
  for (let i = 1; i <= 10; i++) {
    const deg = 190 + i * 15; // 205° to 340°
    const correctAns = deg;
    const options = generateAngleDistractors(correctAns);
    bank.push({
      id: `Q_9_${i}`,
      world: 9,
      type: 'mcq_degrees',
      degrees: deg,
      questionText: `The building makes a massive external turn. Measure the reflex angle (shown on the outer side).`,
      options,
      correctAnswer: correctAns,
      hint1: "A reflex angle is an angle that is greater than 180 degrees but less than 360 degrees.",
      hint2: "This is a reflex angle because it is larger than a straight line.",
      explanation: `This outer turn measures ${deg} degrees. Since it is wider than 180° and less than a full turn (360°), it is a reflex angle.`,
      visual: 'angle'
    });
  }

  return bank;
}

export function generateSessionQuestions() {
  const bank = generateQuestionBank();
  // We shuffle the questions per world so the order of practice is randomized, 
  // but we group them so each world has exactly its 10 questions.
  const shuffledBank = [];
  for (let w = 0; w < 10; w++) {
    const worldQs = bank.filter(q => q.world === w);
    const shuffledWorldQs = shuffleArray(worldQs);
    shuffledBank.push(...shuffledWorldQs);
  }
  return shuffledBank;
}
