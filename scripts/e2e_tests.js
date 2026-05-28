const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const axios = require('axios');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

const results = [];

async function dbCounts(db) {
  const users = await db.collection('users').countDocuments();
  return { users };
}

async function run() {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(2);
  }

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('Connected to MongoDB for verification');

  const before = await dbCounts(db);
  console.log('Counts before tests:', before);

  const unique = Date.now();
  const testUser = { name: `TestUser${unique}`, email: `testuser+${unique}@example.com`, password: 'Passw0rd!' };

  // Health check
  try {
    const res = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
    console.log('Health check', res.status, res.data?.data?.status);
    results.push(['health', true, res.status]);
  } catch (err) {
    console.error('Health check failed:', err.message);
    results.push(['health', false, err.message]);
  }

  // Register
  let createdUserId = null;
  try {
    const res = await axios.post(`${baseUrl}/api/v1/auth/register`, testUser, { timeout: 10000 });
    console.log('Register status', res.status);
    createdUserId = res.data?.user?._id || res.data?._id || null;
    results.push(['register', true, res.status]);
  } catch (err) {
    console.error('Register failed:', err.response ? err.response.data : err.message);
    results.push(['register', false, err.response ? err.response.data : err.message]);
  }

  // Login
  let accessToken = null;
  let refreshToken = null;
  try {
    const res = await axios.post(`${baseUrl}/api/v1/auth/login`, { email: testUser.email, password: testUser.password }, { timeout: 10000 });
    console.log('Login status', res.status);
    accessToken = res.data?.accessToken || res.data?.token || null;
    refreshToken = res.data?.refreshToken || null;
    results.push(['login', true, res.status]);
  } catch (err) {
    console.error('Login failed:', err.response ? err.response.data : err.message);
    results.push(['login', false, err.response ? err.response.data : err.message]);
  }

  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  // Refresh token
  if (refreshToken) {
    try {
      const res = await axios.post(`${baseUrl}/api/v1/auth/refresh`, { refreshToken }, { timeout: 10000 });
      console.log('Refresh status', res.status);
      results.push(['refresh', true, res.status]);
    } catch (err) {
      console.error('Refresh failed:', err.response ? err.response.data : err.message);
      results.push(['refresh', false, err.response ? err.response.data : err.message]);
    }
  }

  // Logout
  try {
    const res = await axios.post(`${baseUrl}/api/v1/auth/logout`, {}, { headers, timeout: 10000 });
    console.log('Logout status', res.status);
    results.push(['logout', true, res.status]);
  } catch (err) {
    console.error('Logout failed (may be fine):', err.response ? err.response.data : err.message);
    results.push(['logout', false, err.response ? err.response.data : err.message]);
  }

  const after = await dbCounts(db);
  console.log('Counts after tests:', after);

  // Cleanup: delete test user by email
  try {
    await db.collection('users').deleteOne({ email: testUser.email });
    console.log('Deleted test user by email from DB (if existed)');
  } catch (err) {
    console.error('Cleanup user failed:', err.message);
  }

  await mongoose.disconnect();

  console.log('\nTest results summary:');
  results.forEach(r => console.log(r));

  process.exit(0);
}

run().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
