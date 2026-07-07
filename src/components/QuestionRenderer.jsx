import React from 'react';

export default function QuestionRenderer({ question }) {
  const { visual } = question;

  if (visual === 'angle') {
    const deg = question.degrees || 0;
    const rad = (180 - deg) * (Math.PI / 180);
    const rx = 150 + 100 * Math.cos(rad);
    const ry = 150 - 100 * Math.sin(rad);

    let arcPath = '';
    if (deg > 0) {
      const arcRad = 35;
      const startX = 150 - arcRad;
      const startY = 150;
      const endX = 150 + arcRad * Math.cos(rad);
      const endY = 150 - arcRad * Math.sin(rad);
      const largeArcFlag = deg > 180 ? 1 : 0;
      arcPath = `M ${startX} ${startY} A ${arcRad} ${arcRad} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    }

    return (
      <div style={{ width: 260, height: 200, margin: '0 auto', background: 'rgba(0,0,0,0.2)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        <svg width="100%" height="100%" viewBox="0 0 300 220">
          {/* Base Grid */}
          <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Vertex center */}
          <circle cx="150" cy="150" r="5" fill="#ffffff" />
          
          {/* Baseline ray (fixed left) */}
          <line x1="150" y1="150" x2="50" y2="150" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
          
          {/* Rotating ray */}
          <line x1="150" y1="150" x2={rx} y2={ry} stroke="var(--blue-bright)" strokeWidth="4" strokeLinecap="round" />

          {/* Shaded opening */}
          {arcPath && (
            <path d={`M 150 150 L 115 150 ${arcPath} Z`} fill="rgba(255, 193, 7, 0.1)" stroke="none" />
          )}

          {/* Arc line */}
          {arcPath && (
            <path d={arcPath} fill="none" stroke="var(--gold)" strokeWidth="2.5" />
          )}
        </svg>
      </div>
    );
  }

  if (visual === 'clock') {
    const hour = question.clockHour !== undefined ? question.clockHour : 12;
    // Calculate hand rotations
    const minuteAngle = 0; // standard top (12 o'clock)
    const hourAngle = hour * 30; // 30° per hour

    const hourRad = (hourAngle - 90) * (Math.PI / 180);
    const minRad = (minuteAngle - 90) * (Math.PI / 180);

    // Hands lengths
    const hx = 100 + 40 * Math.cos(hourRad);
    const hy = 100 + 40 * Math.sin(hourRad);
    const mx = 100 + 65 * Math.cos(minRad);
    const my = 100 + 65 * Math.sin(minRad);

    return (
      <div style={{ width: 200, height: 200, margin: '0 auto', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle cx="100" cy="100" r="4" fill="#ffffff" />

          {/* Hour markers numbers */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => {
            const numAngle = num * 30;
            const numRad = (numAngle - 90) * (Math.PI / 180);
            const tx = 100 + 70 * Math.cos(numRad);
            const ty = 100 + 70 * Math.sin(numRad);
            return (
              <text 
                key={num} 
                x={tx} 
                y={ty + 3} 
                fill="rgba(255,255,255,0.6)" 
                fontSize="0.65rem" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {num}
              </text>
            );
          })}

          {/* Hour hand */}
          <line x1="100" y1="100" x2={hx} y2={hy} stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
          {/* Minute hand */}
          <line x1="100" y1="100" x2={mx} y2={my} stroke="var(--blue-bright)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (visual === 'straight_line') {
    const angleA = question.angleA || 120;
    const rad = (180 - angleA) * (Math.PI / 180);
    const rx = 150 + 90 * Math.cos(rad);
    const ry = 150 - 90 * Math.sin(rad);

    return (
      <div style={{ width: 260, height: 180, margin: '0 auto', background: 'rgba(0,0,0,0.2)', borderRadius: 16 }}>
        <svg width="100%" height="100%" viewBox="0 0 300 200">
          <line x1="30" y1="150" x2="270" y2="150" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="150" cy="150" r="5" fill="#ffffff" />
          <line x1="150" y1="150" x2={rx} y2={ry} stroke="var(--blue-bright)" strokeWidth="3" strokeLinecap="round" />

          {/* Angle A Arc */}
          <path d="M 120 150 A 30 30 0 0 0 138 118" fill="none" stroke="var(--gold)" strokeWidth="2" />
          <text x="100" y="130" fill="var(--gold)" fontSize="0.75rem" fontWeight="bold">{angleA}°</text>

          {/* Missing angle Arc */}
          <path d="M 138 118 A 30 30 0 0 0 180 150" fill="none" stroke="#f43f5e" strokeWidth="2" />
          <text x="180" y="130" fill="#f43f5e" fontSize="0.85rem" fontWeight="bold">x</text>
        </svg>
      </div>
    );
  }

  if (visual === 'around_point') {
    const angleA = question.angleA || 120;
    const angleB = question.angleB || 140;

    const radA = (180 - angleA) * (Math.PI / 180);
    const radB = (180 - (angleA + angleB)) * (Math.PI / 180);

    const ax = 150 + 80 * Math.cos(radA);
    const ay = 100 - 80 * Math.sin(radA);
    const bx = 150 + 80 * Math.cos(radB);
    const by = 100 - 80 * Math.sin(radB);

    return (
      <div style={{ width: 260, height: 180, margin: '0 auto', background: 'rgba(0,0,0,0.2)', borderRadius: 16 }}>
        <svg width="100%" height="100%" viewBox="0 0 300 200">
          <circle cx="150" cy="100" r="5" fill="#ffffff" />
          
          <line x1="150" y1="100" x2="230" y2="100" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="150" y1="100" x2={ax} y2={ay} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="150" y1="100" x2={bx} y2={by} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

          {/* Arcs */}
          <path d="M 175 100 A 25 25 0 0 0 162 78" fill="none" stroke="var(--gold)" strokeWidth="2" />
          <text x="175" y="80" fill="var(--gold)" fontSize="0.75rem" fontWeight="bold">{angleA}°</text>

          <path d="M 162 78 A 25 25 0 0 0 145 125" fill="none" stroke="var(--blue-bright)" strokeWidth="2" />
          <text x="115" y="105" fill="var(--blue-bright)" fontSize="0.75rem" fontWeight="bold">{angleB}°</text>

          <path d="M 145 125 A 25 25 0 0 0 175 100" fill="none" stroke="#f43f5e" strokeWidth="2" />
          <text x="170" y="125" fill="#f43f5e" fontSize="0.85rem" fontWeight="bold">y</text>
        </svg>
      </div>
    );
  }

  // Fallback if visual is 'none'
  return null;
}
