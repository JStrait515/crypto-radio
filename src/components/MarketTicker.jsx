import { formatPrice, formatPercent } from '../lib/formatters';

export default function MarketTicker({ data }) {
  if (!data || !data.coins || data.coins.length === 0) {
    return (
      <div
        className="rounded-lg overflow-hidden mb-4"
        style={{
          background: '#111',
          border: '1px solid #333',
          height: '28px',
        }}
      >
        <div className="text-neutral-600 text-xs text-center leading-7">
          Waiting for market data...
        </div>
      </div>
    );
  }

  const items = data.coins.map((coin) => {
    const change = coin.price_change_percentage_24h;
    const color = change >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <span key={coin.symbol} className="inline-flex items-center gap-1 mx-4 whitespace-nowrap">
        <span className="text-neutral-400 font-bold">{coin.symbol.toUpperCase()}</span>
        <span className="text-neutral-300">{formatPrice(coin.current_price)}</span>
        <span className={color}>{formatPercent(change)}</span>
      </span>
    );
  });

  return (
    <div
      className="rounded-lg overflow-hidden mb-4"
      style={{
        background: '#111',
        border: '1px solid #333',
        height: '28px',
      }}
    >
      <div className="ticker-scroll inline-flex items-center h-7 text-xs">
        {items}
        {items}
      </div>
    </div>
  );
}
