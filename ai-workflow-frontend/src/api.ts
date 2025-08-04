import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001', // adjust if different
});

export const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await API.post('/upload', formData);
  return res.data.docId;
};

export const queryAI = async (prompt: string, docId: string) => {
  const res = await API.post('/query', { prompt, docId });
  return res.data.answer;
};
