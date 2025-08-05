import { Router, type Request, type Response } from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Полный список голосов из документации
const AVAILABLE_VOICES = [
  'Arista-PlayAI',
  'Atlas-PlayAI',
  'Basil-PlayAI',
  'Briggs-PlayAI',
  'Calum-PlayAI',
  'Celeste-PlayAI',
  'Cheyenne-PlayAI',
  'Chip-PlayAI',
  'Cillian-PlayAI',
  'Deedee-PlayAI',
  'Fritz-PlayAI',
  'Gail-PlayAI',
  'Indigo-PlayAI',
  'Mamaw-PlayAI',
  'Mason-PlayAI',
  'Mikail-PlayAI',
  'Mitch-PlayAI',
  'Quinn-PlayAI',
  'Thunder-PlayAI',
];

router.get('/voices', (_req, res) => {
  res.json(AVAILABLE_VOICES);
});

router.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice } = req.body;
    const chosenVoice = AVAILABLE_VOICES.includes(voice) ? voice : 'Fritz-PlayAI';

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

export default router;
