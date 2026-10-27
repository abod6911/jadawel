const https = require('https');

function fetchChunk(path) {
  https.get('https://abod6911.github.io/jadawel' + path, res => {
    let text = '';
    res.on('data', chunk => text += chunk);
    res.on('end', () => {
      console.log('Path:', path, 'Status:', res.statusCode, 'Length:', text.length);
      console.log('Has "branches":', text.includes('branches'));
      console.log('Has "فروع":', text.includes('فروع'));
      console.log('Has "teamLab Borderless":', text.includes('teamLab Borderless'));
      console.log('Has "ALBAIK":', text.includes('ALBAIK'));
      console.log('Has "طقس":', text.includes('طقس') || text.includes('weather'));
    });
  });
}

fetchChunk('/_next/static/chunks/app/page-19f031a8c1292732.js');
fetchChunk('/_next/static/chunks/117-9b187c704536a5b6.js');
