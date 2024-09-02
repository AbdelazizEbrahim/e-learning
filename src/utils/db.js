import mongoose from 'mongoose';

const connect = async () => {
    if (mongoose.connections[0].readyState) {
        console.log('Already connected to MongoDB');
        return;
    }
    console.log('DATABASE_URI:', process.env.DATABASE_URI);

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.DATABASE_URI, {
            serverSelectionTimeoutMS: 50000,  
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.error('MongoDB connection error');
    }
};

export default connect;
