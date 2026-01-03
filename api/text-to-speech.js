import fetch from 'node-fetch';

const ELEVEN_API_KEY = 'sk_c26e99865f25929f342e764cfe586e14702f9ddb2713b4b5'; // replace with your key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'Missing text' });

      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', // replace with your voice ID
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVEN_API_KEY,
          },
          body: JSON.stringify({ text, voice_settings: { stability: 0.5, similarity_boost: 0.7 } }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        return res.status(500).json({ error: err });
      }

      const audioBuffer = await response.arrayBuffer();
      res.status(200).send(Buffer.from(audioBuffer));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
