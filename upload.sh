#!/bin/bash
# ============================================================
# 从 Mac 上传项目到服务器
# 在 /Users/hong7/pk/bloodwar-to-the-end 目录下运行此脚本
# ============================================================

SERVER_IP="136.116.54.112"
SSH_USER="zonghongjin7"
REMOTE_DIR="/home/zonghongjin7/bloodwar"

echo "→ 上传项目到服务器 $SERVER_IP ..."

# 使用 gcloud 方式（推荐，GCP 自动管理密钥）
# 先找 GCP 实例名（如果用 gcloud）
# gcloud compute scp --recurse /Users/hong7/pk/bloodwar-to-the-end zonghongjin7@INSTANCE_NAME:/home/zonghongjin7/bloodwar --zone=us-central1-a

# 直接 SCP（使用 GCP 的默认 SSH 密钥）
rsync -avz --progress \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '*.log' \
    /Users/hong7/pk/bloodwar-to-the-end/ \
    "$SSH_USER@$SERVER_IP:$REMOTE_DIR/"

echo "✓ 上传完成"
echo ""
echo "现在 SSH 到服务器运行部署脚本："
echo "  ssh $SSH_USER@$SERVER_IP"
echo "  cd $REMOTE_DIR && bash deploy.sh"
