"use client";

import React, { useState, useEffect } from "react";

interface CountdownProps {
  deadline: string;
  onExpired?: () => void;
}

interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ deadline, onExpired }: CountdownProps) {
  const [countdown, setCountdown] = useState<CountdownValue>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpired?.();
        return;
      }

      setIsExpired(false);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpired]);

  return (
    <>
      {isExpired ? (
        <div className="text-lg font-bold text-red-600 dark:text-red-400">Expired</div>
      ) : (
        <div className="flex gap-2 text-center">
          <div className="flex-1">
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdown.days}</div>
            <div className="text-xs text-amber-700 dark:text-amber-300">Days</div>
          </div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">:</div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdown.hours}</div>
            <div className="text-xs text-amber-700 dark:text-amber-300">Hours</div>
          </div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">:</div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdown.minutes}</div>
            <div className="text-xs text-amber-700 dark:text-amber-300">Min</div>
          </div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">:</div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{countdown.seconds}</div>
            <div className="text-xs text-amber-700 dark:text-amber-300">Sec</div>
          </div>
        </div>
      )}
    </>
  );
}
