import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// Intro Screen Narration
export const playIntroNarration = () => [
  cheer("Welcome to Angles in Geometry!"),
  say("Today, we are going to explore the world and learn all about angles."),
  ask("Are you ready to begin our global geometric adventure? Let us get started!")
];

// Wonder Phase Narration
export const playWonderNarration = (step) => {
  if (step === 0) {
    return [
      say("Wei Ming opens a book just a little bit, and then opens it all the way flat."),
      ask("Whose book open turn makes a bigger angle? Think about it!")
    ];
  }
  return [
    emphasize("An angle is a measure of turn!"),
    say("Let us find out what makes an angle big or small!")
  ];
};

// Story Phase Narration
export const playStoryNarration = (panelIdx) => {
  switch (panelIdx) {
    case 0:
      return [
        say("Wei Ming lands in Paris, France."),
        emphasize("The Eiffel Tower's legs lean out, making an angle at the ground.")
      ];
    case 1:
      return [
        say("A small turn from a straight line is called an acute angle."),
        emphasize("It is smaller than a corner!")
      ];
    case 2:
      return [
        say("Wei Ming visits a busy crossroads in New York City."),
        emphasize("The streets meet in a perfect square corner — a right angle, exactly ninety degrees!")
      ];
    case 3:
      return [
        say("Wei Ming opens the door of the Sydney Opera House all the way."),
        emphasize("It opens past a right angle, but is not flat. That is called an obtuse angle!")
      ];
    case 4:
      return [
        say("Wei Ming looks at the flat desert horizon near the Pyramids of Giza."),
        emphasize("A perfectly flat line is a straight angle, one hundred eighty degrees.")
      ];
    case 5:
      return [
        say("Wei Ming spins all the way around in a circle under the Tokyo lights."),
        emphasize("A full turn is three hundred sixty degrees!")
      ];
    default:
      return [];
  }
};

// Simulate Phase Narration
export const playSimulateNarration = (stationIdx) => {
  switch (stationIdx) {
    case 0:
      return [
        instruct("Station A: Angle Maker!"),
        say("Drag the ray to match the target angle type or degrees. See how it opens and closes!")
      ];
    case 1:
      return [
        instruct("Station B: Protractor Detective!"),
        say("Drag and rotate the protractor to align with the bottom line. Then read the angle scale and type the number!")
      ];
    case 2:
      return [
        instruct("Station C: Angle Sums!"),
        say("Solve the missing angle equations. Remember: straight lines make one hundred eighty degrees, and a full turn makes three hundred sixty degrees!")
      ];
    default:
      return [];
  }
};

// Play Phase Narration
export const playWorldIntro = (worldName) => [
  cheer(`Welcome to ${worldName}!`),
  say("Let us search for the hidden angles at this historic landmark.")
];

export const playReadQuestion = (questionText) => [
  ask(questionText)
];

export const playCorrectNarration = (streak) => {
  if (streak >= 10) return [celebrate("Amazing! Ten correct in a row! You are unstoppable!")];
  if (streak >= 5) return [cheer(`Fantastic! Five streak! Keep going!`)];
  
  const choices = [
    celebrate("Excellent! That is correct!"),
    cheer("Correct! Spot on!"),
    cheer("Great job! You got it!")
  ];
  return [choices[Math.floor(Math.random() * choices.length)]];
};

export const playWrongNarration = () => [
  think("Not quite. Let us look closely at the math helper and try again!")
];

export const playWorldComplete = (worldName, score, total) => {
  if (score === total) {
    return [celebrate(`Incredible! Perfect score at the ${worldName}! You earned three stars!`)];
  }
  if (score >= 7) {
    return [cheer(`Great job completing the ${worldName}! You earned two stars!`)];
  }
  return [say(`You finished the ${worldName}! Keep practicing to earn more stars!`)];
};

// Reflect Phase Narration
export const playReflectIntro = () => [
  say("Great job exploring angles around the world! Now, let us teach our mascot what we learned.")
];

export const playReflectCorrect = () => [
  celebrate("Exactly! You are a wonderful teacher!")
];

export const playReflectWrong = () => [
  think("Almost! Think about how an angle measures a turn.")
];

export const playReflectConfidence = () => [
  ask("How confident do you feel about identifying and measuring angles now?")
];

export const playReflectCertificate = (pct) => [
  celebrate("Congratulations! You have completed the entire journey!"),
  say(`You scored ${pct} percent correct. You are now a certified Geometry Globe Explorer!`)
];
