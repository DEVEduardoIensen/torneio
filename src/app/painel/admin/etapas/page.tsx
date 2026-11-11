'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Etapa } from '@/types/domain';

const inputClass =
  'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';

function statusColor(status: Etapa['status']) {
  if (status === 'em_andamento' || status === 'inscricoes_abertas') return 'text-emerald-400';
  return 'text-[#a1a8b9]';
}

export default function AdminEtapasPage() {
  const { temporada, etapas, refresh } = usePainel();
  const initial = etapas[0];

  const [editingId, setEditingId] = useState<string>(initial?.id || 'nova');
  const [numero, setNumero] = useState(initial?.numero || 1);
  const [titulo, setTitulo] = useState(initial?.titulo || '');
  const [subtitulo, setSubtitulo] = useState(initial?.subtitulo || '');
  const [localPesca, setLocalPesca] = useState(initial?.local_pesca || '');
  const [cidadeUf, setCidadeUf] = useState(initial?.cidade_uf || 'PR');
  const [dataInicio, setDataInicio] = useState(initial?.data_inicio || '2026-03-01');
  const [dataFim, setDataFim] = useState(initial?.data_fim || '2026-06-30');
  const [palavraChave, setPalavraChave] = useState(initial?.palavra_chave || 'ELDORADO-OUTONO-26');
  const [revelar, setRevelar] = useState(initial?.revelar_palavra_chave ?? true);
  const [status, setStatus] = useState<Etapa['status']>(initial?.status || 'em_andamento');
  const [observacoes, setObservacoes] = useState(initial?.observacoes || '');
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
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Etapas</h1>
        <button
          type="button"
          onClick={() => selectEtapa(null)}
          className="h-12 px-2 text-base font-semibold text-[#e5c158] hover:text-[#cfab44] cursor-pointer"
        >
          Nova etapa
        </button>
      </div>

      <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
        {etapas.map((et) => (
          <li key={et.id} className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => selectEtapa(et)}
              aria-current={editingId === et.id}
              className="min-h-14 flex-1 py-2 text-left cursor-pointer"
            >
              <span
                className={`block text-base font-semibold ${
                  editingId === et.id ? 'text-[#e5c158]' : 'text-[#f3f4f6]'
                }`}
              >
                {et.titulo}
              </span>
              <span className="block text-sm text-[#a1a8b9]">
                <span className={`capitalize ${statusColor(et.status)}`}>
                  {et.status.replace(/_/g, ' ')}
                </span>{' '}
                · {et.palavra_chave}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleDelete(et.id)}
              className="h-12 px-2 text-sm font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSave}
        className="mt-8 max-w-xl space-y-5 border-t border-white/10 pt-6"
      >
        <h2 className="text-lg font-bold text-[#f3f4f6]">
          {editingId === 'nova' ? 'Nova etapa' : `Editar: ${titulo}`}
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="et-num" className={labelClass}>
              Número
            </label>
            <input
              id="et-num"
              type="number"
              inputMode="numeric"
              value={numero}
              onChange={(e) => setNumero(Number(e.target.value))}
              className={`${inputClass} tabular-nums`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="et-tit" className={labelClass}>
              Título
            </label>
            <input
              id="et-tit"
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="et-loc" className={labelClass}>
              Local de pesca
            </label>
            <input
              id="et-loc"
              type="text"
              required
              value={localPesca}
              onChange={(e) => setLocalPesca(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="et-cid" className={labelClass}>
              Cidade / UF
            </label>
            <input
              id="et-cid"
              type="text"
              value={cidadeUf}
              onChange={(e) => setCidadeUf(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="et-ini" className={labelClass}>
              Início
            </label>
            <input
              id="et-ini"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </div>

          <div>
            <label htmlFor="et-fim" className={labelClass}>
              Término
            </label>
            <input
              id="et-fim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="et-st" className={labelClass}>
            Status
          </label>
          <select
            id="et-st"
            value={status}
            onChange={(e) => setStatus(e.target.value as Etapa['status'])}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="agendada">Agendada</option>
            <option value="inscricoes_abertas">Inscrições abertas</option>
            <option value="em_andamento">Em andamento</option>
            <option value="apuracao">Em apuração</option>
            <option value="encerrada">Encerrada</option>
          </select>
        </div>

        <div>
          <label htmlFor="et-key" className={labelClass}>
            Palavra-chave do vídeo
          </label>
          <input
            id="et-key"
            type="text"
            required
            value={palavraChave}
            onChange={(e) => setPalavraChave(e.target.value.toUpperCase())}
            className={`${inputClass} font-bold tracking-wide text-[#e5c158]`}
          />
        </div>

        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={revelar}
            onChange={(e) => setRevelar(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#e5c158]"
          />
          <span className="text-base text-[#f3f4f6]">Mostrar a palavra-chave aos competidores</span>
        </label>

        <div>
          <label htmlFor="et-obs" className={labelClass}>
            Observações
          </label>
          <input
            id="et-obs"
            type="text"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#e5c158] text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar etapa'}
        </button>
      </form>
    </div>
  );
}
