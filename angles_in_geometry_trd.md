# Technical Requirements Document (TRD)

## Angles Using Geometry | Grade 4 Math
### Intellia SG | Global Grade 4 Mathematics Curriculum

═══════════════════════════════════════════════════════════════════════════════

## 1. TECHNICAL OVERVIEW

This document specifies the architecture, component design, state
management, data models, simulation logic, gamification implementation,
audio pipeline, and quality standards for the **"Angles Using Geometry"**
interactive lesson module within Intellia SG's Grade 4 Math program.

The module is a **React 18 application (Vite + JSX)**, structured
identically to the reference repository **https://github.com/dsamyak/equal**,
and styled to match **https://equal-tau.vercel.app/**. It will be embedded
at:

`https://intelliasg.com/courses/grade-4-math/lessons/angles-in-geometry/`

Audio narration uses **ElevenLabs exclusively** (no browser Web Speech API
fallback), mirroring the pipeline from the **Number Bonds Audio & Narration
Pipeline** document, adapted for this lesson's scripts.

═══════════════════════════════════════════════════════════════════════════════

## 2. TECHNOLOGY STACK

| Layer | Technology | Rationale |
|---|---|---|
| UI Framework | React 18 (JSX, Vite) | Matches `equal` repo structure |
| State Management | `useState` + `useReducer` | Sufficient for single-module complexity |
| Styling | CSS Modules + Tailwind | Matches existing repo CSS approach |
| Icons | Lucide React | Available in artifact environment |
| Animation | CSS keyframes + transitions | No external dependency needed |
| SVG Diagrams | Inline SVG (React) | For angle/protractor diagrams |
| Persistence | localStorage | Session state, no backend needed |
| Audio (Primary) | ElevenLabs API | Premium, consistent voice (Alice) |
| Audio (Playback) | HTML5 Audio API (`new Audio()`) | Browser-native, no library needed |
| Math | Vanilla JS (trig for ray angles) | No library required |
| Build Tool | Vite | Matches repo (`vite.config.js` present) |

═══════════════════════════════════════════════════════════════════════════════

## 3. PROJECT STRUCTURE (mirrors `equal` repo)

```
angles-in-geometry/
├── public/
│   ├── assets/
│   │   ├── audio/                     # Pre-generated .mp3 files (ElevenLabs)
│   │   │   ├── audio_wonder_hook_0.mp3
│   │   │   ├── audio_story_panel1_0.mp3
│   │   │   ├── audio_story_panel2_0.mp3
│   │   │   ├── audio_story_panel3_0.mp3
│   │   │   ├── audio_story_panel4_0.mp3
│   │   │   ├── audio_story_panel5_0.mp3
│   │   │   ├── audio_story_panel6_0.mp3
│   │   │   ├── audio_station_a_instruction_0.mp3
│   │   │   ├── audio_station_b_instruction_0.mp3
│   │   │   ├── audio_station_c_instruction_0.mp3
│   │   │   ├── audio_correct_0.mp3
│   │   │   ├── audio_reflect_prompt_0.mp3
│   │   │   └── ... (all phase phrases pre-generated)
│   │   └── images/
│   │       ├── mascot-idle.svg
│   │       ├── mascot-happy.svg
│   │       ├── mascot-thinking.svg
│   │       ├── mascot-celebrate.svg
│   │       └── world-map-bg.svg          # stylized globe/passport map
├── src/
│   ├── main.jsx                          # React entry point
│   ├── App.jsx                           # Root component, global state (useReducer)
│   ├── App.css                           # Global styles (mirrors equal repo CSS)
│   ├── components/
│   │   ├── IntroScreen.jsx               # Welcome + lesson overview + phase dot tracker
│   │   ├── ProgressMap.jsx                # 5-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx           # Phase 1: Hook animation + ElevenLabs narration
│   │   │   ├── StoryPhase.jsx            # Phase 2: Illustrated world-tour narrative panels
│   │   │   ├── SimulatePhase.jsx         # Phase 3: Simulation station wrapper
│   │   │   ├── PlayPhase.jsx             # Phase 4: IntelliPlay™ quiz engine
│   │   │   └── ReflectPhase.jsx          # Phase 5: Journal + completion badge
│   │   ├── simulations/
│   │   │   ├── AngleMakerStation.jsx     # Station A: Drag ray to build angle types
│   │   │   ├── ProtractorStation.jsx     # Station B: Virtual protractor reading
│   │   │   └── AngleSumStation.jsx       # Station C: Fill missing-angle equations
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx      # Polymorphic dispatcher → type-specific component
│   │   │   ├── ClassifyAngleQ.jsx        # Q1: Classify angle from picture
│   │   │   ├── ReadProtractorQ.jsx       # Q2: Read protractor diagram
│   │   │   ├── EstimateAngleQ.jsx        # Q3: Estimate angle size (MCQ)
│   │   │   ├── FillStraightLineQ.jsx     # Q4: Fill blank — straight line sum
│   │   │   ├── FillAroundPointQ.jsx      # Q5: Fill blank — around-a-point sum
│   │   │   ├── CompareAnglesQ.jsx        # Q6: Which angle is bigger?
│   │   │   ├── WordProblemQ.jsx          # Q7: Real-world angle word problem
│   │   │   ├── TrueFalseAngleQ.jsx       # Q8: True/False — angle fact
│   │   │   ├── SpotAngleMCQ.jsx          # Q9: Which picture shows [type] angle?
│   │   │   ├── LandmarkClockQ.jsx        # Q10: Landmark/clock angle problem
│   │   │   └── HintOverlay.jsx           # Hint 1 & 2 + animated explanation after 3 fails
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx             # XP bar + floating XP animation
│   │   │   ├── StarRating.jsx            # 1–3 star rating per world
│   │   │   ├── BadgePanel.jsx            # Badge unlock toast + panel
│   │   │   ├── StreakCounter.jsx         # Fire streak counter
│   │   │   ├── PassportStamps.jsx        # Global-explorer passport stamp collection
│   │   │   └── WorldMap.jsx              # 10-world (landmark) progress map
│   │   └── shared/
│   │       ├── Mascot.jsx                # LearnFlow robot with mood states
│   │       ├── AngleDiagram.jsx          # Reusable SVG: two rays + vertex + arc
│   │       ├── ProtractorOverlay.jsx     # Reusable SVG: draggable protractor scale
│   │       ├── RayHandle.jsx             # Draggable ray endpoint (Station A)
│   │       ├── NumberPad.jsx             # Large tap-friendly digit input (0–9)
│   │       └── FeedbackOverlay.jsx       # Correct/incorrect overlay with animation
│   ├── data/
│   │   ├── questionBank.js               # 100 question objects (all types)
│   │   └── storyContent.js               # Story phase panel data (text + visuals)
│   ├── hooks/
│   │   ├── useAudio.js                   # ElevenLabs + HTML5 Audio playback hook
│   │   ├── useGameState.js               # Gamification state hook
│   │   └── useLocalStorage.js            # Session persistence hook (24hr resume)
│   └── utils/
│       ├── audioMap.js                   # AUTO-GENERATED: text → .mp3 path map
│       ├── shuffle.js                    # Fisher-Yates randomisation
│       ├── angleMath.js                  # Ray-drag → degree calculation, arc geometry
│       ├── scoring.js                    # XP + star calculation + distractor gen
│       └── badgeEngine.js                # Badge unlock condition logic
├── scripts/
│   ├── generate_audio.js                 # Offline ElevenLabs audio pre-generation
│   └── clean_audio.js                    # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                     # ElevenLabs proxy (if server-side key needed)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

═══════════════════════════════════════════════════════════════════════════════

## 4. APPLICATION STATE ARCHITECTURE

### 4.1 Global State (`App.jsx` — `useReducer`)

```javascript
const initialState = {
  // Navigation
  phase: 'intro',            // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,              // 0–5 (6 story panels)
  currentSimStation: 0,        // 0=AngleMaker, 1=Protractor, 2=AngleSum
  simStationsComplete: [false, false, false],
  simRound: 0,                 // Round index within current station (0–3)

  // Play / Challenge phase
  questionSet: [],             // 100 shuffled Question objects
  currentQuestion: 0,          // 0–99
  currentWorld: 0,              // 0–9 (10 worlds / landmarks)
  worldScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,              // Attempts on current question (max 3)

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],                   // Array of unlocked badge IDs
  passportStamps: [],           // Array of unlocked landmark stamp IDs
  stationBPerfect: false,
  wordProblemCorrect: 0,

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,           // ElevenLabs narration on/off
  musicEnabled: false,          // Background ambient music (off by default)
};
```

### 4.2 Reducer Action Types

```javascript
const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  UNLOCK_STAMP: 'UNLOCK_STAMP',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic

```javascript
// ANSWER_CORRECT dispatch
case ACTIONS.ANSWER_CORRECT: {
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
  const newStreak = state.streak + 1;
  const worldIndex = Math.floor(state.currentQuestion / 10);
  const newWorldScore = (state.worldScores[worldIndex] || 0) + 1;
  const updatedWorldScores = [...state.worldScores];
  updatedWorldScores[worldIndex] = newWorldScore;

  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    worldScores: updatedWorldScores,
    totalStars: calcTotalStars(updatedWorldScores),
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_INCORRECT dispatch
case ACTIONS.ANSWER_INCORRECT: {
  return {
    ...state,
    streak: 0,
    attemptCount: state.attemptCount + 1,
  };
}
```

═══════════════════════════════════════════════════════════════════════════════

## 5. QUESTION DATA MODEL

### 5.1 Question Schema

```typescript
interface Question {
  id: string;                 // e.g. "Q1_003", "Q7_008"
  type: QuestionType;         // One of 10 enum values (see below)
  world: number;               // 0–9 (which landmark world this belongs to)
  difficulty: 1 | 2 | 3;       // 1=easy(0-90°), 2=medium(90-180°), 3=hard(180-360°)

  // Core geometry values
  angleDegrees: number;         // The angle in question (0–360)
  angleType: 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex';
  missingSlot: 'angleDegrees' | 'otherAngle' | 'angleType';

  // For angle-sum questions
  knownAngles?: number[];       // e.g. [65, 90] for a 3-angle straight line
  sumTarget?: 180 | 360;

  // Rendering
  questionText: string;         // Full narrated question text (ElevenLabs reads this)
  visual: VisualType;            // 'angleDiagram' | 'protractor' | 'picture' | 'trueFalse'
  showProtractorOverlay?: boolean;

  // MCQ
  options?: (number|string)[];  // 4 MCQ options (always includes correctAnswer)

  // Hints
  hint1: string;                 // Shown after 1 wrong attempt
  hint2: string;                 // Shown after 2 wrong attempts (animation trigger)
  explanation: string;            // Full text explanation after 3 fails (read aloud)

  // Word problems only
  characterName?: string;
  objectName?: string;           // 'laptop lid', 'door', 'book', 'kite string'
  landmarkName?: string;

  // True/False only
  isTrue?: boolean;

  // Answer
  correctAnswer: number | string;
}

type QuestionType =
  | 'classify_angle'       // Q1: Classify angle from picture
  | 'read_protractor'      // Q2: Read protractor diagram
  | 'estimate_angle'       // Q3: Estimate angle size (MCQ)
  | 'fill_straight_line'   // Q4: Angles on straight line = 180°
  | 'fill_around_point'    // Q5: Angles around a point = 360°
  | 'compare_angles'       // Q6: Which angle is bigger?
  | 'word_problem'         // Q7: Real-world angle word problem
  | 'true_false_angle'     // Q8: True/False angle fact
  | 'spot_angle_mcq'       // Q9: Which picture shows [type] angle?
  | 'landmark_clock';      // Q10: Landmark/clock angle problem

type VisualType =
  | 'angleDiagram'   // SVG rays + vertex + arc (AngleDiagram)
  | 'protractor'     // SVG rays + protractor overlay (ProtractorOverlay)
  | 'picture'        // Static illustrated scene (door, clock, landmark)
  | 'trueFalse';     // Statement + True/False buttons
```

### 5.2 Sample Question Objects

```javascript
// Q1 — Classify Angle
{
  id: "Q1_001",
  type: "classify_angle",
  world: 0,
  difficulty: 1,
  angleDegrees: 40,
  angleType: "acute",
  missingSlot: "angleType",
  questionText: "Look at this angle. Is it acute, right, obtuse, straight, or reflex?",
  visual: "angleDiagram",
  hint1: "An acute angle is smaller than a right angle (less than 90°).",
  hint2: "This angle looks like a narrow, sharp wedge — smaller than a square corner.",
  explanation: "This angle is 40°, which is less than 90°, so it is acute.",
  options: ["acute", "right", "obtuse", "straight"],
  correctAnswer: "acute",
}

// Q4 — Fill Blank: Straight Line Sum
{
  id: "Q4_003",
  type: "fill_straight_line",
  world: 3,
  difficulty: 2,
  angleDegrees: 115,
  knownAngles: [115],
  sumTarget: 180,
  missingSlot: "otherAngle",
  questionText: "Two angles sit on a straight line. One angle is 115 degrees. What is the other angle?",
  visual: "angleDiagram",
  hint1: "Angles on a straight line always add up to 180 degrees.",
  hint2: "180 minus 115. Count with me: 180 take away 115 equals...?",
  explanation: "180° − 115° = 65°. The other angle is 65 degrees.",
  options: [55, 60, 65, 75],
  correctAnswer: 65,
}

// Q7 — Word Problem
{
  id: "Q7_004",
  type: "word_problem",
  world: 6,
  difficulty: 2,
  angleDegrees: 110,
  angleType: "obtuse",
  missingSlot: "angleType",
  questionText: "John opens his laptop lid to about 110 degrees. Is that acute, right, or obtuse?",
  visual: "picture",
  characterName: "John",
  objectName: "laptop lid",
  hint1: "A right angle is exactly 90 degrees. Is 110 more or less than that?",
  hint2: "110 is more than 90, so it's bigger than a right angle — but not flat.",
  explanation: "110° is more than 90° but less than 180°, so it is an obtuse angle.",
  options: ["acute", "right", "obtuse", "straight"],
  correctAnswer: "obtuse",
}

// Q10 — Landmark/Clock Angle
{
  id: "Q10_005",
  type: "landmark_clock",
  world: 7,
  difficulty: 2,
  angleDegrees: 90,
  angleType: "right",
  missingSlot: "angleType",
  questionText: "At Big Ben in London, the clock shows 3 o'clock. What type of angle do the two hands make?",
  visual: "picture",
  landmarkName: "Big Ben, London",
  hint1: "Picture the hands: one points straight up, one points straight to the side.",
  hint2: "That makes a perfect square corner — like the corner of a book.",
  explanation: "At 3 o'clock, the hands form a right angle — exactly 90°.",
  options: ["acute", "right", "obtuse", "straight"],
  correctAnswer: "right",
}
```

═══════════════════════════════════════════════════════════════════════════════

## 6. ANGLE DIAGRAM SVG COMPONENT

```javascript
// AngleDiagram.jsx — reusable SVG for two rays + vertex + arc
const ANGLE_COLORS = {
  acute: '#4CAF50',
  right: '#4A90D9',
  obtuse: '#FF9800',
  straight: '#9C27B0',
  reflex: '#E53935',
};

const AngleDiagram = ({
  degrees,
  angleType,
  missingSlot,
  showProtractor = false,
  animated = false,
  size = 'medium',            // 'small' | 'medium' | 'large'
}) => {
  const radius = size === 'large' ? 140 : size === 'medium' ? 100 : 70;
  const cx = radius + 20;
  const cy = radius + 20;
  const svgSize = radius * 2 + 40;

  // Baseline ray fixed at 0°; second ray rotated by `degrees`
  const rad = (degrees * Math.PI) / 180;
  const x2 = cx + radius * Math.cos(-rad);
  const y2 = cy + radius * Math.sin(-rad);

  // Arc path (for arc < 180°, simple; reflex handled with large-arc-flag)
  const largeArcFlag = degrees > 180 ? 1 : 0;
  const arcRadius = radius * 0.35;
  const arcX = cx + arcRadius;
  const arcY = cy;
  const arcEndX = cx + arcRadius * Math.cos(-rad);
  const arcEndY = cy + arcRadius * Math.sin(-rad);

  const color = ANGLE_COLORS[angleType] || '#4A90D9';

  return (
    <svg viewBox={`0 0 ${svgSize} ${svgSize}`}
         xmlns="http://www.w3.org/2000/svg"
         style={{ maxWidth: '100%', height: 'auto' }}>
      {/* Baseline ray (0°) */}
      <line x1={cx} y1={cy} x2={cx + radius} y2={cy}
            stroke="#333" strokeWidth="3" />
      {/* Second ray (rotated) */}
      <line x1={cx} y1={cy} x2={x2} y2={y2}
            stroke="#333" strokeWidth="3"
            className={animated ? 'ray-sweep' : ''} />
      {/* Arc wedge (angle fill) */}
      <path d={`M ${cx} ${cy} L ${arcX} ${arcY}
                A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY} Z`}
            fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
      {/* Right-angle square marker (only if exactly 90°) */}
      {angleType === 'right' && (
        <rect x={cx} y={cy - 14} width="14" height="14"
              fill="none" stroke={color} strokeWidth="2" />
      )}
      {/* Vertex dot */}
      <circle cx={cx} cy={cy} r="4" fill="#333" />
      {/* Degree label at arc midpoint */}
      <text x={cx + arcRadius * 1.6 * Math.cos(-rad / 2)}
            y={cy + arcRadius * 1.6 * Math.sin(-rad / 2)}
            textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
        {missingSlot === 'angleDegrees' ? '?' : `${degrees}°`}
      </text>
      {/* Optional protractor overlay */}
      {showProtractor && (
        <ProtractorOverlay cx={cx} cy={cy} radius={radius} />
      )}
    </svg>
  );
};
```

**Animation variants:**
- `animated=true` → CSS `raySweep` keyframe: second ray rotates in from 0°
  to target degrees over 600ms
- `shake` variant → CSS `shake` keyframe applied to `<svg>` wrapper on wrong answer
- `bounce` variant → CSS `bounceIn` keyframe applied to `<svg>` wrapper on correct answer

═══════════════════════════════════════════════════════════════════════════════

## 7. SIMULATION STATION COMPONENT SPECS

### 7.1 `AngleMakerStation.jsx` — Station A (Concrete)

**State:**
```javascript
const [target, setTarget] = useState(getStationARound(state.simRound));
// target: { requestedType: 'acute', exactDegrees: null, tolerance: null }
// or for right/straight rounds: { requestedType: 'right', exactDegrees: 90, tolerance: 5 }

const [currentDegrees, setCurrentDegrees] = useState(45); // live drag value
const [isDragging, setIsDragging] = useState(false);
```

**Interaction (Drag):**
- `RayHandle` renders a draggable circular handle at the end of the moving ray
- `onPointerMove` recalculates angle via `Math.atan2(dy, dx)` relative to vertex,
  clamped to 0°–360°, updates `currentDegrees` in real time
- Live arc fill and degree readout (optional, hidden pre-submit for type-only rounds)

**Interaction (Tap fallback):**
- Stepper buttons: `−5°` / `+5°` / `−1°` / `+1°`, updates `currentDegrees` directly

**Completion Check:**
```javascript
function checkAngleMaker(currentDegrees, target) {
  const type = classifyAngle(currentDegrees); // acute|right|obtuse|straight|reflex
  if (target.exactDegrees !== null) {
    return Math.abs(currentDegrees - target.exactDegrees) <= target.tolerance;
  }
  return type === target.requestedType;
}
```
- On submit correct: mascot celebrates, ElevenLabs plays celebration audio
- On submit incorrect: shake + narration "Hmm, that one looks [bigger/smaller]. Try again!"

**Station A Rounds (4 rounds, randomised order):**
```javascript
{ requestedType: 'acute',    exactDegrees: null, tolerance: null }
{ requestedType: 'obtuse',   exactDegrees: null, tolerance: null }
{ requestedType: 'right',    exactDegrees: 90,   tolerance: 5 }
{ requestedType: 'straight', exactDegrees: 180,  tolerance: 5 }
```

### 7.2 `ProtractorStation.jsx` — Station B (Pictorial → Abstract)

**State:**
```javascript
const [angle, setAngle] = useState(getProtractorRound(round));
// angle: { degrees: 65, rotationOffset: 0, type: 'acute' }
const [protractorRotation, setProtractorRotation] = useState(0);
const [protractorAligned, setProtractorAligned] = useState(false);
const [inputValue, setInputValue] = useState('');
```

**Alignment logic:**
- `ProtractorOverlay` is draggable/rotatable; snaps to baseline (±3°) when close,
  setting `protractorAligned = true` and enabling the reading step
- Reading is computed as `angle.degrees` once aligned (ground truth), compared
  against student's typed `inputValue` on submit, tolerance ±5°

**Rounds (3 rounds per station):**
- Round 1: Angle pre-aligned to gridlines (30°, 60°, 90°) — easy read
- Round 2: Angle tilted, requires protractor rotation — medium
- Round 3: Reflex-adjacent angle (150°–175°) — hard, careful reading required

### 7.3 `AngleSumStation.jsx` — Station C (Abstract)

**State:**
```javascript
const [problem, setProblem] = useState(getSumProblem(state.simRound));
// problem: { knownAngles: [65], sumTarget: 180, missingIndex: 1 }
const [inputValue, setInputValue] = useState('');
const [showDiagram, setShowDiagram] = useState(false);
```

**Layout:**
```jsx
<div class="sum-equation-row">
  {problem.knownAngles.map((deg, i) => (
    i === problem.missingIndex
      ? <BlankInput key={i} value={inputValue} />
      : <span key={i} class="given-value">{deg}°</span>
  ))}
  <span class="equals">=</span>
  <span class="given-value">{problem.sumTarget}°</span>
</div>
<NumberPad max={360} value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} />
<button onClick={() => setShowDiagram(!showDiagram)}>Show me the angles 📐</button>
{showDiagram && <AngleDiagram degrees={...} missingSlot={...} animated />}
```

**Variants (rotated across 3 rounds):**
- Round 1: Two angles on a straight line, find the missing one (sum = 180°)
- Round 2: Three angles on a straight line, find the missing one (sum = 180°)
- Round 3: Angles around a point, find the missing one (sum = 360°)

ElevenLabs reads the full equation aloud when displayed:
"One hundred fifteen degrees plus what equals one hundred eighty degrees?"

═══════════════════════════════════════════════════════════════════════════════

## 8. AUDIO PIPELINE (ElevenLabs — Matching Source Architecture)

### 8.1 Voice Configuration

- Voice Name: **Alice**
- Voice ID: `Xb7hH8MSUJpSbSDYk0k2`
- Model: `eleven_multilingual_v2`
- API Key Var: `VITE_ELEVENLABS_API_KEY` (in `.env.local`)

### 8.2 Speech Style Settings (per style type)

*(identical to the "Number Bonds Audio & Narration Pipeline" table)*

| Style | Stability | Similarity Boost | Style | Speaker Boost |
|---|---|---|---|---|
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ |
| `question` | 0.20 | 0.55 | 0.55 | ✅ |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ |

### 8.3 Offline Pre-generation Script (`scripts/generate_audio.js`)

```javascript
const phrases = [
  // Phase 1 — Wonder
  { text: "Sarah opens her book just a little bit. Then Mike opens his book all the way flat.", style: 'thinking' },
  { text: "Whose book makes a bigger angle?", style: 'question' },
  { text: "Let's find out what makes an angle big or small!", style: 'encouragement' },

  // Phase 2 — Story Panels
  { text: "John lands in Paris. The Eiffel Tower's legs lean out, making an angle at the ground.", style: 'statement' },
  { text: "A small turn from a straight line is called an acute angle.", style: 'emphasis' },
  { text: "Sarah visits a crossroads in New York. The streets meet in a perfect square corner — a right angle, exactly ninety degrees!", style: 'statement' },
  { text: "Mike opens the door of the Sydney Opera House all the way — past a right angle but not flat. That's an obtuse angle!", style: 'statement' },
  { text: "Priya looks at the flat desert horizon near the Pyramids — a perfectly flat line is a straight angle, one hundred eighty degrees.", style: 'statement' },
  { text: "Yuki spins all the way around in Tokyo — a full turn is three hundred sixty degrees!", style: 'emphasis' },

  // Phase 3 — Simulation Instructions
  { text: "Drag the ray around the vertex. Make an acute angle!", style: 'instruction' },
  { text: "Make sure it looks smaller than a right angle. Can you do it?", style: 'question' },
  { text: "Line up the protractor with the vertex and the baseline. Then read the angle!", style: 'instruction' },
  { text: "Now fill in the missing angle. One hundred fifteen degrees plus what equals one hundred eighty degrees?", style: 'question' },

  // Phase 4 — Feedback
  { text: "Yes! Perfect angle work! You are a geometry superstar!", style: 'celebration' },
  { text: "Not quite! Let's look at the angle again.", style: 'encouragement' },
  { text: "Watch the protractor line up. Can you read it with me?", style: 'thinking' },

  // Phase 5 — Reflect
  { text: "What a journey around the world today! Can you find one angle in your room right now?", style: 'thinking' },
  { text: "Lesson complete! You are a Geometry Champion!", style: 'celebration' },

  // Badge unlocks
  { text: "Badge unlocked! You are an Angle Explorer!", style: 'celebration' },
  { text: "Badge unlocked! Angle Builder! You completed all three stations!", style: 'celebration' },
  { text: "Badge unlocked! Geometry Champion! You scored over eighty percent!", style: 'celebration' },
  { text: "Badge unlocked! World Traveler! You visited every landmark!", style: 'celebration' },
];
// Script hits ElevenLabs API for each phrase, saves to public/assets/audio/
// Auto-generates src/utils/audioMap.js mapping text → .mp3 path
```

### 8.4 Frontend Audio Engine (`src/hooks/useAudio.js`)

```javascript
// Step 1: Check audioMap for pre-generated static asset
// Step 2: If not found + API key present → fetch from ElevenLabs dynamically
// Step 3: Cache dynamic result in elevenLabsCache (in-memory Map)
// Step 4: Play via HTML5 Audio API (new Audio(url))
// Step 5: While segment i plays → preload segment i+1 (eager preload)

const elevenLabsCache = new Map(); // In-memory; cleared on page refresh

export async function getAudioUrl(text, style = 'statement', apiKey) {
  // 1. Static map check (fastest path)
  if (audioMap[text]) return audioMap[text];

  // 2. Memory cache check
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  // 3. Dynamic generation (requires API key)
  if (!apiKey) return null; // Silent skip — no fallback

  const styleSettings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: styleSettings,
      }),
    }
  );
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  elevenLabsCache.set(cacheKey, url);
  return url;
}

export async function narrate(segments, apiKey, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style, apiKey);
    if (!url) continue; // Silent skip if no audio available

    // Eager preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style, apiKey);
    }
    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url); // Resolves on 'ended' event
  }
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve; // Silent fail — never block UX
    audio.play().catch(resolve);
  });
}
```

### 8.5 Audio Cleanup (`scripts/clean_audio.js`)

- Imports `audioMap.js` to determine all valid referenced `.mp3` paths
- Scans `public/assets/audio/` for all `.mp3` files
- Deletes any `.mp3` not present in `audioMap` (orphaned files)
- Run after any phrase deletion or text edit in `generate_audio.js`

### 8.6 Content Policy & Narration Rules

- Audio is generated **ONLY** for paragraph text and questions — never
  titles, headings, or section labels
- **1:1 Strict Parity Rule:** every on-screen narrated string must match
  `narration.js` exactly (same words, punctuation, capitalisation). Any UI
  text change requires: (1) update `generate_audio.js` phrases array,
  (2) re-run `node scripts/generate_audio.js`, (3) update the corresponding
  React UI text, (4) optionally run `node scripts/clean_audio.js`
- Rate-limits at 500ms between API calls during generation

═══════════════════════════════════════════════════════════════════════════════

## 9. RANDOMISATION ENGINE

### 9.1 Fisher-Yates Shuffle (`utils/shuffle.js`)

```javascript
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  // Pick 10 from each type (shuffled), then shuffle the combined 100
  const selected = Object.values(byType)
    .flatMap(qs => shuffleArray(qs).slice(0, 10));
  return shuffleArray(selected);
}
```

### 9.2 Angle Classification & Distractor Generation (`utils/angleMath.js`, `utils/scoring.js`)

```javascript
export function classifyAngle(degrees) {
  if (degrees < 90) return 'acute';
  if (degrees === 90) return 'right';
  if (degrees < 180) return 'obtuse';
  if (degrees === 180) return 'straight';
  return 'reflex';
}

export function generateDegreeDistractors(correct, min = 0, max = 360, count = 3) {
  const distractors = new Set();
  // Strategy: offsets of ±5, ±10, ±15 — plausible near-miss degree readings
  const offsets = [-15, -10, -5, 5, 10, 15];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d >= min && d <= max && d !== correct && distractors.size < count)
      distractors.add(d);
  });
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1) * 5;
    if (d <= max && d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...distractors]);
}

export function generateTypeDistractors(correctType) {
  const ALL_TYPES = ['acute', 'right', 'obtuse', 'straight', 'reflex'];
  const others = shuffleArray(ALL_TYPES.filter(t => t !== correctType)).slice(0, 3);
  return shuffleArray([correctType, ...others]);
}
```

### 9.3 Session Persistence (24-hour resume)

```javascript
const SESSION_KEY = 'intellia_angles_geo_v1';

// On app mount: restore if within 24 hours
const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (saved && Date.now() - saved.timestamp < 86400000) {
  dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
}

// On every state change: persist progress
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phase: state.phase,
    storyPanel: state.storyPanel,
    simStationsComplete: state.simStationsComplete,
    currentQuestion: state.currentQuestion,
    xp: state.xp,
    streak: state.streak,
    maxStreak: state.maxStreak,
    badges: state.badges,
    passportStamps: state.passportStamps,
    worldScores: state.worldScores,
    phaseComplete: state.phaseComplete,
    timestamp: Date.now(),
  }));
}, [state]);
```

═══════════════════════════════════════════════════════════════════════════════

## 10. GAMIFICATION IMPLEMENTATION

### 10.1 XP Calculation (`utils/scoring.js`)

```javascript
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
```

### 10.2 Star Rating (per world of 10 questions)

```javascript
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3; // Gold: ≥90%
  if (correct >= 7) return 2; // Silver: ≥70%
  if (correct >= 5) return 1; // Bronze: ≥50% (world unlock gate)
  return 0; // Try again
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}
```

### 10.3 Badge Engine (`utils/badgeEngine.js`)

```javascript
export const BADGES = [
  {
    id: 'angle_explorer',
    label: '🏅 Angle Explorer',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'angle_builder',
    label: '🥈 Angle Builder',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'geometry_champion',
    label: '🥇 Geometry Champion',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_protractor',
    label: '💎 Perfect Protractor',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_eye',
    label: '🎯 Sharp Eye',
    description: 'Complete Station B without any wrong reading',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'world_traveler',
    label: '🌍 World Traveler',
    description: 'Complete all 10 landmark worlds',
    condition: (s) => s.worldScores.every(ws => ws !== null && ws >= 5),
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

// Call after every state update that could unlock a badge:
const newBadges = checkBadges(newState);
if (newBadges.length > 0) {
  dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: newBadges });
  newBadges.forEach(id => {
    const badge = BADGES.find(b => b.id === id);
    narrate([{ text: badge.description, style: 'celebration' }], apiKey);
  });
}
```

═══════════════════════════════════════════════════════════════════════════════

## 11. CSS ANIMATION KEYFRAMES (matching equal-tau.vercel.app style)

```css
@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(74, 144, 217, 0); }
}

@keyframes celebrate {
  0% { transform: rotate(-5deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.1); }
  50% { transform: rotate(-3deg) scale(1.05); }
  75% { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes raySweep {
  /* Applied to the moving ray on diagram entry — rotates from 0° to target */
  from { transform: rotate(0deg); }
  to { transform: rotate(var(--target-degrees)); }
}

@keyframes arcFillIn {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 0.25; transform: scale(1); }
}
```

═══════════════════════════════════════════════════════════════════════════════

## 12. COMPONENT PROP CONTRACTS

| Component | Props | Returns |
|---|---|---|
| `AngleDiagram` | `{ degrees, angleType, missingSlot?, showProtractor?, animated?, size? }` | SVG element (inline, responsive) |
| `ProtractorOverlay` | `{ cx, cy, radius, rotation, onRotate?, aligned? }` | Draggable semi-transparent protractor SVG |
| `RayHandle` | `{ cx, cy, radius, degrees, onDrag }` | Draggable ray-endpoint handle |
| `NumberPad` | `{ max, value, onChange, onSubmit }` | Grid of digit buttons (min 44×44px), backspace, submit |
| `Mascot` | `{ mood: 'idle'|'happy'|'thinking'|'celebrating'|'encouraging' }` | img/svg + CSS animation class mapped to mood |
| `QuestionRenderer` | `{ question: Question, onAnswer: (answer) => void, hints: number }` | Type-specific question component |
| `FeedbackOverlay` | `{ isCorrect: boolean, explanation?: string, xpEarned: number, onContinue: () => void }` | Animated modal overlay (bounceIn correct / shake wrong) |
| `WorldMap` | `{ worldScores: (number|null)[], currentWorld: number, onSelectWorld: (i) => void }` | Horizontal scrollable landmark-world list with star ratings and lock icons |
| `BadgePanel` | `{ badges: string[], newBadgeId?: string }` | Badge grid with unlock toast animation for `newBadgeId` |
| `PassportStamps` | `{ stamps: string[] }` | Grid of collected landmark passport stamp icons |

═══════════════════════════════════════════════════════════════════════════════

## 13. PERFORMANCE REQUIREMENTS

| Metric | Target |
|---|---|
| Initial load time | < 2 seconds (Vite production build) |
| Time to first meaningful paint | < 1 second |
| SVG/drag animation frame rate | 60 fps |
| Memory usage | < 60 MB |
| Bundle size (gzipped) | < 600 KB |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 90 |
| ElevenLabs pre-gen audio TTFB | 0ms (static .mp3 assets) |
| ElevenLabs dynamic audio TTFB | < 2 seconds (API latency) |
| Protractor drag responsiveness | < 16ms per pointer-move frame |

═══════════════════════════════════════════════════════════════════════════════

## 14. BROWSER & DEVICE SUPPORT

| Environment | Support Level |
|---|---|
| Chrome 110+ (desktop) | Full |
| Safari 15+ (iPad) | Full — primary classroom device |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Android Chrome | Full |
| iOS Safari 15+ | Full |
| IE 11 | Not supported |

Primary test device: iPad (768px, touch) — classroom use context, since
Stations A & B rely on drag interactions.
Secondary: Desktop Chrome (1280px+), with mouse-drag equivalence and
keyboard/stepper-button fallback for all drag interactions.

═══════════════════════════════════════════════════════════════════════════════

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 4 Math, Angles Using Geometry
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`)
