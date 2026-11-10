'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePainel } from '@/components/PainelContext';

export default function AdminRegistrosPage() {
  const { categorias, etapas, registros, currentUser, refresh } = usePainel();
  const [statusFilter, setStatusFilter] = useState<'pendente' | 'aprovado' | 'reprovado' | 'todos'>('pendente');
  const [selectedId, setSelectedId] = useState<string>('');
  const [medidaEdit, setMedidaEdit] = useState<string>('');
  const [parecerEdit, setParecerEdit] = useState<string>('');
  const [motivoReprovacao, setMotivoReprovacao] = useState<string>('');
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const filtered = registros.filter((r) =>
    statusFilter === 'todos' ? true : r.status === statusFilter
  );

  const selectedReg =
    filtered.find((r) => r.id === selectedId) ||
    registros.find((r) => r.id === selectedId) ||
    filtered[0] ||
    null;

  const selectedCategoria = categorias.find((c) => c.id === selectedReg?.categoria_id);
  const selectedEtapa = etapas.find((e) => e.id === selectedReg?.etapa_id);

  useEffect(() => {
    if (selectedReg) {
      setSelectedId(selectedReg.id);
      setMedidaEdit(String(selectedReg.medida_aprovada ?? selectedReg.medida_declarada));
      setParecerEdit(selectedReg.parecer_juiz || '');
      setMotivoReprovacao(selectedReg.motivo_reprovacao || '');
      setChecklistState(selectedReg.checklist_juiz || {});
    }
  }, [selectedReg?.id]);

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleCheckItem = (idx: number) => {
    const key = String(idx);
    setChecklistState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEvaluate = async (decision: 'aprovado' | 'reprovado') => {
    if (!selectedReg) return;
    setSaving(true);
    try {
      await fetch('/api/registros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedReg.id,
          status: decision,
          medida_aprovada: decision === 'aprovado' ? Number(medidaEdit) : null,
          checklist_juiz: checklistState,
          parecer_juiz:
            parecerEdit ||
            (decision === 'aprovado'
              ? 'Medição e soltura conferidas pela mesa de arbitragem.'
              : ''),
          motivo_reprovacao: decision === 'reprovado' ? motivoReprovacao : '',
          avaliado_por_id: currentUser?.id || 'pesc-2',
          avaliado_por_nome: currentUser?.nome || 'Comissão de Arbitragem',
        }),
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/registros?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
            Mesa de Arbitragem e Homologação de Capturas
          </h1>
          <p className="text-sm text-[#a1a8b9] mt-1">
            Inspeção de vídeo em câmera lenta, conferência da régua oficial e aplicação do checklist dinâmico da categoria.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['pendente', 'aprovado', 'reprovado', 'todos'] as const).map((st) => {
            const count =
              st === 'todos'
                ? registros.length
                : registros.filter((r) => r.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-semibold capitalize transition-colors cursor-pointer tabular-nums ${
                  statusFilter === st
                    ? 'bg-[#e5c158] text-[#060a13]'
                    : 'bg-[#080c14] text-[#f3f4f6] hover:border-[#e5c158]/50 border border-white/10'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Fila Lateral de Submissões */}
        <div className="el-card overflow-hidden">
          <div className="px-4 py-3.5 border-b border-white/10 bg-[#060a13] text-xs font-heading font-semibold text-[#e5c158]">
            Fila de Capturas ({filtered.length})
          </div>
          <div className="divide-y divide-white/10 max-h-[620px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#a1a8b9]">
                Nenhum registro encontrado neste filtro.
              </div>
            ) : (
              filtered.map((reg) => {
                const active = selectedReg?.id === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedId(reg.id)}
                    className={`w-full p-4 text-left transition-colors cursor-pointer ${
                      active ? 'bg-[#0c111c] border-l-2 border-[#e5c158]' : 'hover:bg-[#0c111c]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-heading font-bold text-[#f3f4f6]">{reg.pescador_nome}</span>
                      <span className="font-heading font-bold text-[#e5c158] tabular-nums">
                        {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)} cm
                      </span>
                    </div>
                    <div className="text-xs text-[#a1a8b9] mt-1">{reg.categoria_nome}</div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-[#a1a8b9]">{reg.isca_marca}</span>
                      <span
                        className={`font-semibold capitalize ${
                          reg.status === 'aprovado'
                            ? 'text-emerald-300'
                            : reg.status === 'reprovado'
                            ? 'text-red-300'
                            : 'text-[#e5c158]'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Console Principal de Auditoria */}
        <div className="lg:col-span-2 el-card-gold p-6 space-y-6">
          {!selectedReg ? (
            <div className="py-12 text-center text-sm text-[#a1a8b9]">
              Selecione uma captura na fila ao lado para iniciar a auditoria técnica.
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-heading font-bold text-[#f3f4f6]">
                    {selectedReg.pescador_nome}: {selectedReg.categoria_nome}
                  </h2>
                  <p className="text-xs text-[#a1a8b9] mt-1">
                    Inscrição {selectedReg.numero_inscricao || 'S/N'} • Local: {selectedReg.local_captura} • Isca:{' '}
                    {selectedReg.isca_marca} {selectedReg.isca_modelo}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedReg.id)}
                  className="px-4 py-2 rounded-full bg-red-950 hover:bg-red-900 border border-red-800 text-xs font-semibold text-red-200 transition-colors cursor-pointer self-start"
                >
                  Excluir Registro
                </button>
              </div>

              {/* Comparador de Palavra-Chave e Mídia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="text-xs font-heading font-semibold text-[#f3f4f6] flex items-center justify-between">
                    <span>Inspeção Visual (Foto na Régua / Isca)</span>
                    {selectedReg.captura_completa_sem_corte && (
                      <span className="text-[#e5c158] font-bold">
                        Candidato Captura Completa s/ Corte
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center p-3 bg-black/40 rounded-xl min-h-[200px]">
                    <img
                      src={selectedReg.foto_isca_url || '/brand/peixe-dourado-tight.png'}
                      alt={selectedReg.especie_informada}
                      className="max-h-52 w-auto object-contain rounded"
                    />
                  </div>

                  {selectedReg.video_medicao_url ? (
                    <div className="space-y-3">
                      <video
                        ref={videoRef}
                        src={selectedReg.video_medicao_url}
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
                  ) : (
                    <div className="flex items-center justify-between text-xs text-[#a1a8b9] pt-2 border-t border-white/5">
                      <span>Sem vídeo anexado a esta captura</span>
                    </div>
                  )}
                </div>

                {/* Checklist Dinâmico da Categoria */}
                <div className="space-y-4">
                  <div className="py-3 border-y border-white/10 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#a1a8b9]">Palavra-chave da etapa:</span>
                      <strong className="font-heading text-[#e5c158]">
                        {selectedEtapa?.palavra_chave || 'ELDORADO-OUTONO-26'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#a1a8b9]">Informada pelo pescador:</span>
                      <strong className="font-heading text-emerald-300">
                        {selectedReg.palavra_chave_informada}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#a1a8b9]">Medida mínima da categoria:</span>
                      <strong className="tabular-nums text-[#f3f4f6]">
                        {selectedCategoria?.medida_minima || 30} cm
                      </strong>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-heading font-semibold text-[#e5c158] mb-2">
                      Checklist Oficial da Categoria ({selectedCategoria?.nome}):
                    </h3>
                    <div className="space-y-2">
                      {(selectedCategoria?.checklist_validacao || []).map((item, idx) => {
                        const checked = Boolean(checklistState[String(idx)]);
                        return (
                          <label
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-[#f3f4f6] cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCheckItem(idx)}
                              className="mt-0.5 h-4 w-4 rounded border-white/25 bg-[#060a13] text-[#e5c158]"
                            />
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ajuste de Medida e Decisão Final */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="medida-aprovada"
                      className="block text-xs font-semibold text-[#f3f4f6] mb-1.5"
                    >
                      Medida Oficial Validada na Régua (declarada:{' '}
                      {selectedReg.medida_declarada.toFixed(1)} cm)
                    </label>
                    <input
                      id="medida-aprovada"
                      type="number"
                      step="0.5"
                      value={medidaEdit}
                      onChange={(e) => setMedidaEdit(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-[#e5c158] font-heading font-bold text-sm tabular-nums"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="parecer-input"
                      className="block text-xs font-semibold text-[#f3f4f6] mb-1.5"
                    >
                      Parecer Técnico / Observação do Juiz
                    </label>
                    <input
                      id="parecer-input"
                      type="text"
                      value={parecerEdit}
                      onChange={(e) => setParecerEdit(e.target.value)}
                      placeholder="Ex: Boca encostada no marco zero, soltura validada."
                      className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-[#f3f4f6] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reprovacao-input"
                    className="block text-xs font-semibold text-[#a1a8b9] mb-1.5"
                  >
                    Motivo de Reprovação (preencher apenas em caso de indeferimento)
                  </label>
                  <input
                    id="reprovacao-input"
                    type="text"
                    value={motivoReprovacao}
                    onChange={(e) => setMotivoReprovacao(e.target.value)}
                    placeholder="Ex: Vídeo com corte na edição ou ausência da palavra-chave."
                    className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-[#f3f4f6] text-sm"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleEvaluate('aprovado')}
                    className="el-btn-gold h-11 px-6 text-sm"
                  >
                    Homologar Captura ({medidaEdit} cm)
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleEvaluate('reprovado')}
                    className="h-11 px-6 rounded-full bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 font-heading font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Reprovar Captura
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
