import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema
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
    enum: ['Male', 'Female'], // Example validation for gender
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

// Create the model
const InstructorProfile = mongoose.models.InstructorProfile || mongoose.model('InstructorProfile', instructorProfileSchema);

// Export the model
export default InstructorProfile;
