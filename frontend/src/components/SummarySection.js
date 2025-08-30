
import React, { useState } from 'react';
import { Paper, Typography, Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { getSummary } from '../api';

const summaryLengths = ['short', 'medium', 'long'];

function SummarySection({ docData }) {
  const [tab, setTab] = useState(1); // 0: short, 1: medium, 2: long
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);


  React.useEffect(() => {
    if (docData) {
      setSummary(docData.summary);
    }
  }, [docData]);

  // Auto-fetch summary for current tab if missing when docData or tab changes
  React.useEffect(() => {
    if (!docData) return;
    const length = summaryLengths[tab];
    if (!summary || !summary[length]) {
      setLoading(true);
      getSummary(docData.id, length)
        .then((res) => {
          setSummary((prev) => ({ ...prev, [length]: res.summary }));
        })
        .finally(() => setLoading(false));
    }
  }, [docData, tab]);

  const handleTabChange = async (e, newTab) => {
    setTab(newTab);
    if (!docData) return;
    const length = summaryLengths[newTab];
    if (!docData.summary || !docData.summary[length]) {
      setLoading(true);
      try {
        const res = await getSummary(docData.id, length);
        setSummary((prev) => ({ ...prev, [length]: res.summary }));
      } finally {
        setLoading(false);
      }
    }
  };

  const currentLength = summaryLengths[tab];
  const summaryText = summary && summary[currentLength];

  // Extract intro line if present (e.g., "Here is a medium summary of the text: ...")
  let introLine = '';
  let mainSummary = summaryText;
  if (summaryText && summaryText.toLowerCase().startsWith('here is a')) {
    const splitIdx = summaryText.indexOf(':');
    if (splitIdx !== -1) {
      introLine = summaryText.slice(0, splitIdx + 1);
      mainSummary = summaryText.slice(splitIdx + 1).trim();
    }
  }

  return (
    <Paper elevation={6} sx={{ p: 4, minWidth: 340, flex: 2, bgcolor: '#f8fafc', borderRadius: 4, boxShadow: 6 }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 1 }}>
        Generated Summary
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }} centered textColor="primary" indicatorColor="primary">
        <Tab label="Short" sx={{ fontWeight: 600, fontSize: 16 }} />
        <Tab label="Medium" sx={{ fontWeight: 600, fontSize: 16 }} />
        <Tab label="Long" sx={{ fontWeight: 600, fontSize: 16 }} />
      </Tabs>
      <Box sx={{ minHeight: 140, bgcolor: '#f0f4f8', p: 3, borderRadius: 2, boxShadow: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
            <CircularProgress />
          </Box>
        ) : summaryText ? (
          <>
            {introLine && (
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#388e3c', mb: 2, bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
                {introLine}
              </Typography>
            )}
            <Typography sx={{ fontSize: 18, color: '#222', mt: introLine ? 2 : 0 }}>{mainSummary}</Typography>
          </>
        ) : (
          <Typography color="text.secondary">Summary will appear here.</Typography>
        )}
      </Box>
    </Paper>
  );
}

export default SummarySection;
