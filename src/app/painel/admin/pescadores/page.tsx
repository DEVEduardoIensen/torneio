'use client';

import React, { useState } from 'react';
import { usePainel } from '@/components/PainelContext';
import { Pescador, UserRole } from '@/types/domain';

const inputClass =
  'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-[#f3f4f6]';

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
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[#f3f4f6] tracking-tight">Pescadores</h1>

      <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
        {pescadores.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#f3f4f6]">
                <span className="tabular-nums text-[#e5c158]">{p.numero_inscricao || 'S/N'}</span>{' '}
                {p.nome}
              </p>
              <p className="truncate text-sm text-[#a1a8b9]">
                <span className="tabular-nums">{p.whatsapp}</span> · {p.cidade_uf} · {p.equipe}
              </p>
            </div>
            <select
              aria-label={`Papel de ${p.nome}`}
              value={p.role}
              onChange={(e) => handleChangeRole(p, e.target.value as UserRole)}
              className="h-12 shrink-0 cursor-pointer rounded-xl border border-white/15 bg-transparent px-3 text-base text-[#f3f4f6] focus:border-[#e5c158] focus:outline-none"
            >
              <option value="pescador">pescador</option>
              <option value="admin">admin</option>
            </select>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreate} className="mt-8 max-w-xl space-y-5 border-t border-white/10 pt-6">
        <h2 className="text-lg font-bold text-[#f3f4f6]">Novo pescador</h2>

        <div>
          <label htmlFor="pes-nome" className={labelClass}>
            Nome completo
          </label>
          <input
            id="pes-nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pes-whats" className={labelClass}>
            WhatsApp
          </label>
          <input
            id="pes-whats"
            type="tel"
            inputMode="numeric"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
            placeholder="Somente números"
            className={`${inputClass} tabular-nums`}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="pes-cid" className={labelClass}>
              Cidade / UF
            </label>
            <input
              id="pes-cid"
              type="text"
              value={cidadeUf}
              onChange={(e) => setCidadeUf(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="pes-equipe" className={labelClass}>
              Equipe
            </label>
            <input
              id="pes-equipe"
              type="text"
              value={equipe}
              onChange={(e) => setEquipe(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pes-role" className={labelClass}>
            Papel
          </label>
          <select
            id="pes-role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="pescador">Pescador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#e5c158] text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60"
        >
          {saving ? 'Cadastrando...' : 'Cadastrar e inscrever'}
        </button>
      </form>
    </div>
  );
}
