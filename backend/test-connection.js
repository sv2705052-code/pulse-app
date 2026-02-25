import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'));

async function test() {
  try {
    console.log('Starting connection attempt (forcing IPv4)...');
    mongoose.set('debug', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Connection failed.');
    console.error('Error Name:', err.name);
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    if (err.reason) {
      console.error('Error Reason:', JSON.stringify(err.reason, null, 2));
    }
    process.exit(1);
  }
}

test();
