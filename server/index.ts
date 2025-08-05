import express from 'express';
import cors from 'cors';
import ttsRouter from './tts.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', ttsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
