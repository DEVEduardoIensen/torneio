'use client';

import React, { useState, useEffect } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Etapa } from '@/types/domain';

export default function AdminEtapasPage() {
  const { temporada, etapas, refresh } = usePainel();

  const [editingId, setEditingId] = useState<string>('nova');
  const [numero, setNumero] = useState(1);
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [localPesca, setLocalPesca] = useState('');
  const [cidadeUf, setCidadeUf] = useState('');
  const [dataInicio, setDataInicio] = useState('2026-03-01');
  const [dataFim, setDataFim] = useState('2026-06-30');
  const [palavraChave, setPalavraChave] = useState('ELDORADO-OUTONO-26');
  const [revelar, setRevelar] = useState(true);
  const [status, setStatus] = useState<Etapa['status']>('em_andamento');
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);

  const selectEtapa = (et: Etapa | null) => {
    if (!et) {
      setEditingId('nova');
      setNumero(etapas.length + 1);
      setTitulo('');
      setSubtitulo('');
      setLocalPesca('');
      setCidadeUf('PR');
      setDataInicio('2026-08-01');
      setDataFim('2026-11-30');
      setPalavraChave('ELDORADO-PRIMAVERA-26');
      setRevelar(true);
      setStatus('em_andamento');
      setObservacoes('');
      return;
    }
    setEditingId(et.id);
    setNumero(et.numero);
    setTitulo(et.titulo);
    setSubtitulo(et.subtitulo);
    setLocalPesca(et.local_pesca);
    setCidadeUf(et.cidade_uf);
    setDataInicio(et.data_inicio);
    setDataFim(et.data_fim);
    setPalavraChave(et.palavra_chave);
    setRevelar(et.revelar_palavra_chave);
    setStatus(et.status);
    setObservacoes(et.observacoes);
  };

  useEffect(() => {
    if (etapas.length > 0 && editingId === 'nova' && !titulo) {
      selectEtapa(etapas[0]);
    }
  }, [etapas]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temporada) return;
    setSaving(true);
    try {
      await fetch('/api/etapas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId === 'nova' ? undefined : editingId,
          temporada_id: temporada.id,
          numero: Number(numero),
          titulo,
          subtitulo,
          local_pesca: localPesca,
          cidade_uf: cidadeUf,
          data_inicio: dataInicio,
          data_fim: dataFim,
          palavra_chave: palavraChave.toUpperCase(),
          revelar_palavra_chave: revelar,
          status,
          observacoes,
        }),
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/etapas?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await refresh();
    selectEtapa(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Gestão de Etapas e Palavra-Chave Oficial
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Configure as fases da temporada, locais de pesca e altere ou revele a palavra-chave exigida nos vídeos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="el-card overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#060a13]">
            <span className="text-xs font-heading font-semibold text-[#e5c158]">
              Etapas da Temporada ({etapas.length})
            </span>
            <button
              type="button"
              onClick={() => selectEtapa(null)}
              className="el-btn-gold h-8 px-3.5 text-xs"
            >
              Nova Etapa
            </button>
          </div>

          <div className="divide-y divide-white/10">
            {etapas.map((et) => (
              <div
                key={et.id}
                className={`p-4 flex items-center justify-between gap-2 ${
                  editingId === et.id ? 'bg-[#0c111c] border-l-2 border-[#e5c158]' : 'hover:bg-[#0c111c]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectEtapa(et)}
                  className="text-left flex-1 cursor-pointer"
                >
                  <div className="text-sm font-heading font-bold text-[#f3f4f6]">{et.titulo}</div>
                  <div className="text-xs text-[#e5c158] font-medium mt-0.5">
                    Chave: {et.palavra_chave} ({et.status.replace('_', ' ')})
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(et.id)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-red-300 hover:bg-red-950 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="lg:col-span-2 el-card-gold p-6 space-y-4"
        >
          <h2 className="text-lg font-heading font-bold text-[#f3f4f6] border-b border-white/10 pb-3">
            {editingId === 'nova' ? 'Cadastrar Nova Etapa' : `Editar Etapa: ${titulo}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="et-num" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Nº da Etapa
              </label>
              <input
                id="et-num"
                type="number"
                value={numero}
                onChange={(e) => setNumero(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="et-tit" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Título Oficial da Etapa
              </label>
              <input
                id="et-tit"
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="et-loc" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Local de Pesca / Bacia Hidrográfica
              </label>
              <input
                id="et-loc"
                type="text"
                required
                value={localPesca}
                onChange={(e) => setLocalPesca(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              />
            </div>

            <div>
              <label htmlFor="et-cid" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Cidade / Região
              </label>
              <input
                id="et-cid"
                type="text"
                value={cidadeUf}
                onChange={(e) => setCidadeUf(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="et-ini" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Data Início
              </label>
              <input
                id="et-ini"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="et-fim" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Data Término
              </label>
              <input
                id="et-fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="et-st" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Status Operacional
              </label>
              <select
                id="et-st"
                value={status}
                onChange={(e) => setStatus(e.target.value as Etapa['status'])}
                className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              >
                <option value="agendada">Agendada</option>
                <option value="inscricoes_abertas">Inscrições Abertas</option>
                <option value="em_andamento">Em Andamento (Ativa)</option>
                <option value="apuracao">Em Apuração</option>
                <option value="encerrada">Encerrada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-white/10">
            <div>
              <label htmlFor="et-key" className="block text-xs font-semibold text-[#e5c158] mb-1.5">
                Palavra-Chave Oficial (Obrigatória no Vídeo)
              </label>
              <input
                id="et-key"
                type="text"
                required
                value={palavraChave}
                onChange={(e) => setPalavraChave(e.target.value.toUpperCase())}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm font-heading font-bold text-[#e5c158]"
              />
            </div>

            <label className="flex items-center gap-2.5 text-xs text-[#f3f4f6] pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={revelar}
                onChange={(e) => setRevelar(e.target.checked)}
                className="h-4 w-4 rounded border-white/25 bg-[#060a13] text-[#e5c158]"
              />
              <span>Revelar palavra-chave publicamente aos competidores</span>
            </label>
          </div>

          <div>
            <label htmlFor="et-obs" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
              Observações da Etapa
            </label>
            <input
              id="et-obs"
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="el-btn-gold h-11 px-6 text-sm"
          >
            {saving ? 'Salvando...' : 'Salvar Etapa e Palavra-Chave'}
          </button>
        </form>
      </div>
    </div>
  );
}
