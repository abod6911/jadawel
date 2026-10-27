const fs = require('fs');
const path = require('path');

const placesPath = path.resolve('src/data/jeddah-places.ts');
const updatesPath = path.resolve('scripts/verified_updates.json');

const origContent = fs.readFileSync(placesPath, 'utf8');
const updates = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));

function formatBranches(branches) {
  if (!branches || branches.length === 0) return '';
  const lines = ['    branches: ['];
  for (const b of branches) {
    lines.push('      {');
    lines.push(`        id: '${b.id}',`);
    lines.push(`        branchNameAr: '${b.branchNameAr.replace(/'/g, "\\'")}',`);
    lines.push(`        branchNameEn: '${b.branchNameEn.replace(/'/g, "\\'")}',`);
    lines.push(`        districtAr: '${b.districtAr.replace(/'/g, "\\'")}',`);
    lines.push(`        districtEn: '${b.districtEn.replace(/'/g, "\\'")}',`);
    lines.push(`        lat: ${b.lat},`);
    lines.push(`        lng: ${b.lng},`);
    lines.push(`        googleMapsUrl: '${b.googleMapsUrl}',`);
    lines.push(`        isFlagship: ${!!b.isFlagship},`);
    if (b.openingHoursAr) lines.push(`        openingHoursAr: '${b.openingHoursAr.replace(/'/g, "\\'")}',`);
    if (b.openingHoursEn) lines.push(`        openingHoursEn: '${b.openingHoursEn.replace(/'/g, "\\'")}',`);
    lines.push('      },');
  }
  lines.push('    ],');
  return lines.join('\n');
}

let updatedContent = origContent;
let updatedCount = 0;

for (const [id, up] of Object.entries(updates)) {
  // Find id in updatedContent
  const idRegex = new RegExp(`id:\\s*['"]${id}['"]`);
  const match = updatedContent.match(idRegex);
  if (!match) {
    console.error(`ID not found: ${id}`);
    continue;
  }

  const idPos = match.index;
  const openBracePos = updatedContent.lastIndexOf('{', idPos);
  
  let depth = 0;
  let closeBracePos = -1;
  for (let i = openBracePos; i < updatedContent.length; i++) {
    if (updatedContent[i] === '{') depth++;
    else if (updatedContent[i] === '}') {
      depth--;
      if (depth === 0) {
        closeBracePos = i;
        break;
      }
    }
  }

  if (closeBracePos === -1) {
    console.error(`Could not find closing brace for: ${id}`);
    continue;
  }

  let block = updatedContent.slice(openBracePos, closeBracePos + 1);

  // 1. nameAr
  block = block.replace(/nameAr:\s*['"].*?['"],/, () => `nameAr: '${up.nameAr.replace(/'/g, "\\'")}',`);
  // 2. nameEn
  block = block.replace(/nameEn:\s*['"].*?['"],/, () => `nameEn: '${up.nameEn.replace(/'/g, "\\'")}',`);
  // 3. name object
  block = block.replace(/name:\s*\{\s*ar:\s*['"].*?['"],\s*en:\s*['"].*?['"]\s*\},/, 
    () => `name: { ar: '${up.nameAr.replace(/'/g, "\\'")}', en: '${up.nameEn.replace(/'/g, "\\'")}' },`);
  // 4. coordinates
  block = block.replace(/coordinates:\s*\{\s*lat:\s*[\d\.]+,\s*lng:\s*[\d\.]+\s*\},/, 
    () => `coordinates: { lat: ${up.lat}, lng: ${up.lng} },`);
  // 5. priceTier
  block = block.replace(/priceTier:\s*['"].*?['"],/, () => `priceTier: '${up.priceTier}',`);
  // 6. averageCostSAR
  block = block.replace(/averageCostSAR:\s*[\d\.]+,/, () => `averageCostSAR: ${up.averageCostSAR},`);
  // 7. dwellTimeMinutes
  block = block.replace(/dwellTimeMinutes:\s*[\d]+,/, () => `dwellTimeMinutes: ${up.dwellTimeMinutes},`);
  // 8. openingHoursAr
  block = block.replace(/openingHoursAr:\s*['"].*?['"],/, () => `openingHoursAr: '${up.openingHoursAr.replace(/'/g, "\\'")}',`);
  // 9. openingHoursEn
  block = block.replace(/openingHoursEn:\s*['"].*?['"],/, () => `openingHoursEn: '${up.openingHoursEn.replace(/'/g, "\\'")}',`);
  // 10. googleMapsUrl
  block = block.replace(/googleMapsUrl:\s*['"].*?['"],/, () => `googleMapsUrl: '${up.googleMapsUrl}',`);

  // 11. branches
  block = block.replace(/\s*branches:\s*\[[\s\S]*?\],/g, '');
  if (up.branches && up.branches.length > 0) {
    const branchesCode = formatBranches(up.branches);
    const lastBrace = block.lastIndexOf('}');
    const beforeBrace = block.slice(0, lastBrace).trimEnd();
    const needsComma = !beforeBrace.endsWith(',');
    block = beforeBrace + (needsComma ? ',\n' : '\n') + branchesCode + '\n  ' + block.slice(lastBrace);
  }

  // Replace block in updatedContent
  updatedContent = updatedContent.slice(0, openBracePos) + block + updatedContent.slice(closeBracePos + 1);
  updatedCount++;
}

fs.writeFileSync(placesPath, updatedContent, 'utf8');
console.log(`Updated ${updatedCount} places successfully!`);
