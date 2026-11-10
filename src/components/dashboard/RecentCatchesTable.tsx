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
              <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                <th scope="col" className="py-3.5 px-4">Pescador</th>
                <th scope="col" className="py-3.5 px-4">Categoria</th>
                <th scope="col" className="py-3.5 px-4">Medida</th>
                <th scope="col" className="py-3.5 px-4">Isca Utilizada</th>
                <th scope="col" className="py-3.5 px-4">Local e Palavra-Chave</th>
                <th scope="col" className="py-3.5 px-4">Status Arbitragem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {registros.slice(0, 8).map((reg) => {
                const medidaExibida = reg.medida_aprovada ?? reg.medida_declarada;
                return (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/painel/pescadores/${reg.pescador_id}`}
                        className="font-heading font-semibold text-[#f3f4f6] hover:text-[#e5c158] block"
                      >
                        {reg.pescador_nome}
                      </Link>
                      <span className="text-xs text-[#a1a8b9] tabular-nums">
                        {reg.numero_inscricao || 'S/N'} • {reg.pescador_cidade_uf}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#f3f4f6]">{reg.categoria_nome}</div>
                      <div className="text-xs text-[#a1a8b9]">{reg.especie_informada}</div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <span className="font-heading font-bold text-[#e5c158]">
                        {medidaExibida.toFixed(1)} {reg.categoria_unidade || 'cm'}
                      </span>
                      {reg.captura_completa_sem_corte && (
                        <span className="block text-xs text-[#e5c158]/80 font-medium">
                          Vídeo completo s/ corte
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#f3f4f6] font-medium">{reg.isca_marca || '—'}</div>
                      <div className="text-xs text-[#a1a8b9]">{reg.isca_modelo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#f3f4f6] text-xs">{reg.local_captura}</div>
                      <div className="text-xs font-mono text-[#a1a8b9] tabular-nums mt-0.5">
                        Chave: {reg.palavra_chave_informada}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {reg.status === 'aprovado' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Homologado</span>
                        </span>
                      )}
                      {reg.status === 'pendente' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-[#e5c158] border border-amber-800/80">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Em Análise</span>
                        </span>
                      )}
                      {reg.status === 'reprovado' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/80">
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
