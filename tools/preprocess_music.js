const fs = require('fs');

const publicDir = 'public';

const dataJson = JSON.parse(fs.readFileSync(`${publicDir}/music/data.json`, 'utf8'));

// Function to calculate the length of a song
async function getSongLength(filePath) {
    const { parseFile } = await import('music-metadata');
    try {
        const metadata = await parseFile(filePath);
        return metadata.format.duration;
    } catch (error) {
        console.error(`Error reading metadata for file ${filePath}:`, error);
        return 0;
    }
}

// Function to parse WAV file headers and extract audio samples
function parseWavFile(buffer) {
    const view = new DataView(buffer);
    const numChannels = view.getUint16(22, true);
    const sampleRate = view.getUint32(24, true);
    const bitsPerSample = view.getUint16(34, true);
    const dataSize = view.getUint32(40, true);
    const dataStart = 44;

    const sampleCount = dataSize / (bitsPerSample / 8);
    const samples = new Float32Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
        const sampleIndex = dataStart + i * (bitsPerSample / 8);
        if (bitsPerSample === 16) {
            samples[i] = view.getInt16(sampleIndex, true) / 32768;
        } else if (bitsPerSample === 32) {
            samples[i] = view.getInt32(sampleIndex, true) / 2147483648;
        }
    }

    return {
        numChannels,
        sampleRate,
        samples,
    };
}

// Function to calculate the waveform of a song
async function getWaveform(filePath) {
    try {
        const buffer = fs.readFileSync(filePath).buffer;
        const { samples } = parseWavFile(buffer);

        // Normalize the waveform to 1000 data points
        const waveform = [];
        const blockSize = Math.floor(samples.length / 100);
        for (let i = 0; i < 100; i++) {
            const blockStart = i * blockSize;
            const blockEnd = (i + 1) * blockSize;
            const blockSamples = samples.slice(blockStart, blockEnd);
            const blockAverage = blockSamples.reduce((sum, val) => sum + val, 0) / blockSamples.length;
            waveform.push(blockAverage);
        }

        const maxVal = Math.max(...waveform.map(Math.abs));
        return waveform.map(val => Math.log1p(Math.abs(val)) / Math.log1p(maxVal));
    } catch (error) {
        console.error(`Error calculating waveform for file ${filePath}:`, error);
        return Array(1000).fill(0);
    }
}

const modifiedData = dataJson.map(async (data) => {
    const musicPath = `${publicDir}/${data.song}`;
    return {
        ...data,
        length: await getSongLength(musicPath),
        spectrum: await getWaveform(musicPath)
    };
});

Promise.all(modifiedData).then((modifiedData) => {
    fs.writeFileSync(`${publicDir}/music/data.json`, JSON.stringify(modifiedData, null, 4), 'utf8');
});
