'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState('5542999162340');
  const [senha, setSenha] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 13);
    setWhatsapp(digitsOnly);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp, senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Credenciais inválidas.');
        setLoading(false);
        return;
      }
      router.push('/painel');
      router.refresh();
    } catch {
      setError('Falha de comunicação com o servidor.');
      setLoading(false);
    }
  };

  const quickLogin = async (phone: string) => {
    setWhatsapp(phone);
    setSenha('123456');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: phone, senha: '123456' }),
      });
      if (res.ok) {
        router.push('/painel');
        router.refresh();
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-white/15 bg-transparent px-3.5 text-base text-[#f3f4f6] placeholder:text-[#a1a8b9]/60 focus:border-[#e5c158] focus:outline-none';

  const testUsers = [
    { phone: '5542999162340', nome: 'Tiago Witeck', papel: 'Admin geral' },
    { phone: '55999110001', nome: 'Lucas Zanardini', papel: 'Admin' },
    { phone: '55999110002', nome: 'Mateus Oliveira', papel: 'Pescador' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#060a13] px-5 py-10 text-[#f3f4f6]">
      <main className="w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo_header.webp"
          alt="Eldorado Lake"
          className="mx-auto mb-6 h-20 w-auto object-contain"
        />
        <h1 className="text-center text-2xl font-bold tracking-tight">Entrar</h1>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-800 bg-red-950/90 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="whatsapp-input" className="mb-1.5 block text-sm font-medium">
              WhatsApp
            </label>
            <input
              id="whatsapp-input"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={whatsapp}
              onChange={handleWhatsappChange}
              placeholder="55999110001"
              required
              className={`${inputClass} tabular-nums`}
            />
          </div>

          <div>
            <label htmlFor="senha-input" className="mb-1.5 block text-sm font-medium">
              Senha
            </label>
            <input
              id="senha-input"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#e5c158] text-base font-bold text-[#060a13] transition-colors hover:bg-[#cfab44] disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </form>

        <section className="mt-10" aria-labelledby="teste-title">
          <h2 id="teste-title" className="text-sm font-medium text-[#a1a8b9]">
            Acesso rápido de teste
          </h2>
          <ul className="mt-1 divide-y divide-white/10 border-y border-white/10">
            {testUsers.map((u) => (
              <li key={u.phone}>
                <button
                  type="button"
                  onClick={() => quickLogin(u.phone)}
                  disabled={loading}
                  className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 text-left hover:text-[#e5c158] disabled:opacity-60"
                >
                  <span className="font-semibold">{u.nome}</span>
                  <span className="text-sm text-[#a1a8b9]">{u.papel}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}