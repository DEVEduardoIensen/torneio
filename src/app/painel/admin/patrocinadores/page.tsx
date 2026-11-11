'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Patrocinador } from '@/types/domain';

const inputClass =
  'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';

export default function AdminPatrocinadoresPage() {
  const { temporada, patrocinadores, refresh } = usePainel();
  const initial = patrocinadores[0];

  const [editingId, setEditingId] = useState<string>(initial?.id || 'novo');
  const [nome, setNome] = useState(initial?.nome || '');
  const [cota, setCota] = useState<Patrocinador['cota']>(initial?.cota || 'ouro');
  const [segmento, setSegmento] = useState(initial?.segmento || '');
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url || '/brand/logo_header.webp');
  const [whatsappContato, setWhatsappContato] = useState(initial?.whatsapp_contato || '');
  const [enderecoCidade, setEnderecoCidade] = useState(initial?.endereco_cidade || '');
  const [beneficio, setBeneficio] = useState(
    initial?.beneficio_competidor || '15% de desconto em compras à vista ou Pix para inscritos.'
  );
  const [premioIsca, setPremioIsca] = useState(initial?.premio_especial_isca || '');
  const [saving, setSaving] = useState(false);

  const selectPat = (p: Patrocinador | null) => {
    if (!p) {
      setEditingId('novo');
      setNome('');
      setCota('ouro');
      setSegmento('');
      setLogoUrl('/brand/logo_header.webp');
      setWhatsappContato('');
      setEnderecoCidade('');
      setBeneficio('15% de desconto em compras à vista ou Pix para inscritos.');
      setPremioIsca('');
      return;
    }
    setEditingId(p.id);
    setNome(p.nome);
    setCota(p.cota);
    setSegmento(p.segmento);
    setLogoUrl(p.logo_url);
    setWhatsappContato(p.whatsapp_contato);
    setEnderecoCidade(p.endereco_cidade);
    setBeneficio(p.beneficio_competidor);
    setPremioIsca(p.premio_especial_isca);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temporada) return;
    setSaving(true);
    try {
      await fetch('/api/patrocinadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId === 'novo' ? undefined : editingId,
          temporada_id: temporada.id,
          nome,
          cota,
          segmento,
          logo_url: logoUrl,
          whatsapp_contato: whatsappContato,
          endereco_cidade: enderecoCidade,
          beneficio_competidor: beneficio,
          premio_especial_isca: premioIsca,
        }),
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/patrocinadores?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await refresh();
    selectPat(null);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Patrocinadores</h1>
        <button
          type="button"
          onClick={() => selectPat(null)}
          className="h-12 px-2 text-base font-semibold text-[#e5c158] hover:text-[#cfab44] cursor-pointer"
        >
          Novo patrocinador
        </button>
      </div>

      <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
        {patrocinadores.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => selectPat(p)}
              aria-current={editingId === p.id}
              className="min-h-14 flex-1 py-2 text-left cursor-pointer"
            >
              <span
                className={`block text-base font-semibold ${
                  editingId === p.id ? 'text-[#e5c158]' : 'text-[#f3f4f6]'
                }`}
              >
                {p.nome}
              </span>
              <span className="block text-sm text-[#a1a8b9]">
                <span className="capitalize">{p.cota}</span> · {p.endereco_cidade}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleDelete(p.id)}
              className="h-12 px-2 text-sm font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSave}
        className="mt-8 max-w-xl space-y-5 border-t border-white/10 pt-6"
      >
        <h2 className="text-lg font-bold text-[#f3f4f6]">
          {editingId === 'novo' ? 'Novo patrocinador' : `Editar: ${nome}`}
        </h2>

        <div>
          <label htmlFor="pat-nome" className={labelClass}>
            Nome da empresa
          </label>
          <input
            id="pat-nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pat-cota" className={labelClass}>
            Cota
          </label>
          <select
            id="pat-cota"
            value={cota}
            onChange={(e) => setCota(e.target.value as Patrocinador['cota'])}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="master">Master</option>
            <option value="ouro">Ouro</option>
            <option value="prata">Prata</option>
            <option value="apoio">Apoio</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="pat-seg" className={labelClass}>
              Segmento
            </label>
            <input
              id="pat-seg"
              type="text"
              value={segmento}
              onChange={(e) => setSegmento(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="pat-cid" className={labelClass}>
              Cidade / UF
            </label>
            <input
              id="pat-cid"
              type="text"
              value={enderecoCidade}
              onChange={(e) => setEnderecoCidade(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pat-ben" className={labelClass}>
            Benefício para inscritos
          </label>
          <input
            id="pat-ben"
            type="text"
            value={beneficio}
            onChange={(e) => setBeneficio(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pat-premio" className={labelClass}>
            Prêmio especial
          </label>
          <input
            id="pat-premio"
            type="text"
            value={premioIsca}
            onChange={(e) => setPremioIsca(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#e5c158] text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar patrocinador'}
        </button>
      </form>
    </div>
  );
}
