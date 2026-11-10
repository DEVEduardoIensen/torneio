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

  return (
    <form onSubmit={handleSaveCategoria} className="lg:col-span-2 el-card-gold p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
          {!categoryToEdit
            ? 'Criar Nova Categoria Dinâmica'
            : `Editando Categoria: ${catNome}`}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cat-nome" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Nome da Categoria
          </label>
          <input
            id="cat-nome"
            type="text"
            required
            value={catNome}
            onChange={(e) => setCatNome(e.target.value)}
            placeholder="Ex: Dourado Rei do Rio ou Tucunaré Embarcado"
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          />
        </div>

        <div>
          <label htmlFor="cat-esp" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Espécie Alvo
          </label>
          <input
            id="cat-esp"
            type="text"
            required
            value={catEspecie}
            onChange={(e) => setCatEspecie(e.target.value)}
            placeholder="Ex: Dourado (Salminus brasiliensis)"
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cat-desc" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
          Descrição e Regras Específicas da Espécie/Modalidade
        </label>
        <input
          id="cat-desc"
          type="text"
          value={catDescricao}
          onChange={(e) => setCatDescricao(e.target.value)}
          className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="cat-mod" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Modalidade
          </label>
          <select
            id="cat-mod"
            value={catModalidade}
            onChange={(e) => setCatModalidade(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          >
            <option value="livre">Livre (Qualquer modalidade)</option>
            <option value="embarcado">Embarcado (Barco / Lancha)</option>
            <option value="caiaque">Caiaque (Remo / Pedal)</option>
            <option value="barranco_acude">Barranco / Açude</option>
          </select>
        </div>

        <div>
          <label htmlFor="cat-form" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Fórmula Matemática do Ranking
          </label>
          <select
            id="cat-form"
            value={catFormula}
            onChange={(e) => setCatFormula(e.target.value as FormulaRanking)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          >
            <option value="soma_top_n">Soma dos N Maiores Peixes</option>
            <option value="maior_exemplar">Maior Exemplar Único</option>
            <option value="soma_total">Soma Total (Sem limite)</option>
            <option value="media_top_n">Média dos N Maiores Peixes</option>
          </select>
        </div>

        <div>
          <label htmlFor="cat-topn" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Quantidade N de Peixes (Top N)
          </label>
          <input
            id="cat-topn"
            type="number"
            min={1}
            max={50}
            value={catTopN}
            onChange={(e) => setCatTopN(Number(e.target.value))}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label htmlFor="cat-min" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Medida Mínima ({catUnidade})
          </label>
          <input
            id="cat-min"
            type="number"
            step="0.5"
            value={catMinima}
            onChange={(e) => setCatMinima(Number(e.target.value))}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="cat-des" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Desempate
          </label>
          <select
            id="cat-des"
            value={catDesempate}
            onChange={(e) => setCatDesempate(e.target.value as CriterioDesempate)}
            className="w-full h-11 px-3 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          >
            <option value="maior_peixe">Maior Peixe Individual</option>
            <option value="captura_mais_antiga">Captura Mais Antiga</option>
          </select>
        </div>

        <div>
          <label htmlFor="cat-agua" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Máx. Fora d&apos;Água (s)
          </label>
          <input
            id="cat-agua"
            type="number"
            value={catTempoAgua}
            onChange={(e) => setCatTempoAgua(Number(e.target.value))}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="cat-vid" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
            Máx. Vídeo (s)
          </label>
          <input
            id="cat-vid"
            type="number"
            value={catTempoVideo}
            onChange={(e) => setCatTempoVideo(Number(e.target.value))}
            className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cat-check" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
          Checklist de Validação da Mesa de Arbitragem (1 critério por linha)
        </label>
        <textarea
          id="cat-check"
          rows={4}
          value={catChecklistText}
          onChange={(e) => setCatChecklistText(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-[#060a13] border border-white/15 text-xs text-[#f3f4f6]"
        />
      </div>

      <div>
        <label htmlFor="cat-premio" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
          Premiação Principal da Categoria
        </label>
        <input
          id="cat-premio"
          type="text"
          value={catPremio1}
          onChange={(e) => setCatPremio1(e.target.value)}
          className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
        />
      </div>

      <button
        type="submit"
        disabled={savingCat}
        className="el-btn-gold h-11 px-6 text-sm"
      >
        {savingCat
          ? 'Gravando Categoria...'
          : !categoryToEdit
          ? 'Adicionar Nova Categoria ao Torneio'
          : 'Salvar Alterações da Categoria'}
      </button>
    </form>
  );
}
