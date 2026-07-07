import { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

const ROUNDS = [
  { angleOffset: 20, angleSize: 60, desc: "Measure this acute angle. Align the protractor center to the vertex and rotate it to the baseline!" },
  { angleOffset: -40, angleSize: 90, desc: "Measure this right angle. Find the square corner measure!" },
  { angleOffset: 45, angleSize: 120, desc: "Measure this obtuse angle. Read the wide scale carefully!" }
];

export default function ProtractorStation({ onStationComplete, setStationBPerfect }) {
  const [round, setRound] = useState(0);
  const [protractorCenter, setProtractorCenter] = useState({ x: 80, y: 70 });
  const [protractorRot, setProtractorRot] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [dragMode, setDragMode] = useState('none'); // 'center', 'rotation', 'none'
  const [feedback, setFeedback] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);
  const svgRef = useRef(null);

  const currentRound = ROUNDS[round];
  const vertex = { x: 150, y: 160 };

  // Calculate current distance and angle difference
  const dx = protractorCenter.x - vertex.x;
  const dy = protractorCenter.y - vertex.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Normalize difference to [-180, 180]
  const rawDiff = (protractorRot - currentRound.angleOffset) % 360;
  const rotDiff = Math.abs((rawDiff + 540) % 360 - 180);

  const isCenterAligned = dist < 12;
  const isRotAligned = rotDiff < 4.5;
  const isAligned = isCenterAligned && isRotAligned;

  // Snapped coordinates if fully aligned
  const activeCenter = isAligned ? vertex : protractorCenter;
  const activeRot = isAligned ? currentRound.angleOffset : protractorRot;

  useEffect(() => {
    // Reset round states
    setProtractorCenter({ x: 80, y: 70 });
    setProtractorRot(0);
    setInputVal('');
    setFeedback(null);
  }, [round]);

  const handlePointerDown = (e, mode) => {
    e.preventDefault();
    setDragMode(mode);
    updateInteraction(e, mode);
  };

  const handlePointerMove = (e) => {
    if (dragMode === 'none') return;
    updateInteraction(e, dragMode);
  };

  const handlePointerUp = () => {
    setDragMode('none');
  };

  useEffect(() => {
    const handleGlobalUp = () => setDragMode('none');
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, []);

  const updateInteraction = (e, mode) => {
    if (!svgRef.current || isAligned) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    
    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;

    if (mode === 'center') {
      setProtractorCenter({ x: Math.round(px), y: Math.round(py) });
    } else if (mode === 'rotation') {
      // Calculate rotation relative to current protractor center
      const angleRad = Math.atan2(py - protractorCenter.y, px - protractorCenter.x);
      let angleDeg = angleRad * (180 / Math.PI);
      if (angleDeg < 0) angleDeg += 360;
      setProtractorRot(Math.round(angleDeg));
    }
  };

  // Stepper positioning controls for accessibility
  const moveCenter = (dx, dy) => {
    sounds.click();
    if (isAligned) return;
    setProtractorCenter(c => ({
      x: Math.max(10, Math.min(290, c.x + dx)),
      y: Math.max(10, Math.min(290, c.y + dy))
    }));
  };

  const rotateProtractor = (delta) => {
    sounds.click();
    if (isAligned) return;
    setProtractorRot(r => (r + delta + 360) % 360);
  };

  const autoAlign = () => {
    sounds.click();
    setProtractorCenter(vertex);
    setProtractorRot(currentRound.angleOffset);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAligned) {
      sounds.wrong();
      setFeedback({ type: 'wrong', message: 'Not aligned!', sub: 'Please align the protractor to the angle baseline first!' });
      return;
    }

    const value = parseInt(inputVal, 10);
    if (value === currentRound.angleSize) {
      sounds.correct();
      setFeedback({ type: 'correct', message: 'Perfect! 🎉', sub: `Correct reading: ${currentRound.angleSize}°!` });
      setTimeout(() => {
        if (round + 1 < ROUNDS.length) {
          setRound(r => r + 1);
        } else {
          onStationComplete();
        }
      }, 2000);
    } else {
      sounds.wrong();
      setWrongCount(w => {
        const nextW = w + 1;
        if (nextW > 0) {
          setStationBPerfect(false); // Player lost perfect run for Station B
        }
        return nextW;
      });
      setFeedback({ type: 'wrong', message: 'Not quite!', sub: `Look closer at the protractor markings. Check the arc size!` });
    }
  };

  // Angle rays coordinates
  // Vertex is (150, 160).
  // Baseline extends at angleOffset, length = 110.
  const baseRad = (180 - currentRound.angleOffset) * (Math.PI / 180);
  const bx = vertex.x + 110 * Math.cos(baseRad);
  const by = vertex.y - 110 * Math.sin(baseRad);

  // Target ray extends at angleOffset + angleSize
  const targetRad = (180 - (currentRound.angleOffset + currentRound.angleSize)) * (Math.PI / 180);
  const tx = vertex.x + 110 * Math.cos(targetRad);
  const ty = vertex.y - 110 * Math.sin(targetRad);

  // SVG coordinates for rotation handle of protractor
  // Radius = 65 around protractorCenter
  const handleRad = (activeRot) * (Math.PI / 180);
  const hx = activeCenter.x + 65 * Math.cos(handleRad);
  const hy = activeCenter.y + 65 * Math.sin(handleRad);

  return (
    <div className="station-content">
      <div className="station-header">
        <h2>Round {round + 1} of 3: Measure the angle!</h2>
        <p className="wonder-subtext" style={{ marginBottom: 12 }}>{currentRound.desc}</p>
      </div>

      <div 
        className="interaction-area"
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        style={{ width: 300, height: 280, padding: 0 }}
      >
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 280">
          {/* Static Angle to be measured */}
          <circle cx={vertex.x} cy={vertex.y} r="5" fill="#ffffff" />
          
          {/* Baseline (red) */}
          <line x1={vertex.x} y1={vertex.y} x2={bx} y2={by} stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
          {/* Target ray (blue) */}
          <line x1={vertex.x} y1={vertex.y} x2={tx} y2={ty} stroke="var(--blue-bright)" strokeWidth="4.5" strokeLinecap="round" />

          {/* Virtual Protractor */}
          <g 
            transform={`translate(${activeCenter.x}, ${activeCenter.y}) rotate(${activeRot})`}
            style={{ pointerEvents: 'none', transition: isAligned ? 'transform 0.3s ease' : 'none' }}
          >
            {/* Protractor Semi-circle body */}
            <path 
              d="M -70 0 A 70 70 0 0 1 70 0 Z" 
              fill="rgba(255, 193, 7, 0.18)" 
              stroke="var(--gold)" 
              strokeWidth="2.5" 
              style={{ pointerEvents: 'auto', cursor: 'grab' }}
              onMouseDown={(e) => handlePointerDown(e, 'center')}
              onTouchStart={(e) => handlePointerDown(e, 'center')}
            />
            {/* Center tick */}
            <line x1="0" y1="0" x2="0" y2="-8" stroke="var(--gold)" strokeWidth="2" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="var(--gold)" strokeWidth="2" />
            
            {/* Inside ticks for degrees (every 10°) */}
            {Array.from({ length: 19 }).map((_, idx) => {
              const deg = idx * 10;
              const tickRad = (180 - deg) * (Math.PI / 180);
              const innerR = 62;
              const outerR = 70;
              return (
                <g key={deg}>
                  <line 
                    x1={innerR * Math.cos(tickRad)} 
                    y1={-innerR * Math.sin(tickRad)} 
                    x2={outerR * Math.cos(tickRad)} 
                    y2={-outerR * Math.sin(tickRad)} 
                    stroke="var(--gold)" 
                    strokeWidth="1.5" 
                  />
                  {deg % 30 === 0 && (
                    <text 
                      x={(innerR - 12) * Math.cos(tickRad)} 
                      y={-(innerR - 12) * Math.sin(tickRad)} 
                      fill="#ffffff" 
                      fontSize="0.5rem" 
                      fontWeight="bold" 
                      textAnchor="middle" 
                      alignmentBaseline="middle"
                    >
                      {deg}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Interactive Rotation Dial Handle (Yellow handle extending out) */}
          {!isAligned && (
            <circle 
              cx={hx} 
              cy={hy} 
              r="10" 
              fill="var(--gold-light)" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              style={{ cursor: 'grab', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
              onMouseDown={(e) => handlePointerDown(e, 'rotation')}
              onTouchStart={(e) => handlePointerDown(e, 'rotation')}
            />
          )}
        </svg>
      </div>

      {/* Alignment Status HUD */}
      <div className={`alignment-status ${isAligned ? 'aligned' : 'not-aligned'}`}>
        {isAligned 
          ? '🎯 Protractor Aligned! Now read the angle.' 
          : !isCenterAligned 
          ? '📍 Step 1: Drag protractor center to the vertex (white dot).' 
          : '🔄 Step 2: Rotate protractor (drag yellow handle) to align with red baseline.'}
      </div>

      {/* Controls for Fine-tuning / Accessibility */}
      {!isAligned && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" style={{ minWidth: 40 }} onClick={() => moveCenter(-6, 0)}>◀ Left</button>
            <button className="btn btn-outline btn-sm" style={{ minWidth: 40 }} onClick={() => moveCenter(0, -6)}>▲ Up</button>
            <button className="btn btn-outline btn-sm" style={{ minWidth: 40 }} onClick={() => moveCenter(0, 6)}>▼ Down</button>
            <button className="btn btn-outline btn-sm" style={{ minWidth: 40 }} onClick={() => moveCenter(6, 0)}>Right ▶</button>
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={() => rotateProtractor(-5)}>🔄 Rotate Left (-5°)</button>
            <button className="btn btn-outline btn-sm" onClick={() => rotateProtractor(5)}>🔄 Rotate Right (+5°)</button>
            <button className="btn btn-green btn-sm" onClick={autoAlign}>💡 Auto-Align</button>
          </div>
        </div>
      )}

      {/* Degree Answer Submission Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
        <input 
          type="number" 
          placeholder="Degrees (e.g. 60)" 
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setFeedback(null); }}
          disabled={!isAligned}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: '2px solid rgba(255,255,255,0.15)',
            background: 'rgba(0,0,0,0.2)',
            color: 'white',
            width: 160,
            fontSize: '1.05rem',
            textAlign: 'center',
            outline: 'none',
            fontFamily: 'var(--font-display)',
            fontWeight: 'bold'
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={!isAligned || !inputVal}>
          Submit Reading 🔎
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
