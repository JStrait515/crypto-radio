import { useState } from 'react';

export default function TranscriptPanel({ transcript }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!transcript) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer uppercase tracking-wider"
      >
        {isOpen ? '▼ Hide Transcript' : '▶ Show Transcript'}
      </button>
      {isOpen && (
        <div
          className="mt-2 p-3 rounded-lg text-xs text-neutral-400 leading-relaxed"
          style={{
            background: '#111',
            border: '1px solid #2a2a2a',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {transcript}
        </div>
      )}
    </div>
  );
}
