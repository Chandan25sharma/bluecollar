const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4001,
  path: '/api/services',
  method: 'GET',
  timeout: 5000
};

console.log('Testing connection to localhost:4001/api/services...');

const req = http.request(options, (res) => {
  console.log(`✅ Connection successful! Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('❌ Connection failed:', err.message);
  console.error('Error code:', err.code);
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
});

req.end();