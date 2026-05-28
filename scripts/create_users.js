const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const axios = require('axios');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

async function dbCount(db) {
  return db.collection('users').countDocuments();
}

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI missing in .env');
    process.exit(2);
  }

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const before = await dbCount(db);
  console.log('Users before:', before);

  const results = [];
  const ts = Date.now();
  for (let i = 1; i <= 5; i++) {
    const user = {
      name: `BulkUser${i}`,
      email: `bulkuser+${ts}+${i}@example.com`,
      password: 'Passw0rd!'
    };
    try {
      const res = await axios.post(`${baseUrl}/api/v1/auth/register`, user, { timeout: 10000 });
      console.log(`Created ${user.email} -> status ${res.status}`);
      results.push({ email: user.email, ok: true, status: res.status, id: res.data?.user?._id || null });
    } catch (err) {
      console.error(`Failed ${user.email}:`, err.response ? err.response.data : err.message);
      results.push({ email: user.email, ok: false, error: err.response ? err.response.data : err.message });
    }
  }

  const after = await dbCount(db);
  console.log('Users after:', after);

  await mongoose.disconnect();

  console.log('\nSummary:');
  results.forEach(r => console.log(r));
}

run().catch(err => { console.error(err); process.exit(1); });
