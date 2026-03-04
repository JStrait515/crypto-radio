import { useRef, useEffect } from 'react';

export default function AudioVisualizer({ getAnalyser, isActive }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, w, h);

      const analyser = getAnalyser();

      if (analyser && isActive) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = Math.min(48, bufferLength);
        const barWidth = (w - barCount * 2) / barCount;
        const maxBarHeight = h - 8;

        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i] / 255;
          const barHeight = value * maxBarHeight;
          const x = i * (barWidth + 2) + 1;
          const y = h - barHeight - 4;

          // Color gradient: green -> amber -> red
          let color;
          if (value < 0.5) {
            color = '#00ff41';
          } else if (value < 0.8) {
            color = '#ffbf00';
          } else {
            color = '#ff3333';
          }

          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 4;
          ctx.fillRect(x, y, barWidth, barHeight);
          ctx.shadowBlur = 0;
        }
      } else {
        // Idle state - flat line with subtle glow
        ctx.strokeStyle = '#00ff4140';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [getAnalyser, isActive]);

  return (
    <div
      className="rounded-lg overflow-hidden mb-4"
      style={{
        border: '1px solid #333',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: '80px', display: 'block' }}
      />
    </div>
  );
}
