import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    instructorName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    instructorId: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    }
});

// Avoid redefining the model if it already exists
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;
