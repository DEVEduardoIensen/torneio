'use client';

import React, { useState } from 'react';
import { Categoria, CriterioDesempate, FormulaRanking } from '@/types/domain';

interface CategoriaConfigFormProps {
  temporadaId: string;
  categoryToEdit: Categoria | null;
  onSaved: (msg: string) => void;
}

export function CategoriaConfigForm({
  temporadaId,
  categoryToEdit,
  onSaved,
}: CategoriaConfigFormProps) {
  const [catNome, setCatNome] = useState(categoryToEdit?.nome || '');
  const [catEspecie, setCatEspecie] = useState(categoryToEdit?.especie || '');
  const [catDescricao, setCatDescricao] = useState(categoryToEdit?.descricao_especie || '');
  const [catModalidade, setCatModalidade] = useState(categoryToEdit?.modalidade || 'livre');
  const [catUnidade] = useState<'cm' | 'kg' | 'pontos'>(
    categoryToEdit?.unidade_medida || 'cm'
  );
  const [catFormula, setCatFormula] = useState<FormulaRanking>(
    categoryToEdit?.formula_ranking || 'soma_top_n'
  );
  const [catTopN, setCatTopN] = useState(categoryToEdit?.top_n_peixes ?? 3);
  const [catDesempate, setCatDesempate] = useState<CriterioDesempate>(
    categoryToEdit?.criterio_desempate || 'maior_peixe'
  );
  const [catMinima, setCatMinima] = useState(categoryToEdit?.medida_minima ?? 35);
  const [catTempoAgua, setCatTempoAgua] = useState(
    categoryToEdit?.tempo_max_fora_agua_seg ?? 45
  );
  const [catTempoVideo, setCatTempoVideo] = useState(
    categoryToEdit?.tempo_max_video_seg ?? 60
  );
  const [catChecklistText, setCatChecklistText] = useState(
    categoryToEdit
      ? categoryToEdit.checklist_validacao.join('\n')
      : [
          'Citou a Palavra-Chave Oficial da etapa de forma audível',
          'Boca fechada encostada no marco zero da régua plana',
          'Foto nítida do exemplar com a isca artificial',
          'Vídeo sem cortes com soltura do peixe vivo',
        ].join('\n')
  );
  const [catPremio1, setCatPremio1] = useState(
    categoryToEdit?.premiacao[0]?.valor_ou_descricao || 'Troféu Oficial + Kit Patrocinadores'
  );
  const [savingCat, setSavingCat] = useState(false);

  const handleSaveCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCat(true);
    try {
      const checklistItems = catChecklistText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await fetch('/api/temporada/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: categoryToEdit ? categoryToEdit.id : undefined,
          temporada_id: temporadaId,
          nome: catNome,
          especie: catEspecie,
          descricao_especie: catDescricao,
          modalidade: catModalidade,
          unidade_medida: catUnidade,
          formula_ranking: catFormula,
          top_n_peixes: Number(catTopN),
          criterio_desempate: catDesempate,
          medida_minima: Number(catMinima),
          tempo_max_fora_agua_seg: Number(catTempoAgua),
          tempo_max_video_seg: Number(catTempoVideo),
          checklist_validacao: checklistItems,
          premiacao: [
            {
              colocacao: '1º Lugar',
              titulo: `Campeão ${catNome}`,
              valor_ou_descricao: catPremio1,
            },
          ],
          ativa: true,
        }),
      });
      onSaved(`Categoria "${catNome}" gravada com sucesso no banco de dados!`);
    } finally {
      setSavingCat(false);
    }
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';
  const sectionClass = 'space-y-5 border-t border-white/10 pt-6';

  return (
    <form onSubmit={handleSaveCategoria} className="space-y-6">
      <h2 className="text-lg font-bold text-[#f3f4f6]">
        {!categoryToEdit ? 'Nova categoria' : `Editar: ${categoryToEdit.nome}`}
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cat-nome" className={labelClass}>
            Nome
          </label>
          <input
            id="cat-nome"
            type="text"
            required
            value={catNome}
            onChange={(e) => setCatNome(e.target.value)}
            placeholder="Ex: Tucunaré Embarcado"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="cat-esp" className={labelClass}>
            Espécie
          </label>
          <input
            id="cat-esp"
            type="text"
            required
            value={catEspecie}
            onChange={(e) => setCatEspecie(e.target.value)}
            placeholder="Ex: Dourado"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cat-desc" className={labelClass}>
          Regras da espécie
        </label>
        <input
          id="cat-desc"
          type="text"
          value={catDescricao}
          onChange={(e) => setCatDescricao(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cat-mod" className={labelClass}>
          Modalidade
        </label>
        <select
          id="cat-mod"
          value={catModalidade}
          onChange={(e) => setCatModalidade(e.target.value)}
          className={inputClass}
        >
          <option value="livre">Livre (qualquer modalidade)</option>
          <option value="embarcado">Embarcado (barco / lancha)</option>
          <option value="caiaque">Caiaque (remo / pedal)</option>
          <option value="barranco_acude">Barranco / açude</option>
        </select>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-bold text-[#f3f4f6]">Ranking</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cat-form" className={labelClass}>
              Fórmula
            </label>
            <select
              id="cat-form"
              value={catFormula}
              onChange={(e) => setCatFormula(e.target.value as FormulaRanking)}
              className={inputClass}
            >
              <option value="soma_top_n">Soma dos N maiores peixes</option>
              <option value="maior_exemplar">Maior exemplar único</option>
              <option value="soma_total">Soma total (sem limite)</option>
              <option value="media_top_n">Média dos N maiores peixes</option>
            </select>
          </div>

          <div>
            <label htmlFor="cat-topn" className={labelClass}>
              Quantidade de peixes (N)
            </label>
            <input
              id="cat-topn"
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              value={catTopN}
              onChange={(e) => setCatTopN(Number(e.target.value))}
              className={`${inputClass} tabular-nums`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cat-des" className={labelClass}>
            Desempate
          </label>
          <select
            id="cat-des"
            value={catDesempate}
            onChange={(e) => setCatDesempate(e.target.value as CriterioDesempate)}
            className={inputClass}
          >
            <option value="maior_peixe">Maior peixe individual</option>
            <option value="captura_mais_antiga">Captura mais antiga</option>
          </select>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-bold text-[#f3f4f6]">Limites</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="cat-min" className={labelClass}>
              Medida mínima ({catUnidade})
            </label>
            <input
              id="cat-min"
              type="number"
              inputMode="decimal"
              step="0.5"
              value={catMinima}
              onChange={(e) => setCatMinima(Number(e.target.value))}
              className={`${inputClass} tabular-nums`}
            />
          </div>

          <div>
            <label htmlFor="cat-agua" className={labelClass}>
              Fora d&apos;água (s)
            </label>
            <input
              id="cat-agua"
              type="number"
              inputMode="numeric"
              value={catTempoAgua}
              onChange={(e) => setCatTempoAgua(Number(e.target.value))}
              className={`${inputClass} tabular-nums`}
            />
          </div>

          <div>
            <label htmlFor="cat-vid" className={labelClass}>
              Vídeo (s)
            </label>
            <input
              id="cat-vid"
              type="number"
              inputMode="numeric"
              value={catTempoVideo}
              onChange={(e) => setCatTempoVideo(Number(e.target.value))}
              className={`${inputClass} tabular-nums`}
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div>
          <label htmlFor="cat-check" className={labelClass}>
            Checklist da arbitragem (um critério por linha)
          </label>
          <textarea
            id="cat-check"
            rows={5}
            value={catChecklistText}
            onChange={(e) => setCatChecklistText(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-transparent p-3.5 text-base text-[#f3f4f6] focus:border-[#e5c158] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="cat-premio" className={labelClass}>
            Premiação do 1º lugar
          </label>
          <input
            id="cat-premio"
            type="text"
            value={catPremio1}
            onChange={(e) => setCatPremio1(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={savingCat}
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#e5c158] px-6 text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60 sm:w-auto"
      >
        {savingCat ? 'Salvando...' : !categoryToEdit ? 'Adicionar categoria' : 'Salvar categoria'}
      </button>
    </form>
  );
}