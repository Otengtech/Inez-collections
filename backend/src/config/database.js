import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cache the connection across function calls
let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection, use it
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    console.log('✅ Using cached database connection');
    return true;
  }

  // If we're already connecting, wait for it
  if (cachedConnection === 'connecting') {
    console.log('⏳ Waiting for existing connection...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return connectDB();
  }

  // Start new connection
  cachedConnection = 'connecting';
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1, // Keep pool small for serverless
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 5000, // 5 seconds
      retryWrites: true,
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    cachedConnection = null;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

export default connectDB;