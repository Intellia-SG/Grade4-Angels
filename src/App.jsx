import { useState, useEffect } from 'react';
import IntroScreen from './components/phases/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';
import { sounds, stopNarration } from './utils/audio';

const FLOATING_ITEMS = [
  { char: '📐', size: '2rem', delay: '0s', duration: '20s', left: '10%', color: 'rgba(76, 175, 80, 0.22)' }, // acute green
  { char: 'θ', size: '2.5rem', delay: '3s', duration: '25s', left: '80%', color: 'rgba(255, 255, 255, 0.15)' },
  { char: '°', size: '3.2rem', delay: '6s', duration: '18s', left: '30%', color: 'rgba(255, 255, 255, 0.15)' },
  { char: '∠', size: '2.2rem', delay: '1s', duration: '22s', left: '70%', color: 'rgba(74, 144, 217, 0.22)' }, // right blue
  { char: '⦝', size: '1.8rem', delay: '8s', duration: '30s', left: '15%', color: 'rgba(255, 255, 255, 0.15)' },
  { char: '⦞', size: '2rem', delay: '12s', duration: '27s', left: '88%', color: 'rgba(255, 255, 255, 0.15)' },
  { char: '⦟', size: '2.4rem', delay: '4s', duration: '24s', left: '45%', color: 'rgba(255, 255, 255, 0.15)' },
  { char: '◿', size: '2.8rem', delay: '10s', duration: '21s', left: '55%', color: 'rgba(255, 255, 255, 0.15)' },
  // Floating angle numbers with themed colors
  { char: '90°', size: '1.8rem', delay: '2s', duration: '23s', left: '25%', color: 'rgba(74, 144, 217, 0.25)' },  // right blue
  { char: '180°', size: '2rem', delay: '5s', duration: '28s', left: '75%', color: 'rgba(156, 39, 176, 0.25)' },  // straight purple
  { char: '360°', size: '2.2rem', delay: '9s', duration: '26s', left: '5%', color: 'rgba(255, 193, 7, 0.25)' },   // full gold
  { char: '45°', size: '1.6rem', delay: '11s', duration: '21s', left: '60%', color: 'rgba(76, 175, 80, 0.25)' },  // acute green
  { char: '60°', size: '1.7rem', delay: '7s', duration: '24s', left: '38%', color: 'rgba(76, 175, 80, 0.25)' },   // acute green
  { char: '120°', size: '1.9rem', delay: '13s', duration: '29s', left: '92%', color: 'rgba(255, 152, 0, 0.25)' }, // obtuse orange
  { char: '270°', size: '2.1rem', delay: '15s', duration: '22s', left: '50%', color: 'rgba(229, 57, 53, 0.25)' },  // reflex red
  { char: '30°', size: '1.5rem', delay: '16s', duration: '20s', left: '18%', color: 'rgba(76, 175, 80, 0.25)' }   // acute green
];

export default function App() {
  // --- Persistent States ---
  const [activePhase, setActivePhase] = useState(() => {
    return localStorage.getItem('geo_active_phase') || 'intro';
  });

  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('geo_audio_enabled');
    return saved === null ? true : saved === 'true';
  });

  const [xp, setXp] = useState(() => {
    return parseInt(localStorage.getItem('geo_xp') || '0', 10);
  });

  const [worldScores, setWorldScores] = useState(() => {
    return JSON.parse(localStorage.getItem('geo_world_scores') || '{}');
  });

  const [simStationsComplete, setSimStationsComplete] = useState(() => {
    return JSON.parse(localStorage.getItem('geo_sim_complete') || '[false, false, false]');
  });

  const [badges, setBadges] = useState(() => {
    return JSON.parse(localStorage.getItem('geo_badges') || '[]');
  });

  const [maxStreak, setMaxStreak] = useState(() => {
    return parseInt(localStorage.getItem('geo_max_streak') || '0', 10);
  });

  const [stationBPerfect, setStationBPerfect] = useState(() => {
    const saved = localStorage.getItem('geo_station_b_perfect');
    return saved === null ? true : saved === 'true';
  });

  const [phaseComplete, setPhaseComplete] = useState(() => {
    return JSON.parse(localStorage.getItem('geo_phase_complete') || JSON.stringify({
      wonder: false,
      story: false,
      simulate: false,
      play: false,
      reflect: false
    }));
  });

  // --- Synchronization & Persistence ---
  useEffect(() => {
    localStorage.setItem('geo_active_phase', activePhase);
  }, [activePhase]);

  useEffect(() => {
    localStorage.setItem('geo_audio_enabled', audioEnabled.toString());
    if (!audioEnabled) {
      stopNarration();
    }
  }, [audioEnabled]);

  useEffect(() => {
    localStorage.setItem('geo_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('geo_world_scores', JSON.stringify(worldScores));
  }, [worldScores]);

  useEffect(() => {
    localStorage.setItem('geo_sim_complete', JSON.stringify(simStationsComplete));
  }, [simStationsComplete]);

  useEffect(() => {
    localStorage.setItem('geo_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('geo_max_streak', maxStreak.toString());
  }, [maxStreak]);

  useEffect(() => {
    localStorage.setItem('geo_station_b_perfect', stationBPerfect.toString());
  }, [stationBPerfect]);

  useEffect(() => {
    localStorage.setItem('geo_phase_complete', JSON.stringify(phaseComplete));
  }, [phaseComplete]);

  // --- Navigation locks ---
  const isPhaseUnlocked = (phase) => {
    if (phase === 'wonder') return true;
    if (phase === 'story') return phaseComplete.wonder;
    if (phase === 'simulate') return phaseComplete.story;
    if (phase === 'play') return phaseComplete.simulate;
    if (phase === 'reflect') return phaseComplete.play || Object.keys(worldScores).length > 0;
    return false;
  };

  const navigateToPhase = (phase) => {
    if (isPhaseUnlocked(phase)) {
      sounds.click();
      setActivePhase(phase);
    }
  };

  // --- Reset All Progress ---
  const handleRestartJourney = () => {
    sounds.click();
    localStorage.clear();
    setXp(0);
    setWorldScores({});
    setSimStationsComplete([false, false, false]);
    setBadges([]);
    setMaxStreak(0);
    setStationBPerfect(true);
    setPhaseComplete({
      wonder: false,
      story: false,
      simulate: false,
      play: false,
      reflect: false
    });
    setActivePhase('intro');
  };

  // --- Navigation Header Item Helper ---
  const renderJourneyStep = (phaseName, stepNum, label) => {
    const active = activePhase === phaseName;
    const completed = phaseComplete[phaseName];
    const unlocked = isPhaseUnlocked(phaseName);

    return (
      <div 
        className={`journey-step ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
        style={{ cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.45 }}
        onClick={() => unlocked && navigateToPhase(phaseName)}
        title={unlocked ? `Go to ${label}` : `${label} is locked`}
      >
        <div className="journey-step-dot">
          {completed ? '✓' : stepNum}
        </div>
        <span className="journey-step-label">{label}</span>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Background Math Floating Elements */}
      <div className="floating-elements">
        {FLOATING_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="floating-element"
            style={{
              left: item.left,
              fontSize: item.size,
              animationDelay: item.delay,
              animationDuration: item.duration,
              color: item.color || 'rgba(255, 255, 255, 0.15)'
            }}
          >
            {item.char}
          </div>
        ))}
      </div>

      {/* Global Controls */}
      <button 
        className="audio-toggle-btn" 
        onClick={() => { sounds.click(); setAudioEnabled(a => !a); }}
        title={audioEnabled ? "Mute Narration" : "Enable Narration"}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>

      {activePhase !== 'intro' && (
        <button className="home-btn" onClick={() => { sounds.click(); setActivePhase('intro'); }}>
          🏠 Intro
        </button>
      )}

      {/* 5-Phase Navigation Journey Bar */}
      {activePhase !== 'intro' && (
        <div className="journey-bar">
          {renderJourneyStep('wonder', 1, 'Wonder')}
          <div className={`journey-connector ${phaseComplete.wonder ? 'filled' : ''}`} />
          {renderJourneyStep('story', 2, 'Story')}
          <div className={`journey-connector ${phaseComplete.story ? 'filled' : ''}`} />
          {renderJourneyStep('simulate', 3, 'Simulate')}
          <div className={`journey-connector ${phaseComplete.simulate ? 'filled' : ''}`} />
          {renderJourneyStep('play', 4, 'Play Map')}
          <div className={`journey-connector ${phaseComplete.play ? 'filled' : ''}`} />
          {renderJourneyStep('reflect', 5, 'Reflect')}
        </div>
      )}

      {/* Render phase screens */}
      {activePhase === 'intro' && (
        <IntroScreen 
          onStart={() => setActivePhase('wonder')} 
          audioEnabled={audioEnabled} 
        />
      )}

      {activePhase === 'wonder' && (
        <WonderPhase 
          audioEnabled={audioEnabled}
          onComplete={() => {
            setPhaseComplete(prev => ({ ...prev, wonder: true }));
            setActivePhase('story');
          }}
        />
      )}

      {activePhase === 'story' && (
        <StoryPhase 
          audioEnabled={audioEnabled}
          onComplete={() => {
            setPhaseComplete(prev => ({ ...prev, story: true }));
            setActivePhase('simulate');
          }}
        />
      )}

      {activePhase === 'simulate' && (
        <SimulatePhase 
          audioEnabled={audioEnabled}
          simStationsComplete={simStationsComplete}
          setSimStationsComplete={setSimStationsComplete}
          setStationBPerfect={setStationBPerfect}
          onComplete={() => {
            setPhaseComplete(prev => ({ ...prev, simulate: true }));
            setActivePhase('play');
          }}
        />
      )}

      {activePhase === 'play' && (
        <PlayPhase 
          audioEnabled={audioEnabled}
          xp={xp}
          setXp={setXp}
          worldScores={worldScores}
          setWorldScores={setWorldScores}
          badges={badges}
          setBadges={setBadges}
          maxStreak={maxStreak}
          setMaxStreak={setMaxStreak}
          stationBPerfect={stationBPerfect}
          onComplete={() => {
            setPhaseComplete(prev => ({ ...prev, play: true }));
            setActivePhase('reflect');
          }}
        />
      )}

      {activePhase === 'reflect' && (
        <ReflectPhase 
          audioEnabled={audioEnabled}
          xp={xp}
          worldScores={worldScores}
          badges={badges}
          onRestart={handleRestartJourney}
        />
      )}
    </div>
  );
}
