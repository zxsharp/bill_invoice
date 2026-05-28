const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('NO_MONGODB_URI');
  process.exit(2);
}

(async () => {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}, { projection: { email: 1, password: 1, refreshTokenHash: 1, isDeleted: 1 } }).limit(20).toArray();
    console.log('FOUND_USERS:', users.length);
    users.forEach(u => {
      console.log(`- ${u.email} | password: ${u.password ? ('present len=' + u.password.length) : 'MISSING'} | refreshTokenHash: ${u.refreshTokenHash ? 'present' : 'missing'} | isDeleted=${u.isDeleted}`);
    });
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('ERR', err.message || err);
    process.exit(3);
  }
})();
