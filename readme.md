# Document Summary Assistant

A full-stack MERN application that allows users to upload PDF and image documents, extract text, and generate smart AI-powered summaries with improvement suggestions.

## Features

- **Document Upload**
  - Upload PDF and image files (drag-and-drop or file picker)
  - Supports scanned documents and standard PDFs

- **Text Extraction**
  - PDF parsing with formatting retention (using `pdf-parse`)
  - OCR (Optical Character Recognition) for images using Tesseract.js

- **Summary Generation**
  - AI-powered summaries in short, medium, and long formats (via Groq API)
  - Highlights key points and main ideas

- **User Experience**
  - Simple, modern, and mobile-responsive interface (React + Material UI)
  - Loading states and error handling throughout

## Tech Stack

- **Frontend:** React.js, Material UI, react-dropzone, Axios
- **Backend:** Node.js, Express.js, Multer, pdf-parse, Tesseract.js, Mongoose, dotenv, Groq API
- **Database:** MongoDB

## Folder Structure

```
summarizer-app/
│
├── backend/    # Express.js/Node.js server, API, and models
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   └── index.js
│
├── frontend/   # React app (UI components, API calls)
│   ├── public/
│   └── src/
│
├── .gitignore
└── readme.md
```

## Getting Started

### Backend

1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   - `MONGO_URI`
   - `PORT`
   - `GROQ_API_KEY`
   - `GROQ_MODEL`
4. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm start`

## API Endpoints

- `POST /api/upload`  
  Upload a PDF or image. Extracts text and stores document in MongoDB.

- `POST /api/summarize`  
  Generate a summary for a document by ID and length (short, medium, long) using the Groq API.

## Approach

- The backend uses Multer for file uploads, pdf-parse for PDF text extraction, and Tesseract.js for OCR on images.
- Summaries are generated using the Groq API, with support for different summary lengths and highlight extraction.
- The frontend is built with React and Material UI, providing a modern, responsive, and intuitive user experience.
- Error handling and loading states are implemented throughout for robustness.
- The codebase is modular and organized for clarity and extensibility.

