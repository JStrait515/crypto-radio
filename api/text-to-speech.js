export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY not configured' });
  }

  try {
    const { text, segment } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Different voice per station for variety
    const VOICES = {
      overview: 'pNInz6obpgDQGcFmaJgB', // Adam - deep, authoritative
      movers:   'ErXwobaYiN019PkySvjV', // Antoni - warm, engaging
      bitcoin:  'VR6AewLTigWG4xSOukaG', // Arnold - bold, confident
      mood:     'EXAVITQu4vr4xnSDxMaL', // Bella - expressive, vibey
    };
    const voiceId = VOICES[segment] || VOICES.overview;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${err}`);
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
