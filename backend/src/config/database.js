import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cache the connection across function calls
let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  // If we already have a connection, use it
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    console.log('✅ Using cached database connection');
    return true;
  }

  // If we're already connecting, wait for it
  if (connectionPromise) {
    console.log('⏳ Waiting for existing connection...');
    return connectionPromise;
  }

  // Check if MongoDB URI exists
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    return false;
  }

  // Start new connection
  connectionPromise = (async () => {
    try {
      console.log('📡 Connecting to MongoDB Atlas...');
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 1,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        connectTimeoutMS: 5000,
        retryWrites: true,
        retryReads: true,
      });

      cachedConnection = conn;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      cachedConnection = null;
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

export default connectDB;