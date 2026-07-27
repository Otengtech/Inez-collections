// backend/api/index.js
import app from '../index.js';

// Log startup for debugging
console.log('✅ API handler loaded');
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('Socket Server URL:', process.env.SOCKET_SERVER_URL || 'Not set');

// Wrap the app to catch errors
export default async function handler(req, res) {
  try {
    // Log incoming request
    console.log(`📥 ${req.method} ${req.url}`);
    return app(req, res);
  } catch (error) {
    console.error('❌ Handler error:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}