// models/About.js
import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, 
  },
  mainBody: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 1, 
    max: 10, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AboutText = mongoose.models.AboutText || mongoose.model('AboutText', AboutSchema);

export default AboutText;
