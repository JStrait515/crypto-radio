import { useState } from 'react';
import { useRadioStation } from './hooks/useRadioStation';
import { useMarketData } from './hooks/useMarketData';
import RadioChassis from './components/RadioChassis';
import FrequencyDial from './components/FrequencyDial';
import TuneInButton from './components/TuneInButton';
import StationDisplay from './components/StationDisplay';
import AudioVisualizer from './components/AudioVisualizer';
import MarketTicker from './components/MarketTicker';
import TranscriptPanel from './components/TranscriptPanel';

function App() {
  const [selectedSegment, setSelectedSegment] = useState('overview');
  const { status, error, transcript, isPlaying, tuneIn, stopBroadcast, getAnalyser } =
    useRadioStation();
  const { data: marketData } = useMarketData();

  const isWorking = ['tuning', 'fetching', 'generating', 'synthesizing'].includes(status);

  const handleTuneIn = () => {
    if (status === 'playing') {
      stopBroadcast();
    } else {
      tuneIn(selectedSegment);
    }
  };

  return (
    <RadioChassis>
      <StationDisplay segmentId={selectedSegment} status={status} />
      <AudioVisualizer getAnalyser={getAnalyser} isActive={isPlaying} />
      <FrequencyDial
        selectedSegment={selectedSegment}
        onSelect={setSelectedSegment}
        disabled={isWorking || isPlaying}
      />
      <MarketTicker data={marketData} />
      <TuneInButton status={status} onClick={handleTuneIn} />

      {error && (
        <div className="text-center text-red-400 text-xs mt-2 p-2 bg-red-400/10 rounded">
          {error}
        </div>
      )}

      <TranscriptPanel transcript={transcript} />

      <div className="text-center mt-4 text-neutral-600 text-[10px]">
        Powered by Claude AI + ElevenLabs | Market data from CoinGecko
      </div>
    </RadioChassis>
  );
}

export default App;
