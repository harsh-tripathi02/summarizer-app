import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getSummary(id, length) {
  const res = await axios.post(`${API_URL}/summarize`, { id, length });
  return res.data;
}
