import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

async function run() {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    try {
        console.log('Attempting native driver connection to:', uri.replace(/:([^@]+)@/, ':****@'));
        await client.connect();
        console.log('SUCCESS: Native driver connected!');
        await client.db('admin').command({ ping: 1 });
        console.log('Ping successful!');
    } catch (err) {
        console.error('FAILURE: Native driver failed.');
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
