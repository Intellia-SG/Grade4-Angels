import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { 
  playReflectIntro, 
  playReflectCorrect, 
  playReflectWrong, 
  playReflectConfidence, 
  playReflectCertificate 
} from '../../utils/narration';
import { BADGES } from '../../utils/badgeEngine';

const REFLECT_QUESTIONS = [
  {
    question: "What is an acute angle?",
    options: [
      { text: "A turn smaller than 90° (sharp corner)", correct: true },
      { text: "A perfect 90° square corner", correct: false },
      { text: "A wide turn greater than 90°", correct: false }
    ],
    explanation: "Acute angles are sharp and small, measuring between 0° and 90°."
  },
  {
    question: "What is the measure of a straight angle?",
    options: [
      { text: "Exactly 90°", correct: false },
      { text: "Exactly 180° (flat line)", correct: true },
      { text: "Exactly 360° (full circle)", correct: false }
    ],
    explanation: "A straight angle forms a straight flat line and measures exactly 180°."
  },
  {
    question: "A reflex angle is defined as:",
    options: [
      { text: "An angle smaller than 90°", correct: false },
      { text: "An angle between 90° and 180°", correct: false },
      { text: "An angle larger than 180° but smaller than 360°", correct: true }
    ],
    explanation: "Reflex angles are massive external turns, larger than a flat line but smaller than a full circle."
  }
];

export default function ReflectPhase({ xp, worldScores, badges, audioEnabled, onRestart }) {
  const [step, setStep] = useState('review'); // 'review', 'confidence', 'certificate'
  const [reviewIdx, setReviewIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [playerName, setPlayerName] = useState('Wei Ming');
  const [confetti, setConfetti] = useState([]);
  const narrationRef = useRef(null);

  // Play narration segments based on step transitions
  useEffect(() => {
    if (step === 'review') {
      if (audioEnabled) {
        narrationRef.current = narrate(playReflectIntro(), true);
      }
    } else if (step === 'confidence') {
      if (audioEnabled) {
        narrationRef.current = narrate(playReflectConfidence(), true);
      }
    } else if (step === 'certificate') {
      // Calculate percent correct
      const results = Object.values(worldScores);
      const totalCorrect = results.reduce((sum, r) => sum + (r ? r.score : 0), 0);
      const totalQs = results.length * 10 || 100;
      const pct = Math.round((totalCorrect / totalQs) * 100) || 0;
      
      if (audioEnabled) {
        narrationRef.current = narrate(playReflectCertificate(pct), true);
      }
      triggerConfetti();
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [step, audioEnabled]);

  const handleOptionSelect = (option) => {
    if (answered) return;
    sounds.click();
    setSelectedOpt(option);
    setAnswered(true);

    if (option.correct) {
      sounds.correct();
      if (audioEnabled) narrationRef.current = narrate(playReflectCorrect(), true);
      setTimeout(() => {
        if (reviewIdx + 1 < REFLECT_QUESTIONS.length) {
          setReviewIdx(i => i + 1);
          setSelectedOpt(null);
          setAnswered(false);
        } else {
          setStep('confidence');
        }
      }, 2500);
    } else {
      sounds.wrong();
      if (audioEnabled) narrationRef.current = narrate(playReflectWrong(), true);
    }
  };

  const handleConfidenceSelect = (level) => {
    sounds.click();
    setConfidence(level);
    setTimeout(() => {
      setStep('certificate');
    }, 1200);
  };

  const triggerConfetti = () => {
    const pieces = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      backgroundColor: ['#ffc107', '#2196f3', '#4caf50', '#e91e63', '#ffeb3b', '#9c27b0'][i % 6],
      width: `${6 + Math.random() * 8}px`,
      height: `${12 + Math.random() * 12}px`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${3 + Math.random() * 3}s`
    }));
    setConfetti(pieces);
  };

  // Stats summaries
  const totalCorrect = Object.values(worldScores).reduce((sum, r) => sum + (r ? r.score : 0), 0);
  const totalStars = Object.values(worldScores).reduce((sum, r) => sum + (r ? r.stars : 0), 0);

  return (
    <div className="reflect-phase">
      {/* Confetti Rain */}
      {step === 'certificate' && (
        <div className="confetti-container">
          {confetti.map(c => (
            <div 
              key={c.id} 
              className="confetti-piece"
              style={{
                left: c.left,
                backgroundColor: c.backgroundColor,
                width: c.width,
                height: c.height,
                animationDelay: c.animationDelay,
                animationDuration: c.animationDuration
              }}
            />
          ))}
        </div>
      )}

      <div className="reflect-header">
        <h2 className="play-title">Reflect on Your Learning 🌟</h2>
        <p className="play-subtitle">Consolidate your knowledge and receive your geometry award.</p>
      </div>

      {step === 'review' && (
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot happy" style={{ width: 60, height: 60, fontSize: '1.8rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>
              Let's test our angle facts together! Answer the review questions below.
            </div>
          </div>

          <h3 className="reflect-card-title">
            Question {reviewIdx + 1} of {REFLECT_QUESTIONS.length}
          </h3>
          <p className="question-text" style={{ fontSize: '1.15rem' }}>
            {REFLECT_QUESTIONS[reviewIdx].question}
          </p>

          <div className="reflect-options">
            {REFLECT_QUESTIONS[reviewIdx].options.map((opt, i) => {
              const isSel = selectedOpt === opt;
              let optClass = '';
              if (isSel) {
                optClass = opt.correct ? ' correct' : ' wrong';
              } else if (answered && opt.correct) {
                optClass = ' correct';
              }

              return (
                <button
                  key={i}
                  className={`reflect-option${optClass}`}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={answered && opt.correct}
                >
                  <span className="reflect-option-emoji">{opt.correct && answered ? '✅' : isSel ? '❌' : '✏️'}</span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {answered && !selectedOpt.correct && (
            <div style={{
              background: 'rgba(239,83,80,0.12)',
              border: '1px solid var(--red)',
              borderRadius: 12,
              padding: 12,
              marginTop: 12,
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Hint:</strong> {REFLECT_QUESTIONS[reviewIdx].explanation}
            </div>
          )}

          <div className="reflect-progress">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div 
                key={i} 
                className={`reflect-dot ${i === reviewIdx ? 'active' : i < reviewIdx ? 'done' : ''}`} 
              />
            ))}
          </div>
        </div>
      )}

      {step === 'confidence' && (
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot happy" style={{ width: 60, height: 60, fontSize: '1.8rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>
              How confident do you feel about working with angles now? Be honest!
            </div>
          </div>

          <h3 className="reflect-card-title" style={{ marginBottom: 20 }}>Self-Assessment</h3>

          <div className="confidence-grid">
            <button 
              className={`confidence-btn ${confidence === 'high' ? 'selected' : ''}`}
              style={{ '--conf-color': 'var(--green-light)' }}
              onClick={() => handleConfidenceSelect('high')}
            >
              <span className="confidence-emoji">🤩</span>
              <div style={{ textAlign: 'left' }}>
                <div className="confidence-label">Super Confident!</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>I can identify, measure, and solve angles easily.</div>
              </div>
            </button>

            <button 
              className={`confidence-btn ${confidence === 'medium' ? 'selected' : ''}`}
              style={{ '--conf-color': 'var(--blue-bright)' }}
              onClick={() => handleConfidenceSelect('medium')}
            >
              <span className="confidence-emoji">😊</span>
              <div style={{ textAlign: 'left' }}>
                <div className="confidence-label">Feeling Good!</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>I understand acute, right, and obtuse angles.</div>
              </div>
            </button>

            <button 
              className={`confidence-btn ${confidence === 'low' ? 'selected' : ''}`}
              style={{ '--conf-color': 'var(--coral)' }}
              onClick={() => handleConfidenceSelect('low')}
            >
              <span className="confidence-emoji">🤔</span>
              <div style={{ textAlign: 'left' }}>
                <div className="confidence-label">Need More Practice</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>I want to play the simulation stations again.</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {step === 'certificate' && (
        <div className="certificate-card">
          <div className="cert-badge">🏆</div>
          <h2 className="cert-title">GRADUATION CERTIFICATE</h2>
          <p className="cert-subtitle">Angles in Geometry Adventure</p>

          <div style={{ margin: '20px 0' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>This certificate is proudly awarded to:</p>
            <input 
              type="text" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '2px dashed var(--gold)',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%',
                outline: 'none',
                padding: '6px 0',
                marginTop: 6
              }}
            />
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', maxWidth: '380px', margin: '0 auto' }}>
            For successfully traveling to 10 world landmark cities, completing all 3 Simulation Stations, and mastering fourth-grade geometry angles!
          </p>

          {/* Cumulative Stats */}
          <div className="cert-stats">
            <div className="cert-stat">
              <div className="cert-stat-value">⭐ {xp}</div>
              <div className="cert-stat-label">Total XP</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value">★ {totalStars}</div>
              <div className="cert-stat-label">Stars Earned</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value">{totalCorrect}/100</div>
              <div className="cert-stat-label">Correct Answers</div>
            </div>
          </div>

          {/* Badges Earned Dashboard inside certificate */}
          <h4 style={{ fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Unlocked Achievements ({badges.length})
          </h4>
          <div className="badges-grid">
            {BADGES.map(b => {
              const isUnlocked = badges.includes(b.id);
              return (
                <div key={b.id} className={`badge-item-card ${isUnlocked ? 'unlocked' : ''}`} title={b.description}>
                  <div className="badge-item-icon">{isUnlocked ? b.label.split(' ')[0] : '🔒'}</div>
                  <div className="badge-item-label">{b.label.split(' ').slice(1).join(' ')}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary" onClick={onRestart}>
              Play Again 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
