import axios from 'axios';

export class GroqService {
  async getVoices(): Promise<string[]> {
    const res = await axios.get('/api/voices');
    return res.data;
  }

  async generateText(prompt: string): Promise<string> {
    const res = await axios.post('/api/generate-text', { prompt });
    return res.data.choices?.[0]?.message?.content?.trim() || '';
  }

  async playText(text: string, voice: string): Promise<void> {
    const res = await axios.post('/api/tts', { text, voice }, { responseType: 'blob' });

    const url = URL.createObjectURL(res.data);
    const audio = new Audio(url);

    return new Promise<void>((resolve) => {
      audio.onended = () => {
        resolve();
        URL.revokeObjectURL(url);
      };
      audio.play();
    });
  }
}

export const groqService = new GroqService();
