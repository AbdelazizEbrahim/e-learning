import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const userProfileSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
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
}, { timestamps: true });

// Avoid redefining the model if it already exists
const UserProfile = models.UserProfile || model('UserProfile', userProfileSchema);

export default UserProfile;
