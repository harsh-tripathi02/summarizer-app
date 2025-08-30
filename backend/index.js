import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// Debug: Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Load environment variables from .env file
dotenv.config();


// Load env variables
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/summarizer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


import uploadRouter from './routes/upload.js';
import summarizeRouter from './routes/summarize.js';

app.get('/', (req, res) => {
  res.send('Document Summary Assistant Backend Running');
});

app.use('/api/upload', uploadRouter);
app.use('/api/summarize', summarizeRouter);

const PORT = process.env.PORT || 3001;
console.log(`About to start server on port ${PORT}...`);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('app.listen called');
