'use client';

import React, { useRef, useState } from 'react';

interface VideoInspectionPlayerProps {
  videoUrl: string;
}

const SLOW_RATES = [0.25, 0.5, 0.75];
const FAST_RATES = [1.25, 1.5, 2, 3];

export function VideoInspectionPlayer({ videoUrl }: VideoInspectionPlayerProps) {
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const rateClass = (active: boolean) =>
    `h-11 min-w-12 shrink-0 cursor-pointer rounded-xl px-3 text-sm font-semibold tabular-nums transition-colors ${
      active
        ? 'bg-[#e5c158] text-[#060a13]'
        : 'text-[#a1a8b9] hover:text-[#f3f4f6]'
    }`;

  const rates = [...SLOW_RATES, 1, ...FAST_RATES];

  return (
    <div>
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = playbackRate;
        }}
        className="max-h-72 w-full rounded-xl bg-black"
      />
      <p className="mt-3 text-sm text-[#a1a8b9]">
        Velocidade:{' '}
        <span className="font-semibold tabular-nums text-[#e5c158]">
          {playbackRate}x {playbackRate < 1 ? '· câmera lenta' : playbackRate > 1 ? '· acelerado' : '· normal'}
        </span>
      </p>
      <div className="mt-1 flex flex-wrap gap-1" role="group" aria-label="Velocidade do vídeo">
        {rates.map((rate) => (
          <button
            key={rate}
            type="button"
            onClick={() => handleSpeedChange(rate)}
            aria-pressed={playbackRate === rate}
            className={rateClass(playbackRate === rate)}
          >
            {rate}x
          </button>
        ))}
      </div>
    </div>
  );
}
