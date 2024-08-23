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
        required: true,
    },
    studentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    favorite: {
        type: Boolean,
        default: false
    },
    isHome: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    overview: {
        type: String,
        required: false
    },
    requirements: {
        type: String,
        required: false
    },
    whatWeWillLearn: {
        type: String,
        required: false
    }
}, { timestamps: true });

// Avoid redefining the model if it already exists
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;
