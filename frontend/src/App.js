
import React from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import UploadSection from './components/UploadSection';
import SummarySection from './components/SummarySection';
import { useState } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00bcd4' },
    secondary: { main: '#ff4081' },
    background: { default: '#181c24', paper: '#23283a' },
    text: { primary: '#fff', secondary: '#b0bec5' },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial',
    h3: { fontWeight: 800, letterSpacing: 2, color: '#00bcd4' },
  },
});

function App() {
  const [docData, setDocData] = useState(null);
  const [summaryKey, setSummaryKey] = useState(0); // for forcing SummarySection re-render

  // When a new doc is uploaded, force SummarySection to reset and show summary immediately
  const handleUpload = (data) => {
    setDocData(data);
    setSummaryKey((k) => k + 1);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Document Summary Assistant
        </Typography>
        <Box display="flex" flexDirection="column" gap={4}>
          <UploadSection onUpload={handleUpload} />
          <SummarySection key={summaryKey} docData={docData} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
