import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    email: {
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
        required: false,
        default: "image.jpeg",
    },
    favorite: {
        type: Boolean,
        default: false,
        required: false
    },
    // New attributes
    overview: {
        type: String,
        required: true // Or true if required
    },
    requirements: {
        type: String,
        required: true // Or true if required
    },
    whatWeWillLearn: {
        type: String,
        required: true // Or true if required
    },
}, { timestamps: true }); 

// Create a compound index to ensure the combination of email and courseCode is unique
wishlistSchema.index({ email: 1, courseCode: 1 }, { unique: true });

// Avoid redefining the model if it already exists
const WishList = mongoose.models.WishList || mongoose.model('WishList', wishlistSchema);

export default WishList;
