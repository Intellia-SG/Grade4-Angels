import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { playWonderNarration } from '../../utils/narration';

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [step, setStep] = useState(0); // 0: Question, 1: Revealed Discovery
  const [bookState, setBookState] = useState('closed'); // 'closed', 'sarah', 'mike'
  const narrationRef = useRef(null);

  useEffect(() => {
    // Play narration on enter
    if (audioEnabled) {
      narrationRef.current = narrate(playWonderNarration(step), true);
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [step, audioEnabled]);

  const handleBookStateChange = (stateName) => {
    sounds.click();
    setBookState(stateName);
  };

  const handleNext = () => {
    sounds.click();
    if (step === 0) {
      setStep(1);
      setBookState('closed');
    } else {
      onComplete();
    }
  };

  // Compute points for book pages SVG based on cover rotation angle
  // Spine at (150, 150), left cover is fixed at 180° (left, horizontal): (50, 150)
  // Right cover rotates from 180° (closed, overlaps left) to 0° (flat)
  let angle = 0;
  if (bookState === 'sarah') angle = 35;
  if (bookState === 'mike') angle = 180;

  // Calculate coordinates for the rotating front cover (length = 100)
  const rad = (180 - angle) * (Math.PI / 180);
  const rx = 150 + 100 * Math.cos(rad);
  const ry = 150 - 100 * Math.sin(rad); // Screen Y goes down, so subtract to go "up" for positive angles

  // Determine angle arc path
  let arcPath = '';
  if (angle > 0) {
    const arcRad = 35;
    // Start at (50 + 65, 150) = (115, 150), end at (150 + 35 * cos(rad), 150 - 35 * sin(rad))
    const startX = 150 - arcRad;
    const startY = 150;
    const endX = 150 + arcRad * Math.cos(rad);
    const endY = 150 - arcRad * Math.sin(rad);
    const largeArcFlag = angle > 180 ? 1 : 0;
    const sweepFlag = 1; // clockwise sweep
    arcPath = `M ${startX} ${startY} A ${arcRad} ${arcRad} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
  }

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="wonder-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${1 + Math.random() * 2}rem`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 10}s`
            }}
          >
            {['📐', '°', '∠', '⦝', '✏️'][i % 5]}
          </div>
        ))}
      </div>

      <div className="wonder-content">
        <div className={`wonder-qmark ${step === 0 ? 'revealed' : ''}`}>
          <div className="wonder-qmark-icon">?</div>
          <div className="wonder-qmark-glow" />
        </div>

        <div className="mascot-container wonder-mascot visible">
          <div className="mascot thinking">🤖</div>
          <div className="speech-bubble wonder-bubble">
            {step === 0 ? (
              bookState === 'closed'
                ? "Sarah opens her book a little, and Mike opens it flat. Let's see the angle they make!"
                : bookState === 'sarah'
                ? "Look at the small corner! Sarah's book makes a tiny turn angle."
                : "Mike's book is wide open! It makes a flat straight line angle."
            ) : (
              "An angle measures the turn between two lines! Let's discover how to measure them!"
            )}
          </div>
        </div>

        <div className="wonder-question-card visible">
          {step === 0 ? (
            <div>
              <div className="wonder-emoji">📖</div>
              <h2 className="wonder-question-text">
                Sarah opens her book just a little bit. Mike opens his book all the way flat. Whose book makes a bigger angle?
              </h2>
              
              {/* Interactive Book Edge SVG */}
              <div style={{ position: 'relative', width: 300, height: 220, margin: '16px auto', background: 'rgba(0,0,0,0.15)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 220">
                  {/* Table Surface */}
                  <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="5,5" />
                  
                  {/* Book Spine Center */}
                  <circle cx="150" cy="150" r="8" fill="var(--gold)" />
                  
                  {/* Left Page (Fixed cover at 180 degrees) */}
                  <line x1="150" y1="150" x2="50" y2="150" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" />
                  <text x="35" y="155" fill="#f43f5e" fontSize="0.75rem" fontWeight="bold">Back</text>
                  
                  {/* Right Page (Rotating cover) */}
                  <line x1="150" y1="150" x2={rx} y2={ry} stroke="var(--blue-bright)" strokeWidth="8" strokeLinecap="round" style={{ transition: 'all 0.5s ease' }} />
                  <text x={rx + 5} y={ry - 5} fill="var(--blue-bright)" fontSize="0.75rem" fontWeight="bold" style={{ transition: 'all 0.5s ease' }}>Front</text>
                  
                  {/* Angle Arc representation */}
                  {arcPath && (
                    <path d={arcPath} fill="none" stroke="var(--gold)" strokeWidth="3" strokeDasharray="3,3" style={{ transition: 'all 0.5s ease' }} />
                  )}
                  
                  {/* Degree text badge */}
                  <g transform="translate(150, 190)">
                    <rect x="-50" y="-14" width="100" height="24" rx="12" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" />
                    <text x="0" y="3" fill="var(--gold)" fontSize="0.85rem" fontWeight="bold" textAnchor="middle">
                      {bookState === 'closed' ? 'Closed (0°)' : bookState === 'sarah' ? 'Sarah (35°)' : 'Mike (180°)'}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <button
                  className={`btn btn-sm ${bookState === 'sarah' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleBookStateChange('sarah')}
                >
                  Sarah's Book (35°)
                </button>
                <button
                  className={`btn btn-sm ${bookState === 'mike' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleBookStateChange('mike')}
                >
                  Mike's Book (180°)
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="wonder-emoji">✨</div>
              <h2 className="wonder-question-text">
                An angle is a measurement of how much something turns!
              </h2>
              <p className="wonder-subtext" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                When we open a door, spin a wheel, or open a book, we are creating angles. A bigger turn means a bigger angle. Let's learn more about the types of turns we can make!
              </p>
            </div>
          )}
        </div>

        <button className="btn btn-wonder visible" onClick={handleNext}>
          {step === 0 ? "Let's Discover! 🚀" : "Start Learning Tour! 🌍"}
          <span className="wonder-btn-sparkle" style={{ marginLeft: 6 }}>✨</span>
        </button>
      </div>
    </div>
  );
}
