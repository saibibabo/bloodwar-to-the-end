#!/bin/bash
# ============================================================
# Blood War to the End — 一键部署脚本
# 域名: fomopg.fun  |  服务器: 136.116.54.112
# 用法: bash deploy.sh
# ============================================================
set -e

DOMAIN="fomopg.fun"
PROJECT_DIR="/home/zonghongjin7/bloodwar"
EMAIL="hongjin7@proton.me"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "=========================================="
echo "  Blood War to the End — 上线部署"
echo "  域名: https://$DOMAIN"
echo "=========================================="
echo ""

# ── Step 1: 系统更新 & 依赖 ──────────────────────────────────
info "Step 1/6: 更新系统..."
sudo apt-get update -qq
sudo apt-get install -y -qq curl wget git certbot ufw

# ── Step 2: 安装 Docker ──────────────────────────────────────
info "Step 2/6: 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
    log "Docker 安装完成"
else
    log "Docker 已安装: $(docker --version)"
fi

if ! command -v docker &> /dev/null; then
    err "Docker 安装失败，请手动安装后重试"
fi

# Docker Compose
if ! docker compose version &> /dev/null; then
    sudo apt-get install -y docker-compose-plugin
fi
log "Docker Compose: $(docker compose version)"

# ── Step 3: 配置防火墙 ────────────────────────────────────────
info "Step 3/6: 配置防火墙..."
sudo ufw allow 22/tcp   > /dev/null 2>&1 || true
sudo ufw allow 80/tcp   > /dev/null 2>&1 || true
sudo ufw allow 443/tcp  > /dev/null 2>&1 || true
sudo ufw --force enable > /dev/null 2>&1 || true
log "防火墙: 22(SSH), 80(HTTP), 443(HTTPS) 已开放"

# ── Step 4: 初始化 Nginx 配置目录 ────────────────────────────
info "Step 4/6: 初始化 Nginx 配置..."
mkdir -p "$PROJECT_DIR/nginx/conf"
mkdir -p "$PROJECT_DIR/nginx/ssl"

# 先用 HTTP-only 配置启动
cp "$PROJECT_DIR/nginx/default.http.conf" "$PROJECT_DIR/nginx/conf/default.conf"
log "使用 HTTP 配置（SSL 申请前临时使用）"

# ── Step 5: 启动服务 ──────────────────────────────────────────
info "Step 5/6: 启动 Docker 服务..."
cd "$PROJECT_DIR"

# 停止旧容器（如有）
docker compose down --remove-orphans 2>/dev/null || true

# 构建并启动（先不含 nginx，让 certbot 能用 80 端口）
docker compose up -d --build db api sync
log "数据库 & API 已启动"

info "等待数据库初始化（30秒）..."
sleep 30

# 验证 API 健康
if curl -sf http://localhost:3000/api/health > /dev/null; then
    log "API 健康检查通过"
else
    warn "API 暂未就绪，继续..."
fi

# ── Step 6: 申请 SSL 证书 ─────────────────────────────────────
info "Step 6/6: 申请 Let's Encrypt SSL 证书..."

# 检查证书是否已存在
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    log "SSL 证书已存在，跳过申请"
else
    # 用 standalone 模式申请（80 端口此时未被 nginx 占用）
    sudo certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        --domains "$DOMAIN,www.$DOMAIN" \
        --preferred-challenges http \
        || err "SSL 证书申请失败。请确认:
    1. 域名 $DOMAIN 已指向服务器 IP $(curl -s ifconfig.me)
    2. 80 端口未被占用"

    log "SSL 证书申请成功"
fi

# 切换到 HTTPS 配置
cp "$PROJECT_DIR/nginx/default.https.conf" "$PROJECT_DIR/nginx/conf/default.conf"
log "切换到 HTTPS 配置"

# 启动 nginx（现在带 SSL）
docker compose up -d nginx
log "Nginx 已启动（HTTPS）"

# 设置证书自动续期
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && docker compose -f $PROJECT_DIR/docker-compose.yml exec nginx nginx -s reload") | sort -u | crontab -
log "SSL 自动续期已配置"

# ── 完成 ──────────────────────────────────────────────────────
echo ""
echo "=========================================="
echo -e "  ${GREEN}部署成功！${NC}"
echo "=========================================="
echo ""
echo "  网站地址: https://$DOMAIN"
echo "  API 地址: https://$DOMAIN/api/health"
echo ""
echo "  常用命令:"
echo "  查看日志:   docker compose logs -f"
echo "  重启服务:   docker compose restart"
echo "  停止服务:   docker compose down"
echo "  更新代码:   bash $PROJECT_DIR/update.sh"
echo ""
