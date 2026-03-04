import { getSegment } from '../lib/segments';

export default function StationDisplay({ segmentId, status }) {
  const segment = getSegment(segmentId);

  const statusLine = {
    idle: 'Ready to broadcast',
    tuning: 'Scanning frequencies...',
    fetching: 'Downloading market data...',
    generating: 'DJ CryptoWave preparing script...',
    synthesizing: 'Converting to audio...',
    playing: 'LIVE BROADCAST',
    error: 'Signal lost - try again',
  }[status] || '';

  return (
    <div
      className="rounded-lg p-3 mb-4 font-mono"
      style={{
        background: 'linear-gradient(180deg, #0d1f0d 0%, #1a2e1a 100%)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
        border: '1px solid #2a3a2a',
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="lcd-text text-lcd-text text-lg font-bold">
            {segment.frequency} FM
          </div>
          <div className="text-lcd-text/70 text-xs mt-0.5">
            {segment.name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lcd-text/50 text-[10px]">
            {segment.description}
          </div>
          {status === 'playing' && (
            <div className="text-red-400 text-xs font-bold mt-1 animate-pulse">
              ● LIVE
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-lcd-text/60 text-[11px] border-t border-lcd-text/20 pt-2">
        {status === 'tuning' ? (
          <span className="tuning-static">{statusLine}</span>
        ) : (
          statusLine
        )}
      </div>
    </div>
  );
}
