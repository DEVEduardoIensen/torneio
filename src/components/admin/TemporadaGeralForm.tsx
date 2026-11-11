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

  const inputClass =
    'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';

  return (
    <form onSubmit={handleSaveTemporada} className="space-y-5">
      <h2 className="text-lg font-bold text-[#f3f4f6]">Temporada</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="temp-nome" className={labelClass}>
            Nome
          </label>
          <input
            id="temp-nome"
            type="text"
            required
            value={nomeTemp}
            onChange={(e) => setNomeTemp(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="temp-sub" className={labelClass}>
            Subtítulo
          </label>
          <input
            id="temp-sub"
            type="text"
            value={subtituloTemp}
            onChange={(e) => setSubtituloTemp(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="temp-logo" className={labelClass}>
          Logo
        </label>
        <select
          id="temp-logo"
          value={logoUrlTemp}
          onChange={(e) => setLogoUrlTemp(e.target.value)}
          className={inputClass}
        >
          <option value="/brand/logo_header.webp">Eldorado Lake (logo oficial do site)</option>
          <option value="/brand/logo-eldorado-amarelo-tight.png">Eldorado Pesca (dourada)</option>
          <option value="/brand/logo-eldorado-branco-tight.png">Eldorado Pesca (branca)</option>
          <option value="/brand/peixe-dourado-tight.png">Isotipo (peixe dourado)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="temp-pix" className={labelClass}>
            Chave Pix padrão
          </label>
          <input
            id="temp-pix"
            type="text"
            value={chavePix}
            onChange={(e) => setChavePix(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="temp-desc" className={labelClass}>
            Desconto nas lojas parceiras (%)
          </label>
          <input
            id="temp-desc"
            type="number"
            inputMode="decimal"
            value={descontoPct}
            onChange={(e) => setDescontoPct(Number(e.target.value))}
            className={`${inputClass} tabular-nums`}
          />
        </div>
      </div>

      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={multiCatPeixe}
          onChange={(e) => setMultiCatPeixe(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#e5c158]"
        />
        <span className="text-sm text-[#a1a8b9]">
          Permitir o mesmo peixe em várias categorias compatíveis
        </span>
      </label>

      <button
        type="submit"
        disabled={savingTemp}
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#e5c158] px-6 text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60 sm:w-auto"
      >
        {savingTemp ? 'Salvando...' : 'Salvar temporada'}
      </button>
    </form>
  );
}