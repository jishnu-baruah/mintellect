import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import profileRouter from './routes/profile.js';
import trustScoreRouter from './routes/trustScore.js';
import filesRouter from './routes/files.js';
import workflowArchiveRouter from './routes/workflowArchive.js';
import pdfRouter from './routes/pdf.js';
import { requireProfileCompletion } from './middleware/profileCompletion.js';
import { notFound, errorHandler } from './utils/error.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Special middleware for large file uploads (trust score analysis)
app.use('/api/trust-score', express.json({ limit: '100mb' }));
app.use('/api/files', express.json({ limit: '100mb' }));


// Logging middleware
app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (Object.keys(req.body).length) {
    console.log('Body:', req.body);
  }
  if (Object.keys(req.query).length) {
    console.log('Query:', req.query);
  }
  if (Object.keys(req.headers).length) {
    console.log('Headers:', req.headers);
  }
  next();
});

// Example auth middleware (replace with real one)
app.use((req, res, next) => {
  req.user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : {};
  next();
});
app.use('/settings/profile', profileRouter);
app.use('/api/trust-score', trustScoreRouter);
app.use('/api/files', filesRouter);
app.use('/api/workflow', workflowArchiveRouter);
app.use('/api/pdf', pdfRouter);
app.use(requireProfileCompletion);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

export default app;
