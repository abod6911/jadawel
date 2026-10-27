const https = require('https');

https.get('https://abod6911.github.io/jadawel/', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTML Length:', data.length);
    // Find JS chunk paths in the html
    const chunks = [...data.matchAll(/\/_next\/static\/chunks\/[^"]+/g)].map(m => m[0]);
    console.log('Referenced chunks:', chunks);
  });
}).on('error', err => {
  console.error('Error:', err);
});
