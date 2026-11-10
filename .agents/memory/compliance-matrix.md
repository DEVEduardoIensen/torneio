# Matriz de Conformidade Regulamentar (Spec-to-Code Compliance)

Mapeamento entre o Regulamento Oficial da Temporada Eldorado Lake 2026 e a Implementação de Código em `D:\torneio`.

| Item do Regulamento | Requisito da Especificação | Implementação no Código | Status de Conformidade |
|:---|:---|:---|:---:|
| **Art. 1 - Papéis e Acessos** | Simplificação operacional: apenas `admin` e `pescador`. | `src/types/domain.ts`, `src/app/painel/admin/layout.tsx` | CONFORME |
| **Art. 2 - Autenticação** | Login por WhatsApp com tolerância a formatos com/sem DDI e 9º dígito. | `src/lib/db/auth.ts` (`authenticatePescador` c/ match de sufixo de 8 dígitos) | CONFORME |
| **Art. 3 - Fórmulas de Apuração** | Suporte dinâmico a `soma_top_n`, `maior_exemplar`, `media_top_n`. | `src/lib/db/ranking.ts` (`computeCategoryRanking`) | CONFORME |
| **Art. 4 - Critérios de Desempate** | Desempate por `maior_peixe` e `captura_mais_antiga`. | `src/lib/db/ranking.ts` (`entries.sort`) | CONFORME |
| **Art. 5 - Premiação Especial** | Troféu para Maior Captura Completa sem Corte (Fisgada + Medição + Soltura). | `src/lib/db/ranking.ts` (`capturasCompletasSemCorte`) | CONFORME |
| **Art. 6 - Palavra-Chave da Etapa** | Revelação parametrizável por etapa e validação obrigatória. | `src/types/domain.ts` (`revelar_palavra_chave`), `src/components/admin/VideoInspectionPlayer.tsx` | CONFORME |
| **Art. 7 - Mesa de Arbitragem** | Inspeção de vídeo em câmera lenta (0.25x, 0.5x, 0.75x) e avanço rápido (1.25x a 3x). | `src/components/admin/VideoInspectionPlayer.tsx` | CONFORME |
| **Art. 8 - Multi-Categorias** | Possibilidade de inscrever o mesmo exemplar em múltiplas categorias compatíveis. | `temporadas.permite_mesmo_peixe_multiplas_categorias` | CONFORME |
| **Art. 9 - Governança Vibe-Coding** | Todos os arquivos `<= 350` linhas com 4 costuras arquiteturais. | 100% dos arquivos em `src/` auditados e validados | CONFORME |
| **Art. 10 - Supply Chain Risk** | Zero vulnerabilidades de segurança em dependências. | `npm audit` com zero vulnerabilidades | CONFORME |
