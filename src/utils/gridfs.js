
import { MongoClient, GridFSBucket } from 'mongodb';

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = await MongoClient.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  db = client.db();
  return { client, db };
}

async function gridConnect() {
  const { db } = await connectToDatabase();
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  return { bucket, db };
}

export default gridConnect ;
