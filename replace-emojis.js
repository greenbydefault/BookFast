const fs = require('fs');
const path = require('path');

const dirs = ['src/pages/landing', 'src/components/landing'];
const replacements = {
  '🔧': 'gear.svg',
  '📧': 'Mails.svg',
  '✅': 'check.svg',
  '⚙': 'gear.svg',
  '🏷': 'ticket-percent.svg',
  '👤': 'user.svg',
  '🧹': 'clean.svg',
  '🌙': 'date-cog.svg',
  '✉': 'Mail.svg',
  '📦': 'package.svg',
  '🎉': 'spark-magic.svg',
  '📚': 'book-open-text.svg',
  '💪': 'anvil.svg',
  '🏋': 'anvil.svg',
  '💃': 'user.svg',
  '🥊': 'target.svg',
  '🏟': 'home.svg',
  '⚽': 'target.svg',
  '🏊': 'target.svg',
  '��': 'target.svg',
  '✂': 'clean.svg',
  '💄': 'target.svg',
  '💅': 'clean.svg',
  '🎨': 'spark-magic.svg',
  '✨': 'spark-magic.svg',
  '💆': 'clean.svg',
  '🦴': 'puzzle.svg',
  '🌿': 'sprout.svg',
  '🧖': 'clean.svg',
  '📸': 'eye-off.svg',
  '👨': 'user.svg',
  '🍳': 'Recipe.svg',
  '🍷': 'Recipe.svg',
  '🚲': 'road.svg',
  '⛵': 'road.svg',
  '��': 'road.svg',
  '🚐': 'road.svg',
  '🎵': 'chat.svg',
  '🚗': 'road.svg',
  '📖': 'book-open-text.svg',
  '🌍': 'Globe.svg',
  '🐩': 'user.svg',
  '🐾': 'user.svg',
  '🐕': 'user.svg',
  '🍽': 'Recipe.svg',
  '🚚': 'package.svg'
};

const regex = new RegExp(Object.keys(replacements).join('|'), 'g');

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      walk(file);
    } else {
      if (file.endsWith('.js')) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        content = content.replace(regex, (match) => {
          modified = true;
          return `<img src="/src/svg/ICON/${replacements[match]}" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />`;
        });
        
        if (modified) {
          fs.writeFileSync(file, content);
          console.log('Modified: ' + file);
        }
      }
    }
  });
}

dirs.forEach(d => walk(d));
console.log('Done replacing all secondary emojis.');
