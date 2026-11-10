#!/bin/bash
# ==============================================================================
# FisgaRank — Script Automatizado de Instalação e Deploy (Oracle Cloud Always Free)
# Sistema Operacional Alvo: Ubuntu 24.04 LTS (ARM64 Ampere A1 ou AMD64)
# ==============================================================================

set -e

echo "=========================================================="
echo "   Iniciando Instalação do FisgaRank na Oracle Cloud...   "
echo "=========================================================="

# 1. Verifica permissões de root
if [ "$EUID" -ne 0 ]; then
  echo "[ERRO] Execute este script como root ou usando sudo: sudo bash scripts/setup-oracle.sh"
  exit 1
fi

# 2. Atualização dos pacotes do sistema
echo "[1/6] Atualizando pacotes do sistema Ubuntu..."
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release iptables-persistent cron

# 3. Liberação de portas no Firewall da Oracle Cloud (iptables interno)
# NOTA CRÍTICA DA ORACLE CLOUD:
# Imagens Ubuntu da Oracle possuem regras restritivas no iptables nativo que bloqueiam
# conexões externas na porta 80 e 443 mesmo após abrir na Security List da console.
echo "[2/6] Configurando regras de firewall para portas 80 (HTTP) e 443 (HTTPS)..."
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT 2>/dev/null || iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT 2>/dev/null || iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT 2>/dev/null || iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
netfilter-persistent save || true

# 4. Instalação do Docker e Docker Compose
if ! command -v docker &> /dev/null; then
  echo "[3/6] Instalando Docker Engine oficial..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable docker
  systemctl start docker
  echo "[OK] Docker instalado com sucesso."
else
  echo "[3/6] Docker já está instalado."
fi

# 5. Criação e permissão dos diretórios de dados persistentes
echo "[4/6] Configurando diretórios de persistência do banco e uploads..."
mkdir -p data public/uploads
chmod -R 775 data public/uploads

# 6. Agendamento da Retenção Automática de Vídeos (Cron Semanal)
echo "[5/6] Configurando política de limpeza de vídeos (retenção de 30 dias)..."
CRON_JOB="0 3 * * 0 docker exec fisgarank_app node scripts/cleanup-videos.mjs >> /var/log/fisgarank-purge.log 2>&1"
(crontab -l 2>/dev/null | grep -F -v "cleanup-videos.mjs" ; echo "$CRON_JOB") | crontab -
echo "[OK] Cron configurado: execução todo domingo às 03:00 da manhã."

# 7. Build e Inicialização dos Contêineres (Next.js + Caddy HTTPS)
echo "[6/6] Compilando e iniciando a aplicação FisgaRank via Docker Compose..."
docker compose down || true
docker compose up -d --build

echo ""
echo "=========================================================="
echo "   FisgaRank instalado e rodando com sucesso!             "
echo "=========================================================="
echo "Status dos contêineres:"
docker compose ps
echo ""
echo "Acesse seu servidor pelo IP público da Oracle Cloud na porta 80/443:"
echo "http://$(curl -s ifconfig.me 2>/dev/null || echo 'SEU_IP_PUBLICO')"
echo "=========================================================="

