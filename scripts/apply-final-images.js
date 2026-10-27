const fs = require('fs');
const path = require('path');

const placesPath = path.resolve('src/data/jeddah-places.ts');
let content = fs.readFileSync(placesPath, 'utf8');

const finalImages = {
  'plc-23': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  'plc-25': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200',
  'plc-33': 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&q=80&w=1200',
  'budget-03': 'https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&q=80&w=1200',
  'luxury-03': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
  'plc-36': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=1200',
  'free-03': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
};

let count = 0;
for (const [id, url] of Object.entries(finalImages)) {
  const idRegex = new RegExp(`id:\\s*['"]${id}['"]`);
  const match = content.match(idRegex);
  if (!match) continue;

  const idPos = match.index;
  const openBracePos = content.lastIndexOf('{', idPos);
  
  let depth = 0;
  let closeBracePos = -1;
  for (let i = openBracePos; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        closeBracePos = i;
        break;
      }
    }
  }

  if (closeBracePos === -1) continue;

  let block = content.slice(openBracePos, closeBracePos + 1);
  block = block.replace(/imageUrl:\s*['"][^'"]*['"],/, () => `imageUrl: '${url}',`);
  content = content.slice(0, openBracePos) + block + content.slice(closeBracePos + 1);
  count++;
}

fs.writeFileSync(placesPath, content, 'utf8');
console.log(`Updated images for final ${count} places!`);
