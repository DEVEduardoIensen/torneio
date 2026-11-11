'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Categoria, Etapa, Pescador } from '@/types/domain';
import { MediaUploadFields } from './MediaUploadFields';

interface RegistroEnvioFormProps {
  currentUser: Pescador | null;
  activeCategories: Categoria[];
  etapaAtiva: Etapa | null;
  etapas: Etapa[];
  onSubmitted: () => void;
  onSelectedCategoriaChange: (categoria: Categoria) => void;
}

export function RegistroEnvioForm({
  currentUser,
  activeCategories,
  etapaAtiva,
  etapas,
  onSubmitted,
  onSelectedCategoriaChange,
}: RegistroEnvioFormProps) {
  const [categoriaId, setCategoriaId] = useState(activeCategories[0]?.id || '');
  const [etapaId, setEtapaId] = useState(etapaAtiva?.id || etapas[0]?.id || '');
  const [medidaDeclarada, setMedidaDeclarada] = useState('');
  const [iscaMarca, setIscaMarca] = useState('Mathias Iscas');
  const [iscaModelo, setIscaModelo] = useState('');
  const [localCaptura, setLocalCaptura] = useState('');
  const [palavraChaveInformada, setPalavraChaveInformada] = useState(
    etapaAtiva?.revelar_palavra_chave ? etapaAtiva.palavra_chave : ''
  );
  const [capturaCompletaSemCorte, setCapturaCompletaSemCorte] = useState(false);
  const [fotoIscaUrl, setFotoIscaUrl] = useState('');
  const [videoMedicaoUrl, setVideoMedicaoUrl] = useState('');
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const selectedCategoria =
    activeCategories.find((c) => c.id === categoriaId) || activeCategories[0];

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: 'foto' | 'video'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (kind === 'foto') setUploadingFoto(true);
    else setUploadingVideo(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        if (kind === 'foto') setFotoIscaUrl(data.url);
        else setVideoMedicaoUrl(data.url);
      }
    } finally {
      if (kind === 'foto') setUploadingFoto(false);
      else setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoria) return;
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etapa_id: etapaId || etapaAtiva?.id,
          categoria_id: selectedCategoria.id,
          pescador_id: currentUser?.id || 'pesc-1',
          especie_informada: selectedCategoria.especie,
          medida_declarada: Number(medidaDeclarada),
          isca_marca: iscaMarca,
          isca_modelo: iscaModelo,
          captura_completa_sem_corte: capturaCompletaSemCorte,
          local_captura: localCaptura,
          palavra_chave_informada: palavraChaveInformada,
          foto_isca_url: fotoIscaUrl,
          video_medicao_url: videoMedicaoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'err', text: data.error || 'Não foi possível enviar a captura.' });
        setSubmitting(false);
        return;
      }

      setFeedback({
        type: 'ok',
        text: 'Captura registrada no banco de dados e encaminhada para a Mesa de Arbitragem!',
      });
      setMedidaDeclarada('');
      setIscaModelo('');
      setLocalCaptura('');
      setCapturaCompletaSemCorte(false);
      onSubmitted();
    } catch {
      setFeedback({ type: 'err', text: 'Erro de comunicação com a API.' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';
  const unidade = selectedCategoria?.unidade_medida || 'cm';

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {etapaAtiva?.revelar_palavra_chave && (
        <p className="text-sm text-[#a1a8b9]">
          Palavra-chave da etapa{' '}
          <strong className="ml-1 text-base font-bold tracking-wide text-[#e5c158]">
            {etapaAtiva.palavra_chave}
          </strong>
        </p>
      )}

      {feedback && (
        <div
          role="alert"
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            feedback.type === 'ok'
              ? 'border-emerald-800 bg-emerald-950/90 text-emerald-200'
              : 'border-rose-800 bg-rose-950/90 text-rose-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div>
        <label htmlFor="especie-select" className={labelClass}>
          Categoria
        </label>
        <select
          id="especie-select"
          value={categoriaId}
          onChange={(e) => {
            setCategoriaId(e.target.value);
            const found = activeCategories.find((c) => c.id === e.target.value);
            if (found) onSelectedCategoriaChange(found);
          }}
          className={inputClass}
        >
          {activeCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} (mín. {c.medida_minima} {c.unidade_medida})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="etapa-select" className={labelClass}>
          Etapa
        </label>
        <select
          id="etapa-select"
          value={etapaId}
          onChange={(e) => setEtapaId(e.target.value)}
          className={inputClass}
        >
          {etapas.map((et) => (
            <option key={et.id} value={et.id}>
              {et.titulo}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="medida-input" className={labelClass}>
            Medida na régua ({unidade})
          </label>
          <input
            id="medida-input"
            type="number"
            inputMode="decimal"
            step="0.5"
            min={selectedCategoria?.medida_minima || 1}
            required
            value={medidaDeclarada}
            onChange={(e) => setMedidaDeclarada(e.target.value)}
            placeholder={`Ex: ${(selectedCategoria?.medida_minima || 45) + 8.5}`}
            className={`${inputClass} tabular-nums`}
          />
        </div>
        <div>
          <label htmlFor="keyword-input" className={labelClass}>
            Palavra-chave dita no vídeo
          </label>
          <input
            id="keyword-input"
            type="text"
            autoCapitalize="characters"
            required
            value={palavraChaveInformada}
            onChange={(e) => setPalavraChaveInformada(e.target.value.toUpperCase())}
            placeholder="ELDORADO-77"
            className={`${inputClass} font-bold tracking-wide text-[#e5c158]`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="isca-marca" className={labelClass}>
            Marca da isca
          </label>
          <input
            id="isca-marca"
            type="text"
            required
            value={iscaMarca}
            onChange={(e) => setIscaMarca(e.target.value)}
            placeholder="Mathias Iscas"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="isca-modelo" className={labelClass}>
            Modelo da isca
          </label>
          <input
            id="isca-modelo"
            type="text"
            required
            value={iscaModelo}
            onChange={(e) => setIscaModelo(e.target.value)}
            placeholder="Crank Eldorado 90"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="local-input" className={labelClass}>
          Local da pesca
        </label>
        <input
          id="local-input"
          type="text"
          required
          value={localCaptura}
          onChange={(e) => setLocalCaptura(e.target.value)}
          placeholder="Rio Uruguai — Poço Grande"
          className={inputClass}
        />
      </div>

      <MediaUploadFields
        maxVideoSeg={selectedCategoria?.tempo_max_video_seg || 60}
        fotoIscaUrl={fotoIscaUrl}
        videoMedicaoUrl={videoMedicaoUrl}
        uploadingFoto={uploadingFoto}
        uploadingVideo={uploadingVideo}
        onFileUpload={handleFileUpload}
      />

      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={capturaCompletaSemCorte}
          onChange={(e) => setCapturaCompletaSemCorte(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#e5c158]"
        />
        <span className="text-sm text-[#a1a8b9]">
          <strong className="block text-base font-semibold text-[#f3f4f6]">
            Captura completa sem corte
          </strong>
          Fisgada, medição e soltura no mesmo vídeo. Concorre ao prêmio especial.
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#e5c158] text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60"
      >
        <Upload className="h-5 w-5" aria-hidden />
        {submitting ? 'Enviando...' : 'Enviar captura'}
      </button>
    </form>
  );
}