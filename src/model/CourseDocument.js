import mongoose from 'mongoose';

const { Schema } = mongoose;

const docSchema = new Schema({
  courseCode: {
    type: String,
    required: true,
    trim: true,
  },
  documentPath: {
    type: String,
    required: true,
    trim: true,
  },
  docName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  orderNumber: {
    type: Number,
    required: true,
    unique: true,
  },
}, {
  timestamps: true, 
});

const CourseDocument = mongoose.models.CourseDocument || mongoose.model('CourseDocument', docSchema);

export default CourseDocument;
