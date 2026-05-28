require('dotenv').config();
const mongoose = require('mongoose');

async function main(){
  try{
    const uri = process.env.MONGODB_URI;
    if(!uri){
      console.error('MONGODB_URI not set in environment');
      process.exit(2);
    }
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const count = await db.collection('users').countDocuments();
    console.log('users_count:', count);
    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Connection/count error:', err);
    process.exit(1);
  }
}

main();
