'use client';

import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function PainelInscricoesPage() {
  const { temporada, etapaAtiva, inscricoes, patrocinadores, currentUser, refresh } = usePainel();
  const [modalidade, setModalidade] = useState('embarcado');
  const [copiedPix, setCopiedPix] = useState(false);
  const [saving, setSaving] = useState(false);

  const minhaInscricao = inscricoes.find((i) => i.pescador_id === currentUser?.id);
  const chavePix = etapaAtiva?.chave_pix || temporada?.chave_pix_padrao || 'pix@eldoradopesca.com.br';
  const valorReais = ((etapaAtiva?.valor_inscricao_centavos || temporada?.valor_inscricao_padrao_centavos || 5000) / 100).toFixed(2);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleSolicitarInscricao = async () => {
    if (!currentUser || !temporada) return;
    setSaving(true);
    try {
      await fetch('/api/inscricao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temporada_id: temporada.id,
          etapa_id: etapaAtiva?.id || null,
          pescador_id: currentUser.id,
          modalidade_principal: modalidade,
          status_pagamento: 'pago',
          valor_pago_centavos: etapaAtiva?.valor_inscricao_centavos || 5000,
        }),
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const pago = minhaInscricao?.status_pagamento === 'pago';
  const pct = temporada?.beneficio_desconto_parceiros_pct || 15;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Inscrição</h1>

      {/* Passaporte: o único card da página */}
      <section
        aria-labelledby="passaporte-title"
        className="mt-4 rounded-2xl border border-[#e5c158]/40 bg-[#e5c158]/5 p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-[#a1a8b9]">Passaporte {temporada?.nome}</p>
            <h2 id="passaporte-title" className="truncate text-xl font-bold text-[#f3f4f6]">
              {currentUser?.nome}
            </h2>
          </div>
          <span
            className={`shrink-0 text-sm font-semibold ${pago ? 'text-emerald-400' : 'text-[#a1a8b9]'}`}
          >
            {pago ? 'Ativo' : 'Aguardando Pix'}
          </span>
        </div>

        <dl className="mt-4 divide-y divide-white/10 border-t border-white/10 text-sm">
          <div className="flex justify-between py-2.5">
            <dt className="text-[#a1a8b9]">WhatsApp</dt>
            <dd className="tabular-nums text-[#f3f4f6]">{currentUser?.whatsapp}</dd>
          </div>
          {currentUser?.role !== 'admin' && currentUser?.cidade_uf && (
            <div className="flex justify-between py-2.5">
              <dt className="text-[#a1a8b9]">Cidade</dt>
              <dd className="text-[#f3f4f6]">{currentUser.cidade_uf}</dd>
            </div>
          )}
          <div className="flex justify-between py-2.5">
            <dt className="text-[#a1a8b9]">Equipe</dt>
            <dd className="text-[#f3f4f6]">{currentUser?.equipe || 'Individual'}</dd>
          </div>
        </dl>

        {!minhaInscricao ? (
          <div className="mt-4 space-y-3">
            <label htmlFor="modalidade" className="block text-sm font-medium text-[#a1a8b9]">
              Modalidade principal
            </label>
            <select
              id="modalidade"
              value={modalidade}
              onChange={(e) => setModalidade(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/15 bg-[#060a13] px-3.5 text-base text-[#f3f4f6] focus:border-[#e5c158] focus:outline-none"
            >
              <option value="embarcado">Embarcado</option>
              <option value="caiaque">Caiaque</option>
              <option value="barranco">Barranco / Açude</option>
            </select>
            <button
              type="button"
              onClick={handleSolicitarInscricao}
              disabled={saving}
              className="h-12 w-full cursor-pointer rounded-xl bg-[#e5c158] text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60"
            >
              {saving ? 'Ativando...' : 'Ativar inscrição'}
            </button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[#a1a8b9]">
            Vale para todas as etapas. Apresente seu nome nas lojas parceiras para ter {pct}% de
            desconto.
          </p>
        )}
      </section>

      <section className="mt-8" aria-labelledby="pix-title">
        <h2 id="pix-title" className="text-lg font-bold text-[#f3f4f6]">
          Pagamento via Pix
        </h2>
        <p className="mt-1 text-sm text-[#a1a8b9]">
          <span className="text-2xl font-bold tabular-nums text-[#e5c158]">R$ {valorReais}</span>
          <span className="ml-2">todas as etapas e categorias</span>
        </p>

        <label htmlFor="chave-pix" className="mt-4 block text-sm font-medium text-[#a1a8b9]">
          Chave Pix
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="chave-pix"
            type="text"
            readOnly
            value={chavePix}
            className="h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-transparent px-3.5 text-sm tabular-nums text-[#f3f4f6] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopyPix}
            className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-[#e5c158] px-4 text-sm font-semibold text-[#e5c158] transition-colors hover:bg-[#e5c158]/10"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {copiedPix ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <p className="mt-2 text-sm text-[#a1a8b9]">
          Depois do Pix, a organização confirma e libera seu número de competidor.
        </p>
      </section>

      {patrocinadores.length > 0 && (
        <section className="mt-8" aria-labelledby="lojas-title">
          <h2 id="lojas-title" className="text-lg font-bold text-[#f3f4f6]">
            Lojas com {pct}% de desconto
          </h2>
          <ul className="mt-2 divide-y divide-white/10 border-y border-white/10 text-sm">
            {patrocinadores.slice(0, 4).map((p) => (
              <li key={p.id} className="flex justify-between gap-3 py-3">
                <span className="font-semibold text-[#f3f4f6]">{p.nome}</span>
                <span className="text-[#a1a8b9]">{p.endereco_cidade}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}