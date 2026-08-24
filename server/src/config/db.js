import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qrcode_platform';
    console.log(`[Database] Connecting to MongoDB...`);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });
    
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    console.warn(`[Database] Running in disconnected/fallback mode until MongoDB connection is available.`);
    return null;
  }
};
