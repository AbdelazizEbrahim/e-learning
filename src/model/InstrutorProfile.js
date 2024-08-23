import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const instructorProfileSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  instructorId: {
    type: String,
    required: true,
    unique: true,
    sparse: true, // Ensures uniqueness for non-null values
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const InstructorProfile = models.InstructorProfile || model('InstructorProfile', instructorProfileSchema);

export default InstructorProfile;
