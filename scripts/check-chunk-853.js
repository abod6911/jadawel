const https = require('https');

https.get('https://abod6911.github.io/jadawel/_next/static/chunks/853-1cb917c593129203.js', res => {
  let text = '';
  res.on('data', chunk => text += chunk);
  res.on('end', () => {
    console.log('Chunk 853 Length:', text.length);
    console.log('Has "branches":', text.includes('branches'));
    console.log('Has "فروع":', text.includes('فروع'));
  });
});
