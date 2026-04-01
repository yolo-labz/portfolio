#!/usr/bin/env bash
set -euo pipefail

# Setup script for Dokku deployment of portfolio site
# Run this once from a machine with SSH access to the Dokku host.
#
# Usage: ./scripts/setup-dokku.sh

DOKKU_HOST="192.168.1.184"
APP_NAME="portfolio"
DOMAIN="portfolio.home301server.com.br"

echo "=== Portfolio Dokku Setup ==="
echo "Host: $DOKKU_HOST"
echo "App:  $APP_NAME"
echo "Domain: $DOMAIN"
echo ""

# Verify SSH connection
echo "[1/6] Verifying SSH connection..."
ssh "dokku@${DOKKU_HOST}" version || {
    echo "ERROR: Cannot connect to Dokku at ${DOKKU_HOST}"
    echo "Ensure SSH key is configured for dokku user"
    exit 1
}

# Create app if not exists
echo "[2/6] Creating app..."
ssh "dokku@${DOKKU_HOST}" apps:create "$APP_NAME" 2>/dev/null || echo "App already exists"

# Set domain
echo "[3/6] Configuring domain..."
ssh "dokku@${DOKKU_HOST}" domains:set "$APP_NAME" "$DOMAIN"

# Set Dockerfile path
echo "[4/6] Setting Dockerfile path..."
ssh "dokku@${DOKKU_HOST}" builder-dockerfile:set "$APP_NAME" dockerfile-path Dockerfile.dokku

# Set environment variables
echo "[5/6] Setting environment variables..."
ssh "dokku@${DOKKU_HOST}" config:set --no-restart "$APP_NAME" \
    NODE_ENV=production \
    NEXT_PUBLIC_SITE_URL="https://${DOMAIN}" \
    NEXT_TELEMETRY_DISABLED=1

# Set proxy ports
echo "[6/6] Configuring proxy..."
ssh "dokku@${DOKKU_HOST}" ports:set "$APP_NAME" http:80:3000

echo ""
echo "=== Setup Complete ==="
echo "Deploy with: git push dokku main"
echo "Or via GitHub Actions (push to main branch)"
echo ""
echo "Post-deploy checklist:"
echo "  1. Configure Cloudflare tunnel for ${DOMAIN}"
echo "  2. Add DOKKU_SSH_PRIVATE_KEY secret to yolo-labz/portfolio repo"
echo "  3. Verify self-hosted runner is registered for yolo-labz org"
echo "  4. Push to main to trigger deploy"
