'use client';

import React, { useState } from 'react';
import { Temporada } from '@/types/domain';

interface TemporadaGeralFormProps {
  temporada: Temporada;
  onSaved: () => void;
}

export function TemporadaGeralForm({ temporada, onSaved }: TemporadaGeralFormProps) {
  const [nomeTemp, setNomeTemp] = useState(temporada.nome);
  const [subtituloTemp, setSubtituloTemp] = useState(temporada.subtitulo);
  const [logoUrlTemp, setLogoUrlTemp] = useState(temporada.logo_url || '/brand/logo_header.webp');
  const [descontoPct, setDescontoPct] = useState(temporada.beneficio_desconto_parceiros_pct);
  const [chavePix, setChavePix] = useState(temporada.chave_pix_padrao);
  const [multiCatPeixe, setMultiCatPeixe] = useState(temporada.permite_mesmo_peixe_multiplas_categorias);
  const [savingTemp, setSavingTemp] = useState(false);

  const handleSaveTemporada = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTemp(true);
    try {
      await fetch('/api/temporada', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: temporada.id,
          nome: nomeTemp,
          subtitulo: subtituloTemp,
          logo_url: logoUrlTemp,
          beneficio_desconto_parceiros_pct: Number(descontoPct),
          chave_pix_padrao: chavePix,
          permite_mesmo_peixe_multiplas_categorias: multiCatPeixe,
        }),
      });
      onSaved();
    } finally {
      setSavingTemp(false);
    }
  };

  return (
    <form onSubmit={handleSaveTemporada} className="el-card-gold p-6 space-y-5">
      <h2 className="text-lg font-heading font-bold text-[#f3f4f6] border-b border-white/10 pb-3">
        Identidade e Regras Globais da Temporada Ativa
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="temp-nome" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Nome Oficial da Temporada
          </label>
          <input
            id="temp-nome"
            type="text"
            required
            value={nomeTemp}
            onChange={(e) => setNomeTemp(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          />
        </div>

        <div>
          <label htmlFor="temp-sub" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Subtítulo Institucional
          </label>
          <input
            id="temp-sub"
            type="text"
            value={subtituloTemp}
            onChange={(e) => setSubtituloTemp(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          />
        </div>

        <div>
          <label htmlFor="temp-logo" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Variante Oficial do Logo Eldorado Lake
          </label>
          <select
            id="temp-logo"
            value={logoUrlTemp}
            onChange={(e) => setLogoUrlTemp(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          >
            <option value="/brand/logo_header.webp">Eldorado Lake (Logo Oficial do Site)</option>
            <option value="/brand/logo-eldorado-amarelo-tight.png">Eldorado Pesca (Tipografia Dourada)</option>
            <option value="/brand/logo-eldorado-branco-tight.png">Eldorado Pesca (Tipografia Branca)</option>
            <option value="/brand/peixe-dourado-tight.png">Isotipo Oficial (Peixe Dourado)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label htmlFor="temp-pix" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Chave Pix Padrão
          </label>
          <input
            id="temp-pix"
            type="text"
            value={chavePix}
            onChange={(e) => setChavePix(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm font-semibold text-[#e5c158]"
          />
        </div>

        <div>
          <label htmlFor="temp-desc" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Desconto nas Lojas Parceiras (%)
          </label>
          <input
            id="temp-desc"
            type="number"
            value={descontoPct}
            onChange={(e) => setDescontoPct(Number(e.target.value))}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
          />
        </div>

        <label className="flex items-center gap-2.5 text-xs text-[#f3f4f6] pt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={multiCatPeixe}
            onChange={(e) => setMultiCatPeixe(e.target.checked)}
            className="h-4 w-4 rounded border-white/25 bg-[#060a13] text-[#e5c158]"
          />
          <span>Permitir inscrições do mesmo exemplar em múltiplas categorias compatíveis</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={savingTemp}
        className="el-btn-gold h-11 px-6 text-xs"
      >
        {savingTemp ? 'Salvando...' : 'Salvar Parâmetros da Temporada'}
      </button>
    </form>
  );
}
