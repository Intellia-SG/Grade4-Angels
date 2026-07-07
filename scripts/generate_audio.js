import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const audioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

const getElevenLabsSettings = (style) => {
    switch (style) {
        case 'celebration': return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
        case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
        case 'question': return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
        case 'emphasis': return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
        case 'thinking': return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
        default: return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
    }
};

const phrases = [
    // Intro Phase
    { text: "Welcome to Angles in Geometry!", style: 'encouragement' },
    { text: "Today, we are going to explore the world and learn all about angles.", style: 'statement' },
    { text: "Are you ready to begin our global geometric adventure? Let us get started!", style: 'encouragement' },

    // Wonder Phase
    { text: "Sarah opens her book just a little bit. Then Mike opens his book all the way flat.", style: 'statement' },
    { text: "Whose book makes a bigger angle? Think about it!", style: 'question' },
    { text: "An angle is a measure of turn!", style: 'emphasis' },
    { text: "Let us find out what makes an angle big or small!", style: 'statement' },

    // Story Phase
    { text: "John lands in Paris, France.", style: 'statement' },
    { text: "The Eiffel Tower's legs lean out, making an angle at the ground.", style: 'emphasis' },
    { text: "A small turn from a straight line is called an acute angle.", style: 'statement' },
    { text: "It is smaller than a corner!", style: 'emphasis' },
    { text: "Sarah visits a crossroads in New York City.", style: 'statement' },
    { text: "The streets meet in a perfect square corner — a right angle, exactly ninety degrees!", style: 'emphasis' },
    { text: "Mike opens the door of the Sydney Opera House all the way.", style: 'statement' },
    { text: "It opens past a right angle, but is not flat. That is called an obtuse angle!", style: 'emphasis' },
    { text: "Priya looks at the flat desert horizon near the Pyramids of Giza.", style: 'statement' },
    { text: "A perfectly flat line is a straight angle, one hundred eighty degrees.", style: 'emphasis' },
    { text: "Yuki spins all the way around in a circle under the Tokyo lights.", style: 'statement' },
    { text: "A full turn is three hundred sixty degrees!", style: 'emphasis' },

    // Simulate Phase
    { text: "Station A: Angle Maker!", style: 'emphasis' },
    { text: "Drag the ray to match the target angle type or degrees. See how it opens and closes!", style: 'statement' },
    { text: "Station B: Protractor Detective!", style: 'emphasis' },
    { text: "Drag and rotate the protractor to align with the bottom line. Then read the angle scale and type the number!", style: 'statement' },
    { text: "Station C: Angle Sums!", style: 'emphasis' },
    { text: "Solve the missing angle equations. Remember: straight lines make one hundred eighty degrees, and a full turn makes three hundred sixty degrees!", style: 'statement' },

    // Play Phase general feedback
    { text: "Let us search for the hidden angles at this landmark.", style: 'statement' },
    { text: "Let us search for the hidden angles at this historic landmark.", style: 'statement' },
    { text: "Amazing! Ten correct in a row! You are unstoppable!", style: 'celebration' },
    { text: "Fantastic! Five streak! Keep going!", style: 'celebration' },
    { text: "Excellent! That is correct!", style: 'celebration' },
    { text: "Correct! Spot on!", style: 'encouragement' },
    { text: "Great job! You got it!", style: 'encouragement' },
    { text: "Not quite. Let us look closely at the math helper and try again!", style: 'thinking' },

    // Reflect Phase
    { text: "Great job exploring angles around the world! Now, let us teach our mascot what we learned.", style: 'statement' },
    { text: "Exactly! You are a wonderful teacher!", style: 'celebration' },
    { text: "Almost! Think about how an angle measures a turn.", style: 'thinking' },
    { text: "How confident do you feel about identifying and measuring angles now?", style: 'question' },
    { text: "Congratulations! You have completed the entire journey!", style: 'celebration' }
];

// Add World-specific intros dynamically
const worlds = [
  'Eiffel Tower, Paris', 'Statue of Liberty, New York', 'Sydney Opera House, Sydney',
  'Pyramids of Giza, Cairo', 'Taj Mahal, Agra', 'Great Wall of China, Beijing',
  'Big Ben, London', 'Machu Picchu, Cusco', 'Colosseum, Rome', 'Burj Khalifa, Dubai'
];
worlds.forEach(w => {
    phrases.push({ text: `Welcome to ${w}!`, style: 'encouragement' });
});

async function generate() {
    const mapData = {};

    if (!apiKey) {
        console.warn('WARNING: VITE_ELEVENLABS_API_KEY is not defined. No audio will be generated.');
        console.log('Writing fallback empty audioMap.js...');
        const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
        fs.writeFileSync(mapFile, `export const audioMap = {};\n`);
        return;
    }

    for (let i = 0; i < phrases.length; i++) {
        const { text, style } = phrases[i];
        const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
        const filename = `audio_${safeName}_${i}.mp3`;
        const filepath = path.join(audioDir, filename);

        mapData[text] = `/assets/audio/${filename}`;

        if (fs.existsSync(filepath)) {
            console.log(`Skipping (already exists): ${filename}`);
            continue;
        }

        console.log(`Generating: ${filename}`);

        const settings = getElevenLabsSettings(style);

        try {
            const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: settings
                })
            });

            if (!res.ok) {
                console.error(`Failed to generate ${filename}: ${res.statusText}`);
                const textErr = await res.text();
                console.error(textErr);
                continue;
            }

            const buffer = await res.arrayBuffer();
            fs.writeFileSync(filepath, Buffer.from(buffer));
            console.log(`Saved: ${filename}`);
        } catch (err) {
            console.error(`Error with ${filename}:`, err.message);
        }

        await new Promise(r => setTimeout(r, 500));
    }

    const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
    fs.writeFileSync(mapFile, `export const audioMap = ${JSON.stringify(mapData, null, 2)};\n`);
    console.log('Done generating! Map saved to src/utils/audioMap.js');
}

generate();
