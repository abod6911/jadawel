const fs = require('fs');
const path = require('path');

const updatesPath = path.resolve('scripts/verified_updates.json');
const data = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));

for (const [id, item] of Object.entries(data)) {
  const cost = item.averageCostSAR;
  if (cost === 0) {
    item.priceTier = 'free';
  } else if (cost <= 45) {
    item.priceTier = '$';
  } else if (cost <= 140) {
    item.priceTier = '$$';
  } else if (cost <= 250) {
    item.priceTier = '$$$';
  } else {
    item.priceTier = '$$$$';
  }
}

fs.writeFileSync(updatesPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Fixed all price tiers successfully!');
