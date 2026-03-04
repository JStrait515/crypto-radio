const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

async function fetchWithRetry(url, maxRetries = 2) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
      return res.json();
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === maxRetries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error('CoinGecko request failed after retries');
}

export default async function handler(req, res) {
  try {
    const segment = req.query.segment || 'overview';

    let params;
    if (segment === 'bitcoin') {
      params = 'ids=bitcoin&vs_currency=usd&sparkline=false&price_change_percentage=1h,24h,7d';
    } else {
      // Fetch fewer coins to speed up response
      params =
        'vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h';
    }

    const coins = await fetchWithRetry(`${COINGECKO_BASE}/coins/markets?${params}`);

    // Skip global data fetch to stay within timeout
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.json({ coins, global: null });
  } catch (err) {
    console.error('Market data error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
