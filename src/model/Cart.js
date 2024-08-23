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
        autoIncrement: true // Assuming you have a mechanism to handle auto-increment
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
        required: true,
        default: false
    },
    status: {
        type: String,
        required: false,
    }
}, { timestamps: true }); 

// Create a unique compound index on userEmail and courseCode
cartSchema.index({ userEmail: 1, courseCode: 1 }, { unique: true });

// Avoid redefining the model if it already exists
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
