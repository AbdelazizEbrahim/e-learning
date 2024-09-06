

import formidable from 'formidable';
import { MongoClient, GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing by Next.js
  },
};

// MongoDB connection and GridFS bucket setup
async function gridConnect() {
  console.log('Connecting to MongoDB...');
  const client = await MongoClient.connect(process.env.DATABASE_URI);
  console.log('Connected to MongoDB.');
  const db = client.db(process.env.MONGODB_DB);
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  return { client, bucket, db };
}

export default async function handler(req, res) {
  console.log(`Received request with method: ${req.method}`);

  // if (req.method !== 'POST' || req.method !== 'GET') {
  //   console.log('Method not allowed');
  //   return res.status(405).json({ message: 'Method not allowed' });
  // }

  const form = formidable({ multiples: true });
  const { email } = req.query; 

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ message: 'Error uploading files' });
    }

    console.log('Form parsed successfully');
    console.log('Fields:', fields);
    console.log('Files:', files);

    const { client, bucket } = await gridConnect(); // Connect to MongoDB and GridFS

    try {
      const fileUploadPromises = Object.keys(files).map((key) => {
        const file = files[key];
        const filePath = file.filepath || file[0].filepath; // Access file path

        if (!filePath) {
          console.error('File path not found:', file);
          return Promise.reject(new Error('File path not found'));
        }

        console.log(`Uploading file: ${path.basename(filePath)}`);

        return new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStream(path.basename(filePath), {
            contentType: file.mimetype,
          });

          const readStream = fs.createReadStream(filePath);
          readStream.pipe(uploadStream);

          readStream.on('error', (error) => {
            console.error('Read stream error:', error);
            reject(error);
          });

          uploadStream.on('error', (error) => {
            console.error('Upload stream error:', error);
            reject(error);
          });

          uploadStream.on('finish', () => {
            console.log(`File uploaded successfully: ${uploadStream.id}`);
            resolve(uploadStream.id);
          });
        });
      });

      const fileIds = await Promise.all(fileUploadPromises);
      console.log('All files uploaded:', fileIds);
      res.status(200).json({ message: 'Files uploaded successfully', fileIds });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ message: 'Failed to upload files' });
    } finally {
      console.log('Closing MongoDB client');
      await client.close();
      console.log('MongoDB client closed');
    }
  });
}
