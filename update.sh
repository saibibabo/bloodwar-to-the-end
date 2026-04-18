#!/bin/bash
# 更新代码后在服务器运行此脚本
set -e
PROJECT_DIR="/home/zonghongjin7/bloodwar"
cd "$PROJECT_DIR"
echo "→ 重建并重启服务..."
docker compose build api
docker compose up -d --no-deps api
docker compose exec nginx nginx -s reload 2>/dev/null || true
echo "✓ 更新完成"
docker compose ps
