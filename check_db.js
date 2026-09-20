const axios = require('axios');

const API_URL = 'http://10.10.26.200:8000/api/v1';
const EMAIL = 'admin@gmail.com';
const PASSWORD = '12345678';

async function main() {
  try {
    console.log(`Logging into ${API_URL}/auth/login with ${EMAIL}...`);
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      identifier: EMAIL,
      password: PASSWORD
    });
    
    const token = loginRes.data.data.accessToken;
    console.log('Login successful!');
    
    console.log('Fetching apartments...');
    let apartmentsRes;
    try {
      apartmentsRes = await axios.get(`${API_URL}/apartment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Used GET /apartment');
    } catch (e) {
      console.log('Failed GET /apartment, trying /apartments...', e.message);
      apartmentsRes = await axios.get(`${API_URL}/apartments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Used GET /apartments');
    }
    
    const data = apartmentsRes.data;
    const apartments = data.data?.data || data.data || data; // Pagination wrapper
    
    if (Array.isArray(apartments)) {
      console.log(`Found ${apartments.length} apartments in the database.`);
      if (apartments.length > 0) {
        console.log('First apartment sample:', JSON.stringify(apartments[0], null, 2));
      }
    } else {
      console.log('Response is not an array:', apartments);
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

main();
