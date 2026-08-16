import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { playStoryNarration } from '../../utils/narration';

const STORY_PANELS = [
  {
    title: "Eiffel Tower — Paris, France 🗼",
    text: "<strong>Wei Ming</strong> lands in Paris. The <strong>Eiffel Tower's</strong> legs lean out, making an <strong>acute angle</strong> at the ground.",
    highlight: "<strong>Acute Angle</strong>: Smaller than a <strong>90°</strong> corner!",
    character: "Wei Ming",
    landmark: "Eiffel Tower"
  },
  {
    title: "What is an Acute Angle? 📐",
    text: "A turn that is smaller than a perfect square corner is called an <strong>acute angle</strong>. It measures between <strong>0° and 90°</strong>.",
    highlight: "<strong>Acute Angle</strong>: 0° to 90° (Sharp & Small!)",
    character: "Wei Ming",
    landmark: "Geometry Sandbox"
  },
  {
    title: "Broadway Crossroads — New York, USA 🗽",
    text: "<strong>Wei Ming</strong> visits a crossroads in New York. The streets meet in a perfect square corner — a <strong>right angle</strong>, measuring <strong>exactly 90°</strong>!",
    highlight: "<strong>Right Angle</strong>: Exactly <strong>90°</strong>!",
    character: "Wei Ming",
    landmark: "Broadway Crossroads"
  },
  {
    title: "Opera House Sails — Sydney, Australia ⛵",
    text: "<strong>Wei Ming</strong> opens the door of the Sydney Opera House all the way. It opens past a right angle, but not flat. That's an <strong>obtuse angle</strong>!",
    highlight: "<strong>Obtuse Angle</strong>: Between <strong>90° and 180°</strong>!",
    character: "Wei Ming",
    landmark: "Sydney Opera House"
  },
  {
    title: "Giza Horizon — Cairo, Egypt 🔺",
    text: "<strong>Wei Ming</strong> looks at the flat desert horizon near the Pyramids. A perfectly flat line makes a <strong>straight angle</strong>, measuring <strong>exactly 180°</strong>.",
    highlight: "<strong>Straight Angle</strong>: Exactly <strong>180°</strong>!",
    character: "Wei Ming",
    landmark: "Giza Pyramids"
  },
  {
    title: "Shibuya Crossing Spin — Tokyo, Japan 🏙️",
    text: "<strong>Wei Ming</strong> spins all the way around in Shibuya Crossing. A full turn from start to finish is <strong>exactly 360°</strong>!",
    highlight: "<strong>Full Spin</strong>: Exactly <strong>360°</strong>!",
    character: "Wei Ming",
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
          <p 
            className={`story-text ${revealed ? 'revealed' : ''}`}
            dangerouslySetInnerHTML={{ __html: p.text }}
          />
          
          <div className={`story-highlight ${revealed ? 'visible' : ''}`}>
            <span 
              className="story-highlight-text"
              dangerouslySetInnerHTML={{ __html: '💡 ' + p.highlight }}
            />
          </div>

          <div className="story-mascot">
            <div className="mascot happy" style={{ width: 52, height: 52, fontSize: '1.6rem' }}>🤖</div>
            <div className="speech-bubble" style={{ padding: '12px 18px', fontSize: '1.15rem' }}>
              Hi! I'm <strong>{p.character}</strong>'s guide! Check out the <strong>{p.landmark}</strong>!
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
