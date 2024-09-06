import mongoose from 'mongoose';

// Function to generate a random 5-digit string
function generateRandomId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

const enrollmentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: false
  },
  requirements: {
    type: String,
    required: false
  },
  whatWeWillLearn: {
    type: String,
    required: false
  },
  orderNumber: {
    type: String,
    unique: false,
    required: false,
  },
  paymentId: {
    type: String,
    unique: true, // Ensure it's unique
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'PAID', 'FAILED'], 
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Pending', 'PAID', 'FAILED'], 
    default: 'Pending',
  },
  paymentVia: {
    type: String,
    default: "CHAPA"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, // Set to true if you want automatic createdAt and updatedAt fields
});
enrollmentSchema.index({ userEmail: 1, courseCode: 1 }, { unique: true });


// Pre-save middleware to handle orderNumber and paymentId generation
enrollmentSchema.pre('save', async function(next) {
  // Generate unique 5-digit paymentId
  if (!this.paymentId) {
    let uniquePaymentId = generateRandomId();
    let existingEntry = await Enrollment.findOne({ paymentId: uniquePaymentId });

    // Ensure the generated paymentId is unique
    while (existingEntry) {
      uniquePaymentId = generateRandomId();
      existingEntry = await Enrollment.findOne({ paymentId: uniquePaymentId });
    }

    this.paymentId = uniquePaymentId;
  }

  next();
});

// Avoid redefining the model if it already exists
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
