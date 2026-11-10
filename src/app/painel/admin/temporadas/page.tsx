'use client';

import React, { useState, useEffect } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Categoria, FormulaRanking, CriterioDesempate } from '@/types/domain';

export default function AdminTemporadasPage() {
  const { temporada, categorias, refresh } = usePainel();

  const [nomeTemp, setNomeTemp] = useState('');
  const [subtituloTemp, setSubtituloTemp] = useState('');
  const [logoUrlTemp, setLogoUrlTemp] = useState('/brand/logo_header.webp');
  const [descontoPct, setDescontoPct] = useState(15);
  const [chavePix, setChavePix] = useState('');
  const [multiCatPeixe, setMultiCatPeixe] = useState(true);
  const [savingTemp, setSavingTemp] = useState(false);

  const [editingCatId, setEditingCatId] = useState<string>('nova');
  const [catNome, setCatNome] = useState('');
  const [catEspecie, setCatEspecie] = useState('');
  const [catDescricao, setCatDescricao] = useState('');
  const [catModalidade, setCatModalidade] = useState('livre');
  const [catUnidade, setCatUnidade] = useState<'cm' | 'kg' | 'pontos'>('cm');
  const [catFormula, setCatFormula] = useState<FormulaRanking>('soma_top_n');
  const [catTopN, setCatTopN] = useState(3);
  const [catDesempate, setCatDesempate] = useState<CriterioDesempate>('maior_peixe');
  const [catMinima, setCatMinima] = useState(35);
  const [catTempoAgua, setCatTempoAgua] = useState(45);
  const [catTempoVideo, setCatTempoVideo] = useState(60);
  const [catChecklistText, setCatChecklistText] = useState('');
  const [catPremio1, setCatPremio1] = useState('Troféu Oficial + Premiação');
  const [savingCat, setSavingCat] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (temporada) {
      setNomeTemp(temporada.nome);
      setSubtituloTemp(temporada.subtitulo);
      setLogoUrlTemp(temporada.logo_url || '/brand/logo_header.webp');
      setDescontoPct(temporada.beneficio_desconto_parceiros_pct);
      setChavePix(temporada.chave_pix_padrao);
      setMultiCatPeixe(temporada.permite_mesmo_peixe_multiplas_categorias);
    }
  }, [temporada]);

  const selectCategoryForEdit = (cat: Categoria | null) => {
    if (!cat) {
      setEditingCatId('nova');
      setCatNome('');
      setCatEspecie('');
      setCatDescricao('');
      setCatModalidade('livre');
      setCatUnidade('cm');
      setCatFormula('soma_top_n');
      setCatTopN(3);
      setCatDesempate('maior_peixe');
      setCatMinima(35);
      setCatTempoAgua(45);
      setCatTempoVideo(60);
      setCatChecklistText(
        [
          'Citou a Palavra-Chave Oficial da etapa de forma audível',
          'Boca fechada encostada no marco zero da régua plana',
          'Foto nítida do exemplar com a isca artificial',
          'Vídeo sem cortes com soltura do peixe vivo',
        ].join('\n')
      );
      setCatPremio1('Troféu Oficial + Kit Patrocinadores');
      return;
    }

    setEditingCatId(cat.id);
    setCatNome(cat.nome);
    setCatEspecie(cat.especie);
    setCatDescricao(cat.descricao_especie);
    setCatModalidade(cat.modalidade);
    setCatUnidade(cat.unidade_medida);
    setCatFormula(cat.formula_ranking);
    setCatTopN(cat.top_n_peixes);
    setCatDesempate(cat.criterio_desempate);
    setCatMinima(cat.medida_minima);
    setCatTempoAgua(cat.tempo_max_fora_agua_seg);
    setCatTempoVideo(cat.tempo_max_video_seg);
    setCatChecklistText(cat.checklist_validacao.join('\n'));
    setCatPremio1(cat.premiacao[0]?.valor_ou_descricao || 'Troféu Oficial');
  };

  useEffect(() => {
    if (categorias.length > 0 && editingCatId === 'nova' && !catNome) {
      selectCategoryForEdit(categorias[0]);
    }
  }, [categorias]);

  const handleSaveTemporada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temporada) return;
    setSavingTemp(true);
    setStatusMsg('');
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
      await refresh();
      setStatusMsg('Parâmetros da temporada salvos com sucesso!');
    } finally {
      setSavingTemp(false);
    }
  };

  const handleSaveCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temporada) return;
    setSavingCat(true);
    setStatusMsg('');
    try {
      const checklistItems = catChecklistText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await fetch('/api/temporada/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCatId === 'nova' ? undefined : editingCatId,
          temporada_id: temporada.id,
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
      await refresh();
      setStatusMsg(`Categoria "${catNome}" gravada com sucesso no banco de dados!`);
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategoria = async (id: string) => {
    await fetch(`/api/temporada/categorias?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await refresh();
    selectCategoryForEdit(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Motor de Configuração da Temporada e Categorias Dinâmicas
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Crie ou altere espécies, modalidades, fórmulas matemáticas de ranking, medidas mínimas e itens do checklist de arbitragem sem precisar alterar uma única linha de código.
        </p>
      </div>

      {statusMsg && (
        <div
          role="status"
          className="rounded-xl bg-emerald-950/90 border border-emerald-800 px-4 py-3 text-sm font-medium text-emerald-200"
        >
          {statusMsg}
        </div>
      )}

      {/* Configuração Geral da Temporada */}
      <form
        onSubmit={handleSaveTemporada}
        className="el-card-gold p-6 space-y-5"
      >
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

      {/* Construtor de Categorias Dinâmicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="el-card overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#060a13]">
            <span className="text-xs font-heading font-semibold text-[#e5c158]">
              Categorias Cadastradas ({categorias.length})
            </span>
            <button
              type="button"
              onClick={() => selectCategoryForEdit(null)}
              className="el-btn-gold h-8 px-3.5 text-xs"
            >
              Nova Categoria
            </button>
          </div>

          <div className="divide-y divide-white/10">
            {categorias.map((cat) => (
              <div
                key={cat.id}
                className={`p-4 flex items-center justify-between gap-2 ${
                  editingCatId === cat.id ? 'bg-[#0c111c] border-l-2 border-[#e5c158]' : 'hover:bg-[#0c111c]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectCategoryForEdit(cat)}
                  className="text-left flex-1 cursor-pointer"
                >
                  <div className="text-sm font-heading font-bold text-[#f3f4f6]">{cat.nome}</div>
                  <div className="text-xs text-[#a1a8b9] mt-0.5 tabular-nums">
                    {cat.especie} • Fórmula: {cat.formula_ranking} ({cat.top_n_peixes}) • Mín.{' '}
                    {cat.medida_minima} {cat.unidade_medida}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategoria(cat.id)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-red-300 hover:bg-red-950 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Paramétrico da Categoria Selecionada */}
        <form
          onSubmit={handleSaveCategoria}
          className="lg:col-span-2 el-card-gold p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-heading font-bold text-[#f3f4f6]">
              {editingCatId === 'nova'
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
              : editingCatId === 'nova'
              ? 'Adicionar Nova Categoria ao Torneio'
              : 'Salvar Alterações da Categoria'}
          </button>
        </form>
      </div>
    </div>
  );
}
