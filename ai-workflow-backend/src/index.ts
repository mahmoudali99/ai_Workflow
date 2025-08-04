import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import queryRoute from './routes/query';
import uploadRoute from './routes/upload';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/upload', uploadRoute);
app.use('/query', queryRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
