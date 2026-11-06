"use client";

import { useEffect, useState } from "react";

export function AnimatedCounter({ 
  value, 
  duration = 1600,
  delay = 150
}: { 
  value: number; 
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const timeoutId = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easeOutCubic curve for comfortable, readable counting pace
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easeOut * value);

        setCount(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration, delay]);

  return <span className="tabular-nums">{count}</span>;
}

