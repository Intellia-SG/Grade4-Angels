import { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';

const ROUNDS = [
  {
    type: 'straight_line',
    equation: '110° + x = 180°',
    variable: 'x',
    correctAnswer: 70,
    desc: 'Angles on a straight line always add up to 180°. Solve for x!',
    angleA: 110,
    hint: 'Subtract 110 from 180: 180 - 110 = ?'
  },
  {
    type: 'around_point',
    equation: '120° + 140° + y = 360°',
    variable: 'y',
    correctAnswer: 100,
    desc: 'Angles all the way around a point always add up to 360°. Solve for y!',
    angleA: 120,
    angleB: 140,
    hint: 'Add the two angles: 120 + 140 = 260. Then subtract from 360: 360 - 260 = ?'
  },
  {
    type: 'right_angle',
    equation: '35° + z = 90°',
    variable: 'z',
    correctAnswer: 55,
    desc: 'Angles inside a right angle corner always add up to 90°. Solve for z!',
    angleA: 35,
    hint: 'Subtract 35 from 90: 90 - 35 = ?'
  }
];

export default function AngleSumStation({ onStationComplete }) {
  const [round, setRound] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);

  const currentRound = ROUNDS[round];

  useEffect(() => {
    setInputVal('');
    setFeedback(null);
  }, [round]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(inputVal, 10);
    if (value === currentRound.correctAnswer) {
      sounds.correct();
      setFeedback({ type: 'correct', message: 'Amazing! 🎉', sub: `Correct! ${currentRound.variable} = ${currentRound.correctAnswer}°` });
      setTimeout(() => {
        if (round + 1 < ROUNDS.length) {
          setRound(r => r + 1);
        } else {
          onStationComplete();
        }
      }, 2000);
    } else {
      sounds.wrong();
      setFeedback({ type: 'wrong', message: 'Not quite!', sub: `Remember: ${currentRound.hint}` });
    }
  };

  const adjustVal = (amount) => {
    sounds.click();
    const cur = parseInt(inputVal, 10) || 0;
    setInputVal(Math.max(0, cur + amount).toString());
    setFeedback(null);
  };

  const renderSVG = () => {
    switch (currentRound.type) {
      case 'straight_line': // 110 + x = 180
        return (
          <svg width="100%" height="100%" viewBox="0 0 300 200">
            {/* Straight Line base */}
            <line x1="30" y1="150" x2="270" y2="150" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <circle cx="150" cy="150" r="6" fill="var(--gold)" />
            
            {/* Splitting Ray at 110 degrees */}
            {/* Rad = (180 - 110) * PI / 180 = 70 * PI / 180 */}
            <line x1="150" y1="150" x2="115" y2="55" stroke="var(--blue-bright)" strokeWidth="4" strokeLinecap="round" />
            
            {/* Angle Arcs */}
            {/* Left Arc: 110° */}
            <path d="M 120 150 A 30 30 0 0 0 138 118" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
            <text x="95" y="125" fill="var(--gold)" fontSize="0.85rem" fontWeight="bold">110°</text>

            {/* Right Arc: x */}
            <path d="M 138 118 A 30 30 0 0 0 180 150" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="180" y="125" fill="#f43f5e" fontSize="0.95rem" fontWeight="bold">x</text>
          </svg>
        );
      case 'around_point': // 120 + 140 + y = 360
        return (
          <svg width="100%" height="100%" viewBox="0 0 300 200">
            {/* Center vertex */}
            <circle cx="150" cy="100" r="6" fill="#ffffff" />
            
            {/* Ray 1 (0 degrees, right) */}
            <line x1="150" y1="100" x2="240" y2="100" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Ray 2 (120 degrees counter-clockwise) */}
            {/* 150 + 90 * cos(120), 100 - 90 * sin(120) */}
            <line x1="150" y1="100" x2="105" y2="22" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

            {/* Ray 3 (120 + 140 = 260 degrees counter-clockwise) */}
            {/* 150 + 90 * cos(260), 100 - 90 * sin(260) */}
            <line x1="150" y1="100" x2="134" y2="188" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

            {/* Angle Arcs & Labels */}
            {/* 120° Arc */}
            <path d="M 180 100 A 30 30 0 0 0 135 74" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
            <text x="175" y="75" fill="var(--gold)" fontSize="0.75rem" fontWeight="bold">120°</text>

            {/* 140° Arc */}
            <path d="M 135 74 A 30 30 0 0 0 145 130" fill="none" stroke="var(--blue-bright)" strokeWidth="2.5" />
            <text x="100" y="115" fill="var(--blue-bright)" fontSize="0.75rem" fontWeight="bold">140°</text>

            {/* y Arc */}
            <path d="M 145 130 A 30 30 0 0 0 180 100" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="182" y="132" fill="#f43f5e" fontSize="0.95rem" fontWeight="bold">y</text>
          </svg>
        );
      case 'right_angle': // 35 + z = 90
        return (
          <svg width="100%" height="100%" viewBox="0 0 300 200">
            {/* Corner Base and Vertical */}
            <line x1="100" y1="160" x2="220" y2="160" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="160" x2="100" y2="40" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeDasharray="4,3" />
            <circle cx="100" cy="160" r="6" fill="var(--gold)" />

            {/* Right Angle Corner box */}
            <rect x="100" y="140" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* Splitting Ray at 35 degrees */}
            {/* 100 + 110 * cos(35), 160 - 110 * sin(35) */}
            <line x1="100" y1="160" x2="190" y2="97" stroke="var(--blue-bright)" strokeWidth="4" strokeLinecap="round" />

            {/* Arcs */}
            {/* 35° Arc */}
            <path d="M 140 160 A 40 40 0 0 0 133 137" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
            <text x="155" y="152" fill="var(--gold)" fontSize="0.85rem" fontWeight="bold">35°</text>

            {/* z Arc */}
            <path d="M 133 137 A 40 40 0 0 0 100 120" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="115" y="105" fill="#f43f5e" fontSize="0.95rem" fontWeight="bold">z</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="station-content">
      <div className="station-header">
        <h2>Round {round + 1} of 3: Find the missing angle</h2>
        <p className="wonder-subtext" style={{ marginBottom: 8 }}>{currentRound.desc}</p>
      </div>

      <div className="interaction-area" style={{ width: 300, height: 210, padding: 0 }}>
        {renderSVG()}
      </div>

      {/* Equation display */}
      <div className="sum-equation-row">
        {currentRound.equation.split(' ').map((term, i) => {
          if (term.includes(currentRound.variable)) {
            return (
              <span key={i} style={{ color: '#f43f5e', borderBottom: '3px solid #f43f5e', padding: '0 4px', margin: '0 4px' }}>
                {currentRound.variable}
              </span>
            );
          }
          return <span key={i}>{term}</span>;
        })}
      </div>

      {/* Input controls */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button type="button" className="btn btn-outline btn-sm" style={{ minWidth: 50 }} onClick={() => adjustVal(-10)}>-10</button>
          <button type="button" className="btn btn-outline btn-sm" style={{ minWidth: 40 }} onClick={() => adjustVal(-1)}>-1</button>
          
          <input 
            type="number" 
            placeholder="?" 
            value={inputVal}
            onChange={(e) => { setInputVal(e.target.value); setFeedback(null); }}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '2px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.2)',
              color: 'white',
              width: 90,
              fontSize: '1.6rem',
              textAlign: 'center',
              outline: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 'bold'
            }}
          />

          <button type="button" className="btn btn-outline btn-sm" style={{ minWidth: 40 }} onClick={() => adjustVal(1)}>+1</button>
          <button type="button" className="btn btn-outline btn-sm" style={{ minWidth: 50 }} onClick={() => adjustVal(10)}>+10</button>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }} disabled={!inputVal}>
          Submit Equation ✏️
        </button>
      </form>

      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '😢'}</div>
            <div className="feedback-message">{feedback.message}</div>
            <div className="feedback-sub">{feedback.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}
