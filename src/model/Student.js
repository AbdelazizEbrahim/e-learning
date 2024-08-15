import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    enrolledCourse: {
        type: String,
        required: false
    }
});

// Avoid redefining the model if it already exists
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;
