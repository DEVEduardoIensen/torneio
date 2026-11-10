# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16.4 (App Router, Turbopack, TypeScript 5), Tailwind CSS v4, Lucide React (ícones vetoriais SVG), Arquitetura Local-First com repositório adaptável (IndexedDB / LocalStorage em modo desconectado + Supabase Postgres/Auth/Storage via `@supabase/ssr` quando conectado).

## Users

1. **Pescador Competidor (`pescador`):** Acessa pelo smartphone (PWA instalado na tela inicial) no barco, caiaque, barranco ou em casa. Precisa consultar a etapa ativa e sua palavra-chave de validação, realizar sua inscrição, enviar registros de captura (foto com a isca + vídeo único de medição na régua e soltura), acompanhar o parecer da arbitragem e consultar sua posição no ranking por categoria.
2. **Árbitro / Fiscal (`juiz`):** Opera na mesa de validação (`/painel/admin/registros`). Analisa a fila de capturas pendentes assistindo ao vídeo de medição/soltura e inspecionando a foto da régua, confere os requisitos configurados na categoria (boca no zero, régua legível, palavra-chave falada, tempo limite, identificação de espécie) e aprova (com eventual ajuste fino de medida em cm) ou reprova com motivo técnico auditável.
3. **Organizador / Administrador (`admin`):** Configura e opera toda a plataforma sem depender de alterações de código (`/painel/admin/*`): cria temporadas, define regras matemáticas de pontuação e desempate, cria categorias e espécies com critérios próprios de validação, agenda etapas e palavras-chave, gerencia inscrições e pagamentos, administra pescadores/fiscais, cadastra patrocinadores/cupons de desconto e publica comunicados.

## Product Purpose

Plataforma web/PWA multi-temporada e multi-etapa para gestão completa de torneios, rankings e ligas de pesca esportiva (modalidade pesque e solte). Substitui controles manuais em planilhas e grupos de WhatsApp por um fluxo auditável de inscrição, submissão de mídia comprobatória, arbitragem técnica e apuração automática de resultados em tempo real.

## Positioning

Diferente de sistemas engessados feitos para um único regulamento fixo, a plataforma desacopla completamente o motor de competição das regras de cada evento: temporadas, etapas, categorias, espécies, exigências de validação de vídeo e fórmulas de pontuação (soma dos $N$ maiores peixes, soma total, maior exemplar, bônus de consumo local ou isca patrocinada) são 100% parametrizáveis pelo organizador no painel administrativo.

## Operating Context

- Uso frequente em ambientes externos (rios, represas, lagos e pousadas) sob luz solar intensa ou baixa luminosidade, exigindo alto contraste (WCAG AA ≥ 4.5:1) e alvos de toque de no mínimo 44×44px.
- O vídeo de medição e soltura é gravado pelo pescador no aplicativo de câmera nativo do celular e enviado pela plataforma (`/painel/registros`). **Escopo explícito:** este sistema não é um aplicativo de câmera de ação ("GoPro"); ele recebe, valida e classifica os registros do torneio.
- O login principal utiliza o número de WhatsApp (DDD + dígitos, somente números) e senha, refletindo a identidade real dos pescadores nos grupos oficiais da competição.

## Capabilities and Constraints

- **Arquitetura Desengessada (Zero Hardcoding de Regras):**
  - **Temporadas (`Temporada`):** Múltiplas temporadas simultâneas ou históricas; cada temporada define seu regulamento, logo, período e parâmetros de cálculo de ranking.
  - **Categorias Dinâmicas (`Categoria`):** Criadas livremente por temporada (ex.: Dourado Geral, Dourado Caiaque, Traíra Embarcado, Traíra Açude/Barranco, Tucunaré, Duplas, Individual), cada uma com espécie-alvo, modalidade, medida mínima em cm, fórmula de pontuação (`soma_top_n`, `maior_unico`, `soma_total`), quantidade $N$ de peixes computados (ex.: Top 3, Top 5), critério de desempate, premiações e checklist específico de arbitragem.
  - **Etapas (`Etapa`):** Cada temporada possui uma ou mais etapas com local, datas de início/término, palavra-chave de validação (ocultável até a liberação oficial), taxa de inscrição e status operacional.
  - **Inscrições (`Inscricao`):** Controle de número de inscrição sequencial (`#001`, `#002`...), status financeiro (`pendente`, `confirmada`, `cancelada`), vínculo com temporada/etapa e permissão configurável para competir em múltiplas categorias com capturas distintas.
  - **Registros de Captura (`Registro`):** Submissão vinculada a Temporada + Etapa + Categoria + Pescador, contendo foto(s), vídeo de medição/soltura, medida declarada (`cm`), isca utilizada (marca/modelo para concorrer a prêmios de patrocinadores), flag de "Captura Completa" (fisgada + medição + soltura sem corte) e histórico de auditoria do juiz.
  - **Patrocinadores e Incentivo Local (`Patrocinador`):** Gestão de cotas (`Master`, `Ouro`, `Prata`, `Apoio`), benefícios/descontos para inscritos (ex.: 15% OFF na loja parceira) e programa de pontuação/sorteios do comércio local.
- **Mapa de Rotas Oficial (Fiel à Engenharia Reversa de `torneiodepesca.app.br`):**
  - Autenticação: `/login`
  - Área do Pescador: `/painel`, `/painel/etapas`, `/painel/inscricoes`, `/painel/registros`, `/painel/ranking`, `/painel/patrocinadores`, `/painel/pescadores/[id]`
  - Área Administrativa e Arbitragem: `/painel/admin/temporadas`, `/painel/admin/etapas`, `/painel/admin/inscricoes`, `/painel/admin/pescadores`, `/painel/admin/registros`, `/painel/admin/patrocinadores`, `/painel/admin/notificacao`
  - Rotas de API REST: `/api/temporada`, `/api/temporada/categorias`, `/api/etapas`, `/api/inscricao`, `/api/registros`, `/api/patrocinadores`, `/api/notificacao`

## Brand Commitments

- Identidade visual ancorada na engenharia reversa de `torneiodepesca.app.br`: superfícies escuras profundas (`gray-950` `#030712`), containers náuticos sóbrios (`sky-950` `#082f49` com bordas `gray-800`/`gray-900`), ações primárias em verde sólido de alto contraste (`green-700` `#15803d`), tipografia `Inter` com numerais tabulares (`tabular-nums`).
- Proibição estrita de emojis decorativos na interface, textos em gradiente, brilhos neon (`dark-glow`), cards aninhados (`nested-cards`) e bordas laterais grossas (`border-l-4`).

## Evidence on Hand

- HTML, CSS (`/_next/static/css/78bab80d1e862a09.css`), `manifest.json` e chunks JS (`/_next/static/chunks/app/login/page-7653db357eb6c52e.js`, `_buildManifest.js`) extraídos de `https://torneiodepesca.app.br/`.
- Documentos reais de regras de negócio: `REGULAMENTO RANKING ELDORADO PESCA 2026.docx`, `RANKING ELDORADO PESCA.rtf`, `projeto liga de pesca.rtf` e `regras torneio.rtf` (usados como **seed inicial configurável** do banco de dados, nunca como constantes fixas no código).

## Product Principles

1. **Configuração acima de código:** Nenhuma regra de campeonato, categoria, espécie, palavra-chave, premiação ou fórmula de ranking pode ser escrita de forma fixa nos componentes React. Tudo vem do estado/banco da temporada e pode ser editado em `/painel/admin/*`.
2. **Familiaridade operacional (Modo Operate):** A interface deve desaparecer na tarefa. Tabelas densas e legíveis para ranking e inscrições, formulários diretos com labels visíveis, estados claros (`pendente`, `aprovado`, `reprovado`) e navegação previsível entre `/painel/*` e `/painel/admin/*`.
3. **Rigor na validação esportiva:** O fluxo de arbitragem garante que cada peixe aprovado cumpra os critérios configurados para sua categoria, preservando a credibilidade do torneio e a sobrevivência do peixe no pesque e solte.

## Accessibility & Inclusion

- Conformidade WCAG 2.1 AA: contraste mínimo de 4.5:1 para todo texto funcional e 3:1 para títulos grandes.
- Piso tipográfico absoluto de 12px (`0.75rem`) para metadados/badges e 14px–16px (`0.875rem`–`1rem`) para corpo de texto e controles.
- Áreas de toque mínimas de 44×44px em controles móveis e foco de teclado visível em todos os elementos interativos.

