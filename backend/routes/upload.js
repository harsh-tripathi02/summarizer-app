import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import Document from '../models/Document.js';

const router = express.Router();

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    let text = '';
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (file.mimetype.startsWith('image/')) {
      const { data: { text: ocrText } } = await Tesseract.recognize(file.path, 'eng');
      text = ocrText;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    const doc = await Document.create({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      text,
    });
    res.json({ id: doc._id, text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process file', details: err.message });
  }
});

export default router;
