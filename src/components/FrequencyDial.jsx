import { SEGMENTS } from '../lib/segments';

export default function FrequencyDial({ selectedSegment, onSelect, disabled }) {
  return (
    <div className="mb-4">
      {/* Frequency band */}
      <div
        className="rounded-lg p-3"
        style={{
          background: 'linear-gradient(180deg, #111 0%, #1a1a1a 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] text-neutral-600 uppercase tracking-wider">FM</span>
          <span className="text-[10px] text-neutral-600 uppercase tracking-wider">MHz</span>
        </div>

        <div className="flex gap-1 sm:gap-2">
          {SEGMENTS.map((seg) => {
            const isActive = selectedSegment === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => onSelect(seg.id)}
                disabled={disabled}
                className={`flex-1 rounded-md py-2 px-1 sm:px-2 text-center transition-all duration-200 border ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                } ${
                  isActive
                    ? 'border-amber-glow bg-amber-glow/10'
                    : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-500'
                }`}
              >
                <div
                  className={`text-sm sm:text-base font-bold ${
                    isActive ? 'text-amber-glow' : 'text-neutral-400'
                  }`}
                  style={isActive ? { textShadow: '0 0 8px rgba(245,158,11,0.5)' } : {}}
                >
                  {seg.frequency}
                </div>
                <div className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 leading-tight">
                  {seg.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
