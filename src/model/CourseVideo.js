import mongoose from 'mongoose';

const { Schema } = mongoose;

const videoSchema = new Schema({
  courseCode: {
    type: String,
    required: true,
    trim: true,
  },
  videoPath: {
    type: String,
    required: true,
    trim: true,
  },
  videoName: {
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
  },
}, {
  timestamps: true, 
});

videoSchema.index({ courseCode: 1, orderNumber: 1 }, { unique: true });

const CourseVideo = mongoose.models.CourseVideo || mongoose.model('CourseVideo', videoSchema);

export default CourseVideo;
