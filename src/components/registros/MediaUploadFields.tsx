'use client';

import React from 'react';

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
      <div>
        <label htmlFor="foto-upload" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
          Foto do peixe com a isca artificial (Disco Local)
        </label>
        <input
          id="foto-upload"
          type="file"
          accept="image/*"
          onChange={(e) => onFileUpload(e, 'foto')}
          className="block w-full text-xs text-[#a1a8b9] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0d1626] file:text-[#f3f4f6] hover:file:bg-[#121c2e] file:border file:border-white/10"
        />
        <span className="text-xs text-[#a1a8b9] mt-1 block truncate">
          {uploadingFoto ? 'Enviando foto...' : `Arquivo ativo: ${fotoIscaUrl}`}
        </span>
      </div>

      <div>
        <label htmlFor="video-upload" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
          Vídeo de medição e soltura sem cortes (máx. {maxVideoSeg}s)
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={(e) => onFileUpload(e, 'video')}
          className="block w-full text-xs text-[#a1a8b9] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0d1626] file:text-[#f3f4f6] hover:file:bg-[#121c2e] file:border file:border-white/10"
        />
        <span className="text-xs text-[#a1a8b9] mt-1 block truncate">
          {uploadingVideo
            ? 'Enviando vídeo...'
            : videoMedicaoUrl
            ? `Vídeo anexado: ${videoMedicaoUrl}`
            : 'Opcional em teste ou selecione arquivo MP4/MOV'}
        </span>
      </div>
    </div>
  );
}

