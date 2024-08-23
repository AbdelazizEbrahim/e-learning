import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: {type: Boolean }
  }, {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  });
  
  const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
  
  export default Feedback;


