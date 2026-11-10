'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, KeyRound, MapPin, ShieldCheck, Sliders } from 'lucide-react';
import { usePainel } from '@/components/PainelContext';

export default function PainelEtapasPage() {
  const { temporada, etapas, categorias, currentUser, loading } = usePainel();

  if (loading || !temporada) {
    return (
      <div className="py-12 text-center text-sm text-[#a1a8b9]">
        Carregando etapas e regulamento oficial...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
            Etapas Oficiais e Regulamento Dinâmico
          </h1>
          <p className="text-sm text-[#a1a8b9] mt-1">
            Cronograma de etapas, palavras-chave vigentes e diretrizes técnicas configuradas para a temporada.
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <Link
            href="/painel/admin/etapas"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0d1626] hover:bg-[#121c2e] border border-[#e5c158]/30 hover:border-[#e5c158] text-xs font-semibold text-[#e5c158] transition-colors self-start"
          >
            <Sliders className="w-4 h-4" />
            <span>Editar Etapas e Palavra-Chave</span>
          </Link>
        )}
      </div>

      {/* Cronograma de Etapas */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {etapas.map((etapa) => (
          <div
            key={etapa.id}
            className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-heading font-bold uppercase text-[#e5c158] tabular-nums">
                  Etapa #{etapa.numero} • {etapa.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-[#a1a8b9] tabular-nums">
                  {etapa.data_inicio} a {etapa.data_fim}
                </span>
              </div>
              <h2 className="text-xl font-heading font-bold text-[#f3f4f6]">{etapa.titulo}</h2>
              <p className="text-sm text-[#a1a8b9] mt-1">{etapa.subtitulo}</p>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#f3f4f6]">
                  <MapPin className="w-4 h-4 text-[#e5c158] shrink-0" />
                  <span className="text-[#a1a8b9]">Local de pesca: </span>
                  <span>
                    {etapa.local_pesca} ({etapa.cidade_uf})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#f3f4f6]">
                  <KeyRound className="w-4 h-4 text-[#e5c158] shrink-0" />
                  <span className="text-[#a1a8b9]">Palavra-Chave Oficial: </span>
                  {etapa.revelar_palavra_chave ? (
                    <strong className="font-mono text-[#e5c158] tabular-nums font-bold">
                      {etapa.palavra_chave}
                    </strong>
                  ) : (
                    <span className="text-xs font-mono bg-[#0d1626] px-2 py-0.5 rounded text-[#a1a8b9]">
                      LIBERAÇÃO NO HORÁRIO DA LARGADA
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#a1a8b9]">{etapa.observacoes || 'Pesca esportiva 100% pesque e solte.'}</span>
              <Link
                href="/painel/registros"
                className="font-heading font-bold text-[#e5c158] hover:text-[#cfab44]"
              >
                Registrar peixe →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Regulamento Oficial Parametrizado */}
      <section className="bg-[#080c14] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#e5c158] shrink-0" />
          <div>
            <h2 className="text-xl font-heading font-bold text-[#f3f4f6]">
              Diretrizes Técnicas e Regulamento Geral da Temporada
            </h2>
            <p className="text-xs text-[#a1a8b9] mt-0.5">
              Validação das capturas em régua oficial padronizada e vídeo contínuo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#f3f4f6] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Obrigatório no Vídeo</span>
            </h3>
            <p className="text-xs text-[#a1a8b9] leading-relaxed">
              O pescador deve falar em voz alta e audível a palavra-chave oficial da etapa. A boca do
              peixe deve estar encostada no anteparo marco zero da régua plana, com o corpo esticado e
              a ponta da cauda visível sobre a graduação métrica em centímetros.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#f3f4f6] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Soltura e Sobrevivência</span>
            </h3>
            <p className="text-xs text-[#a1a8b9] leading-relaxed">
              O peixe deve retornar à água com vitalidade e nadar ativamente. Peixes que boiarem sem
              reação serão desclassificados sumariamente pela mesa de arbitragem para assegurar a
              preservação das matrizes reprodutoras.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#f3f4f6] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Isca Artificial e Foto</span>
            </h3>
            <p className="text-xs text-[#a1a8b9] leading-relaxed">
              É obrigatório o uso de iscas artificiais. Uma foto nítida da isca ao lado do peixe deve ser
              submetida no formulário para validação da comissão e concorrência aos prêmios das marcas
              parceiras da temporada.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
