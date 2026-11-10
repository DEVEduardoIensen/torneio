'use client';

import React, { useState, useEffect } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Patrocinador } from '@/types/domain';

export default function AdminPatrocinadoresPage() {
  const { temporada, patrocinadores, refresh } = usePainel();

  const [editingId, setEditingId] = useState<string>('novo');
  const [nome, setNome] = useState('');
  const [cota, setCota] = useState<Patrocinador['cota']>('ouro');
  const [segmento, setSegmento] = useState('');
  const [logoUrl, setLogoUrl] = useState('/brand/logo_header.webp');
  const [whatsappContato, setWhatsappContato] = useState('');
  const [enderecoCidade, setEnderecoCidade] = useState('');
  const [beneficio, setBeneficio] = useState('15% de desconto em compras à vista ou Pix para inscritos.');
  const [premioIsca, setPremioIsca] = useState('');
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

  useEffect(() => {
    if (patrocinadores.length > 0 && editingId === 'novo' && !nome) {
      selectPat(patrocinadores[0]);
    }
  }, [patrocinadores]);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Gestão de Patrocinadores, Descontos e Prêmios de Isca
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Configure as empresas parceiras, o benefício do Passaporte do Competidor e os prêmios especiais por marca.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="el-card overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#060a13]">
            <span className="text-xs font-heading font-semibold text-[#e5c158]">
              Parceiros ({patrocinadores.length})
            </span>
            <button
              type="button"
              onClick={() => selectPat(null)}
              className="el-btn-gold h-8 px-3.5 text-xs"
            >
              Novo Parceiro
            </button>
          </div>

          <div className="divide-y divide-white/10">
            {patrocinadores.map((p) => (
              <div
                key={p.id}
                className={`p-4 flex items-center justify-between gap-2 ${
                  editingId === p.id ? 'bg-[#0c111c] border-l-2 border-[#e5c158]' : 'hover:bg-[#0c111c]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectPat(p)}
                  className="text-left flex-1 cursor-pointer"
                >
                  <div className="text-sm font-heading font-bold text-[#f3f4f6]">{p.nome}</div>
                  <div className="text-xs text-[#e5c158] font-medium mt-0.5">
                    Cota {p.cota} • {p.endereco_cidade}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-red-300 hover:bg-red-950 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="lg:col-span-2 el-card-gold p-6 space-y-4"
        >
          <h2 className="text-lg font-heading font-bold text-[#f3f4f6] border-b border-white/10 pb-3">
            {editingId === 'novo' ? 'Adicionar Patrocinador' : `Editando: ${nome}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="pat-nome" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Nome da Empresa / Marca
              </label>
              <input
                id="pat-nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              />
            </div>

            <div>
              <label htmlFor="pat-cota" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Cota de Patrocínio
              </label>
              <select
                id="pat-cota"
                value={cota}
                onChange={(e) => setCota(e.target.value as Patrocinador['cota'])}
                className="w-full h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              >
                <option value="master">Master</option>
                <option value="ouro">Ouro</option>
                <option value="prata">Prata</option>
                <option value="apoio">Apoio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pat-seg" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Segmento de Atuação
              </label>
              <input
                id="pat-seg"
                type="text"
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              />
            </div>

            <div>
              <label htmlFor="pat-cid" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
                Cidade / UF
              </label>
              <input
                id="pat-cid"
                type="text"
                value={enderecoCidade}
                onChange={(e) => setEnderecoCidade(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pat-ben" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
              Benefício / Desconto para Competidores Inscritos
            </label>
            <input
              id="pat-ben"
              type="text"
              value={beneficio}
              onChange={(e) => setBeneficio(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
            />
          </div>

          <div>
            <label htmlFor="pat-premio" className="block text-xs font-semibold text-[#f3f4f6] mb-1.5">
              Prêmio Especial / Bônus de Captura Completa
            </label>
            <input
              id="pat-premio"
              type="text"
              value={premioIsca}
              onChange={(e) => setPremioIsca(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="el-btn-gold h-11 px-6 text-sm"
          >
            {saving ? 'Salvando...' : 'Salvar Patrocinador'}
          </button>
        </form>
      </div>
    </div>
  );
}
