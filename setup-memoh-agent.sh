#!/bin/bash
# ==============================================================================
# 🤖 Memoh.ai Cloud Agent Setup Script for TypeSafe Jev Autonomous Quant Bot
# ==============================================================================
set -e

echo "🚀 Starting TypeSafe Jev Autonomous Trading Bot Setup on Memoh.ai..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo "✅ Node.js $(node -v) detected"

# Ensure .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    API_KEY="${TYPESAFE_API_KEY:-$1}"
    if [ -z "$API_KEY" ]; then
        echo -n "🔑 Enter your TypeSafe API Key: "
        read -r API_KEY
    fi
    cat << ENVEOF > .env
PORT=3001
NODE_ENV=production
TYPESAFE_API_KEY=${API_KEY}
ENVEOF
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build production React frontend
echo "⚡ Building React terminal dashboard..."
npm run build

# Start with PM2 if available, or background node
if command -v pm2 &> /dev/null; then
    echo "🔄 Starting with PM2 (24/7 Always-On)..."
    pm2 stop jev-trading-bot 2>/dev/null || true
    pm2 start server/server.js --name jev-trading-bot
    pm2 save
    echo "✅ PM2 process 'jev-trading-bot' is running 24/7"
else
    echo "🔄 Starting with Node in background daemon..."
    nohup node server/server.js > /tmp/jev-trading-bot.log 2>&1 &
    echo "✅ Process started in background (PID: $!)"
fi

echo ""
echo "🎉 ===================================================================== 🎉"
echo "   🤖 JEV AUTONOMOUS TRADING BOT IS LIVE ON YOUR MEMOH CLOUD AGENT!      "
echo "   ---------------------------------------------------------------------   "
echo "   🌐 Dashboard Web UI : http://localhost:3001 (or Agent Port 3001 URL) "
echo "   ⚡ API Health Check : http://localhost:3001/api/health               "
echo "   🔌 MCP Server Path  : $(pwd)/mcp-server.js                           "
echo "🎉 ===================================================================== 🎉"
