import { useState, useEffect, useRef } from 'react';
import AngleMakerStation from '../simulations/AngleMakerStation';
import ProtractorStation from '../simulations/ProtractorStation';
import AngleSumStation from '../simulations/AngleSumStation';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { playSimulateNarration } from '../../utils/narration';

const STATIONS = [
  { id: 0, title: 'Station A: Angle Maker', icon: '📐' },
  { id: 1, title: 'Station B: Protractor Detective', icon: '🔎' },
  { id: 2, title: 'Station C: Angle Sums', icon: '➕' }
];

export default function SimulatePhase({ 
  simStationsComplete, 
  setSimStationsComplete, 
  onComplete, 
  audioEnabled, 
  setStationBPerfect 
}) {
  const [activeStation, setActiveStation] = useState(0);
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);
  const narrationRef = useRef(null);

  // Play narration when active station changes
  useEffect(() => {
    setShowCompleteOverlay(false);
    if (audioEnabled) {
      narrationRef.current = narrate(playSimulateNarration(activeStation), true);
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [activeStation, audioEnabled]);

  const handleStationComplete = () => {
    sounds.click();
    
    // Mark global state complete
    setSimStationsComplete(prev => {
      const next = [...prev];
      next[activeStation] = true;
      return next;
    });

    setShowCompleteOverlay(true);
  };

  const handleNext = () => {
    sounds.click();
    setShowCompleteOverlay(false);
    
    if (activeStation + 1 < STATIONS.length) {
      setActiveStation(s => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="simulate-phase">
      {/* Simulation HUD/Progress */}
      <div className="hud">
        <div style={{ display: 'flex', gap: 6 }}>
          {STATIONS.map(st => (
            <button
              key={st.id}
              onClick={() => { sounds.click(); setActiveStation(st.id); }}
              className={`btn btn-sm ${activeStation === st.id ? 'btn-primary' : simStationsComplete[st.id] ? 'btn-green' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: 'auto' }}
            >
              {st.icon} {st.id === 0 ? 'Maker' : st.id === 1 ? 'Detective' : 'Sums'}
            </button>
          ))}
        </div>
        <div className="hud-item" style={{ fontSize: '0.85rem' }}>
          Completed: {simStationsComplete.filter(Boolean).length} / 3
        </div>
      </div>

      {/* Card wrapper */}
      <div className="glass-card" style={{ maxWidth: 550, margin: '0 auto', position: 'relative' }}>
        {/* Render Station Component dynamically */}
        {activeStation === 0 && (
          <AngleMakerStation onStationComplete={handleStationComplete} />
        )}
        {activeStation === 1 && (
          <ProtractorStation 
            onStationComplete={handleStationComplete} 
            setStationBPerfect={setStationBPerfect} 
          />
        )}
        {activeStation === 2 && (
          <AngleSumStation onStationComplete={handleStationComplete} />
        )}

        {/* Mascot overlay */}
        <div className="mascot-container" style={{ marginTop: 24 }}>
          <div className="mascot thinking">🤖</div>
          <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>
            {activeStation === 0 
              ? "Need help? Move the handle closer to the L corner to see acute angles, or lay it flat!" 
              : activeStation === 1 
              ? "Align the crosshair exactly to the white dot, then rotate so the protractor's bottom is straight on the red line!"
              : "Complementary angles add to 90°, supplementary on straight lines add to 180°, and full circles make 360°!"}
          </div>
        </div>
      </div>

      {/* Completion Overlay popup inside phase */}
      {showCompleteOverlay && (
        <div className="feedback-overlay" style={{ zIndex: 150 }}>
          <div className="world-complete-card">
            <div className="world-complete-icon">🎖️</div>
            <div className="world-complete-title">Station Cleared!</div>
            <p className="wonder-subtext" style={{ margin: '10px 0 20px' }}>
              You successfully mastered {STATIONS[activeStation].title}!
            </p>
            <button className="btn btn-primary" onClick={handleNext}>
              {activeStation + 1 < STATIONS.length ? "Proceed to Next Station 🚀" : "Finish Simulations! 🌟"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
