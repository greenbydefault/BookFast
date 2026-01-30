import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_DIR = path.join(__dirname, '../src/svg/ICON');
const OUT_FILE = path.join(__dirname, '../src/components/Icons/sprite.js');

const generateSprite = async () => {
    if (!fs.existsSync(ICON_DIR)) {
        console.error(`Error: Icon directory not found at ${ICON_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(ICON_DIR).filter(file => file.endsWith('.svg'));

    let symbols = '';

    files.forEach(file => {
        const filePath = path.join(ICON_DIR, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Extract filename without extension for ID
        const id = 'icon-' + file.replace('.svg', '').toLowerCase();

        // Simple parsing to extract content inside <svg> tags
        const svgContentMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);

        if (svgContentMatch && svgContentMatch[1]) {
            let innerContent = svgContentMatch[1];

            // Replace hardcoded colors with currentColor
            innerContent = innerContent.replace(/#44403C/gi, 'currentColor');

            symbols += `<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor">${innerContent}</symbol>\n`;
        }
    });

    const spriteContent = `
const sprite = \`<svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
<defs>
${symbols}
</defs>
</svg>\`;

export const loadSprite = () => {
    const div = document.createElement('div');
    div.innerHTML = sprite;
    document.body.insertBefore(div.firstChild, document.body.firstChild);
};
`;

    fs.writeFileSync(OUT_FILE, spriteContent);
    console.log(`Sprite generated at ${OUT_FILE} with ${files.length} icons.`);
};

generateSprite();
