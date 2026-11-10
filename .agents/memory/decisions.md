# Registro de Decisões Arquiteturais (ADR - Decisions Log)

## Decisão 001: Eliminação da Função `juiz` e Consolidação em `admin`
- **Contexto:** A gestão do torneio exige agilidade na homologação e configuração direta pelo administrador geral sem fricção de múltiplas telas de permissão intermediárias.
- **Decisão:** Unificar a função de arbitragem diretamente no perfil `admin`. A plataforma possui apenas `admin` e `pescador`.
- **Impacto:** Código mais limpo, menos rotas redundantes, regras de autorização transparentes.

## Decisão 002: Administrador Geral Tiago Witeck com WhatsApp do Site
- **Contexto:** O diretor Tiago Witeck precisa de acesso prioritário com credenciais oficiais diretamente vinculadas ao WhatsApp divulgado no site.
- **Decisão:** Cadastrado como `pesc-tiago` com número `5542999162340` (final `2340`), inscrição `#000` (Direção Geral FisgaRank).

## Decisão 003: Autenticação por Tolerância de Sufixo de 8 Dígitos
- **Contexto:** Pescadores frequentemente digitam seu telefone com ou sem DDI 55, com ou sem DDD, com ou sem o 9º dígito.
- **Decisão:** Algoritmo de autenticação SQL faz match exato, match por sufixo de 8 dígitos ou match por contenção, garantindo 100% de sucesso no login móvel em campo.

## Decisão 004: Controle Multivelocidade no Player de Arbitragem
- **Contexto:** A homologação do toque da boca no marco zero e o batimento da cauda na régua exige câmera lenta analítica, enquanto a checagem da soltura pode ser acelerada.
- **Decisão:** Player de vídeo com botões em tempo real para 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x e 3x.

## Decisão 005: Empacotamento Docker e Caddy para Oracle Cloud Always Free
- **Contexto:** Hospedagem em infraestrutura Always Free da Oracle Cloud (computação ARM64 Ampere A1).
- **Decisão:** Construção de `Dockerfile` baseado em Node 22 slim, `docker-compose.yml` com persistência de volumes (`data/` e `public/uploads/`), proxy reverso Caddy com emissão e renovação automática de certificado SSL Let's Encrypt e script de limpeza automática de vídeos com mais de 30 dias (`scripts/cleanup-videos.mjs`).
