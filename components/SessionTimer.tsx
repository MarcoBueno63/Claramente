"use client";
import React, { useEffect, useState } from "react";

export default function SessionTimer({ max = 30, onExpire }: { max?: number; onExpire: () => void; }) {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSec(prev => {
        if (prev === 59) {
          setMin(prevMin => {
            const newMin = prevMin + 1;
            if (newMin >= max) {
              onExpire();
              return max;
            }
            return newMin;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [max, onExpire]);

  return (
    <div className="text-sm text-gray-600">
      {min}:{sec.toString().padStart(2, '0')} / {max}:00
    </div>
  );
}