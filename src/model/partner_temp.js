import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, 
{ timestamps: true });

const Partner = mongoose.models.Partner || mongoose.model('Partner', partnerSchema);

export default Partner;
