const fs = require('fs');
const path = require('path');

const placesPath = path.resolve('src/data/jeddah-places.ts');
let content = fs.readFileSync(placesPath, 'utf8');

const newImages = {
  'trend-04': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=1200',
  'luxury-02': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=1200',
  'plc-26': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=1200',
  'plc-13': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  'iconic-03': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1200',
  'trend-03': 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=1200',
  'plc-27': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=1200',
  'plc-29': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1200',
  'plc-28': 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80&w=1200',
  'plc-14': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200',
  'trend-01': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=1200',
  'iconic-04': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200',
  'plc-31': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1200',
  'plc-32': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=1200',
  'plc-18': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200',
  'plc-30': 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=1200',
  'free-07': 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=1200',
  'free-06': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=1200',
  'free-01': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
  'free-04': 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&q=80&w=1200',
  'free-05': 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1200',
  'free-02': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
};

let count = 0;
for (const [id, url] of Object.entries(newImages)) {
  const idRegex = new RegExp(`id:\\s*['"]${id}['"]`);
  const match = content.match(idRegex);
  if (!match) {
    console.error(`ID not found: ${id}`);
    continue;
  }

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
console.log(`Updated images for ${count} places!`);
