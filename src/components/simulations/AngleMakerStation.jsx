import { useState, useRef, useEffect } from 'react';
import { getAngleDegrees, snapToDegrees, classifyAngle } from '../../utils/angleMath';
import { sounds } from '../../utils/audio';

const ROUNDS = [
  { target: 'acute', label: 'Acute Angle (less than 90°)', desc: 'Drag the handle to create an angle <strong>smaller than 90°</strong>, then check your answer!' },
  { target: 'right', label: 'Right Angle (exactly 90°)', desc: 'Drag the handle to build a <strong>perfect 90° square corner</strong>.' },
  { target: 'obtuse', label: 'Obtuse Angle (between 90° and 180°)', desc: 'Drag the handle to create a wide angle <strong>between 90° and 180°</strong>.' }
];

export default function AngleMakerStation({ onStationComplete }) {
  const [round, setRound] = useState(0);
  const [degrees, setDegrees] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const svgRef = useRef(null);

  const currentRound = ROUNDS[round];

  // Set default degrees for the round target
  useEffect(() => {
    if (round === 0) setDegrees(45);
    if (round === 1) setDegrees(60); // start off-target
    if (round === 2) setDegrees(135);
    setFeedback(null);
  }, [round]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateAngleFromPointer(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateAngleFromPointer(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, []);

  const updateAngleFromPointer = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Get pointer coordinates (mouse or touch)
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX === undefined || clientY === undefined) return;

    // Apply scale factors for responsive SVGs
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    
    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;

    // Center is (150, 150)
    const rawDeg = getAngleDegrees(px, py, 150, 150);
    const snapped = snapToDegrees(rawDeg);
    
    // Keep it between 5 and 355 for the sandbox
    if (snapped >= 0 && snapped <= 360) {
      setDegrees(snapped === 360 ? 0 : snapped);
    }
  };

  const stepAngle = (delta) => {
    sounds.click();
    let newDeg = (degrees + delta + 360) % 360;
    setDegrees(newDeg);
    setFeedback(null);
  };

  const checkAnswer = () => {
    const currentClass = classifyAngle(degrees);
    const isCorrect = currentClass === currentRound.target;

    if (isCorrect) {
      sounds.correct();
      setFeedback({ type: 'correct', message: 'Perfect! 🎉', sub: `You built a correct ${currentRound.target} angle measuring ${degrees}°!` });
      setTimeout(() => {
        if (round + 1 < ROUNDS.length) {
          setRound(r => r + 1);
        } else {
          onStationComplete();
        }
      }, 2000);
    } else {
      sounds.wrong();
      setFeedback({ type: 'wrong', message: 'Not quite!', sub: `That angle is ${degrees}° which is classified as ${currentClass}. Try again!` });
    }
  };

  // Coordinates for the moving ray (center = 150, 150, length = 110)
  const rad = (180 - degrees) * (Math.PI / 180);
  const rx = 150 + 110 * Math.cos(rad);
  const ry = 150 - 110 * Math.sin(rad);

  // Helper angle arc
  let arcPath = '';
  if (degrees > 0) {
    const arcRad = 40;
    const startX = 150 - arcRad;
    const startY = 150;
    const endX = 150 + arcRad * Math.cos(rad);
    const endY = 150 - arcRad * Math.sin(rad);
    const largeArcFlag = degrees > 180 ? 1 : 0;
    arcPath = `M ${startX} ${startY} A ${arcRad} ${arcRad} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  }

  const currentClass = classifyAngle(degrees);

  return (
    <div className="station-content">
      <div className="station-header">
        <h2>Round {round + 1} of 3: Build a <strong>{currentRound.label}</strong></h2>
        <p 
          className="wonder-subtext" 
          style={{ marginBottom: 12 }}
          dangerouslySetInnerHTML={{ __html: currentRound.desc }}
        />
      </div>

      <div 
        className="interaction-area"
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseUp={handlePointerUp}
      >
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 300">
          {/* Protractor dial background grid */}
          <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          
          {/* Tic marks for major degrees */}
          {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map(deg => {
            const radVal = (180 - deg) * (Math.PI / 180);
            const x1 = 150 + 115 * Math.cos(radVal);
            const y1 = 150 - 115 * Math.sin(radVal);
            const x2 = 150 + 125 * Math.cos(radVal);
            const y2 = 150 - 125 * Math.sin(radVal);
            return (
              <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            );
          })}

          {/* Reference baseline grid */}
          <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />

          {/* Vertex center */}
          <circle cx="150" cy="150" r="6" fill="#ffffff" />

          {/* Fixed base line (horizontal left, 180 degrees) */}
          <line x1="150" y1="150" x2="40" y2="150" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
          
          {/* Shaded Angle area */}
          {arcPath && (
            <path d={`M 150 150 L 110 150 ${arcPath} Z`} fill="rgba(255, 193, 7, 0.12)" stroke="none" />
          )}

          {/* Rotating ray */}
          <line x1="150" y1="150" x2={rx} y2={ry} stroke="var(--blue-bright)" strokeWidth="4" strokeLinecap="round" />

          {/* Draggable Handle */}
          <circle 
            className="draggable-ray-handle" 
            cx={rx} 
            cy={ry} 
            r="12" 
            fill="var(--gold-light)" 
            stroke="#ffffff" 
            strokeWidth="3" 
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}
          />

          {/* Angle Arc line representation */}
          {arcPath && (
            <path d={arcPath} fill="none" stroke="var(--gold)" strokeWidth="2.5" />
          )}
        </svg>

        {/* Live Degree indicator */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(7, 7, 30, 0.85)',
          padding: '4px 12px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.15)',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}>
          📐 {degrees}° <span style={{ color: 'var(--gold)', marginLeft: 4 }}>({currentClass})</span>
        </div>
      </div>

      {/* Stepper controls for accessibility */}
      <div className="stepper-controls">
        <button className="btn btn-outline btn-sm" onClick={() => stepAngle(-5)}>◀ -5°</button>
        <button className="btn btn-outline btn-sm" onClick={() => stepAngle(-1)}>◀ -1°</button>
        <button className="btn btn-outline btn-sm" onClick={() => stepAngle(1)}>+1° ▶</button>
        <button className="btn btn-outline btn-sm" onClick={() => stepAngle(5)}>+5° ▶</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <button className="btn btn-primary" onClick={checkAnswer}>
          Check Angle ✅
        </button>
      </div>

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
