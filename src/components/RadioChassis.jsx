export default function RadioChassis({ children }) {
  return (
    <div className="relative">
      {/* Outer shell - wood grain */}
      <div
        className="rounded-2xl p-1"
        style={{
          background: 'linear-gradient(145deg, #5c3d2e 0%, #3d2b1f 40%, #2a1a10 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Inner metal panel */}
        <div
          className="rounded-xl p-4 sm:p-6"
          style={{
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #222 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {/* Brand header */}
          <div className="text-center mb-4">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-widest"
              style={{
                color: '#f59e0b',
                textShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
              }}
            >
              CRYPTO FM
            </h1>
            <div className="text-xs tracking-[0.3em] text-neutral-500 mt-1">
              AI-POWERED MARKET RADIO
            </div>
          </div>

          {children}

          {/* Bottom screws */}
          <div className="flex justify-between mt-4 px-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #666, #333)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
