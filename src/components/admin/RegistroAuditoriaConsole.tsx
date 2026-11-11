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

  const inputClass =
    'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-[#f3f4f6]">
            {selectedReg.pescador_nome}: {selectedReg.categoria_nome}
          </h2>
          <p className="mt-1 text-sm text-[#a1a8b9]">
            {selectedReg.local_captura} · {selectedReg.isca_marca} {selectedReg.isca_modelo}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(selectedReg.id)}
          className="h-11 shrink-0 cursor-pointer rounded-xl px-3 text-sm font-semibold text-rose-400 transition-colors hover:text-rose-300"
        >
          Excluir
        </button>
      </div>

      {/* Mídia da captura */}
      <section aria-label="Mídia da captura">
        {selectedReg.captura_completa_sem_corte && (
          <p className="mb-3 text-sm font-semibold text-[#e5c158]">
            Candidata a captura completa sem corte
          </p>
        )}
        <div className="flex min-h-[200px] items-center justify-center rounded-xl bg-black/40 p-3">
          <img
            src={selectedReg.foto_isca_url || '/brand/peixe-dourado-tight.png'}
            alt={selectedReg.especie_informada}
            className="max-h-52 w-auto rounded object-contain"
          />
        </div>
        <div className="mt-4">
          {selectedReg.video_medicao_url ? (
            <VideoInspectionPlayer videoUrl={selectedReg.video_medicao_url} />
          ) : (
            <p className="text-sm text-[#a1a8b9]">Sem vídeo anexado a esta captura.</p>
          )}
        </div>
      </section>

      {/* Conferência e checklist da categoria */}
      <section aria-label="Conferência">
        <dl className="divide-y divide-white/10 border-y border-white/10 text-sm">
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-[#a1a8b9]">Palavra-chave da etapa</dt>
            <dd className="font-semibold text-[#e5c158]">
              {selectedEtapa?.palavra_chave || 'ELDORADO-OUTONO-26'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-[#a1a8b9]">Informada pelo pescador</dt>
            <dd className="font-semibold text-emerald-400">{selectedReg.palavra_chave_informada}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-[#a1a8b9]">Medida mínima</dt>
            <dd className="font-semibold tabular-nums text-[#f3f4f6]">
              {selectedCategoria?.medida_minima || 30} cm
            </dd>
          </div>
        </dl>

        <h3 className="mt-6 text-base font-semibold text-[#f3f4f6]">
          Checklist{selectedCategoria?.nome ? ` · ${selectedCategoria.nome}` : ''}
        </h3>
        <div className="mt-1">
          {(selectedCategoria?.checklist_validacao || []).map((item, idx) => {
            const checked = Boolean(checklistState[String(idx)]);
            return (
              <label
                key={idx}
                className="flex min-h-11 cursor-pointer select-none items-start gap-3 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheckItem(idx)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#e5c158]"
                />
                <span className="text-base text-[#f3f4f6]">{item}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Ajuste de medida e decisão final */}
      <section aria-label="Decisão" className="border-t border-white/10 pt-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="medida-aprovada" className={labelClass}>
              Medida validada na régua (cm){' '}
              <span className="font-normal text-[#a1a8b9]">
                declarada: {selectedReg.medida_declarada.toFixed(1)}
              </span>
            </label>
            <input
              id="medida-aprovada"
              type="number"
              inputMode="decimal"
              step="0.5"
              value={medidaEdit}
              onChange={(e) => setMedidaEdit(e.target.value)}
              className={`${inputClass} font-bold tabular-nums text-[#e5c158]`}
            />
          </div>

          <div>
            <label htmlFor="parecer-input" className={labelClass}>
              Parecer do juiz
            </label>
            <input
              id="parecer-input"
              type="text"
              value={parecerEdit}
              onChange={(e) => setParecerEdit(e.target.value)}
              placeholder="Ex: Boca encostada no marco zero, soltura validada."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="reprovacao-input" className={labelClass}>
              Motivo da reprovação{' '}
              <span className="font-normal text-[#a1a8b9]">só se reprovar</span>
            </label>
            <input
              id="reprovacao-input"
              type="text"
              value={motivoReprovacao}
              onChange={(e) => setMotivoReprovacao(e.target.value)}
              placeholder="Ex: Vídeo com corte na edição ou sem a palavra-chave."
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleEvaluate('aprovado')}
              className="h-12 w-full cursor-pointer rounded-xl bg-[#e5c158] px-6 text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60 sm:w-auto"
            >
              Homologar ({medidaEdit} cm)
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleEvaluate('reprovado')}
              className="h-12 w-full cursor-pointer rounded-xl px-6 text-base font-semibold text-rose-400 transition-colors hover:text-rose-300 disabled:opacity-60 sm:w-auto"
            >
              Reprovar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
