'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Copy, FileCheck2, ShieldCheck, Store } from 'lucide-react';
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Minha Inscrição e Passaporte do Competidor
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Com uma única inscrição ativa você compete em todas as categorias compatíveis e garante{' '}
          {temporada?.beneficio_desconto_parceiros_pct || 15}% de desconto nas lojas parceiras.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credencial Oficial do Pescador */}
        <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo_header.webp"
                alt="Eldorado Pesca"
                className="h-12 w-auto object-contain"
              />
              <div>
                <span className="text-xs font-semibold text-[#e5c158] block">
                  Credencial Oficial da Temporada
                </span>
                <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">{currentUser?.nome}</h2>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#a1a8b9] block">Nº Inscrição</span>
              <strong className="font-mono text-xl text-[#e5c158] tabular-nums font-bold">
                {minhaInscricao?.numero_inscricao || currentUser?.numero_inscricao || 'S/N'}
              </strong>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#a1a8b9]">Status da Homologação</span>
              {minhaInscricao?.status_pagamento === 'pago' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Passaporte Ativo e Homologado</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e5c158] bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800/80">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Aguardando Confirmação Pix</span>
                </span>
              )}
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#a1a8b9]">WhatsApp Cadastrado</span>
              <span className="font-mono text-[#f3f4f6] tabular-nums">{currentUser?.whatsapp}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#a1a8b9]">Cidade / UF</span>
              <span className="text-[#f3f4f6]">{currentUser?.cidade_uf || 'Curitiba/PR'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#a1a8b9]">Equipe</span>
              <span className="text-[#f3f4f6]">{currentUser?.equipe || 'Individual'}</span>
            </div>
          </div>

          <div className="pt-2">
            {!minhaInscricao ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[#a1a8b9]">
                  Selecione sua modalidade principal:
                </label>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/10 text-sm text-[#f3f4f6] focus:outline-none focus:border-[#e5c158]"
                >
                  <option value="embarcado">Embarcado (Barco com motor / Lancha)</option>
                  <option value="caiaque">Caiaque (Remo ou Pedal)</option>
                  <option value="barranco">Barranco / Açude / Pesqueiro</option>
                </select>

                <button
                  type="button"
                  onClick={handleSolicitarInscricao}
                  disabled={saving}
                  className="w-full h-11 rounded-full bg-[#e5c158] hover:bg-[#cfab44] disabled:opacity-60 text-[#060a13] font-heading font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{saving ? 'Ativando...' : 'Ativar Minha Inscrição Oficial'}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#0d1626] border border-white/10 text-xs text-[#a1a8b9] flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#e5c158] shrink-0" />
                <span>
                  Sua inscrição é única e vitalícia para todas as etapas da temporada{' '}
                  {temporada?.nome}. Apresente seu número #{minhaInscricao.numero_inscricao} nas lojas
                  conveniadas para obter os descontos.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Informações de Pagamento e Chave Pix */}
        <div className="bg-[#080c14] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs font-semibold text-[#e5c158] block uppercase tracking-wider">
              Pagamento via Pix
            </span>
            <h2 className="text-lg font-heading font-bold text-[#f3f4f6] mt-0.5">
              Taxa de Inscrição da Temporada
            </h2>
            <div className="mt-2 text-2xl font-heading font-bold text-[#e5c158] tabular-nums">
              R$ {valorReais}
            </div>
            <p className="text-xs text-[#a1a8b9] mt-1">
              Valor único para acesso a todas as etapas e todas as categorias da temporada.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-[#a1a8b9]">
              Chave Pix Oficial da Organização:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={chavePix}
                className="flex-1 h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/10 text-[#f3f4f6] font-mono text-xs tabular-nums focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyPix}
                className="h-11 px-4 rounded-xl bg-[#0d1626] hover:bg-[#121c2e] border border-[#e5c158]/30 hover:border-[#e5c158] text-[#e5c158] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
              </button>
            </div>
            <p className="text-xs text-[#a1a8b9]">
              Após realizar o Pix, a comissão financeira homologa sua credencial e libera seu número
              oficial de competidor em instantes.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f3f4f6] mb-3">
              <Store className="w-4 h-4 text-[#e5c158]" />
              <span>
                Lojas parceiras que aceitam o desconto de {temporada?.beneficio_desconto_parceiros_pct}%:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#a1a8b9]">
              {patrocinadores.slice(0, 4).map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-[#060a13] border border-white/5 truncate">
                  <span className="font-heading font-bold text-[#f3f4f6] block truncate">{p.nome}</span>
                  <span className="text-xs text-[#a1a8b9]">{p.endereco_cidade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
