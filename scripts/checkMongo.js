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
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('MONGO_PING_OK');
    console.log('DATABASES:' + dbs.databases.map(d => d.name).join(','));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MONGO_ERR', err.message);
    process.exit(3);
  }
})();
