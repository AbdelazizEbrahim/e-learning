import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const DocumentationSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cv: {
    type: String, // URL or path to the CV file
    required: false,
  },
  degree: {
    type: String, // URL or path to the degree file
    required: false,
  },
}, { timestamps: true });

// Avoid redefining the model if it already exists
const Documentation = models.Documentation || model('Documentation', DocumentationSchema);

export default Documentation;
