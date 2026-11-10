# 🚀 Guia de Deploy Oficial — FisgaRank na Oracle Cloud Always Free

Este guia contém o passo a passo exato para colocar o **FisgaRank** no ar na **Oracle Cloud**, aproveitando os recursos **Always Free** (vitalícios e gratuitos):
- **4 OCPUs ARM64** (Ampere A1)
- **24 GB de Memória RAM**
- **200 GB de Disco NVMe** de altíssima velocidade
- **Custo: R$ 0,00 / mês**

---

## 📋 1. Criando a Máquina Virtual na Oracle Cloud Console

1. Acesse o console da Oracle Cloud e no menu principal clique em **Compute** > **Instances** > **Create Instance**.
2. **Nome da Instância:** `fisgarank-server`
3. **Image and Shape:**
   - Clique em **Change Image** e selecione: **Canonical Ubuntu 24.04 LTS** (ou 22.04 LTS).
   - Clique em **Change Shape**:
     - Selecione **Ampere (ARM Processor)**.
     - Escolha a VM **VM.Standard.A1.Flex**.
     - Arraste a barra para: **4 OCPUs** e **24 GB de Memória** (limite Always Free total).
4. **Networking:**
   - Deixe na VCN padrão e certifique-se de marcar: **Assign a public IPv4 address: Yes**.
5. **Add SSH Keys:**
   - Selecione **Generate a key pair for me** e clique em **Save private key** (salve o arquivo `.key` no seu computador com cuidado).
6. **Boot Volume:**
   - Especifique o tamanho personalizado de **200 GB** (incluso na cota Always Free).
7. Clique em **Create**. Em 1 a 2 minutos a instância estará **RUNNING** com um **Public IP** atribuído.

---

## 🛡️ 2. Liberando as Portas de Internet (Security List)

Para que o site responda na internet, libere o tráfego HTTP e HTTPS na Oracle:
1. Na página da sua Instância, clique na sua **Subnet** (em Primary VNIC).
2. Clique na **Default Security List**.
3. Clique em **Add Ingress Rules**:
   - **Source CIDR:** `0.0.0.0/0`
   - **IP Protocol:** `TCP`
   - **Destination Port Range:** `80,443,3000`
   - **Description:** `Acesso Web FisgaRank HTTP e HTTPS`
4. Clique em **Add Ingress Rules**.

---

## 💻 3. Conectando na Máquina via Terminal

No seu computador Windows, abra o PowerShell e conecte via SSH:

```powershell
ssh -i "C:\caminho\para\sua_chave_privada.key" ubuntu@IP_PUBLICO_DA_ORACLE
```

---

## ⚡ 4. Instalação com 1 Comando (Automática)

Dentro do servidor Ubuntu, faça o upload dos arquivos ou clone o repositório em uma pasta `/var/www/fisgarank` e execute o script de instalação automática:

```bash
# Permissão de execução no script
chmod +x scripts/setup-oracle.sh

# Rodar o instalador automatizado
sudo bash scripts/setup-oracle.sh
```

### O que este script faz automaticamente:
1. Atualiza o Ubuntu e instala **Docker Engine** e **Docker Compose**.
2. Destrava o `iptables` interno da Oracle Cloud para aceitar conexões públicas nas portas **80**, **443** e **3000**.
3. Sobe o contêiner do **FisgaRank (Next.js)** e o **Caddy Web Server**.
4. Configura o agendador **cron semanal** para rodar o script de retenção de vídeos (`cleanup-videos.mjs`).

---

## 🌐 5. Apontando o Domínio no Registro.br (`fisgarank.com.br`)

No painel de controle do **Registro.br**:
1. Acesse a gestão de DNS do domínio `fisgarank.com.br`.
2. Adicione os seguintes apontamentos:
   - **Tipo A**: Deixe o nome em branco (`@`) e coloque o **IP Público da sua VM na Oracle**.
   - **Tipo CNAME**: Nome `www` apontando para `fisgarank.com.br`.
3. Assim que o DNS propagar, o Caddy emitirá e renovará **certificados SSL Let's Encrypt 100% grátis e automáticos** para `https://fisgarank.com.br`.

---

## 🧹 6. Como Funciona a Retenção Automática de Vídeos

Para garantir que os 200 GB da Oracle nunca lotem mesmo com dezenas de torneios e milhares de vídeos gravados:
- O script `scripts/cleanup-videos.mjs` roda todo **domingo às 03:00 da manhã**.
- Ele identifica torneios/etapas encerradas há mais de **30 dias**.
- Apaga os arquivos pesados de vídeo (`.mp4`) do disco.
- **Preserva 100% dos dados da competição no banco SQLite**:
  - Classificação geral e por categoria
  - Pontuações e maiores exemplares
  - Iscas e modelos utilizados
  - Troféus e prêmios conquistados
  - Foto nítida da isca (arquivos leves em KB para histórico visual permanente)

---

## 👥 Acessos Administrativos Padrão

- **Tiago Witeck (Admin Geral)**: WhatsApp `5542999162340` (+55 42 99916-2340) / Senha: `123456`
- **Lucas Zanardini (Admin)**: WhatsApp `55999110001` / Senha: `123456`
- **Competidor Pescador**: WhatsApp `55999440004` (Diego Belmonte) / Senha: `123456`

