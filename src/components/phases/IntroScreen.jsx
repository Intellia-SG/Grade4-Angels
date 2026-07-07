import { useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { playIntroNarration } from '../../utils/narration';

export default function IntroScreen({ onStart, audioEnabled }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      narrationRef.current = narrate(playIntroNarration(), true);
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [audioEnabled]);

  const handleStart = () => {
    sounds.click();
    onStart();
  };

  const stepsPreview = [
    { label: '1. Wonder', desc: 'Book opening puzzle', icon: '📖' },
    { label: '2. Story', desc: 'World tour discovery', icon: '🗼' },
    { label: '3. Simulate', desc: '3 hands-on stations', icon: '📐' },
    { label: '4. Play Map', desc: '100-question quest', icon: '🌍' },
    { label: '5. Reflect', desc: 'Graduation review', icon: '🎓' }
  ];

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ GRADE 4 GEOMETRY UNIT</div>
      
      <h1 className="intro-title">Angles in Geometry</h1>
      
      <p className="intro-desc">
        Embark on a virtual journey around the globe! Discover how angles are formed, interact with virtual protractors, and solve puzzles at world landmarks.
      </p>

      {/* 5-Phase Learner Journey Map Preview */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your 5-Step Learning Pathway</h3>
        
        <div className="intro-journey-steps">
          {stepsPreview.map((step, idx) => (
            <div key={idx} className="intro-journey-step">
              <div className="intro-journey-icon">{step.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{step.label}</div>
                <div className="intro-journey-desc">{step.desc}</div>
              </div>
              {idx + 1 < stepsPreview.length && (
                <div className="intro-journey-arrow">➔</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart}>
        Start Adventure 🚀
      </button>
    </div>
  );
}
