'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Fish,
  KeyRound,
  Ruler,
  Upload,
  Video,
  XCircle,
} from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function PainelRegistrosPage() {
  const {
    temporada,
    etapaAtiva,
    categorias,
    etapas,
    registros,
    currentUser,
    refresh,
  } = usePainel();

  const activeCategories = categorias.filter((c) => c.ativa);

  const [categoriaId, setCategoriaId] = useState('');
  const [etapaId, setEtapaId] = useState('');
  const [medidaDeclarada, setMedidaDeclarada] = useState('');
  const [iscaMarca, setIscaMarca] = useState('Mathias Iscas');
  const [iscaModelo, setIscaModelo] = useState('');
  const [localCaptura, setLocalCaptura] = useState('');
  const [palavraChaveInformada, setPalavraChaveInformada] = useState('');
  const [capturaCompletaSemCorte, setCapturaCompletaSemCorte] = useState(false);
  const [fotoIscaUrl, setFotoIscaUrl] = useState('/brand/peixe-dourado-tight.png');
  const [videoMedicaoUrl, setVideoMedicaoUrl] = useState('');
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (!categoriaId && activeCategories.length > 0) {
      setCategoriaId(activeCategories[0].id);
    }
  }, [activeCategories, categoriaId]);

  useEffect(() => {
    if (!etapaId && etapaAtiva) {
      setEtapaId(etapaAtiva.id);
      if (etapaAtiva.revelar_palavra_chave) {
        setPalavraChaveInformada(etapaAtiva.palavra_chave);
      }
    }
  }, [etapaAtiva, etapaId]);

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
      await refresh();
    } catch {
      setFeedback({ type: 'err', text: 'Erro de comunicação com a API.' });
    } finally {
      setSubmitting(false);
    }
  };

  const meusRegistros = registros.filter((r) => r.pescador_id === currentUser?.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Registro Oficial de Captura e Soltura
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Submeta a foto na régua e o vídeo sem cortes para validação pela comissão de arbitragem.
          {temporada?.permite_mesmo_peixe_multiplas_categorias
            ? ' O regulamento ativo permite registrar o mesmo exemplar em múltiplas categorias compatíveis.'
            : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Formulário Dinâmico de Envio */}
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
                onChange={(e) => setCategoriaId(e.target.value)}
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

          {/* Upload Real de Mídia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div>
              <label htmlFor="foto-upload" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
                Foto do peixe com a isca artificial (Disco Local)
              </label>
              <input
                id="foto-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'foto')}
                className="block w-full text-xs text-[#a1a8b9] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0d1626] file:text-[#f3f4f6] hover:file:bg-[#121c2e] file:border file:border-white/10"
              />
              <span className="text-xs text-[#a1a8b9] mt-1 block truncate">
                {uploadingFoto ? 'Enviando foto...' : `Arquivo ativo: ${fotoIscaUrl}`}
              </span>
            </div>

            <div>
              <label htmlFor="video-upload" className="block text-sm font-medium text-[#f3f4f6] mb-1.5">
                Vídeo de medição e soltura sem cortes (máx. {selectedCategoria?.tempo_max_video_seg || 60}s)
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, 'video')}
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

        {/* Checklist Dinâmico da Categoria Selecionada */}
        {selectedCategoria && (
          <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 space-y-4 shadow-xl">
            <div>
              <span className="text-xs font-semibold text-[#e5c158]">
                Regras Auditadas na Categoria
              </span>
              <h2 className="text-lg font-heading font-bold text-[#f3f4f6] mt-0.5">
                {selectedCategoria.nome}
              </h2>
              <p className="text-xs text-[#a1a8b9] mt-1">
                {selectedCategoria.descricao_especie}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-[#f3f4f6] tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#a1a8b9]">Medida mínima exigida:</span>
                <strong className="text-[#e5c158]">
                  {selectedCategoria.medida_minima} {selectedCategoria.unidade_medida}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a8b9]">Tempo máx. fora da água:</span>
                <strong>{selectedCategoria.tempo_max_fora_agua_seg} segundos</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a1a8b9]">Duração máx. do vídeo:</span>
                <strong>{selectedCategoria.tempo_max_video_seg} segundos</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <h3 className="text-xs font-semibold text-[#f3f4f6] mb-2.5">
                Checklist que o Juiz verificará no seu envio:
              </h3>
              <ul className="space-y-2 text-xs text-[#a1a8b9]">
                {selectedCategoria.checklist_validacao.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Histórico de Capturas do Pescador Atual */}
      <section className="space-y-4">
        <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
          Minhas Capturas Enviadas ({meusRegistros.length})
        </h2>

        <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                  <th scope="col" className="py-3.5 px-4">Categoria / Espécie</th>
                  <th scope="col" className="py-3.5 px-4">Medida Declarada</th>
                  <th scope="col" className="py-3.5 px-4">Medida Homologada</th>
                  <th scope="col" className="py-3.5 px-4">Isca e Local</th>
                  <th scope="col" className="py-3.5 px-4">Status e Parecer do Juiz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {meusRegistros.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-[#a1a8b9]">
                      Você ainda não enviou capturas com este perfil ({currentUser?.nome}).
                    </td>
                  </tr>
                ) : (
                  meusRegistros.map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-semibold text-[#f3f4f6]">{reg.categoria_nome}</div>
                        <div className="text-xs text-[#a1a8b9]">{reg.especie_informada}</div>
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-[#f3f4f6]">
                        {reg.medida_declarada.toFixed(1)} cm
                      </td>
                      <td className="py-3.5 px-4 tabular-nums font-heading font-bold text-[#e5c158]">
                        {reg.medida_aprovada !== null ? `${reg.medida_aprovada.toFixed(1)} cm` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#f3f4f6] font-medium">
                          {reg.isca_marca} — {reg.isca_modelo}
                        </div>
                        <div className="text-xs text-[#a1a8b9]">{reg.local_captura}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {reg.status === 'aprovado' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aprovado</span>
                            </span>
                          )}
                          {reg.status === 'pendente' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-[#e5c158] border border-amber-800/80">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pendente</span>
                            </span>
                          )}
                          {reg.status === 'reprovado' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/80">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reprovado</span>
                            </span>
                          )}
                        </div>
                        {(reg.parecer_juiz || reg.motivo_reprovacao) && (
                          <p className="text-xs text-[#a1a8b9] mt-1">
                            {reg.motivo_reprovacao || reg.parecer_juiz}
                          </p>
                        )}
                        {reg.video_medicao_url && (
                          <a
                            href={reg.video_medicao_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-[#e5c158] hover:underline"
                          >
                            <Video className="w-3.5 h-3.5 shrink-0" />
                            <span>Ver Vídeo da Captura</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
