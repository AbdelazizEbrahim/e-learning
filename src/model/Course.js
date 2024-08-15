import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    instructor: {
        type: String,
        required: true
    },
    studentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
});

// Avoid redefining the model if it already exists
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;
