import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { uploadDocument, getSummary } from '../api';

const acceptedTypes = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const { id, text } = await uploadDocument(file);
      // Default to medium summary
      const summaryData = await getSummary(id, 'medium');
      onUpload && onUpload({ id, text, ...summaryData });
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, minWidth: 340, bgcolor: '#23283a', borderRadius: 4, boxShadow: 6 }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 700, color: '#00bcd4', letterSpacing: 1 }}>
        Upload Document
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #00bcd4',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? '#263238' : '#181c24',
          color: '#fff',
          borderRadius: 2,
          transition: 'background 0.2s',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography sx={{ color: '#00bcd4' }}>Drop the file here...</Typography>
        ) : (
          <Typography>Drag & drop a PDF or image, or click to select</Typography>
        )}
        {file && <Typography sx={{ mt: 1, color: '#ff4081' }}>Selected: {file.name}</Typography>}
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: '100%', fontWeight: 700, fontSize: 16, py: 1.2, borderRadius: 2, boxShadow: 3 }}
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Upload'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Paper>
  );
}

export default UploadSection;
