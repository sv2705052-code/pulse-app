import mongoose from 'mongoose';

const baseUri = 'mongodb+srv://tinder_user:pg0zbD17DDU0XMdh@cluster0.vtzk1id.mongodb.net/tinder';
const standardUri = 'mongodb://tinder_user:pg0zbD17DDU0XMdh@cluster0-shard-00-00.vtzk1id.mongodb.net:27017,cluster0-shard-00-01.vtzk1id.mongodb.net:27017,cluster0-shard-00-02.vtzk1id.mongodb.net:27017/tinder?authSource=admin&replicaSet=atlas-1qjeja-shard-0&tls=true';

const testUris = [
    { name: 'SRV (Default)', uri: baseUri + '?retryWrites=true&w=majority' },
    { name: 'SRV (No Options)', uri: baseUri },
    { name: 'Standard (ReplicaSet)', uri: standardUri },
];

async function runTests() {
    for (const test of testUris) {
        console.log(`--- Testing: ${test.name} ---`);
        try {
            await mongoose.connect(test.uri, { serverSelectionTimeoutMS: 5000, family: 4 });
            console.log(`SUCCESS: ${test.name} worked!`);
            await mongoose.disconnect();
            process.exit(0);
        } catch (err) {
            console.log(`FAILED: ${test.name} - ${err.message}`);
        }
    }
    console.log('--- All cloud connection formats failed. ---');
    process.exit(1);
}

runTests();
