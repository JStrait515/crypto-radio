const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch(url);
    if (res.status === 429) {
      const wait = 15000 * (attempt + 1);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
    return res.json();
  }
  throw new Error('Rate limited by CoinGecko after retries');
}

export default async function handler(req, res) {
  try {
    const segment = req.query.segment || 'overview';

    let params;
    if (segment === 'bitcoin') {
      params = 'ids=bitcoin&vs_currency=usd&sparkline=false&price_change_percentage=1h,24h,7d';
    } else {
      params =
        'vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h,24h,7d';
    }

    const coins = await fetchWithRetry(`${COINGECKO_BASE}/coins/markets?${params}`);

    // Also fetch global data for overview
    let global = null;
    if (segment === 'overview' || segment === 'mood') {
      try {
        global = await fetchWithRetry(`${COINGECKO_BASE}/global`);
      } catch {
        // Non-critical, continue without global data
      }
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.json({ coins, global: global?.data || null });
  } catch (err) {
    console.error('Market data error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
