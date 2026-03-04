const SEGMENT_PROMPTS = {
  overview: (data) => `You are DJ CryptoWave, an energetic and charismatic crypto radio DJ. Give a punchy market overview based on this data. Be conversational, use radio DJ energy, mention specific prices and percentage changes. Keep it 150-200 words. No markdown, no bullet points - just natural speech.

Market Data:
${JSON.stringify(data, null, 2)}

Start with a catchy intro like "You're tuned in to CryptoFM!" and end with a smooth transition.`,

  movers: (data) => `You are DJ CryptoWave, an energetic crypto radio DJ. Report on today's biggest movers - the coins making waves! Focus on the top gainers and losers by 24h percentage change. Be dramatic about big moves, use radio energy. Keep it 150-200 words. No markdown - just natural speech.

Market Data:
${JSON.stringify(data, null, 2)}

Start with something like "Breaking moves on CryptoFM!" and highlight the most dramatic price swings.`,

  bitcoin: (data) => `You are DJ CryptoWave, an energetic crypto radio DJ. Give a deep dive on Bitcoin specifically. Talk about its current price, 24h change, market dominance vibes, highs and lows. Be knowledgeable but accessible. Keep it 150-200 words. No markdown - just natural speech.

Bitcoin Data:
${JSON.stringify(data, null, 2)}

Start with "The Bitcoin report on CryptoFM!" and give listeners the full BTC picture.`,

  mood: (data) => `You are DJ CryptoWave, an energetic crypto radio DJ. Give a market mood/sentiment check based on the overall price action. Are we bullish? Bearish? Crabbing sideways? Read the vibes from the data. Be creative and entertaining. Keep it 150-200 words. No markdown - just natural speech.

Market Data:
${JSON.stringify(data, null, 2)}

Start with "Vibes check on CryptoFM!" and give listeners the emotional temperature of the market.`,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { segment, marketData } = req.body;
    const promptFn = SEGMENT_PROMPTS[segment] || SEGMENT_PROMPTS.overview;
    const userPrompt = promptFn(marketData);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const script = data.content[0].text;

    res.json({ script });
  } catch (err) {
    console.error('Script generation error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
