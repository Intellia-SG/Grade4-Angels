import { useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { playIntroNarration } from '../../utils/narration';

export default function IntroScreen({ onStart, audioEnabled }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  const handleStart = (phase = 'wonder') => {
    sounds.click();
    onStart(phase);
  };

  const phaseCards = [
    {
      id: 'wonder',
      title: 'Wonder',
      subtitle: 'A math mystery!',
      icon: '🧐'
    },
    {
      id: 'story',
      title: 'Story',
      subtitle: 'World landmark tour',
      icon: '📖'
    },
    {
      id: 'simulate',
      title: 'Simulate',
      subtitle: '3 Station Sandbox',
      icon: '🧪'
    },
    {
      id: 'play',
      title: 'Practice',
      subtitle: '100 challenges',
      icon: '🎮'
    },
    {
      id: 'reflect',
      title: 'Reflect',
      subtitle: 'Quiz & review',
      icon: '📓'
    }
  ];

  return (
    <div className="intro-screen">
      {/* Top Badge */}
      <div className="intro-badge">
        <span>✨</span> Grade 4 Geometry
      </div>

      {/* Main Display Title */}
      <h1 className="intro-title">Angles in Geometry</h1>

      {/* Subtitle */}
      <h2 className="intro-subtitle">Types, Protractors, Polygons & Triangles!</h2>

      {/* Translucent Banner Card */}
      <div className="intro-banner-card">
        <span>Let's master angle types, measuring with protractors, classifying polygons, and solving angle puzzles!</span>
        <span className="intro-banner-icon">📐</span>
      </div>

      {/* 5 Interactive Phase Cards */}
      <div className="intro-cards-grid">
        {phaseCards.map((card) => (
          <div
            key={card.id}
            className="intro-card"
            onClick={() => handleStart(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleStart(card.id)}
          >
            <div className="intro-card-icon">{card.icon}</div>
            <div className="intro-card-title">{card.title}</div>
            <div className="intro-card-subtitle">{card.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Glowing CTA Button */}
      <button className="intro-cta-btn" onClick={() => handleStart('wonder')}>
        <span className="intro-cta-rocket">🚀</span> Begin Your Journey!
      </button>

      {/* Bottom Feature Tags */}
      <div className="intro-tags-row">
        <div className="intro-tag">
          <span className="intro-tag-icon">🎯</span> 100 Questions
        </div>
        <div className="intro-tag">
          <span className="intro-tag-icon">📐</span> Angles in Geometry
        </div>
        <div className="intro-tag">
          <span className="intro-tag-icon">🏆</span> Badges & XP
        </div>
      </div>
    </div>
  );
}

