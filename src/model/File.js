import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  fileIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

export default mongoose.models.File || mongoose.model('File', fileSchema);
