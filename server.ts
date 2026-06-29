import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  app.post('/api/explain', async (req, res) => {
    try {
      const { question, options, correctAnswer, selectedAnswer } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required' });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
You are a helpful Russian language tutor. 
A student answered a multiple-choice question incorrectly.
Question: "${question}"
Options: ${options.join(', ')}
Correct Answer: "${correctAnswer}"
Student's Answer: "${selectedAnswer}"

Provide a concise explanation in a mix of simple Russian and English (to help an English-speaking learner of Russian) of why "${correctAnswer}" is correct and why "${selectedAnswer}" is wrong. 
The explanation must be based ONLY on the official correct answer. Keep it under 3 sentences.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (error) {
      console.error('Error generating explanation:', error);
      res.status(500).json({ error: 'Failed to generate explanation' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
