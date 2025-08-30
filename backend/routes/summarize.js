import express from 'express';


import { OpenAI } from 'openai';
import Document from '../models/Document.js';

const router = express.Router();



async function getSummary(text, length = 'medium') {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const GROQ_MODEL = process.env.GROQ_MODEL ;
  if (!GROQ_API_KEY) {
    return {
      summary: 'No Groq API key set in backend .env',
      highlights: [],
      suggestions: ['Set GROQ_API_KEY in backend .env'],
    };
  }
  let lengthPrompt = 'medium';
  if (length === 'short') lengthPrompt = 'short';
  if (length === 'long') lengthPrompt = 'long';
  const prompt = `Summarize the following text in a ${lengthPrompt} summary. Highlight main ideas and key points.\n\nText:\n${text}`;
  try {
    const openai = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    const response = await openai.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes documents.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.3
    });
    const summary = response.choices?.[0]?.message?.content || 'No summary generated.';
    // Extract highlights: look for lines starting with "-" or "•" or sentences
    const highlightRegex = /(?:\n|^)[\-•]\s*(.+)/g;
    let highlights = [];
    let match;
    while ((match = highlightRegex.exec(summary)) !== null) {
      highlights.push(match[1].trim());
    }
    if (highlights.length === 0) {
      highlights = summary.split('. ').slice(0, 2).map(s => s.trim()).filter(Boolean);
    }
    const suggestions = ['Review summary for clarity and completeness.'];
    return { summary, highlights, suggestions };
  } catch (err) {
    return {
      summary: 'Error generating summary from Groq API.',
      highlights: [],
      suggestions: [err.message],
    };
  }
}

router.post('/', async (req, res) => {
  const { id, length } = req.body;
  try {
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const { summary, highlights, suggestions } = await getSummary(doc.text, length);
    doc.summary = { ...doc.summary, [length]: summary };
    doc.suggestions = suggestions;
    await doc.save();
    res.json({ summary, highlights, suggestions });
  } catch (err) {
    res.status(500).json({ error: 'Summarization failed', details: err.message });
  }
});

export default router;
