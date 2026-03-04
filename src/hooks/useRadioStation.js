import { useState, useCallback } from 'react';
import { useAudioPlayer } from './useAudioPlayer';

// States: idle | tuning | fetching | generating | synthesizing | playing | error
export function useRadioStation() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const { isPlaying, play, stop, getAnalyser } = useAudioPlayer();

  const tuneIn = useCallback(async (segmentId) => {
    try {
      setError(null);
      setTranscript('');

      // Step 1: Tuning animation
      setStatus('tuning');
      await new Promise((r) => setTimeout(r, 800));

      // Step 2: Fetch market data
      setStatus('fetching');
      const dataRes = await fetch(`/api/market-data?segment=${segmentId}`);
      if (!dataRes.ok) throw new Error('Failed to fetch market data');
      const marketData = await dataRes.json();

      // Step 3: Generate DJ script
      setStatus('generating');
      const scriptRes = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment: segmentId, marketData }),
      });
      if (!scriptRes.ok) throw new Error('Failed to generate script');
      const { script } = await scriptRes.json();
      setTranscript(script);

      // Step 4: Synthesize speech
      setStatus('synthesizing');
      const ttsRes = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: script }),
      });
      if (!ttsRes.ok) throw new Error('Failed to synthesize speech');
      const audioBlob = await ttsRes.blob();

      // Step 5: Play audio
      setStatus('playing');
      await play(audioBlob);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [play]);

  const stopBroadcast = useCallback(() => {
    stop();
    setStatus('idle');
  }, [stop]);

  return {
    status,
    error,
    transcript,
    isPlaying,
    tuneIn,
    stopBroadcast,
    getAnalyser,
  };
}
