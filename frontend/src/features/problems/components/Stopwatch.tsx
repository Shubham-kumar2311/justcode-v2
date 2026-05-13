import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10) as unknown as number;
    } else if (!isRunning) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-center" style={{ gap: '1rem', padding: '0.5rem 1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-primary)', minWidth: '100px', textAlign: 'center' }}>
        {formatTime(time)}
      </div>
      <div className="flex-center" style={{ gap: '0.5rem' }}>
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isRunning ? 'var(--warning)' : 'var(--success)' }}
          title={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <Square size={18} /> : <Play size={18} />}
        </button>
        <button 
          onClick={() => setTime(0)} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};
