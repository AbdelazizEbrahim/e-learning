import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    courseCode: {
        type: String,
        required: true,
    },
    orderNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String,
        required: false,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'PAID', 'FAILED'], 
        default: 'Pending',
    },
    status: {
        type: String,
        enum: ['Pending', 'PAID', 'FAILED', 'Active'], 
        default: 'Pending',
    },
    courseTitle: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: false,
    },
    requirements: {
        type: String,
        required: false,
    },
    whatWeWillLearn: {
        type: String,
        required: false,
    },
    isHome: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Create a unique compound index on userEmail and courseCode
cartSchema.index({ userEmail: 1, courseCode: 1 }, { unique: true });

// Avoid redefining the model if it already exists
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
