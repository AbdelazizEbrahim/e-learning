import mongoose from 'mongoose';

const testimonySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    testimony: {
        type: String,
        required: true
    }
}, { timestamps: true}
)

const Testimony = mongoose.models.Testimony || mongoose.model("Testimony", testimonySchema);

export default Testimony;

