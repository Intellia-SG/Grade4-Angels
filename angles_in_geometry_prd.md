# Product Requirements Document (PRD)

## Angles Using Geometry | Grade 4 Math
### Intellia SG | Global Grade 4 Mathematics Curriculum (Common Core / CBSE / Cambridge-aligned)

═══════════════════════════════════════════════════════════════════════════════

## 1. EXECUTIVE SUMMARY

This document defines product requirements for the **"Angles Using Geometry"**
interactive lesson module, delivered within Intellia SG's **Grade 4 Math** program.
The module targets Grade 4 students aged 9–10 across a **global classroom
audience** and introduces angles — naming, classifying, measuring, and
relating angles to one another — as the concrete-to-abstract bridge into
formal geometric reasoning.

> **Note on source link:** the reference URL supplied
> (`https://intelliasg.com/courses/grade-3-math`) is treated as the parent
> course-catalog page you will upload; this module is scoped for **Grade 4**
> content per your brief and is planned to live at:
> `https://intelliasg.com/courses/grade-4-math/lessons/angles-in-geometry/`
> Please confirm the final slug/grade folder once the upload is live so this
> can be corrected if Grade 3 was in fact intended.

The product is a standalone web page/app, built using **React (Vite + JSX,
JavaScript/CSS)**, designed to **strictly mirror** the visual and UX structure
established at **https://equal-tau.vercel.app/** and its repository
**https://github.com/dsamyak/equal**.

Audio narration uses **ElevenLabs exclusively** (Voice: **Alice**, Voice ID:
`Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`) with pre-generated
static `.mp3` files for all phase narrations and dynamic generation for
practice questions — matching the pipeline documented in the **Number Bonds
Audio & Narration Pipeline** doc you supplied.

The module follows Intellia's 6-stage learner journey:

- Phase 0 — **INTRO** → Welcome screen + 5-phase progress map
- Phase 1 — **WONDER** → Curiosity hook
- Phase 2 — **STORY** → Narrative-based concept introduction (global cast)
- Phase 3 — **SIMULATE** → Sandbox-style interactive simulation (3 stations)
- Phase 4 — **PLAY** → IntelliPlay™ gamified practice (100 randomised questions)
- Phase 5 — **REFLECT** → Journal / LearnFlow AI prompt + completion badge

═══════════════════════════════════════════════════════════════════════════════

## 2. PRODUCT VISION & GOALS

**Vision**
To make angles intuitive, visual, and joyful for 9–10 year old learners
everywhere — building a concrete-pictorial-abstract (CPA) bridge from
"turning" and "corners" toward formal angle measurement and reasoning, via
animated protractor simulations, a globe-trotting story, and adaptive
gamified challenge.

**Goals**

| Goal | Metric |
|---|---|
| Learning Completion | ≥85% of students complete all 5 phases |
| Practice Engagement | ≥90% attempt at least 10 practice questions |
| Score Achievement | Average challenge score ≥75% on first attempt |
| Session Duration | Average engagement ≥15–18 minutes per session |
| Curriculum Alignment | 100% aligned to Grade 4 global geometry standards |
| Phase Progression | ≥80% reach Play phase in a single session |
| Simulation Interaction Rate | ≥95% attempt all 3 simulation stations |
| Protractor Accuracy | ≥80% of measurements within ±5° on first try by end of module |

═══════════════════════════════════════════════════════════════════════════════

## 3. TARGET USERS

**Primary: Grade 4 Students (Age 9–10), Global**

- Comfortable readers; ready for more abstract vocabulary ("vertex", "ray", "degree")
- Learn concretely first (C → P → A: Concrete–Pictorial–Abstract)
- Motivated by exploration and travel/adventure framing
- Names, food, and settings should feel **globally inclusive** — no single
  national context; drawn from many countries/cultures

**Secondary: Parents & Teachers**

- Assign as classwork or enrichment homework
- Expect alignment with major international Grade 4 standards
  (Common Core 4.MD/4.G, Cambridge Primary, CBSE Class 4, Singapore MOE P4)
- Monitor via phase completion indicators embedded in lesson page

═══════════════════════════════════════════════════════════════════════════════

## 4. CURRICULUM ALIGNMENT — Global Grade 4 Geometry

**Topic:** Angles Using Geometry
**Programme:** Intellia SG Grade 4 Math — Geometry & Measurement Strand
**Lesson URL:** `https://intelliasg.com/courses/grade-4-math/lessons/angles-in-geometry/`

**Source References (cross-mapped, global):**

- **Common Core (US)** 4.G.A.1 — draw points, lines, line segments, rays,
  angles; 4.MD.C.5–7 — angle as a geometric figure, measure with a
  protractor, additive angle relationships
- **Cambridge Primary Maths (International)** Stage 4 — identify, describe,
  and estimate the size of angles; compare with a right angle
- **CBSE Class 4 (India)** — types of angles, measuring with a protractor
- **Singapore MOE Primary 4** — angles as amount of turning, right angles,
  angles on a straight line and at a point
- **Australian Curriculum Year 4** — compare angles using informal units,
  identify angle types in the environment

**Learning Objectives Covered (LOs):**

- LO1 Define an angle as the amount of turning between two rays sharing a vertex
- LO2 Identify and name angle parts: vertex, arm/ray
- LO3 Classify angles: acute, right, obtuse, straight, reflex
- LO4 Estimate the size of an angle before measuring
- LO5 Measure angles accurately using a (virtual) protractor
- LO6 Understand angles on a straight line sum to 180°
- LO7 Understand angles around a point sum to 360°
- LO8 Compare angles by size without needing exact measurement
- LO9 Solve simple real-world/word problems involving angles (clocks, doors, ramps, landmarks)
- LO10 Use correct vocabulary: "degree (°)", "vertex", "ray/arm", "acute",
  "right", "obtuse", "straight", "reflex", "protractor"

**CPA Progression for This Lesson:**

- **Concrete** → Physically "opening" a door/book/scissors at different
  amounts of turn (simulated digitally with a draggable ray)
- **Pictorial** → Angle diagrams, arc markings, protractor overlay images
- **Abstract** → Numeric degree values, angle-sum equations
  (e.g. `35° + ___ = 180°`)

**Number/Degree Ranges:**

- Easy: 0°–90° (acute/right), whole 5° or 10° increments
- Medium: 0°–180° (adds obtuse/straight), 5° increments
- Hard: 0°–360° (adds reflex), includes angle-sum and missing-angle problems

**Vocabulary Focus:**
"angle", "vertex", "ray", "arm", "degree (°)", "acute", "right", "obtuse",
"straight", "reflex", "protractor", "turn", "full turn", "half turn",
"quarter turn", "angles on a straight line", "angles around a point"

═══════════════════════════════════════════════════════════════════════════════

## 5. THE 5-PHASE LEARNER JOURNEY (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ INTRO SCREEN → Progress Map (5-step visual tracker, top bar)                │
│ Welcome: "Hi explorer! Today we're going on a world trip to learn Angles!"  │
│ Lesson badge shown (locked). 5 glowing phase dots visible.                  │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 — WONDER (≈ 1–2 min)                                                │
│                                                                              │
│ Hook: "Sarah opens her book just a little bit. Then Mike opens his book    │
│ all the way flat. Whose book makes a BIGGER angle?" 📖                      │
│                                                                              │
│ Visual: Animated book opening from closed → flat, angle arc drawn live     │
│ Narration (ElevenLabs): Alice voice reads the hook warmly                  │
│ → Mascot (LearnFlow robot) appears with a curious expression              │
│ → "Let's find out what makes an angle big or small!"                      │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 — STORY (≈ 2–3 min) — "Around the World with Angles"               │
│                                                                              │
│ Narrative: John, Sarah, Mike, Priya, Yuki, and Carlos are on a virtual      │
│ world-explorer trip, spotting angles hidden in famous landmarks.           │
│                                                                              │
│ Panel 1: "John lands in Paris. The Eiffel Tower's legs lean out, making    │
│ an angle at the ground. Is it a small turn or a big turn?" 🗼               │
│ Panel 2: "A small turn from a straight line is an ACUTE angle." 📐         │
│ Panel 3: "Sarah visits a crossroads in New York. The streets meet in a     │
│ perfect square corner — a RIGHT angle, exactly 90°!" 🏙️                    │
│ Panel 4: "Mike opens the door of the Sydney Opera House all the way —      │
│ past a right angle but not flat. That's an OBTUSE angle!" 🎭                │
│ Panel 5: "Priya lies down and looks at the flat desert horizon near the    │
│ Pyramids — a perfectly flat line is a STRAIGHT angle, 180°." 🏜️            │
│ Panel 6: "Yuki spins all the way around in Tokyo — a FULL turn is a        │
│ REFLEX angle's big cousin: 360°!" 🗾                                        │
│                                                                              │
│ → Illustrated story panels (animated slide-in), ElevenLabs narration       │
│ → Key vocabulary highlighted: "acute", "right", "obtuse", "straight"       │
│ → Angle diagram (arc + degree label) introduced visually at each panel     │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 — SIMULATE (≈ 6–8 min)                                              │
│                                                                              │
│ 3 Interactive Stations — student must complete all 3 to advance            │
│                                                                              │
│ Station A — "The Angle Maker" (Concrete)                                    │
│   Drag one ray around a fixed vertex to build angles of a target type.     │
│                                                                              │
│ Station B — "Protractor Detective" (Pictorial → Abstract)                   │
│   A virtual protractor overlays an angle; student reads and enters degrees.│
│                                                                              │
│ Station C — "Angle Sums" (Abstract)                                         │
│   Complete missing-angle equations for straight-line and around-a-point    │
│   angle sums, with a live diagram scaffold.                                │
│                                                                              │
│ → Mascot reacts to each completed station                                  │
│ → ElevenLabs narrates each station instruction and feedback                │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PLAY (≈ 8–10 min)                                                 │
│                                                                              │
│ IntelliPlay™ Level: 100 randomised questions across 10 worlds              │
│ (each world = a global landmark). 10 questions per world, world unlocks   │
│ at ≥5/10 correct. Stars (1–3), XP, badges, and streak fire counter active. │
│ → Mastery gates the world map; encouragement-first feedback               │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 — REFLECT (≈ 1–2 min)                                               │
│                                                                              │
│ Journal prompt: "Can you find one angle in your room right now? What      │
│ type is it?"                                                               │
│ Or: LearnFlow AI chat — type/speak your understanding                     │
│ Lesson complete badge unlocks here. Summary of XP + badges shown.         │
│ → "Share with your teacher!" button (screenshot / export)                 │
└────────────────────────────────────────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════════════════

## 6. PHASE 3 — SIMULATION DESIGN (Detailed)

### 6.1 Station A — "The Angle Maker" (Concrete)

**Visual:**
- A large protractor-style dial with a fixed ray (0°) and one draggable ray
  pivoting around a central vertex dot
- Live arc fill shows the angle "wedge" in a bright color as it's dragged
- Live degree readout appears (can be hidden for early rounds)
- "Make an ACUTE angle!" instruction narrated by Alice (ElevenLabs)

**Interaction:**
- Student drags the moving ray (touch/mouse) around the vertex
- OR taps preset stepper arrows (+5°/−5°) for accessibility mode
- On release, system checks whether the resulting angle matches the
  requested **type** (not an exact degree) for Rounds 1–2, and an exact
  **target degree ± 5°** for Rounds 3–4

**Feedback:**
- Correct type/degree → mascot dances, "Yes! That's a perfect acute angle!" 🎉
- Incorrect → gentle shake + "Hmm, that one looks bigger than acute. Try again!"

**Variants per round (randomised):**
- Round 1: Build any ACUTE angle (0°–89°)
- Round 2: Build any OBTUSE angle (91°–179°)
- Round 3: Build a RIGHT angle (exactly 90°, ±5° tolerance)
- Round 4: Build a STRAIGHT angle (exactly 180°, ±5° tolerance)

### 6.2 Station B — "Protractor Detective" (Pictorial → Abstract)

**Visual:**
- A pre-drawn angle (two rays + vertex) on screen
- A draggable/snappable virtual protractor overlay (semi-transparent,
  0°–180° scale) the student aligns over the vertex and baseline ray
- Reading line + numeric input field below

**Interaction:**
- Student aligns the protractor (drag + optional rotate-snap to baseline)
- Reads off the degree value where the second ray crosses the scale
- Types the degree value into the input, submits

**Teaching goal:**
- Correct protractor placement (vertex on center point, 0° line on baseline)
- Reading the correct scale (inner vs outer) — a common Grade 4 error point

**Feedback:**
- Within ±5° → "Excellent reading! That's a [type] angle of about [X]°."
- Off scale (e.g., read wrong side) → hint: "Check — did you start counting
  from the 0° on the ray?"

**3 rounds with increasing difficulty:**
- Round 1: Angle aligned exactly on gridlines (easy read, ~30°, 60°, 90°)
- Round 2: Angle at a slight tilt requiring protractor rotation (medium)
- Round 3: Reflex-adjacent / near-180° angle requiring careful reading (hard)

### 6.3 Station C — "Angle Sums" (Abstract)

**Visual:**
```
___° + 65° = 180°        (angles on a straight line)
120° + ___° + 90° = 360° (angles around a point)
```
- One blank highlighted for input; other values visible
- Diagram shown above as scaffold: a straight line split by rays, or a
  point with rays fanning around it, each wedge labeled

**Interaction:**
- Number pad (large, tap-friendly, 0–9 + backspace)
- "Show diagram" toggle always visible
- On submit: correct → bounce animation; incorrect → shake + hint

**Variants (rotated per round):**
- Round 1: Angles on a straight line (two angles, sum = 180°)
- Round 2: Angles on a straight line (three angles, sum = 180°)
- Round 3: Angles around a point (sum = 360°)

ElevenLabs narrates each equation aloud when displayed.

═══════════════════════════════════════════════════════════════════════════════

## 7. PHASE 4 — QUESTION BANK (100 Randomised Questions)

### 7.1 Question Types (10 types × 10 questions = 100 total)

| Type | Description | Example |
|---|---|---|
| Q1 | Classify angle from picture | [Picture] Is this angle acute, right, obtuse, straight, or reflex? |
| Q2 | Read a protractor diagram | The protractor shows the ray at 65°. What type of angle is this? |
| Q3 | Estimate angle size (no protractor) | Which is the best estimate for this angle: 30°, 90°, or 150°? |
| Q4 | Fill blank — straight line sum | 115° + ___° = 180° |
| Q5 | Fill blank — around a point sum | 90° + 140° + ___° = 360° |
| Q6 | Compare two angles — which is bigger | Which angle is bigger: 72° or 68°? |
| Q7 | Real-world word problem | John opens a laptop lid to 110°. Is that acute, right, or obtuse? |
| Q8 | True or False — angle fact | "A right angle is always exactly 90°." True or False? |
| Q9 | Spot the matching angle (pictorial MCQ) | Which picture shows an obtuse angle? (4 choices) |
| Q10 | Landmark/clock angle problem | At 3 o'clock, what type of angle do the clock hands make? |

### 7.2 Question Distribution by Difficulty

| Type | Count | Easy (acute/right basics) | Medium (obtuse/straight) | Hard (reflex/angle-sum) |
|---|---|---|---|---|
| Q1 | 10 | 5 | 3 | 2 |
| Q2 | 10 | 4 | 4 | 2 |
| Q3 | 10 | 5 | 3 | 2 |
| Q4 | 10 | 3 | 4 | 3 |
| Q5 | 10 | 2 | 4 | 4 |
| Q6 | 10 | 5 | 3 | 2 |
| Q7 | 10 | 4 | 4 | 2 |
| Q8 | 10 | 5 | 3 | 2 |
| Q9 | 10 | 4 | 4 | 2 |
| Q10 | 10 | 3 | 4 | 3 |
| **TOT** | **100** | **40** | **36** | **24** |

### 7.3 Degree Ranges

- Easy: 0°–90°, whole 5°/10° increments
- Medium: 90°–180°, whole 5° increments
- Hard: 180°–360°, angle-sum and reverse-find questions

### 7.4 Global Names, Objects & Contexts Used in Word Problems

**Names (globally diverse, first-name only, age-appropriate):**
John, Mike, Sarah, Priya, Yuki, Carlos, Emma, Liam, Fatima, Noah, Aisha,
Lucas, Mei, Omar, Ana, Kwame, Sofia, Ravi, Chloe, Diego

**Objects/scenes:** laptop lids, doors, book pages, scissors, clock hands,
skateboard ramps, kite strings, umbrella spokes, road signs, ladders

**Global landmark contexts (non-exclusive, rotate across worlds):** Eiffel
Tower (Paris), Statue of Liberty (New York), Sydney Opera House, Great
Pyramids (Giza), Taj Mahal (Agra), Great Wall (China), Big Ben (London),
Machu Picchu (Peru), Colosseum (Rome), Burj Khalifa (Dubai)

### 7.5 Vocabulary Requirements

All questions use consistent, globally-neutral geometry vocabulary:

- "angle", "vertex", "ray/arm", "degree (°)"
- "acute", "right", "obtuse", "straight", "reflex"
- "angles on a straight line", "angles around a point"
- "protractor", "estimate", "measure"

═══════════════════════════════════════════════════════════════════════════════

## 8. GAMIFICATION DESIGN

### 8.1 Reward System

- **Stars (⭐):** Earned per 10-question world (1–3 stars based on score)
- **XP Points:** 10 XP correct first try | 7 XP second try | 5 XP with hint used
- **Streak 🔥:** Fire counter for consecutive correct answers
- **Streak Bonus:** +5 XP per correct answer when streak ≥ 5
- **Passport Stamps 🛂:** A themed collectible — each completed world "stamps"
  a virtual passport with that landmark's icon (ties to global-explorer theme)

### 8.2 Badges (Unlockable)

- 🏅 **"Angle Explorer"** — Complete Wonder + Story phases
- 🥈 **"Angle Builder"** — Complete all 3 Simulation stations
- 🥇 **"Geometry Champion"** — Score ≥80% on Play phase (≥80 questions correct)
- 💎 **"Perfect Protractor"** — Score 10/10 in any world
- 🔥 **"Streak Star"** — Achieve a streak of 10 consecutive correct answers
- 🌟 **"Full Journey"** — Complete all 5 phases (lesson complete badge)
- 🎯 **"Sharp Eye"** — Get 5 correct in Station B (protractor reading) without a wrong pick
- 🌍 **"World Traveler"** — Complete all 10 landmark worlds

### 8.3 Feedback Mechanics

**✅ Correct:**
- Bounce animation on answer card + mascot happy mood
- ElevenLabs celebration audio: "Yes! Perfect angle work! 🎉"
- XP floats up from answer card (+10 / +7 / +5)
- Streak fire counter increments

**❌ Incorrect (Attempt 1):**
- Gentle shake animation on answer card
- ElevenLabs gentle voice: "Not quite! Let's look at the angle again 📐"
- Hint 1 activates: angle diagram highlighted with arc + reference right-angle shown

**❌ Incorrect (Attempt 2):**
- Stronger shake + Hint 2: protractor overlay animates onto the angle
- ElevenLabs: "Watch the protractor line up. Can you read it with me?"

**❌ Incorrect (Attempt 3):**
- Answer revealed with animated explanation (mascot explains)
- ElevenLabs: full explanation read aloud
- No score penalty — encouragement only

No negative scoring. Encouragement-first approach always.

### 8.4 World Map (IntelliPlay™ Level Progression — Global Landmarks)

- World 1 — "Eiffel Tower, Paris" (Q1–10, acute basics 0°–45°)
- World 2 — "Statue of Liberty, New York" (Q11–20, right angles focus)
- World 3 — "Sydney Opera House" (Q21–30, obtuse angles introduced)
- World 4 — "Great Pyramids, Giza" (Q31–40, straight angles, 170°–180°)
- World 5 — "Taj Mahal, Agra" (Q41–50, mixed acute/right/obtuse)
- World 6 — "Great Wall, China" (Q51–60, reflex angles introduced, 180°–270°)
- World 7 — "Big Ben, London" (Q61–70, clock-angle word problems)
- World 8 — "Machu Picchu, Peru" (Q71–80, angle-sum straight line problems)
- World 9 — "Colosseum, Rome" (Q81–90, angle-sum around-a-point problems)
- World 10 — "Burj Khalifa, Dubai" (Q91–100, mixed hardest, all types + reverse-find)

Unlock gate: ≥5/10 correct (1-star minimum) required to advance to next world.
3 stars in a world unlocks a hidden "Bonus Challenge" (3 extra questions).

### 8.5 Mascot (LearnFlow AI Companion)

- Character: Friendly robot — "LearnFlow" (matching Intellia branding),
  now wearing a small explorer backpack/compass for this module's theme
- Mood States: idle | curious | happy | thinking | celebrating | encouraging
- Appearances: Wonder hook, Story narration, Simulation feedback, Reflect phase
- Reactions: Correct answer, badge unlock, streak milestone, world completion
- Audio: All mascot speech via ElevenLabs Alice voice (pre-generated .mp3)

═══════════════════════════════════════════════════════════════════════════════

## 9. AUDIO & NARRATION DESIGN

*(Mirrors the "Number Bonds Audio & Narration Pipeline" document exactly —
same provider, voice, model, and pipeline scripts, retargeted to this
lesson's content.)*

### 9.1 ElevenLabs Pipeline

- Voice Provider: **ElevenLabs (ONLY** — no browser Web Speech API fallback)
- Voice Name: **Alice** (Clear, Engaging Educator)
- Voice ID: `Xb7hH8MSUJpSbSDYk0k2`
- Model: `eleven_multilingual_v2`
- API Key Env Var: `VITE_ELEVENLABS_API_KEY`

### 9.2 Speech Styles Mapped to ElevenLabs Settings

*(carried over from the source pipeline's "Voice Settings by Style" table)*

| Style | Stability | Similarity Boost | Style | Speaker Boost |
|---|---|---|---|---|
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ |
| `question` | 0.20 | 0.55 | 0.55 | ✅ |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ |

### 9.3 Content Policy: Paragraphs & Questions ONLY

> **IMPORTANT:** Audio is generated ONLY for paragraph text and questions.
> Titles, headings, and section labels are NEVER narrated.

### 9.4 Pre-generated Audio Files (Offline — `scripts/generate_audio.js`)

All phase narration lines (Wonder, Story panels, Simulate instructions,
Reflect prompt, badge unlock messages, world completion) are pre-generated
offline and stored as static `.mp3` in `public/assets/audio/`.
`audioMap.js` is auto-generated and maps exact text strings → file paths.
The frontend checks `audioMap` first; dynamic generation only for play-phase
questions not in the map.

### 9.5 Dynamic Generation

Practice questions (Phase 4) are generated dynamically if not pre-cached.
Requires `VITE_ELEVENLABS_API_KEY` in `.env.local`. If key is absent,
narration silently skipped (no browser TTS fallback). Internal memory cache
prevents re-fetching same text.

### 9.6 Segment Synchronisation

The audio engine parses narration as an array of segments (one per
sentence). While segment i plays, segment i+1 is eagerly preloaded. Uses
HTML5 Audio API (`new Audio()`) for playback — no gaps between sentences.

### 9.7 Narration Script Examples

**Phase 1 (Wonder) — style: thinking**
"Sarah opens her book just a little bit. Then Mike opens his book all the
way flat."
"Whose book makes a bigger angle?"
"Let's find out what makes an angle big or small!"

**Phase 2 (Story, Panel 1) — style: statement**
"John lands in Paris. The Eiffel Tower's legs lean out, making an angle at
the ground."
"Is it a small turn or a big turn? A small turn from a straight line is
called an acute angle."

**Phase 3 (Station A) — style: instruction**
"Drag the ray around the vertex. Make an acute angle!"
"Make sure it looks smaller than a right angle. Can you do it?"

**Phase 4 (Correct feedback) — style: celebration**
"Yes! Perfect angle work! You are a geometry superstar!"

**Phase 5 (Reflect) — style: thinking**
"What a journey around the world today! Can you find one angle in your
room right now?"

═══════════════════════════════════════════════════════════════════════════════

## 10. UX & VISUAL DESIGN REQUIREMENTS

### 10.1 Visual Theme

- Brand: Intellia SG — Think. Explore. Become.
- **Reference UI (mirror exactly):** https://equal-tau.vercel.app/
- **Reference Repo:** https://github.com/dsamyak/equal
- Colours: Match `equal-tau.vercel.app` exactly (primary blue, accent
  gold/yellow for rewards and stars, soft coral/red for wrong-answer shake
  states, white card backgrounds, soft drop shadows)
- Typography: Rounded, playful — Nunito or Fredoka One
- Illustrations: Cartoon-style, globally diverse characters and clothing;
  recognizable but simplified landmark silhouettes (non-copyrighted,
  original stylized illustrations, not photographic reproductions)
- Angle diagrams: Clean vector line/ray/vertex illustrations with color-filled
  arc wedges, distinct per angle type

### 10.2 Layout Structure (mirrors equal-tau.vercel.app)

- Top Bar: Intellia logo | Lesson title "Angles Using Geometry" | 5-phase dot tracker
- Main Area: Phase content (fills screen, responsive, smooth phase transitions)
- Bottom Bar: XP counter | Star count | Streak fire | Phase navigation arrows
- Sidebar: Hidden on mobile; shown on tablet+ as vertical phase map

### 10.3 Angle Diagram Visual Component (Primary Visual)

Used throughout all phases. Visual spec:

- Two rays from a shared vertex point, with an arc drawn between them
  proportional to the true angle
- Arc fill color-coded by type (acute = green, right = blue + small square
  marker, obtuse = orange, straight = purple, reflex = red)
- Degree label at the arc's midpoint (or "?" for missing-value questions)
- Rays animate in with a "sweep" animation when diagram first renders
- Optional protractor overlay toggle for scaffolded questions

### 10.4 Accessibility

- Large tap targets (minimum 44×44px on all interactive elements)
- WCAG AA colour contrast on all text elements
- All narration via ElevenLabs (premium, consistent voice)
- Keyboard navigable (Tab + Enter/Arrow keys for ray-dragging alternative)
- No mandatory time pressure (optional timer toggle in challenge mode only)
- Drag interactions (Station A ray, Station B protractor) have
  touch-equivalent stepper-button fallback

### 10.5 Responsive Design

- Primary: iPad / tablet (768px+) — classroom context
- Secondary: Desktop browser (1024px+)
- Tertiary: Mobile (375px+) — stacked single-column layout

═══════════════════════════════════════════════════════════════════════════════

## 11. CONTENT REQUIREMENTS

### 11.1 Simulation Visuals

- Angle diagrams: SVG-rendered rays + vertex + color-filled arc
- Protractor overlay: SVG semi-transparent scale (0°–180°, dual inner/outer
  scale) that snaps to vertex/baseline on drag
- Station A object: single draggable ray handle (large, tap/drag-friendly dot)
- Station C: large bold typography for angle-sum equations, one highlighted
  blank per round

### 11.2 Question Bank Coverage

- All 10 question types × 10 questions = 100 unique question objects in `questionBank.js`
- Questions randomised per session using Fisher-Yates shuffle
- No two sessions present same question order
- MCQ distractors always plausible (within ±10°–15° or a commonly-confused
  angle type, e.g., obtuse vs. reflex)

### 11.3 Word Problem Format (Global Style)

**Type/estimate sense:**
"[Name] opens a [object] to about [degree]°. Is this acute, right, obtuse,
or straight?"

**Angle-sum sense:**
"Two angles sit on a straight line. One is [X]°. What is the other angle?"

**Landmark/real-world sense:**
"At [landmark], [Name] notices the [structure] leans at about [degree]°.
What type of angle is this?"

### 11.4 Audio Script Parity (1:1 Strict Parity Rule)

Every on-screen text string that is narrated must match the narration
script exactly — same words, same punctuation. This prevents confusion for
young learners who are simultaneously listening and reading. Any UI text
change requires updating both the `generate_audio.js` phrases array and the
`narration.js` file.

═══════════════════════════════════════════════════════════════════════════════

## 12. SUCCESS CRITERIA (v1.0)

| Criterion | Target |
|---|---|
| All 100 questions randomised correctly | ✅ Required |
| All 3 simulation stations functional | ✅ Required |
| All 5 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, 8 badges) working | ✅ Required |
| World map 10-world progression logic correct | ✅ Required |
| ElevenLabs audio plays for all phase narration | ✅ Required |
| Audio pipeline (pre-gen + dynamic) functional | ✅ Required |
| Mobile/tablet responsive layout | ✅ Required |
| Global Grade 4 geometry syllabus 100% covered | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches equal-tau.vercel.app structure | ✅ Required |
| Hosted correctly at intelliasg.com lesson URL | ✅ Required |

═══════════════════════════════════════════════════════════════════════════════

## 13. OUT OF SCOPE (v1.0)

- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation
- Related lessons (e.g., angle bisectors, parallel lines & angle
  relationships, triangle angle sums) — separate modules
- Assessment against full curriculum (broader test engine)
- Physical (non-virtual) protractor hardware integration

═══════════════════════════════════════════════════════════════════════════════

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 4 Math, Angles Using Geometry
**Lesson Title:** Angles Using Geometry — Around the World
**Curriculum:** Global Grade 4 Mathematics (Common Core / Cambridge / CBSE / MOE cross-aligned)
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`)
**Parent Course Page:** https://intelliasg.com/courses/grade-4-math/
**Lesson URL:** https://intelliasg.com/courses/grade-4-math/lessons/angles-in-geometry/
