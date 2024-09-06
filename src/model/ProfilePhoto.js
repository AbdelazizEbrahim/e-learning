// models/ProfilePhoto.js
import mongoose from 'mongoose';

const ProfilePhotoSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const ProfilePhoto = mongoose.models.ProfilePhoto || mongoose.model('ProfilePhoto', ProfilePhotoSchema);

export default ProfilePhoto;
