'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Pescador, UserRole } from '@/types/domain';

export default function AdminPescadoresPage() {
  const { temporada, pescadores, refresh } = usePainel();

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidadeUf, setCidadeUf] = useState('');
  const [equipe, setEquipe] = useState('');
  const [role, setRole] = useState<UserRole>('pescador');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temporada) return;
    setSaving(true);
    try {
      const res = await fetch('/api/pescadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          whatsapp: whatsapp.replace(/\D/g, ''),
          cidade_uf: cidadeUf,
          equipe,
          role,
        }),
      });
      const data = await res.json();
      if (res.ok && data.pescador) {
        await fetch('/api/inscricao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            temporada_id: temporada.id,
            pescador_id: data.pescador.id,
            modalidade_principal: 'livre',
            status_pagamento: 'pago',
          }),
        });
      }
      setNome('');
      setWhatsapp('');
      setCidadeUf('');
      setEquipe('');
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleChangeRole = async (p: Pescador, newRole: UserRole) => {
    await fetch('/api/pescadores', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...p,
        role: newRole,
      }),
    });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
          Cadastro de Competidores e Administradores
        </h1>
        <p className="text-sm text-[#a1a8b9] mt-1">
          Adicione novos competidores ou defina permissões de administração do torneio.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="el-card-gold p-6 space-y-4"
      >
        <h2 className="text-base font-heading font-bold text-[#f3f4f6]">
          Cadastrar Novo Participante (Com Inscrição Automática)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className="h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          />
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
            placeholder="WhatsApp (números)"
            className="h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6] tabular-nums"
          />
          <input
            type="text"
            value={cidadeUf}
            onChange={(e) => setCidadeUf(e.target.value)}
            placeholder="Cidade - UF"
            className="h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          />
          <input
            type="text"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            placeholder="Equipe"
            className="h-11 px-4 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="h-11 px-3.5 rounded-xl bg-[#060a13] border border-white/15 text-sm text-[#f3f4f6]"
          >
            <option value="pescador">Pescador Competidor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="el-btn-gold h-11 px-6 text-xs"
        >
          {saving ? 'Cadastrando...' : 'Cadastrar e Gerar Inscrição'}
        </button>
      </form>

      <div className="el-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#060a13] text-xs font-heading font-semibold text-[#a1a8b9]">
                <th scope="col" className="py-3.5 px-4">Inscrição</th>
                <th scope="col" className="py-3.5 px-4">Nome</th>
                <th scope="col" className="py-3.5 px-4">WhatsApp</th>
                <th scope="col" className="py-3.5 px-4">Cidade / Equipe</th>
                <th scope="col" className="py-3.5 px-4 text-right">Nível de Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {pescadores.map((p) => (
                <tr key={p.id} className="hover:bg-[#0c111c]">
                  <td className="py-3.5 px-4 font-heading font-bold text-[#e5c158] tabular-nums">
                    {p.numero_inscricao || 'S/N'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#f3f4f6]">{p.nome}</td>
                  <td className="py-3.5 px-4 text-xs text-[#a1a8b9] tabular-nums">
                    {p.whatsapp}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#a1a8b9]">
                    {p.cidade_uf} • {p.equipe}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      aria-label={`Papel de ${p.nome}`}
                      value={p.role}
                      onChange={(e) => handleChangeRole(p, e.target.value as UserRole)}
                      className="h-9 px-3 rounded-xl bg-[#060a13] border border-white/15 text-xs text-[#f3f4f6]"
                    >
                      <option value="pescador">pescador</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
