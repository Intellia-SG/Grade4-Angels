import { audioMap } from './audioMap';

let currentQueue = null;
let isSpeaking = false;
let currentAudio = null;
let playId = 0;
const elevenLabsCache = new Map();

const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice

const getElevenLabsSettings = (speechStyle) => {
  switch (speechStyle) {
    case 'celebration':
      return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
    case 'question':
      return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking':
      return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
    default:
      return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  }
};

export async function getAudioUrl(text, style) {
  if (audioMap && audioMap[text]) {
    return audioMap[text];
  }

  const cacheKey = `${text}_${style}`;
  if (elevenLabsCache.has(cacheKey)) {
    return elevenLabsCache.get(cacheKey);
  }

  const fetchPromise = (async () => {
    const localApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceSettings = getElevenLabsSettings(style);

    // Fallback directly to ElevenLabs API if key is present
    if (localApiKey) {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'xi-api-key': localApiKey 
        },
        body: JSON.stringify({ 
          text, 
          model_id: 'eleven_multilingual_v2', 
          voice_settings: voiceSettings 
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    }

    throw new Error("Narration key absent or API failure. Audio narration skipped.");
  })();

  elevenLabsCache.set(cacheKey, fetchPromise);
  fetchPromise.catch(() => elevenLabsCache.delete(cacheKey));
  return fetchPromise;
}

export function speak(text, enabled = true, style = 'statement') {
  return new Promise(async (resolve) => {
    if (!enabled || !text) { resolve(); return; }

    playId++;
    const currentPlayId = playId;
    isSpeaking = true;

    try {
      const audioUrl = await getAudioUrl(text, style);
      if (currentPlayId !== playId) { isSpeaking = false; resolve(); return; }

      if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }

      currentAudio = new Audio(audioUrl);
      currentAudio.onended = () => { isSpeaking = false; resolve(); };
      currentAudio.onerror = () => { fallbackTTS(text, currentPlayId, resolve); };
      await currentAudio.play();
      return;
    } catch (error) {
      fallbackTTS(text, currentPlayId, resolve);
    }
  });
}

function fallbackTTS(text, currentPlayId, resolve) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      // Remove emojis or special symbols before speech synthesis
      const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => { if (currentPlayId === playId) isSpeaking = false; resolve(); };
      utterance.onerror = () => { if (currentPlayId === playId) isSpeaking = false; resolve(); };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      isSpeaking = false;
      resolve();
    }
  } else {
    isSpeaking = false;
    resolve();
  }
}

// ─── Narration Segment Types ────────────────────
export function seg(text, style = 'statement', pause = 400) {
  return { text, style, pause };
}

export const say = (text, pause = 0) => seg(text, 'statement', pause);
export const ask = (text, pause = 0) => seg(text, 'question', pause);
export const cheer = (text, pause = 0) => seg(text, 'encouragement', pause);
export const emphasize = (text, pause = 0) => seg(text, 'emphasis', pause);
export const think = (text, pause = 0) => seg(text, 'thinking', pause);
export const celebrate = (text, pause = 0) => seg(text, 'celebration', pause);
export const instruct = (text, pause = 0) => seg(text, 'instruction', pause);
export const pause = (ms = 0) => seg('', 'statement', ms);

export function preloadNarration(segments) {
  if (!segments) return;
  segments.forEach(s => {
    if (s.text && s.text.trim()) {
      getAudioUrl(s.text, s.style).catch(() => { });
    }
  });
}

export function narrate(segments, enabled = true) {
  const queueId = Symbol('narration');
  currentQueue = queueId;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (currentQueue === queueId) {
      isSpeaking = false;
      currentQueue = null;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments || segments.length === 0) return;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (cancelled || currentQueue !== queueId) return;

      // Eagerly preload the next segment in queue
      if (i + 1 < segments.length) {
        const nextSeg = segments[i + 1];
        if (nextSeg.text && nextSeg.text.trim()) {
          getAudioUrl(nextSeg.text, nextSeg.style).catch(() => {});
        }
      }

      if (segment.text && segment.text.trim()) {
        await speak(segment.text, true, segment.style);
      }

      if (segment.pause > 0 && !cancelled && currentQueue === queueId) {
        await new Promise(r => setTimeout(r, segment.pause));
      }
    }
  })();

  return { cancel, promise };
}

export function stopNarration() {
  playId++;
  currentQueue = null;
  if (currentAudio) { 
    currentAudio.pause(); 
    currentAudio.currentTime = 0; 
    currentAudio = null; 
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  isSpeaking = false;
}

// ─── Simple tone generation ──────────────────────
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

export function playTone(frequency, duration = 200) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) { /* silent fallback */ }
}

export const sounds = {
  correct: () => { 
    playTone(523, 120); 
    setTimeout(() => playTone(659, 120), 120); 
    setTimeout(() => playTone(784, 180), 240); 
  },
  wrong: () => { 
    playTone(220, 250); 
  },
  badge: () => { 
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 150), i * 120)); 
  },
  click: () => playTone(440, 60),
  streak: () => { 
    playTone(880, 100); 
    setTimeout(() => playTone(1100, 150), 100); 
  },
};
