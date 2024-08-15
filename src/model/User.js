import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Specify possible roles
  otp: { type: String },
}, {
  timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;