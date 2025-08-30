import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  text: String,
  summary: {
    short: String,
    medium: String,
    long: String,
  },
  suggestions: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Document', DocumentSchema);
