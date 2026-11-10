'use client';

import React from 'react';
import { CheckCircle2, Clock, Video, XCircle } from 'lucide-react';
import { RegistroCaptura } from '@/types/domain';

interface MeusRegistrosTableProps {
  registros: RegistroCaptura[];
  currentUserName?: string;
}

export function MeusRegistrosTable({ registros, currentUserName }: MeusRegistrosTableProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
        Minhas Capturas Enviadas ({registros.length})
      </h2>

      <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                <th scope="col" className="py-3.5 px-4">Categoria / Espécie</th>
                <th scope="col" className="py-3.5 px-4">Medida Declarada</th>
                <th scope="col" className="py-3.5 px-4">Medida Homologada</th>
                <th scope="col" className="py-3.5 px-4">Isca e Local</th>
                <th scope="col" className="py-3.5 px-4">Status e Parecer do Juiz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-[#a1a8b9]">
                    Você ainda não enviou capturas com este perfil ({currentUserName || 'Atleta'}).
                  </td>
                </tr>
              ) : (
                registros.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-semibold text-[#f3f4f6]">{reg.categoria_nome}</div>
                      <div className="text-xs text-[#a1a8b9]">{reg.especie_informada}</div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-[#f3f4f6]">
                      {reg.medida_declarada.toFixed(1)} cm
                    </td>
                    <td className="py-3.5 px-4 tabular-nums font-heading font-bold text-[#e5c158]">
                      {reg.medida_aprovada !== null ? `${reg.medida_aprovada.toFixed(1)} cm` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#f3f4f6] font-medium">
                        {reg.isca_marca} — {reg.isca_modelo}
                      </div>
                      <div className="text-xs text-[#a1a8b9]">{reg.local_captura}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {reg.status === 'aprovado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aprovado</span>
                          </span>
                        )}
                        {reg.status === 'pendente' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-[#e5c158] border border-amber-800/80">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendente</span>
                          </span>
                        )}
                        {reg.status === 'reprovado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/80">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reprovado</span>
                          </span>
                        )}
                      </div>
                      {(reg.parecer_juiz || reg.motivo_reprovacao) && (
                        <p className="text-xs text-[#a1a8b9] mt-1">
                          {reg.motivo_reprovacao || reg.parecer_juiz}
                        </p>
                      )}
                      {reg.video_medicao_url && (
                        <a
                          href={reg.video_medicao_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-[#e5c158] hover:underline"
                        >
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span>Ver Vídeo da Captura</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
