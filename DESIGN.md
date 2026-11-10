---
colors:
  background: "#060a13"
  surface-card: "#080c14"
  surface-elevated: "#0d1626"
  surface-hover: "#0c111c"
  text-light: "#f3f4f6"
  text-secondary: "#d1d5db"
  text-muted: "#a1a8b9"
  primary-gold: "#e5c158"
  primary-gold-hover: "#cfab44"
  border-gold: "#423922"
  border-light: "#161f30"
  success: "#34d399"
  warning: "#e5c158"
  danger: "#f87171"
typography:
  font-heading: "Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  font-body: "DM Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  size-xs: "0.75rem"
  size-sm: "0.875rem"
  size-base: "1rem"
  size-lg: "1.125rem"
  size-xl: "1.25rem"
  size-2xl: "1.5rem"
  size-3xl: "1.875rem"
  size-4xl: "2.25rem"
rounded:
  none: "0px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button:
    height: "44px"
    padding-x: "22px"
    radius: "50px"
    font-size: "0.9rem"
    font-weight: "600"
  input:
    height: "44px"
    padding-x: "14px"
    radius: "10px"
    background: "#060a13"
    border: "1px solid #161f30"
    font-size: "0.925rem"
  panel:
    radius: "16px"
    background: "#080c14"
    border: "1px solid #161f30"
    padding: "24px"
---

# Design System — Eldorado Lake (Plataforma Oficial de Torneios)

## Overview

Este sistema segue fielmente a identidade visual e a paleta cromática oficial do site da operação **Eldorado Lake** (`C:\Users\User\Desktop\SITE\eldorado-lake\css\style.css`), utilizando o fundo meia-noite profundo `#060a13`, superfícies `#080c14` / `#0d1626`, o dourado champanhe oficial `#e5c158` (`hover: #cfab44`) e textos claros `#f3f4f6` / `#a1a8b9`.

## Colors (Extraídas de `C:\Users\User\Desktop\SITE\eldorado-lake\css\style.css`)

| Token | Valor Oficial | Uso |
|---|---|---|
| `--bg-dark` | `#060a13` | Fundo global da aplicação (`html`, `body`, inputs). |
| `--bg-card` | `rgba(8, 12, 20, 0.92)` (`#080c14`) | Superfície de cartões, tabelas e painéis principais. |
| `--bg-card-hover` | `rgba(12, 17, 28, 0.96)` (`#0c111c`) | Superfície interativa e linhas de tabela em hover. |
| `--bg-header` | `rgba(6, 10, 19, 0.92)` | Top Navbar fixa no topo com `backdrop-filter: blur(12px)`. |
| `--primary-gold` | `#e5c158` | Cor de destaque da marca Eldorado Lake, botões primários (`.el-btn-gold` com texto `#060a13`), sublinhado de navegação ativa e conquistas. |
| `--primary-gold-hover` | `#cfab44` | Hover dos botões dourados e links de destaque. |
| `--text-light` | `#f3f4f6` | Texto principal e títulos. |
| `--text-muted` | `#a1a8b9` | Subtítulos, descrições e rótulos secundários. |
| `--border-gold` | `rgba(229, 193, 88, 0.25)` | Borda sutil dourada para painéis de destaque e cabeçalhos. |
| `--border-light` | `rgba(255, 255, 255, 0.08)` | Borda padrão de cartões, divisórias e tabelas. |

## Typography

- **Títulos e Navegação (`--font-heading`):** `Outfit` (`600`, `700`, `800`), idêntica à fonte de cabeçalhos e navbar de `eldoradolake.com.br`.
- **Corpo, Rótulos, Etapas e Tabelas (`--font-body`):** `DM Sans` (`400`, `500`, `600`, `700`), limpa e humana.
- **Zero `font-mono` (Monospace Proibido):** Códigos de etapa, nomes de etapa (como `1ª Etapa: Abertura de Outono`), palavras-chave (`ELDORADO-OUTONO-26`), números de inscrição (`#001`) e medidas (`84,5 cm`) **não** utilizam fonte monoespaçada de terminal; usam a tipografia principal com `tabular-nums` para alinhamento numérico limpo.

## Top Navbar ("Lá em cima") e Responsividade

- **Navegação Superior Unificada (`header` no topo):**
  - Inspirada diretamente no `#main-header` de `C:\Users\User\Desktop\SITE\eldorado-lake`: logo oficial `logo_header.webp` à esquerda, links horizontais centralizados com indicador inferior dourado (`#e5c158`) para a página ativa, e controles de perfil/ação à direita.
  - Quando o usuário acessa a área de **Arbitragem e Gestão** (`/painel/admin/*`), uma barra horizontal secundária limpa exibe as 7 ferramentas administrativas sem comprimir a largura útil da tela.
  - Em dispositivos móveis e tablets (`< 1024px`), o menu recolhe em um painel deslizante superior acionado pelo botão acessível de menu (`aria-label="Abrir menu de navegação"`).

## Ícones e Acessibilidade

- **Sem Emojis ou Ícones Decorativos Inúteis:** Não utilizar emojis nem espalhar ícones decorativos ao lado de cada título, card de estatística, badge de status ou nome de etapa.
- **Apenas Ícones Funcionais / Acessibilidade:** Manter ícones apenas em controles interativos de navegação/acessibilidade (botão de abrir/fechar menu mobile, seletor de perfil e ação de sair).
