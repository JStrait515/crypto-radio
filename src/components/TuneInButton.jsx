const STATUS_LABELS = {
  idle: 'TUNE IN',
  tuning: 'TUNING...',
  fetching: 'FETCHING DATA...',
  generating: 'DJ IS WRITING...',
  synthesizing: 'GOING TO AIR...',
  playing: 'ON AIR',
  error: 'RETRY',
};

export default function TuneInButton({ status, onClick }) {
  const isWorking = ['tuning', 'fetching', 'generating', 'synthesizing'].includes(status);
  const isOnAir = status === 'playing';
  const label = STATUS_LABELS[status] || 'TUNE IN';

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={onClick}
        disabled={isWorking}
        className={`
          relative px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase
          transition-all duration-300
          ${isWorking ? 'cursor-wait' : 'cursor-pointer'}
          ${isOnAir
            ? 'bg-red-600 text-white pulse-glow'
            : isWorking
              ? 'bg-neutral-700 text-amber-glow'
              : 'bg-neutral-800 text-amber-glow hover:bg-neutral-700 hover:scale-105'
          }
          border ${isOnAir ? 'border-red-400' : 'border-neutral-600'}
        `}
        style={
          !isOnAir && !isWorking
            ? { boxShadow: '0 0 10px rgba(245,158,11,0.2)' }
            : {}
        }
      >
        {isOnAir && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
        {isWorking && (
          <span className="inline-block w-3 h-3 border-2 border-amber-glow border-t-transparent rounded-full animate-spin mr-2 align-middle" />
        )}
        {label}
      </button>
    </div>
  );
}
