import express from 'express';
import multer from 'multer';
import parsePdf from '../utils/parsePdf';
import { embedAndStoreChunks } from '../utils/embed';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const text = await parsePdf(file.buffer);
  const docId = await embedAndStoreChunks(text);
  
  res.json({ message: 'Uploaded and processed', docId });
});

export default router;
