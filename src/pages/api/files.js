import NextConnect from 'next-connect';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

// MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017/mydatabase';

let gfs;

const connectToDatabase = async () => {
  console.log('Connecting to MongoDB...');
  if (mongoose.connection.readyState) {
    console.log('Already connected to MongoDB.');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const conn = mongoose.connection;
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('MongoDB connected and GridFS initialized.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    console.log('Received file for upload:', file.originalname);
    return {
      filename: file.originalname,
      bucketName: 'uploads',
    };
  },
});

const upload = multer({ storage });

const handler = NextConnect();
console.log("handler: ", handler);

// Connect to MongoDB
handler.use(async (req, res, next) => {
  console.log('Middleware: Connecting to database...');
  await connectToDatabase();
  next();
});

// Upload file
handler.post(upload.single('file'), (req, res) => {
  console.log('Handling file upload...');
  if (!req.file) {
    console.log('No file uploaded.');
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log('File uploaded successfully:', req.file.originalname);
  res.status(201).json({
    filename: req.file.originalname,
    url: `/api/files/${req.file.filename}`,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

// Retrieve file
handler.get(async (req, res) => {
  console.log('Handling file retrieval...');
  const { filename } = req.query;
  console.log('Filename for retrieval:', filename);
  try {
    gfs.files.findOne({ filename }, (err, file) => {
      if (err) {
        console.error('Error finding file:', err);
        return res.status(500).json({ error: 'Error finding file' });
      }
      if (!file || file.length === 0) {
        console.log('No file found with the given filename.');
        return res.status(404).json({ error: 'No file found' });
      }
      console.log('File found, creating read stream.');
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    });
  } catch (error) {
    console.error('Error handling file retrieval:', error);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

// Delete file
handler.delete(async (req, res) => {
  console.log('Handling file deletion...');
  const { filename } = req.query;
  console.log('Filename for deletion:', filename);
  try {
    gfs.files.deleteOne({ filename }, (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
        return res.status(500).json({ error: 'Failed to delete file' });
      }
      console.log('File deleted successfully.');
      res.status(200).json({ message: 'File deleted successfully' });
    });
  } catch (error) {
    console.error('Error handling file deletion:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default handler;
