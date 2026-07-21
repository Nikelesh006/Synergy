import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://synergytechlabshelp:V29KH1myr7txseTQ@cluster0.k257bpo.mongodb.net/?appName=Cluster0';

if (!MONGODB_URL) {
  throw new Error('MONGODB_URL must be set in environment variables');
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
  }
};

export { mongoose };
