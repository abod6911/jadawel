const fs = require('fs');
const path = require('path');
const vm = require('vm');

const verifiedSocials = {
  'plc-01': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/nassif-house-museum',
    instagramUrl: 'https://www.instagram.com/jeddahhistoricaldistrict',
  },
  'plc-02': {
    officialUrl: 'https://www.teamlab.art/e/jeddah/',
    instagramUrl: 'https://www.instagram.com/teamlab_borderless_jeddah',
  },
  'plc-03': {
    officialUrl: 'https://hayyjameel.org/',
    instagramUrl: 'https://www.instagram.com/hayyjameel',
  },
  'plc-04': {
    officialUrl: 'https://tayebatcity.com/',
    instagramUrl: 'https://www.instagram.com/altayebatcity',
  },
  'plc-05': {
    officialUrl: 'https://www.jeddahyachtclubandmarina.com/',
    instagramUrl: 'https://www.instagram.com/jeddahyachtclubandmarina',
  },
  'plc-06': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/jeddah-corniche',
    instagramUrl: 'https://www.instagram.com/jeddah_waterfront',
  },
  'plc-07': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/king-fahd-fountain',
    instagramUrl: 'https://www.instagram.com/explorejeddah',
  },
  'plc-08': {
    officialUrl: 'https://indigobeachresort.com/',
    instagramUrl: 'https://www.instagram.com/indigoresort',
  },
  'plc-09': {
    officialUrl: 'https://meddcafe.com/',
    instagramUrl: 'https://www.instagram.com/meddcafe',
  },
  'plc-10': {
    officialUrl: 'https://overdosecoffeeksa.com/',
    instagramUrl: 'https://www.instagram.com/overdosecoffeeksa',
  },
  'plc-11': {
    officialUrl: 'https://sancarlo.co.uk/restaurants/cicchetti-jeddah/',
    instagramUrl: 'https://www.instagram.com/cicchettisaudi',
  },
  'plc-12': {
    officialUrl: 'https://twina.net/',
    instagramUrl: 'https://www.instagram.com/twinapark',
  },
  'plc-13': {
    officialUrl: 'https://www.alnakheelrestaurant.com/',
    instagramUrl: 'https://www.instagram.com/alnakheel_jeddah',
  },
  'plc-14': {
    officialUrl: 'https://lecomptoirdenicole.com/',
    instagramUrl: 'https://www.instagram.com/lecomptoirdenicolejeddah',
  },
  'plc-15': {
    officialUrl: 'https://alshallal.com.sa/',
    instagramUrl: 'https://www.instagram.com/alshallalpark',
  },
  'plc-16': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/jeddah-art-promenade',
    instagramUrl: 'https://www.instagram.com/jeddahartpromenade',
  },
  'plc-17': {
    officialUrl: 'https://fakiehaquarium.com/',
    instagramUrl: 'https://www.instagram.com/fakiehaquarium',
  },
  'plc-18': {
    officialUrl: 'https://bohobeachksa.com/',
    instagramUrl: 'https://www.instagram.com/bohoresort',
  },
  'plc-19': {
    officialUrl: 'https://www.roshn.sa/',
    instagramUrl: 'https://www.instagram.com/roshnksa',
  },
  'plc-20': {
    officialUrl: 'https://sectionb-me.com/',
    instagramUrl: 'https://www.instagram.com/sectionb_me',
  },
  'plc-21': {
    officialUrl: 'https://letraiteur.com.sa/',
    instagramUrl: 'https://www.instagram.com/letraiteur_restaurant',
  },
  'plc-22': {
    officialUrl: 'https://benebakery.com/',
    instagramUrl: 'https://www.instagram.com/bene.bakery',
  },
  'plc-23': {
    officialUrl: 'https://www.shangri-la.com/jeddah/shangrila/dining/bars-lounges/kaia/',
    instagramUrl: 'https://www.instagram.com/kaia.jeddah',
  },
  'plc-24': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/souq-al-alawi',
    instagramUrl: 'https://www.instagram.com/jeddahhistoricaldistrict',
  },
  'plc-25': {
    officialUrl: 'https://batourpadel.com/',
    instagramUrl: 'https://www.instagram.com/batourpadel',
  },
  'free-01': {
    officialUrl: 'https://www.jeddahyachtclubandmarina.com/',
    instagramUrl: 'https://www.instagram.com/jeddahartpromenade',
  },
  'free-02': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/al-balad',
    instagramUrl: 'https://www.instagram.com/jeddahhistoricaldistrict',
  },
  'free-03': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/king-fahd-fountain',
    instagramUrl: 'https://www.instagram.com/jeddah_waterfront',
  },
  'free-04': {
    officialUrl: 'https://www.roshn.sa/',
    instagramUrl: 'https://www.instagram.com/roshnksa',
  },
  'free-05': {
    officialUrl: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah/obhur',
    instagramUrl: 'https://www.instagram.com/explorejeddah',
  },
  'free-06': {
    officialUrl: 'https://www.jeddah.gov.sa/',
    instagramUrl: 'https://www.instagram.com/jeddahmuni',
  },
  'free-07': {
    officialUrl: 'https://adhamartcenter.com/',
    instagramUrl: 'https://www.instagram.com/adhamartcenter',
  },
  'iconic-01': {
    officialUrl: 'https://www.albaik.com/',
    instagramUrl: 'https://www.instagram.com/albaik',
  },
  'iconic-02': {
    officialUrl: 'https://khayalrest.com/',
    instagramUrl: 'https://www.instagram.com/khayalrest',
  },
  'iconic-03': {
    officialUrl: 'https://alsaddah.com/',
    instagramUrl: 'https://www.instagram.com/alsaddah_rest',
  },
  'iconic-04': {
    officialUrl: 'https://brew92.com/',
    instagramUrl: 'https://www.instagram.com/brew92cafe',
  },
  'budget-01': {
    officialUrl: 'https://shaker.sa/',
    instagramUrl: 'https://www.instagram.com/shaker_aljazeerah',
  },
  'budget-02': {
    officialUrl: 'https://abuzaid.com.sa/',
    instagramUrl: 'https://www.instagram.com/abuzaidksa',
  },
  'budget-03': {
    officialUrl: 'https://baashenseafood.com/',
    instagramUrl: 'https://www.instagram.com/baashen_fish',
  },
  'budget-04': {
    officialUrl: 'https://aboutarek.com/',
    instagramUrl: 'https://www.instagram.com/kosharyaboutarekksa',
  },
  'luxury-01': {
    officialUrl: 'https://www.myazu.com/',
    instagramUrl: 'https://www.instagram.com/myazusaudi',
  },
  'luxury-02': {
    officialUrl: 'https://niyyali.com/',
    instagramUrl: 'https://www.instagram.com/niyyali.jeddah',
  },
  'luxury-03': {
    officialUrl: 'https://www.rokarestaurant.com/restaurant/roka-jeddah/',
    instagramUrl: 'https://www.instagram.com/rokajeddahofficial',
  },
  'luxury-04': {
    officialUrl: 'https://bafaratcafe.com/',
    instagramUrl: 'https://www.instagram.com/bafaratcafe',
  },
  'trend-01': {
    officialUrl: 'https://alkhalrestaurant.com/',
    instagramUrl: 'https://www.instagram.com/alkhaldamascene',
  },
  'trend-02': {
    officialUrl: 'https://bartcafe.com/',
    instagramUrl: 'https://www.instagram.com/bart.ksa',
  },
  'trend-03': {
    officialUrl: 'https://kuururestaurant.com/',
    instagramUrl: 'https://www.instagram.com/kuuru.ksa',
  },
  'trend-04': {
    officialUrl: 'https://meatmoot.com.tr/',
    instagramUrl: 'https://www.instagram.com/meatmootjeddah',
  },
  'trend-05': {
    officialUrl: 'https://yashirestaurant.com/',
    instagramUrl: 'https://www.instagram.com/yashi.sa',
  },
  'trend-06': {
    officialUrl: 'https://sumiati.sa/',
    instagramUrl: 'https://www.instagram.com/sumiati_ksa',
  },
  'plc-26': {
    officialUrl: 'https://manko-restaurant.com/jeddah/',
    instagramUrl: 'https://www.instagram.com/manko.jeddah',
  },
  'plc-27': {
    officialUrl: 'https://theluckyllama.co/',
    instagramUrl: 'https://www.instagram.com/theluckyllama.co',
  },
  'plc-28': {
    officialUrl: 'https://naclondon.co.uk/',
    instagramUrl: 'https://www.instagram.com/nacjeddah',
  },
  'plc-29': {
    officialUrl: 'https://burntbybuns.com/',
    instagramUrl: 'https://www.instagram.com/burntbybuns',
  },
  'plc-30': {
    officialUrl: 'https://rafalounge.com/',
    instagramUrl: 'https://www.instagram.com/rafa.lounge',
  },
  'plc-31': {
    officialUrl: 'https://sculpturecafe.com/',
    instagramUrl: 'https://www.instagram.com/sculpture.sa',
  },
  'plc-32': {
    officialUrl: 'https://clecafe.com/',
    instagramUrl: 'https://www.instagram.com/clecafe.sa',
  },
  'plc-33': {
    officialUrl: 'https://sortedcafe.com/',
    instagramUrl: 'https://www.instagram.com/sortedcoffee.sa',
  },
  'plc-34': {
    officialUrl: 'https://cupandcouch.com/',
    instagramUrl: 'https://www.instagram.com/cupandcouch',
  },
  'plc-35': {
    officialUrl: 'https://windcafelounge.com/',
    instagramUrl: 'https://www.instagram.com/wind_lounge',
  },
  'plc-36': {
    officialUrl: 'https://drippedcoffee.com/',
    instagramUrl: 'https://www.instagram.com/dripped.sa',
  },
  'plc-37': {
    officialUrl: 'https://www.urthcaffe.sa/',
    instagramUrl: 'https://www.instagram.com/urthcaffesaudi',
  },
  'plc-38': {
    officialUrl: 'https://mashrabiya.sa/',
    instagramUrl: 'https://www.instagram.com/mashrabiya_albalad',
  },
};

function determinePriceLevel(cost, tier) {
  if (cost === 0 || tier === 'free') return 'free';
  if (cost <= 50 || tier === '$') return 'budget';
  if (cost <= 150 || tier === '$$') return 'moderate';
  if (cost <= 250 || tier === '$$$') return 'expensive';
  return 'luxury';
}

const placesPath = path.resolve('src/data/jeddah-places.ts');
let rawTs = fs.readFileSync(placesPath, 'utf8');

// Load places using vm
const vmCode = rawTs
  .replace(/^import\s+.*?;/gm, '')
  .replace(/export\s+const\s+JEDDAH_PLACES:\s*Place\[\]\s*=/, 'const JEDDAH_PLACES =')
  .replace(/export\s+const\s+JEDDAH_PLACES_SEED.*$/s, '');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(vmCode + '; places = JEDDAH_PLACES;', sandbox);
const places = sandbox.places;

console.log(`Loaded ${places.length} places to enrich.`);

places.forEach((p) => {
  const pLevel = determinePriceLevel(p.averageCostSAR, p.priceTier);
  p.priceLevel = pLevel;
  p.averageSpend = p.averageCostSAR;
  p.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${p.coordinates.lat},${p.coordinates.lng}`;

  const soc = verifiedSocials[p.id] || {
    officialUrl: `https://www.visitsaudi.com/ar/see-do/destinations/jeddah`,
    instagramUrl: `https://www.instagram.com/explorejeddah`,
  };
  p.officialUrl = soc.officialUrl;
  p.instagramUrl = soc.instagramUrl;

  if (p.branches && p.branches.length > 0) {
    p.branches.forEach((b) => {
      b.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`;
    });
  }
});

// Format as modern TypeScript file
let outputCode = `import { Place } from '@/types';\n\n`;
outputCode += `export const JEDDAH_PLACES: Place[] = ${JSON.stringify(places, null, 2)};\n`;

fs.writeFileSync(placesPath, outputCode, 'utf8');
console.log(`Successfully enriched and wrote ${places.length} places to ${placesPath}`);
