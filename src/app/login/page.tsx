'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Phone, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#060a13] text-[#f3f4f6] flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-[#080c14] border border-[#e5c158]/25 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/brand/logo_header.webp"
            alt="Logo Oficial Eldorado Lake"
            className="h-20 w-auto object-contain mb-4"
          />
          <h1 className="text-2xl font-heading font-bold text-[#f3f4f6] tracking-tight">
            Acesso ao Painel do Torneio
          </h1>
          <p className="text-sm text-[#a1a8b9] mt-1.5">
            Informe seu WhatsApp cadastrado (apenas números) e sua senha de competidor ou administrador.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl bg-red-950/90 border border-red-800 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="whatsapp-input"
              className="block text-sm font-medium text-[#f3f4f6] mb-1.5"
            >
              WhatsApp (somente números)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
              <input
                id="whatsapp-input"
                type="tel"
                value={whatsapp}
                onChange={handleWhatsappChange}
                placeholder="Ex: 55999110001"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#060a13] border border-white/10 text-sm text-[#f3f4f6] placeholder-[#a1a8b9]/50 focus:border-[#e5c158] focus:ring-1 focus:ring-[#e5c158] focus:outline-none transition-colors tabular-nums"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="senha-input"
              className="block text-sm font-medium text-[#f3f4f6] mb-1.5"
            >
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
              <input
                id="senha-input"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha de acesso"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#060a13] border border-white/10 text-sm text-[#f3f4f6] placeholder-[#a1a8b9]/50 focus:border-[#e5c158] focus:ring-1 focus:ring-[#e5c158] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#e5c158] hover:bg-[#cfab44] disabled:opacity-60 text-[#060a13] font-heading font-bold text-sm transition-colors cursor-pointer shadow-md"
          >
            <span>{loading ? 'Entrando...' : 'Entrar no Sistema'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-xs font-semibold text-[#a1a8b9] mb-3 text-center uppercase tracking-wider">
            Acesso Rápido de Teste (1 Clique)
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => quickLogin('5542999162340')}
              disabled={loading}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0d1626] hover:bg-[#121c2e] border border-white/10 hover:border-[#e5c158]/40 text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-[#e5c158]" />
                <div>
                  <div className="font-heading font-semibold text-[#f3f4f6]">Tiago Witeck (Admin Geral)</div>
                  <div className="text-xs text-[#a1a8b9]">Direção do Torneio • WhatsApp: +55 (42) 99916-2340</div>
                </div>
              </div>
              <span className="font-mono text-[#e5c158] font-bold">Entrar →</span>
            </button>

            <button
              type="button"
              onClick={() => quickLogin('55999110001')}
              disabled={loading}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0d1626] hover:bg-[#121c2e] border border-white/10 hover:border-[#e5c158]/40 text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-[#e5c158]" />
                <div>
                  <div className="font-heading font-semibold text-[#f3f4f6]">Lucas Zanardini (Admin)</div>
                  <div className="text-xs text-[#a1a8b9]">Comissão Técnica • WhatsApp: 55999110001</div>
                </div>
              </div>
              <span className="font-mono text-[#e5c158] font-bold">Entrar →</span>
            </button>

            <button
              type="button"
              onClick={() => quickLogin('55999110002')}
              disabled={loading}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0d1626] hover:bg-[#121c2e] border border-white/10 hover:border-[#e5c158]/40 text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-left">
                <UserCheck className="w-4 h-4 text-[#e5c158]" />
                <div>
                  <div className="font-heading font-semibold text-[#f3f4f6]">Competidor Inscrito (Pescador)</div>
                  <div className="text-xs text-[#a1a8b9]">Mateus Oliveira • WhatsApp: 55999110002</div>
                </div>
              </div>
              <span className="font-mono text-[#e5c158] font-bold">Entrar →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
