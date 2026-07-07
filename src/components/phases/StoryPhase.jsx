import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { playStoryNarration } from '../../utils/narration';

const STORY_PANELS = [
  {
    title: "Eiffel Tower — Paris, France 🗼",
    text: "John lands in Paris. The Eiffel Tower's legs lean out, making an angle at the ground.",
    highlight: "Acute Angle: Smaller than a corner!",
    character: "John",
    landmark: "Eiffel Tower"
  },
  {
    title: "What is an Acute Angle? 📐",
    text: "A turn that is smaller than a perfect square corner is called an acute angle. It ranges between 0° and 90°.",
    highlight: "Acute: < 90° (Sharp & Small!)",
    character: "Sarah",
    landmark: "Geometry Sandbox"
  },
  {
    title: "Broadway Crossroads — New York, USA 🗽",
    text: "Sarah visits a crossroads in New York. The streets meet in a perfect square corner — a right angle, exactly ninety degrees!",
    highlight: "Right Angle: Exactly 90°!",
    character: "Sarah",
    landmark: "Broadway Crossroads"
  },
  {
    title: "Opera House Sails — Sydney, Australia ⛵",
    text: "Mike opens the door of the Sydney Opera House all the way. It opens past a right angle, but not flat. That's an obtuse angle!",
    highlight: "Obtuse Angle: Between 90° and 180°!",
    character: "Mike",
    landmark: "Sydney Opera House"
  },
  {
    title: "Giza Horizon — Cairo, Egypt 🔺",
    text: "Priya looks at the flat desert horizon near the Pyramids. A perfectly flat line makes a straight angle, exactly one hundred eighty degrees.",
    highlight: "Straight Angle: Exactly 180°!",
    character: "Priya",
    landmark: "Giza Pyramids"
  },
  {
    title: "Shibuya Crossing Spin — Tokyo, Japan 🏙️",
    text: "Yuki spins all the way around in Shibuya Crossing. A full turn from start to finish is three hundred sixty degrees!",
    highlight: "Full Spin: Exactly 360°!",
    character: "Yuki",
    landmark: "Shibuya Crossing"
  }
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [panelIdx, setPanelIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const narrationRef = useRef(null);

  useEffect(() => {
    setRevealed(false);
    if (audioEnabled) {
      narrationRef.current = narrate(playStoryNarration(panelIdx), true);
    }
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 400);

    return () => {
      narrationRef.current?.cancel();
      stopNarration();
      clearTimeout(timer);
    };
  }, [panelIdx, audioEnabled]);

  const handlePrev = () => {
    if (panelIdx > 0) {
      sounds.click();
      setFlipping(true);
      setTimeout(() => {
        setPanelIdx(i => i - 1);
        setFlipping(false);
      }, 300);
    }
  };

  const handleNext = () => {
    sounds.click();
    if (panelIdx + 1 < STORY_PANELS.length) {
      setFlipping(true);
      setTimeout(() => {
        setPanelIdx(i => i + 1);
        setFlipping(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const p = STORY_PANELS[panelIdx];

  return (
    <div className="story-phase">
      {/* Story Progress Bar */}
      <div className="story-progress">
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${((panelIdx + 1) / STORY_PANELS.length) * 100}%` }} />
        </div>
        <span className="story-progress-label">Slide {panelIdx + 1} of {STORY_PANELS.length}</span>
      </div>

      {/* Story Card */}
      <div className={`story-card ${flipping ? 'flipping' : ''}`}>
        <div className="story-visual-section">
          <img 
            src={`/story/${panelIdx + 1}.png`} 
            alt={p.title} 
            className="story-image" 
          />
        </div>
        
        <div className="story-text-section">
          <h3 className="story-title">{p.title}</h3>
          <p className={`story-text ${revealed ? 'revealed' : ''}`}>{p.text}</p>
          
          <div className={`story-highlight ${revealed ? 'visible' : ''}`}>
            <span className="story-highlight-text">💡 {p.highlight}</span>
          </div>

          <div className="story-mascot">
            <div className="mascot happy" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>🤖</div>
            <div className="speech-bubble" style={{ padding: '8px 12px', fontSize: '1rem' }}>
              Hi, I'm <strong>{p.character}</strong>'s companion! Look at the {p.landmark}!
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={handlePrev} disabled={panelIdx === 0}>
          ← Back
        </button>
        
        <div className="story-dots">
          {STORY_PANELS.map((_, i) => (
            <div key={i} className={`story-dot ${i === panelIdx ? 'active' : i < panelIdx ? 'completed' : ''}`} />
          ))}
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleNext}>
          {panelIdx + 1 === STORY_PANELS.length ? "Let's Practice! 🎮" : "Next Landmark →"}
        </button>
      </div>
    </div>
  );
}
