'use client';

import React, { useState } from 'react';
import { KeyRound, Ruler, Upload } from 'lucide-react';
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
  const [fotoIscaUrl, setFotoIscaUrl] = useState('/brand/peixe-dourado-tight.png');
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

  return (
    <form
      onSubmit={handleSubmit}
      className="lg:col-span-2 bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 space-y-5 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
            Dados da Captura ({currentUser?.nome})
          </h2>
          <p className="text-xs text-[#a1a8b9]">
            Inscrição vinculada: {currentUser?.numero_inscricao || '#001'}
          </p>
        </div>
        {etapaAtiva && (
          <div className="text-right">
            <span className="text-xs text-[#a1a8b9] block">Palavra-Chave Vigente</span>
            <strong className="font-mono text-sm text-[#e5c158] tabular-nums font-bold">
              {etapaAtiva.revelar_palavra_chave ? etapaAtiva.palavra_chave : 'OCULTA'}
            </strong>
          </div>
        )}
      </div>

      {feedback && (
        <div
          role="alert"
          className={`rounded-xl px-4 py-3 text-sm font-medium border ${
            feedback.type === 'ok'
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/90 border-rose-800 text-rose-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cat-select" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
            Categoria pretendida
          </label>
          <select
            id="cat-select"
            value={categoriaId}
            onChange={(e) => {
              setCategoriaId(e.target.value);
              const found = activeCategories.find((c) => c.id === e.target.value);
              if (found) onSelectedCategoriaChange(found);
            }}
            className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/10 text-sm text-[#f3f4f6] focus:outline-none focus:border-[#e5c158]"
          >
            {activeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} (Mín. {c.medida_minima} {c.unidade_medida})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="etapa-select" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
            Etapa da temporada
          </label>
          <select
            id="etapa-select"
            value={etapaId}
            onChange={(e) => setEtapaId(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/10 text-sm text-[#f3f4f6] focus:outline-none focus:border-[#e5c158]"
          >
            {etapas.map((et) => (
              <option key={et.id} value={et.id}>
                {et.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="medida-input" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
            Medida na régua ({selectedCategoria?.unidade_medida || 'cm'}) — Mínimo:{' '}
            {selectedCategoria?.medida_minima || 30} {selectedCategoria?.unidade_medida || 'cm'}
          </label>
          <div className="relative">
            <Ruler className="w-4 h-4 text-[#a1a8b9] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="medida-input"
              type="number"
              step="0.5"
              min={selectedCategoria?.medida_minima || 1}
              required
              value={medidaDeclarada}
              onChange={(e) => setMedidaDeclarada(e.target.value)}
              placeholder={`Ex: ${(selectedCategoria?.medida_minima || 45) + 8.5}`}
              className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#060a13] border border-white/10 text-[#f3f4f6] text-sm tabular-nums focus:outline-none focus:border-[#e5c158]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="keyword-input" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
            Palavra-Chave citada no vídeo
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="keyword-input"
              type="text"
              required
              value={palavraChaveInformada}
              onChange={(e) => setPalavraChaveInformada(e.target.value.toUpperCase())}
              placeholder="Ex: ELDORADO-77"
              className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#060a13] border border-white/10 text-[#e5c158] font-mono text-sm tabular-nums focus:outline-none focus:border-[#e5c158] font-bold"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="isca-marca" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
            Marca da isca artificial
          </label>
          <input
            id="isca-marca"
            type="text"
            required
            value={iscaMarca}
            onChange={(e) => setIscaMarca(e.target.value)}
            placeholder="Ex: Mathias Iscas"
            className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/10 text-[#f3f4f6] text-sm focus:outline-none focus:border-[#e5c158]"
          />
        </div>

        <div>
          <label htmlFor="isca-modelo" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
            Modelo da isca
          </label>
          <input
            id="isca-modelo"
            type="text"
            required
            value={iscaModelo}
            onChange={(e) => setIscaModelo(e.target.value)}
            placeholder="Ex: Crank Eldorado 90"
            className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/10 text-[#f3f4f6] text-sm focus:outline-none focus:border-[#e5c158]"
          />
        </div>

        <div>
          <label htmlFor="local-input" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
            Local / Rio / Açude
          </label>
          <input
            id="local-input"
            type="text"
            required
            value={localCaptura}
            onChange={(e) => setLocalCaptura(e.target.value)}
            placeholder="Ex: Rio Uruguai — Poço Grande"
            className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/10 text-[#f3f4f6] text-sm focus:outline-none focus:border-[#e5c158]"
          />
        </div>
      </div>

      <MediaUploadFields
        maxVideoSeg={selectedCategoria?.tempo_max_video_seg || 60}
        fotoIscaUrl={fotoIscaUrl}
        videoMedicaoUrl={videoMedicaoUrl}
        uploadingFoto={uploadingFoto}
        uploadingVideo={uploadingVideo}
        onFileUpload={handleFileUpload}
      />

      <div className="pt-2 border-t border-white/10">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={capturaCompletaSemCorte}
            onChange={(e) => setCapturaCompletaSemCorte(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-[#060a13] text-[#e5c158] focus:ring-[#e5c158]"
          />
          <span className="text-sm text-[#f3f4f6]">
            <strong className="text-[#e5c158] block">
              Concorrer ao Prêmio Especial de Captura Completa sem Corte
            </strong>
            Marque se o vídeo registra sem nenhum corte desde a fisgada (ataque do peixe na isca),
            passando pela medição na régua até a soltura ativa na água.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-11 rounded-full bg-[#e5c158] hover:bg-[#cfab44] disabled:opacity-60 text-[#060a13] font-heading font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
      >
        <Upload className="w-4 h-4" />
        <span>
          {submitting ? 'Gravando no Banco SQLite...' : 'Enviar Captura para Arbitragem'}
        </span>
      </button>
    </form>
  );
}
