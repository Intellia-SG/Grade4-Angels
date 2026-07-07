import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/assets/audio');
const mapFile = path.join(__dirname, '../src/utils/audioMap.js');

async function clean() {
    if (!fs.existsSync(mapFile)) {
        console.log('No audioMap.js found, skipping clean.');
        return;
    }

    // Dynamic import to read current map
    const { audioMap } = await import(path.toNamespacedPath(mapFile));
    const activeFiles = new Set(Object.values(audioMap || {}).map(p => path.basename(p)));

    if (!fs.existsSync(audioDir)) {
        console.log('No audio directory found, skipping clean.');
        return;
    }

    const files = fs.readdirSync(audioDir);
    let deletedCount = 0;

    files.forEach(file => {
        if (file.endsWith('.mp3') && !activeFiles.has(file)) {
            const filepath = path.join(audioDir, file);
            fs.unlinkSync(filepath);
            console.log(`Deleted orphaned audio file: ${file}`);
            deletedCount++;
        }
    });

    console.log(`Cleanup complete! Purged ${deletedCount} orphaned audio files.`);
}

clean();
