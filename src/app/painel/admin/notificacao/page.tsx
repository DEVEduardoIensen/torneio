'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Notificacao } from '@/types/domain';

export default function AdminNotificacaoPage() {
  const { temporada, etapaAtiva, notificacoes, inscricoes, refresh } = usePainel();

  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState<Notificacao['tipo']>('aviso');
  const [fixado, setFixado] = useState(true);
  const [premioSorteio, setPremioSorteio] = useState('Kit Oficial Mathias Iscas + Boné Eldorado Lake');
  const [saving, setSaving] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temporada) return;
    setSaving(true);
    try {
      await fetch('/api/notificacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temporada_id: temporada.id,
          etapa_id: etapaAtiva?.id || null,
          titulo,
          mensagem,
          tipo,
          fixado,
          autor_nome: 'Comissão Organizadora',
        }),
      });
      setTitulo('');
      setMensagem('');
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleRealizarSorteio = async () => {
    if (!temporada) return;
    const aptos = inscricoes.filter(
      (i) => i.status_pagamento === 'pago' || i.status_pagamento === 'isento'
    );
    if (aptos.length === 0) return;

    const vencedor = aptos[Math.floor(Math.random() * aptos.length)];
    setSaving(true);
    try {
      await fetch('/api/notificacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temporada_id: temporada.id,
          etapa_id: etapaAtiva?.id || null,
          titulo: `Resultado de Sorteio Oficial: ${vencedor.pescador_nome} (${vencedor.numero_inscricao})`,
          mensagem: `Sorteio auditado entre ${aptos.length} competidores confirmados. Prêmio: ${premioSorteio}. Ganhador: ${vencedor.pescador_nome} (${vencedor.pescador_cidade_uf}).`,
          tipo: 'sorteio',
          fixado: true,
          autor_nome: 'Sistema Oficial de Sorteios',
        }),
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notificacao?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await refresh();
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';
  const goldButton =
    'h-12 w-full cursor-pointer rounded-xl bg-[#e5c158] px-6 text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60';

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">Comunicados</h1>

      <form onSubmit={handlePublish} className="mt-6 space-y-5">
        <h2 className="text-lg font-semibold text-[#f3f4f6]">Novo comunicado</h2>

        <div>
          <label htmlFor="not-tit" className={labelClass}>
            Título
          </label>
          <input
            id="not-tit"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Horário limite para envio de vídeos da 1ª Etapa"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="not-tipo" className={labelClass}>
            Tipo de aviso
          </label>
          <select
            id="not-tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as Notificacao['tipo'])}
            className={inputClass}
          >
            <option value="aviso">Aviso Geral</option>
            <option value="palavra_chave">Revelação de Palavra-Chave</option>
            <option value="resultado">Resultado Oficial</option>
            <option value="sorteio">Sorteio</option>
          </select>
        </div>

        <div>
          <label htmlFor="not-msg" className={labelClass}>
            Mensagem
          </label>
          <textarea
            id="not-msg"
            rows={4}
            required
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-transparent p-3.5 text-base text-[#f3f4f6] focus:border-[#e5c158] focus:outline-none"
          />
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={fixado}
            onChange={(e) => setFixado(e.target.checked)}
            className="h-5 w-5 shrink-0 accent-[#e5c158]"
          />
          <span className="text-base text-[#f3f4f6]">Fixar no topo da Visão Geral</span>
        </label>

        <button type="submit" disabled={saving} className={goldButton}>
          Publicar
        </button>
      </form>

      {/* Sorteador Auditável */}
      <section className="mt-12 space-y-5 border-t border-white/10 pt-8">
        <div>
          <h2 className="text-lg font-semibold text-[#f3f4f6]">Sorteio</h2>
          <p className="mt-1 text-sm text-[#a1a8b9]">
            Sorteia entre inscritos pagos ou isentos e publica o ganhador no mural.
          </p>
        </div>

        <div>
          <label htmlFor="sort-premio" className={labelClass}>
            Prêmio
          </label>
          <input
            id="sort-premio"
            type="text"
            value={premioSorteio}
            onChange={(e) => setPremioSorteio(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleRealizarSorteio}
          className={goldButton}
        >
          Sortear e publicar
        </button>
      </section>

      {/* Lista de Comunicados Publicados */}
      <section className="mt-12" aria-label="Comunicados publicados">
        <h2 className="text-lg font-semibold text-[#f3f4f6]">Publicados</h2>
        <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
          {notificacoes.map((not) => (
            <li key={not.id} className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-[#f3f4f6]">{not.titulo}</h3>
                <p className="mt-1 text-sm text-[#a1a8b9]">{not.mensagem}</p>
                <p className="mt-1 text-sm text-[#a1a8b9]">
                  {not.autor_nome} · {not.tipo.replace('_', ' ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(not.id)}
                className="h-11 shrink-0 cursor-pointer rounded-xl px-3 text-sm font-semibold text-rose-400 transition-colors hover:text-rose-300"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
