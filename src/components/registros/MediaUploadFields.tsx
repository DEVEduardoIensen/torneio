'use client';

import React, { useRef } from 'react';
import { Camera, Check, Loader2, Video } from 'lucide-react';

interface MediaUploadFieldsProps {
  maxVideoSeg: number;
  fotoIscaUrl: string;
  videoMedicaoUrl: string;
  uploadingFoto: boolean;
  uploadingVideo: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, kind: 'foto' | 'video') => void;
}

export function MediaUploadFields({
  maxVideoSeg,
  fotoIscaUrl,
  videoMedicaoUrl,
  uploadingFoto,
  uploadingVideo,
  onFileUpload,
}: MediaUploadFieldsProps) {
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const hasFoto = Boolean(fotoIscaUrl);
  const hasVideo = Boolean(videoMedicaoUrl);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
      {/* Upload da Foto */}
      <div className="flex flex-col">
        <label
          htmlFor="foto-upload"
          className="block text-sm font-medium text-[#f3f4f6] mb-2"
        >
          Foto do Peixe com a Isca
        </label>
        <input
          ref={fotoInputRef}
          id="foto-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onFileUpload(e, 'foto')}
          aria-label="Selecionar foto do peixe com a isca artificial"
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => fotoInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fotoInputRef.current?.click();
            }
          }}
          className={`relative flex flex-col items-center justify-center p-5 rounded-xl border text-center transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#e5c158] ${
            uploadingFoto
              ? 'bg-[#080c14] border-white/20 opacity-75'
              : hasFoto
              ? 'bg-[#06120d] border-emerald-500/30 hover:border-emerald-500/50'
              : 'bg-[#080c14] border-white/10 hover:border-[#e5c158]/50 hover:bg-[#0c121e]'
          }`}
        >
          {uploadingFoto ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-[#e5c158] animate-spin" />
              <span className="text-xs font-medium text-[#f3f4f6]">Enviando foto...</span>
            </div>
          ) : hasFoto ? (
            <div className="flex flex-col items-center gap-2 py-1">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-400 block">
                  Foto anexada com sucesso
                </span>
                <span className="text-[11px] text-[#a1a8b9] mt-0.5 block hover:underline">
                  Clique para trocar a foto
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#e5c158]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#f3f4f6] block">
                  Selecionar Foto da Isca
                </span>
                <span className="text-[11px] text-[#a1a8b9] mt-0.5 block">
                  Toque para tirar foto ou escolher arquivo
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload do Vídeo */}
      <div className="flex flex-col">
        <label
          htmlFor="video-upload"
          className="block text-sm font-medium text-[#f3f4f6] mb-2"
        >
          Vídeo da Régua e Soltura (máx. {maxVideoSeg}s)
        </label>
        <input
          ref={videoInputRef}
          id="video-upload"
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) => onFileUpload(e, 'video')}
          aria-label="Selecionar vídeo de medição e soltura sem cortes"
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => videoInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              videoInputRef.current?.click();
            }
          }}
          className={`relative flex flex-col items-center justify-center p-5 rounded-xl border text-center transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#e5c158] ${
            uploadingVideo
              ? 'bg-[#080c14] border-white/20 opacity-75'
              : hasVideo
              ? 'bg-[#06120d] border-emerald-500/30 hover:border-emerald-500/50'
              : 'bg-[#080c14] border-white/10 hover:border-[#e5c158]/50 hover:bg-[#0c121e]'
          }`}
        >
          {uploadingVideo ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-[#e5c158] animate-spin" />
              <span className="text-xs font-medium text-[#f3f4f6]">Enviando vídeo...</span>
            </div>
          ) : hasVideo ? (
            <div className="flex flex-col items-center gap-2 py-1">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-400 block">
                  Vídeo anexado com sucesso
                </span>
                <span className="text-[11px] text-[#a1a8b9] mt-0.5 block hover:underline">
                  Clique para trocar o vídeo
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#e5c158]">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#f3f4f6] block">
                  Selecionar Vídeo da Régua
                </span>
                <span className="text-[11px] text-[#a1a8b9] mt-0.5 block">
                  Vídeo contínuo sem cortes (MP4 ou MOV)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
