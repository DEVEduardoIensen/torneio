'use client';

import React, { useState } from 'react';
import { Categoria, Etapa, RegistroCaptura } from '@/types/domain';
import { VideoInspectionPlayer } from './VideoInspectionPlayer';

interface RegistroAuditoriaConsoleProps {
  selectedReg: RegistroCaptura;
  selectedCategoria?: Categoria;
  selectedEtapa?: Etapa;
  currentUserId?: string;
  currentUserName?: string;
  onRefresh: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RegistroAuditoriaConsole({
  selectedReg,
  selectedCategoria,
  selectedEtapa,
  currentUserId,
  currentUserName,
  onRefresh,
  onDelete,
}: RegistroAuditoriaConsoleProps) {
  const [medidaEdit, setMedidaEdit] = useState<string>(
    String(selectedReg.medida_aprovada ?? selectedReg.medida_declarada)
  );
  const [parecerEdit, setParecerEdit] = useState<string>(selectedReg.parecer_juiz || '');
  const [motivoReprovacao, setMotivoReprovacao] = useState<string>(
    selectedReg.motivo_reprovacao || ''
  );
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    selectedReg.checklist_juiz || {}
  );
  const [saving, setSaving] = useState(false);

  const toggleCheckItem = (idx: number) => {
    const key = String(idx);
    setChecklistState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEvaluate = async (decision: 'aprovado' | 'reprovado') => {
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
          avaliado_por_id: currentUserId || 'pesc-2',
          avaliado_por_nome: currentUserName || 'Comissão de Arbitragem',
        }),
      });
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
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
          onClick={() => onDelete(selectedReg.id)}
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
            <VideoInspectionPlayer videoUrl={selectedReg.video_medicao_url} />
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
    </div>
  );
}
