import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isInstructor: { type: Boolean, required: false, default: false },
  role: { type: String, enum: ['user', 'admin', 'instructor'], default: 'user', required: false }, 
  otp: { type: String, required: false },
}, {
  timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
