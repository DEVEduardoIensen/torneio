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

interface UploadRowProps {
  id: string;
  label: string;
  hint: string;
  accept: string;
  done: boolean;
  uploading: boolean;
  Icon: typeof Camera;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadRow({ id, label, hint, accept, done, uploading, Icon, onChange }: UploadRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const status = uploading ? 'Enviando...' : done ? 'Anexado · toque para trocar' : hint;

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onChange}
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-xl border px-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c158] ${
          done
            ? 'border-emerald-500/40 hover:border-emerald-500/70'
            : 'border-white/20 hover:border-[#e5c158]'
        }`}
      >
        <span className={done ? 'text-emerald-400' : 'text-[#e5c158]'}>
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
          ) : done ? (
            <Check className="h-6 w-6" aria-hidden />
          ) : (
            <Icon className="h-6 w-6" aria-hidden />
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-base font-semibold text-[#f3f4f6]">{label}</span>
          <span className={`block text-sm ${done ? 'text-emerald-400' : 'text-[#a1a8b9]'}`}>
            {status}
          </span>
        </span>
      </button>
    </div>
  );
}

export function MediaUploadFields({
  maxVideoSeg,
  fotoIscaUrl,
  videoMedicaoUrl,
  uploadingFoto,
  uploadingVideo,
  onFileUpload,
}: MediaUploadFieldsProps) {
  return (
    <div className="space-y-3">
      <UploadRow
        id="foto-upload"
        label="Foto do peixe com a isca"
        hint="Tirar foto ou escolher arquivo"
        accept="image/*"
        done={Boolean(fotoIscaUrl)}
        uploading={uploadingFoto}
        Icon={Camera}
        onChange={(e) => onFileUpload(e, 'foto')}
      />
      <UploadRow
        id="video-upload"
        label={`Vídeo na régua e soltura (até ${maxVideoSeg}s)`}
        hint="Sem cortes · MP4 ou MOV"
        accept="video/*"
        done={Boolean(videoMedicaoUrl)}
        uploading={uploadingVideo}
        Icon={Video}
        onChange={(e) => onFileUpload(e, 'video')}
      />
    </div>
  );
}
