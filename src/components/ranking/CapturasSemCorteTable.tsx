'use client';

import React from 'react';
import Link from 'next/link';
import { Video } from 'lucide-react';
import { RegistroCaptura } from '@/types/domain';

interface CapturasSemCorteTableProps {
  capturas: RegistroCaptura[];
}

export function CapturasSemCorteTable({ capturas }: CapturasSemCorteTableProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
          Prêmio Especial — Captura Completa sem Corte (Fisgada + Medição + Soltura)
        </h2>
        <p className="text-sm text-[#a1a8b9] mt-1.5">
          Concorrem a esta premiação especial todos os vídeos contínuos homologados que registram a fisgada do peixe, a medição na régua oficial e a soltura em uma única tomada sem edições, destacando a marca e o modelo da isca artificial utilizada.
        </p>
      </div>

      <div className="bg-[#080c14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0d1626] text-xs font-semibold text-[#a1a8b9]">
                <th scope="col" className="py-3.5 px-4">Posição</th>
                <th scope="col" className="py-3.5 px-4">Competidor</th>
                <th scope="col" className="py-3.5 px-4">Espécie e Categoria</th>
                <th scope="col" className="py-3.5 px-4">Isca Artificial</th>
                <th scope="col" className="py-3.5 px-4">Local da Captura</th>
                <th scope="col" className="py-3.5 px-4 text-right">Medida Homologada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {capturas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-[#a1a8b9]">
                    Nenhuma captura completa sem corte homologada para este filtro.
                  </td>
                </tr>
              ) : (
                capturas.map((reg, index) => (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-heading font-bold tabular-nums text-[#e5c158]">
                      {index + 1}º
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/painel/pescadores/${reg.pescador_id}`}
                        className="font-heading font-semibold text-[#f3f4f6] hover:text-[#e5c158] block"
                      >
                        {reg.pescador_nome}
                      </Link>
                      <span className="text-xs text-[#a1a8b9] tabular-nums">
                        {reg.numero_inscricao} • {reg.pescador_cidade_uf}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#f3f4f6]">{reg.especie_informada}</div>
                      <div className="text-xs text-[#a1a8b9]">{reg.categoria_nome}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#e5c158]">{reg.isca_marca}</span>
                      <span className="block text-xs text-[#a1a8b9]">{reg.isca_modelo}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#f3f4f6]">
                      {reg.local_captura}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-heading font-bold text-[#e5c158] tabular-nums text-base">
                        {(reg.medida_aprovada ?? reg.medida_declarada).toFixed(1)} cm
                      </div>
                      {reg.video_medicao_url && (
                        <a
                          href={reg.video_medicao_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#e5c158] hover:underline"
                        >
                          <Video className="w-3 h-3" />
                          <span>Assistir Vídeo</span>
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
    </div>
  );
}

