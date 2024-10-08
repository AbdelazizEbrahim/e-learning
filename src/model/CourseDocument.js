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
    unique: false,
  },
}, {
  timestamps: true, 
});

// Create a compound index to enforce the uniqueness of orderNumber combined with courseCode
docSchema.index({ courseCode: 1, orderNumber: 1 }, { unique: true });

const CourseDocument = mongoose.models.CourseDocument || mongoose.model('CourseDocument', docSchema);

export default CourseDocument;
