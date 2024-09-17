// models/File.js
import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileComponent: {
    type: String,
    required: true, 
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  filePath: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true, 
  },
});

const File = mongoose.models.File || mongoose.model('File', FileSchema);

export default File;
