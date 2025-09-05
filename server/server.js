
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API endpoints available:');
    console.log('- GET  /');
    console.log('- GET  /health (with HTTP Basic Auth)');
    console.log('- POST /api/files/upload');
    console.log('- GET  /api/files');
    console.log('- GET  /api/files/:fileId');
    console.log('- POST /api/files/:fileId/check-plagiarism');
    console.log('- GET  /api/files/:fileId/trust-score');
    console.log('- POST /api/trust-score/generate');
    console.log('- GET  /api/trust-score/:fileId');
    console.log('- POST /api/trust-score/:fileId/analyze');
    console.log('- GET  /settings/profile/profile');
    console.log('- POST /settings/profile/profile');
    console.log('- POST /api/pdf/generate-plagiarism-report');
  });
};

// Connect to MongoDB if URI is provided
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB connected');
    startServer();
  }).catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Starting server without MongoDB...');
    startServer();
  });
} else {
  console.log('No MongoDB URI provided, starting server without database...');
  startServer();
}
