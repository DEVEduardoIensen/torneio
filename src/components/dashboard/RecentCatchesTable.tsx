'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import { RegistroCaptura } from '@/types/domain';

interface RecentCatchesTableProps {
  registros: RegistroCaptura[];
}

export function RecentCatchesTable({ registros }: RecentCatchesTableProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#f3f4f6]">
            Últimas Capturas Enviadas
          </h2>
          <p className="text-xs text-[#a1a8b9]">
            Acompanhe as validações da arbitragem em tempo real
          </p>
        </div>
        <Link
          href="/painel/registros"
          className="text-xs font-semibold text-[#e5c158] hover:text-[#cfab44] self-start sm:self-auto"
        >
          Minhas capturas →
        </Link>
      </div>

      {/* Lista em Cards para Telas Mobile */}
      <div className="md:hidden space-y-2.5">
        {registros.slice(0, 6).map((reg) => {
          const medidaExibida = reg.medida_aprovada ?? reg.medida_declarada;
          return (
            <div
              key={reg.id}
              className="bg-[#080c14] border border-white/10 rounded-xl p-3.5 space-y-2.5 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/painel/pescadores/${reg.pescador_id}`}
                    className="font-semibold text-sm text-[#f3f4f6] hover:text-[#e5c158]"
                  >
                    {reg.pescador_nome}
                  </Link>
                  <span className="text-xs text-[#a1a8b9] block">
                    {reg.pescador_cidade_uf}
                  </span>
                </div>

                <div>
                  {reg.status === 'aprovado' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Homologado</span>
                    </span>
                  )}
                  {reg.status === 'pendente' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                      <Clock className="w-3 h-3" />
                      <span>Em Análise</span>
                    </span>
                  )}
                  {reg.status === 'reprovado' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <span>Reprovado</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div>
                  <div className="text-xs font-medium text-[#f3f4f6]">{reg.categoria_nome}</div>
                  <div className="text-[11px] text-[#a1a8b9]">
                    {reg.isca_marca ? `${reg.isca_marca} ${reg.isca_modelo || ''}` : reg.especie_informada}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-[#e5c158] tabular-nums">
                    {medidaExibida.toFixed(1)} {reg.categoria_unidade || 'cm'}
                  </div>
                  {reg.captura_completa_sem_corte && (
                    <span className="text-[10px] text-[#e5c158]/80 block font-medium">
                      Vídeo s/ corte
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#a1a8b9] pt-1 border-t border-white/5 flex items-center justify-between">
                <span className="truncate max-w-[65%]">{reg.local_captura}</span>
                <span className="font-mono text-[#e5c158]/80 text-[10px]">
                  Chave: {reg.palavra_chave_informada}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela Completa para Desktop / Tablet */}
      <div className="hidden md:block bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#080c14] text-xs font-medium text-[#a1a8b9]">
                <th scope="col" className="py-3 px-4">Pescador</th>
                <th scope="col" className="py-3 px-4">Categoria</th>
                <th scope="col" className="py-3 px-4">Medida</th>
                <th scope="col" className="py-3 px-4">Isca Utilizada</th>
                <th scope="col" className="py-3 px-4">Local e Palavra-Chave</th>
                <th scope="col" className="py-3 px-4">Status Arbitragem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {registros.slice(0, 8).map((reg) => {
                const medidaExibida = reg.medida_aprovada ?? reg.medida_declarada;
                return (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        href={`/painel/pescadores/${reg.pescador_id}`}
                        className="font-medium text-[#f3f4f6] hover:text-[#e5c158] block"
                      >
                        {reg.pescador_nome}
                      </Link>
                      <span className="text-xs text-[#a1a8b9]">
                        {reg.pescador_cidade_uf}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#f3f4f6]">{reg.categoria_nome}</div>
                      <div className="text-xs text-[#a1a8b9]">{reg.especie_informada}</div>
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <span className="font-bold text-[#e5c158]">
                        {medidaExibida.toFixed(1)} {reg.categoria_unidade || 'cm'}
                      </span>
                      {reg.captura_completa_sem_corte && (
                        <span className="block text-xs text-[#e5c158]/80 font-medium">
                          Vídeo completo s/ corte
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#f3f4f6] font-medium">{reg.isca_marca || '—'}</div>
                      <div className="text-xs text-[#a1a8b9]">{reg.isca_modelo}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#f3f4f6] text-xs">{reg.local_captura}</div>
                      <div className="text-xs font-mono text-[#a1a8b9] tabular-nums mt-0.5">
                        Chave: {reg.palavra_chave_informada}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {reg.status === 'aprovado' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Homologado</span>
                        </span>
                      )}
                      {reg.status === 'pendente' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Em Análise</span>
                        </span>
                      )}
                      {reg.status === 'reprovado' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <span>Reprovado</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

