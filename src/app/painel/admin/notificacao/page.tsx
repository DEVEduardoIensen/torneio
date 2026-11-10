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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Comunicados Oficiais e Sorteador entre Inscritos
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Publique avisos no mural do painel, divulgue a palavra-chave e realize sorteios auditáveis entre os participantes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <form
          onSubmit={handlePublish}
          className="el-card-gold p-6 space-y-4"
        >
          <h2 className="text-lg font-heading font-bold text-[#f3f4f6] border-b border-white/10 pb-3">
            Publicar Novo Comunicado
          </h2>

          <div>
            <label htmlFor="not-tit" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
              Título do Comunicado
            </label>
            <input
              id="not-tit"
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Horário limite para envio de vídeos da 1ª Etapa"
              className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="not-tipo" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Categoria do Aviso
              </label>
              <select
                id="not-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as Notificacao['tipo'])}
                className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              >
                <option value="aviso">Aviso Geral</option>
                <option value="palavra_chave">Revelação de Palavra-Chave</option>
                <option value="resultado">Resultado Oficial</option>
                <option value="sorteio">Sorteio</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#f3f4f6] pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={fixado}
                onChange={(e) => setFixado(e.target.checked)}
                className="h-4 w-4 rounded border-white/25 bg-[#060a13] text-[#e5c158]"
              />
              <span>Fixar no topo da Visão Geral</span>
            </label>
          </div>

          <div>
            <label htmlFor="not-msg" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
              Mensagem Completa
            </label>
            <textarea
              id="not-msg"
              rows={3}
              required
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="el-btn-gold h-11 px-6 text-sm"
          >
            Publicar no Painel
          </button>
        </form>

        {/* Sorteador Auditável */}
        <div className="el-card p-6 space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#f3f4f6] border-b border-white/10 pb-3">
            Sorteador Oficial entre Competidores Confirmados
          </h2>

          <p className="text-sm text-[#a1a8b9]">
            Realiza o sorteio aleatório entre todos os pescadores com inscrição paga/isenta e publica automaticamente o vencedor no mural oficial da temporada.
          </p>

          <div>
            <label htmlFor="sort-premio" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
              Prêmio a ser sorteado agora
            </label>
            <input
              id="sort-premio"
              type="text"
              value={premioSorteio}
              onChange={(e) => setPremioSorteio(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleRealizarSorteio}
            className="w-full h-11 el-btn-gold text-sm"
          >
            Sortear Competidor e Publicar Resultado
          </button>
        </div>
      </div>

      {/* Lista de Comunicados Publicados */}
      <div className="el-card divide-y divide-white/10">
        {notificacoes.map((not) => (
          <div key={not.id} className="p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-heading font-bold text-[#f3f4f6]">{not.titulo}</h3>
              <p className="text-sm text-[#a1a8b9] mt-1">{not.mensagem}</p>
              <div className="text-xs font-medium text-[#e5c158] mt-2">
                {not.autor_nome} • {not.tipo.replace('_', ' ')}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(not.id)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-300 hover:bg-red-950 cursor-pointer shrink-0"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
