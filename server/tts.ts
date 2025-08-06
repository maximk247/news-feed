import { Router, type Request, type Response } from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { AVAILABLE_AI_VOICES } from './constants/available-ai-voices.ts';

dotenv.config();

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get('/voices', (_req, res) => {
  res.json(AVAILABLE_AI_VOICES);
});

router.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice } = req.body;
    const chosenVoice = AVAILABLE_AI_VOICES.includes(voice) ? voice : 'Fritz-PlayAI';

    const response = await groq.audio.speech.create({
      model: 'playai-tts',
      voice: chosenVoice,
      input: text,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'TTS failed' });
  }
});

router.post('/generate-text', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 30,
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Text generation failed' });
  }
});

export default router;
