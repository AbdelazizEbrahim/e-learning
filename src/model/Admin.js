// model/admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Correctly placed the closing parenthesis

// Avoid redefining the model if it already exists
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;