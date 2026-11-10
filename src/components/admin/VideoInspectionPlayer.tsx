'use client';

import React, { useRef, useState } from 'react';

interface VideoInspectionPlayerProps {
  videoUrl: string;
}

export function VideoInspectionPlayer({ videoUrl }: VideoInspectionPlayerProps) {
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="space-y-3">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = playbackRate;
        }}
        className="w-full rounded-xl bg-black max-h-72 border border-white/10 shadow-lg"
      />
      <div className="bg-[#060a13] border border-white/10 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a1a8b9] font-medium">
            Controle de Velocidade (Áudio & Vídeo):
          </span>
          <span className="font-mono text-[#e5c158] font-bold">
            {playbackRate}x {playbackRate < 1 ? '• Câmera Lenta' : playbackRate > 1 ? '• Acelerado' : '• Normal'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#a1a8b9] font-semibold mr-1">Lenta:</span>
          {[0.25, 0.5, 0.75].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleSpeedChange(rate)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold tabular-nums cursor-pointer transition-colors ${
                playbackRate === rate
                  ? 'bg-[#e5c158] text-[#060a13] font-bold shadow-sm'
                  : 'bg-[#080c14] text-[#a1a8b9] hover:text-[#f3f4f6] hover:bg-white/5 border border-white/10'
              }`}
            >
              {rate}x
            </button>
          ))}
          <span className="text-xs text-white/20 mx-1">|</span>
          <button
            type="button"
            onClick={() => handleSpeedChange(1)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold tabular-nums cursor-pointer transition-colors ${
              playbackRate === 1
                ? 'bg-[#e5c158] text-[#060a13] font-bold shadow-sm'
                : 'bg-[#080c14] text-[#a1a8b9] hover:text-[#f3f4f6] hover:bg-white/5 border border-white/10'
            }`}
          >
            1x Normal
          </button>
          <span className="text-xs text-white/20 mx-1">|</span>
          <span className="text-[11px] text-[#a1a8b9] font-semibold mr-1">Acelerar:</span>
          {[1.25, 1.5, 2, 3].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleSpeedChange(rate)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold tabular-nums cursor-pointer transition-colors ${
                playbackRate === rate
                  ? 'bg-[#e5c158] text-[#060a13] font-bold shadow-sm'
                  : 'bg-[#080c14] text-[#a1a8b9] hover:text-[#f3f4f6] hover:bg-white/5 border border-white/10'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

