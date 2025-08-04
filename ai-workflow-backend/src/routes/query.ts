import express from 'express';
import axios from 'axios';
import { getChunks, cosineSimilarity } from '../vectorStore/memoryStore';
import { getEmbedding } from '../utils/embed';

const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt, docId } = req.body;
  if (!prompt || !docId) return res.status(400).json({ error: 'Missing prompt or docId' });

  const chunks = getChunks(docId);
  if (!chunks.length) return res.status(404).json({ error: 'Document not found' });

  const queryEmbedding = await getEmbedding(prompt);
  const ranked = chunks
    .map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const context = ranked.map(r => r.text).join('\n---\n');

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'Use the context below to answer the user question.' },
        { role: 'user', content: `Context:\n${context}\n\nQuestion:\n${prompt}` },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const answer = response.data.choices[0].message.content;
  res.json({ answer });
});

export default router;
