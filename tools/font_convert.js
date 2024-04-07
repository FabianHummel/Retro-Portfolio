const fontverter = require('fontverter');
const fs = require('fs');

const path = '/Users/fabian/Documents/Projects/Web/Portfolio/public/font';

(async () => {
    fs.readdirSync(path).forEach(async file => {
        if (file.endsWith('.ttf')) {
            const mySfntFontBuffer = fs.readFileSync(`${path}/${file}`);
            const myWoffFontBuffer = await fontverter.convert(mySfntFontBuffer, 'woff');
            const myWoff2FontBuffer = await fontverter.convert(myWoffFontBuffer, 'woff2');

            const { woffFile, woff2File } = { woffFile: file.replace('.ttf', '.woff'), woff2File: file.replace('.ttf', '.woff2') };
            fs.existsSync(woffFile) && fs.rmSync(woffFile);
            fs.existsSync(woff2File) && fs.rmSync(woff2File);
            fs.writeFileSync(`${path}/${woffFile}`, myWoffFontBuffer);
            fs.writeFileSync(`${path}/${woff2File}`, myWoff2FontBuffer);
        }
    })
})()