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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
            Últimos Registros de Captura Recebidos
          </h2>
          <p className="text-xs text-[#a1a8b9]">
            Histórico em tempo real de submissões com status de validação da Mesa de Arbitragem.
          </p>
        </div>
        <Link
          href="/painel/registros"
          className="text-xs font-semibold text-[#e5c158] hover:text-[#cfab44]"
        >
          Enviar ou consultar minhas capturas
        </Link>
      </div>

      <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden">
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

