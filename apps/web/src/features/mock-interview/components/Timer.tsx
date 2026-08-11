import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimerProps {
  startTime: string;
  durationMinutes: number;
  onExpire: () => void;
  isPaused?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ startTime, durationMinutes, onExpire, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startTime).getTime();
      const end = start + durationMinutes * 60 * 1000;
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        onExpire();
      }
    };

    // Initial calculation
    calculateTimeLeft();

    if (isPaused) return;

    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onExpire, isPaused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isWarning = timeLeft < 300; // Less than 5 minutes
  const isCritical = timeLeft < 60; // Less than 1 minute

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold border transition-colors ${
      isCritical 
        ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50 animate-pulse'
        : isWarning
          ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50'
          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    }`}>
      {isCritical ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
