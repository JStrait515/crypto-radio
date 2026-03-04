# CryptoFM: An AI Radio Station That Reads You the Market

## Week 4 of Spring into AI: Soundwave

This week's theme was **Soundwave** — transmission of identity through sound. So I built an AI-powered crypto radio station where you literally tune in and hear a DJ give you live market updates.

No reading charts. No scrolling feeds. Just hit TUNE IN and listen.

## How It Works

CryptoFM has four radio stations, each with a different DJ voice and focus:

- **88.1 FM — Market Overview** — Adam gives you the big picture on the top coins
- **91.5 FM — Top Movers** — Antoni breaks down the biggest gainers and losers
- **95.3 FM — Bitcoin Deep Dive** — Arnold goes deep on BTC price action
- **99.7 FM — Market Mood** — Bella reads the vibes and tells you if we're bullish or bearish

Each broadcast is unique. The app pulls live market data from CoinGecko, sends it to Claude to write a DJ-style script, then ElevenLabs synthesizes it into real voice audio — complete with a retro VU meter visualizer.

The whole thing takes about 10 seconds from clicking TUNE IN to hearing a voice.

## The Build

The frontend is React + Vite + Tailwind CSS with a retro radio aesthetic — wood grain shell, green LCD display, amber frequency dials. The backend is three Vercel serverless functions:

1. **Market data** — proxies CoinGecko with retry logic
2. **Script generation** — Claude writes 150-200 words of DJ patter based on real data
3. **Text-to-speech** — ElevenLabs converts the script to audio, different voice per station

All API keys stay server-side. The frontend just receives an audio blob and plays it through the Web Audio API, which also powers the visualizer bars.

The most fun part was getting the voices right. Each station has its own ElevenLabs voice that fits the segment personality — the Bitcoin analyst sounds different from the vibes checker.

## Links

- **Live app:** [https://crypto-radio-lyart.vercel.app](https://crypto-radio-lyart.vercel.app)
- **GitHub repo:** [https://github.com/JStrait515/crypto-radio](https://github.com/JStrait515/crypto-radio)

Tune in and turn it up. See you in Week 5.
