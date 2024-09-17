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
  },
  studentId: {
    type: String,
    required: false,
    default:"none",
    unique: false,
  },
  age: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
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

// Static method to generate a new instructorId
instructorProfileSchema.statics.generateInstructorId = async function () {
  // Find the last instructorId
  const lastProfile = await this.findOne({}, {}, { sort: { instructorId: -1 } });

  if (lastProfile) {
    const lastId = lastProfile.instructorId;
    const lastNumber = parseInt(lastId.slice(3), 10); // Extract the numeric part
    const newNumber = lastNumber + 1; // Increment the number
    return `str${newNumber.toString().padStart(4, '0')}`;
  } else {
    // If no profiles exist, start with 0001
    return 'str0001';
  }
};

// Pre-save middleware to set the instructorId
instructorProfileSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      this.instructorId = await this.constructor.generateInstructorId();
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Create the model
const InstructorProfile = mongoose.models.InstructorProfile || mongoose.model('InstructorProfile', instructorProfileSchema);

export default InstructorProfile;
