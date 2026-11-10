# Memória Arquitetural FisgaRank (Claude-Mem Standard)

## 1. Visão Geral
Plataforma de torneios de pesca esportiva homologada no padrão pesque e solte, com apuração em tempo real por vídeo sem cortes, régua oficial e arbitragem auditada.

## 2. Princípios de Governança (Vibe-Coding Standard)
- **Limite Estrito de Linhas:** `MAX_LINES <= 350` por arquivo em todo o diretório `src/`.
- **4 Costuras Arquiteturais (Seams):**
  1. **Domínio:** Entidades tipadas em `@/types/domain.ts`, regras de pontuação e critérios de desempate.
  2. **UI:** Componentes de apresentação desacoplados com paleta Black & Gold (`#060a13`, `#080c14`, `#e5c158`).
  3. **Infra / IO:** Camada de banco de dados SQLite nativo (`node:sqlite` DatabaseSync), sistema de arquivos e uploads em `public/uploads/`.
  4. **Pure Helpers:** Utilitários puros de formatação, normalização de telefone e cálculos matemáticos.
- **Zero-Warning Burndown:** TypeScript strictly typed (`tsc --noEmit`), zero falhas de lint e zero vulnerabilidades npm audit.

## 3. Banco de Dados e Persistência
- **Engine:** `node:sqlite` (nativo do Node.js 22+, sem compilação de binários nativos no host).
- **Pragmas Obrigatórios:**
  - `PRAGMA journal_mode = DELETE;` (previne bloqueios de concorrência em sistemas de arquivos Windows/SMB/NFS).
  - `PRAGMA foreign_keys = ON;` (garante integridade referencial com cascata).
- **Módulos do Banco (`src/lib/db/`):**
  - `connection.ts`: Instância singleton e diretórios de dados.
  - `schema.ts`: DDL das 8 tabelas de domínio.
  - `seed-data.ts`: Constantes da carga inicial (Temporada Eldorado 2026, admin Tiago Witeck).
  - `seed.ts`: Inicialização idempotente do banco.
  - `mappers.ts`: Conversores tipados entre linhas SQL e modelos TypeScript.
  - `queries.ts`: Operações de leitura (temporadas, etapas, pescadores, registros, rankings).
  - `mutations/temporada.ts`: Operações de escrita em configurações e etapas.
  - `mutations/competicao.ts`: Operações de escrita em competidores, capturas e homologações.
  - `auth.ts`: Autenticação inteligente por sufixo de 8 dígitos de WhatsApp.
  - `ranking.ts`: Motor de pontuação multi-categoria e captura sem corte.
  - `db.ts`: Fachada (facade) que reexporta todos os módulos sem quebrar importações existentes.

## 4. Segurança e Funções de Acesso
- Apenas 2 papéis permitidos: `admin` (gestão e arbitragem) e `pescador` (competidor). O papel `juiz` foi consolidado no `admin`.
- Proteção de rotas em `src/app/painel/admin/layout.tsx` redirecionando usuários sem privilégio.
