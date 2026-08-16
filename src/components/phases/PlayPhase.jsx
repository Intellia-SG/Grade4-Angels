import { useState, useEffect, useRef } from 'react';
import { WORLDS, generateQuestionBank } from '../../utils/questionBank';
import QuestionRenderer from '../QuestionRenderer';
import { calcXP, calcStars, canUnlockWorld } from '../../utils/scoring';
import { checkBadges, BADGES } from '../../utils/badgeEngine';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { 
  playWorldIntro, 
  playReadQuestion, 
  playCorrectNarration, 
  playWrongNarration, 
  playWorldComplete 
} from '../../utils/narration';

export default function PlayPhase({ 
  xp, 
  setXp, 
  worldScores, 
  setWorldScores, 
  badges, 
  setBadges, 
  onComplete, 
  audioEnabled,
  maxStreak,
  setMaxStreak,
  stationBPerfect
}) {
  const [activeWorldId, setActiveWorldId] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [worldScore, setWorldScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(0); // 0: none, 1: hint1, 2: hint2
  const [showWorldComplete, setShowWorldComplete] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [badgeToast, setBadgeToast] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const narrationRef = useRef(null);
  const autoAdvanceTimeoutRef = useRef(null);

  const bank = generateQuestionBank();

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Filter questions for active world
  useEffect(() => {
    if (activeWorldId !== null) {
      const worldQs = bank.filter(q => q.world === activeWorldId);
      setSessionQuestions(worldQs);
      setQuestionIndex(0);
      setLives(3);
      setWorldScore(0);
      setStreak(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(0);
      setHintsUsed(0);
      setShowWorldComplete(false);
      setShowFailed(false);

      // Play intro narration
      const worldName = WORLDS[activeWorldId].name;
      if (audioEnabled) {
        narrationRef.current = narrate(playWorldIntro(worldName), true);
      }
    } else {
      stopNarration();
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [activeWorldId, audioEnabled]);

  // Read question narration when question index changes
  useEffect(() => {
    if (activeWorldId !== null && sessionQuestions.length > 0 && !showWorldComplete && !showFailed) {
      const q = sessionQuestions[questionIndex];
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(0);
      setHintsUsed(0);
      if (audioEnabled) {
        narrationRef.current = narrate(playReadQuestion(q.questionText), true);
      }
    }
  }, [questionIndex, sessionQuestions, activeWorldId, showWorldComplete, showFailed]);

  const [attemptsOnQuestion, setAttemptsOnQuestion] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [wrongShakeOption, setWrongShakeOption] = useState(null);

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    sounds.click();
    setSelectedOption(option);
    setWrongShakeOption(null);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    const q = sessionQuestions[questionIndex];
    const correct = selectedOption === q.correctAnswer;
    
    if (correct) {
      setIsAnswered(true);
      setIsCorrect(true);
      sounds.correct();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) {
        setMaxStreak(nextStreak);
      }
      setWorldScore(s => s + 1);
      
      // Calculate XP
      const earnedXP = calcXP(1, hintsUsed, nextStreak);
      setXp(x => x + earnedXP);

      if (audioEnabled) {
        narrationRef.current = narrate(playCorrectNarration(nextStreak), true);
      }

      // Auto advance
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        if (questionIndex + 1 < sessionQuestions.length) {
          setQuestionIndex(i => i + 1);
          setAttemptsOnQuestion(0);
        } else {
          handleWorldComplete(worldScore + 1);
        }
      }, 2200);
    } else {
      sounds.wrong();
      setStreak(0);
      setWrongShakeOption(selectedOption);
      const nextAttempts = attemptsOnQuestion + 1;
      setAttemptsOnQuestion(nextAttempts);

      setLives(l => {
        const nextL = l - 1;
        if (nextL <= 0) {
          setIsAnswered(true);
          setIsCorrect(false);
          setShowFailed(true);
          if (audioEnabled) {
            narrationRef.current = narrate([ { text: "Oh no! You ran out of hearts. Let's return to the map and try again!", style: 'thinking', pause: 0 } ], true);
          }
        }
        return nextL;
      });

      if (nextAttempts >= 2) {
        setIsAnswered(true);
        setIsCorrect(false);
        if (audioEnabled) {
          narrationRef.current = narrate(playWrongNarration(), true);
        }
      } else {
        // First wrong attempt: auto show hint & allow retry!
        const nextHint = Math.min(2, showHint + 1);
        setShowHint(nextHint);
        setHintsUsed(h => h + 1);
        if (audioEnabled) {
          const hintText = nextHint === 1 ? q.hint1 : q.hint2;
          narrationRef.current = narrate([ { text: `Incorrect attempt! ${hintText}`, style: 'encouragement', pause: 0 } ], true);
        }
      }
    }
  };

  const handleSkipOrNext = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    sounds.click();
    setSelectedOption(null);
    setIsAnswered(false);
    setAttemptsOnQuestion(0);
    setWrongShakeOption(null);
    if (questionIndex + 1 < sessionQuestions.length) {
      setQuestionIndex(i => i + 1);
    } else {
      handleWorldComplete(worldScore);
    }
  };

  const handleUseHint = () => {
    sounds.click();
    const nextHint = Math.min(2, showHint + 1);
    setHintsUsed(h => h + 1);
    setShowHint(nextHint);
    setShowHintModal(true);

    const q = sessionQuestions[questionIndex];
    const hintText = nextHint === 1 ? q.hint1 : q.hint2;
    if (audioEnabled && hintText) {
      narrationRef.current = narrate([ { text: `Hint: ${hintText}`, style: 'instruction', pause: 0 } ], true);
    }
  };

  const handleWorldComplete = (finalScore) => {
    const worldName = WORLDS[activeWorldId].name;
    const earnedStars = calcStars(finalScore, 10);
    
    const updatedScores = {
      ...worldScores,
      [activeWorldId]: { score: finalScore, total: 10, stars: earnedStars }
    };
    setWorldScores(updatedScores);

    if (audioEnabled) {
      narrationRef.current = narrate(playWorldComplete(worldName, finalScore, 10), true);
    }

    // Check Badges
    const mockState = {
      phaseComplete: { wonder: true, story: true, simulate: true, play: false, reflect: false },
      simStationsComplete: [true, true, true],
      worldScores: updatedScores,
      maxStreak: Math.max(maxStreak, streak),
      stationBPerfect,
      badges
    };

    const keys = Object.keys(updatedScores);
    if (keys.length === 10) {
      mockState.phaseComplete.play = true;
    }

    const newBadges = checkBadges(mockState);
    if (newBadges.length > 0) {
      sounds.badge();
      setBadges(prev => [...prev, ...newBadges]);
      setBadgeToast(newBadges[0]);
      setTimeout(() => {
        setBadgeToast(null);
      }, 4000);
    }

    setShowWorldComplete(true);
  };

  const retryWorld = () => {
    sounds.click();
    setLives(3);
    setWorldScore(0);
    setStreak(0);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setAttemptsOnQuestion(0);
    setShowHint(0);
    setHintsUsed(0);
    setShowFailed(false);
    setShowWorldComplete(false);
  };

  const exitToMap = () => {
    sounds.click();
    setShowExitConfirm(false);
    setActiveWorldId(null);
  };

  // Determine if a world is locked
  const isWorldLocked = (worldId) => {
    if (worldId === 0) return false;
    const prev = worldScores[worldId - 1];
    return !prev || prev.score < 5; // Must score >= 5 in previous world to unlock next
  };

  const isAllWorldsPassed = () => {
    const keys = Object.keys(worldScores);
    if (keys.length < 10) return false;
    return Object.values(worldScores).every(s => s && s.score >= 5);
  };

  if (activeWorldId === null) {
    // RENDER WORLD MAP
    return (
      <div className="play-phase">
        <div className="play-header">
          <span className="play-xp-badge">⭐ {xp} Cumulative XP</span>
          <h2 className="play-title">Explore Landmark Worlds 🌍</h2>
          <p className="play-subtitle">Solve geometry puzzles in cities around the globe. Score 5/10 to unlock the next world!</p>
        </div>

        <div className="world-map">
          {WORLDS.map(w => {
            const locked = isWorldLocked(w.id);
            const scoreRecord = worldScores[w.id];
            
            return (
              <div 
                key={w.id} 
                className={`world-card ${locked ? 'locked' : 'unlocked'} ${scoreRecord ? 'completed' : ''}`}
                style={{ '--world-color': w.color }}
                onClick={() => !locked && setActiveWorldId(w.id)}
              >
                {locked && <div className="world-lock">🔒</div>}
                
                <div className="world-icon">{w.icon}</div>
                <div className="world-name">{w.name}</div>
                <div className="world-desc">{w.desc}</div>

                {scoreRecord && (
                  <div>
                    <div className="world-stars">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} style={{ color: i < scoreRecord.stars ? 'var(--gold)' : 'rgba(255,255,255,0.15)' }}>★</span>
                      ))}
                      <span className="world-score">{scoreRecord.score} / {scoreRecord.total}</span>
                    </div>
                  </div>
                )}

                {!locked && (
                  <button className="world-play-btn" style={{ background: w.color }}>
                    {scoreRecord ? 'Replay World 🔄' : 'Enter Landmark 🚀'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button 
            className={`btn btn-lg ${isAllWorldsPassed() ? 'btn-primary' : 'btn-outline'}`}
            onClick={onComplete}
          >
            Proceed to Reflection Phase 🌟
          </button>
          {!isAllWorldsPassed() && (
            <p className="wonder-subtext" style={{ fontSize: '0.8rem' }}>
              Tip: Complete all 10 worlds with 5/10 score to unlock the World Traveler badge!
            </p>
          )}
        </div>
      </div>
    );
  }

  // RENDER QUIZ ENGINE
  const q = sessionQuestions[questionIndex];
  if (!q) return null;

  return (
    <div className="play-phase">
      {/* Quiz HUD */}
      <div className="hud">
        <button className="home-btn" onClick={() => setShowExitConfirm(true)} style={{ position: 'static' }}>
          ◀ Map
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="hud-item">
            ❤️ <span style={{ marginLeft: 4 }}>{lives}</span>
          </div>
          <div className="hud-item">
            🔥 <span style={{ marginLeft: 4 }}>{streak}</span>
          </div>
          <div className="hud-item" style={{ color: 'var(--gold)' }}>
            ⭐ {xp} XP
          </div>
        </div>
        <div className="hud-item" style={{ fontSize: '0.85rem' }}>
          Q: {questionIndex + 1} / 10
        </div>
      </div>

      {/* World Name Badge */}
      <div className="play-world-badge" style={{ background: WORLDS[activeWorldId].color }}>
        {WORLDS[activeWorldId].name}
      </div>

      {/* Question Card */}
      <div className="question-card">
        {/* Dynamic Graphic SVG illustration */}
        <QuestionRenderer question={q} />

        <h3 className="question-text">{q.questionText}</h3>

        {/* Options grid */}
        <div className="options-grid">
          {q.options.map((opt, i) => {
            const isSel = selectedOption === opt;
            const isCorrectOpt = opt === q.correctAnswer;
            const isShake = wrongShakeOption === opt;
            
            let btnClass = '';
            if (isSel) btnClass += ' selected';
            if (isShake) btnClass += ' wrong-shake';
            if (isAnswered) {
              btnClass += ' disabled';
              if (isCorrectOpt) btnClass += ' correct';
              else if (isSel) btnClass += ' wrong';
            }

            return (
              <button 
                key={i}
                className={`option-btn${btnClass}`}
                onClick={() => handleOptionSelect(opt)}
              >
                {typeof opt === 'number' && q.type === 'mcq_degrees' ? `${opt}°` : opt}
              </button>
            );
          })}
        </div>

        {/* Hints and Submissions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '16px 0', flexWrap: 'wrap' }}>
          {!isAnswered ? (
            <>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={handleUseHint}
                disabled={showHint >= 2}
              >
                Need a Hint? 💡 ({2 - showHint} left)
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button className="btn btn-green" onClick={handleSkipOrNext}>
              {questionIndex + 1 === sessionQuestions.length ? 'Finish World 🏆' : 'Next Question ➡️'}
            </button>
          )}
        </div>

        {/* Hints / Explanations Text Area */}
        {showHint > 0 && !isAnswered && (
          <div style={{ background: 'rgba(255, 193, 7, 0.08)', border: '1px dashed var(--gold)', borderRadius: 12, padding: 14, marginTop: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Hint {showHint}:</strong> {showHint === 1 ? q.hint1 : q.hint2}
          </div>
        )}

        {isAnswered && (
          <div style={{
            background: isCorrect ? 'rgba(76,175,80,0.12)' : 'rgba(239,83,80,0.12)',
            border: `1px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
            borderRadius: 12,
            padding: 14,
            marginTop: 12,
            fontSize: '0.9rem',
            textAlign: 'left'
          }}>
            <strong>{isCorrect ? '✅ Fantastic Work! Spot on!' : '❌ Let\'s Review!'}</strong>
            <p style={{ marginTop: 4, color: 'var(--text-secondary)' }}>{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Mascot Companion */}
      <div className="mascot-container" style={{ marginTop: 16 }}>
        <div className={`mascot ${isAnswered ? (isCorrect ? 'happy' : 'thinking') : 'thinking'}`}>
          🤖
        </div>
        <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>
          {isAnswered 
            ? (isCorrect ? "Fantastic Work! You've got a sharp eye for angles!" : "Let's learn from this explanation and tackle the next challenge!")
            : "Think about the angle type or turn degrees! Use hints if needed!"}
        </div>
      </div>

      {/* Animated Hint Popup Modal */}
      {showHintModal && (
        <div className="modal-backdrop" onClick={() => setShowHintModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💡</div>
            <h3 className="modal-title">Helpful Hint</h3>
            <p className="modal-body">
              <strong>Hint {showHint}:</strong> {showHint === 1 ? q.hint1 : q.hint2}
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowHintModal(false)} style={{ marginTop: 16 }}>
              Got It! 👍
            </button>
          </div>
        </div>
      )}

      {/* Animated Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="modal-backdrop" onClick={() => setShowExitConfirm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🗺️</div>
            <h3 className="modal-title">Return to World Map?</h3>
            <p className="modal-body">
              Are you sure you want to exit to the World Map? Your current XP and completed scores will be saved!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setShowExitConfirm(false)}>
                Keep Practicing
              </button>
              <button className="btn btn-primary btn-sm" onClick={exitToMap}>
                Yes, Exit to Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* World Complete Overlay Modal */}
      {showWorldComplete && (
        <div className="modal-backdrop">
          <div className="world-complete-card modal-card">
            <div className="world-complete-icon">🎉</div>
            <div className="world-complete-title">Level Complete!</div>
            <p className="wonder-subtext">Congratulations! You cleared {WORLDS[activeWorldId].name}!</p>
            
            <div className="world-complete-score">Score: {worldScore}/10</div>
            
            {/* Stars animating */}
            <div className="world-complete-stars">
              {Array.from({ length: 3 }).map((_, i) => (
                <span 
                  key={i} 
                  className={`world-star ${i < calcStars(worldScore, 10) ? 'earned' : ''}`}
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  ★
                </span>
              ))}
            </div>

            <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>
              XP Earned: <span className="world-complete-xp">+{worldScore * 10} XP</span>
            </p>

            <button className="btn btn-primary" onClick={exitToMap}>
              Return to Map 🌍
            </button>
          </div>
        </div>
      )}

      {/* Out of Hearts Modal Overlay */}
      {showFailed && (
        <div className="modal-backdrop">
          <div className="world-complete-card modal-card" style={{ border: '2px solid var(--red)' }}>
            <div className="world-complete-icon">💔</div>
            <div className="world-complete-title">Out of Hearts!</div>
            <p className="wonder-subtext" style={{ marginBottom: 20 }}>
              No hearts left for this landmark. Review your angle types and let's try again!
            </p>
            
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={exitToMap}>
                Exit to Map
              </button>
              <button className="btn btn-primary" onClick={retryWorld}>
                Retry World 🔄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Unlock Notification Toast */}
      {badgeToast && (
        <div className="badge-toast">
          <div className="badge-item-icon">🏆</div>
          <div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>New Achievement!</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              {BADGES.find(b => b.id === badgeToast)?.label}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.9 }}>
              {BADGES.find(b => b.id === badgeToast)?.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
