#!/bin/bash

# ElevenLabs CLI Setup Script
# This script initializes and manages ElevenLabs agent configuration

set -e

echo "🚀 ElevenLabs CLI Setup for Telehealth Insight Companion"
echo "========================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0.0 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version must be 16.0.0 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install ElevenLabs CLI globally
echo ""
echo "📦 Installing ElevenLabs CLI..."
npm install -g @elevenlabs/cli

echo "✅ ElevenLabs CLI installed successfully"

# Check if API key is provided
if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo ""
    echo "⚠️  ELEVENLABS_API_KEY environment variable not set"
    echo "Please set your API key before authenticating:"
    echo "  export ELEVENLABS_API_KEY='your-api-key-here'"
    echo ""
    read -p "Do you want to authenticate now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        elevenlabs auth login
    fi
else
    echo "✅ ELEVENLABS_API_KEY is set"
fi

# Verify authentication
echo ""
echo "🔐 Verifying authentication..."
if elevenlabs auth whoami > /dev/null 2>&1; then
    echo "✅ Authentication successful"
else
    echo "❌ Authentication failed. Please run: elevenlabs auth login"
    exit 1
fi

# Initialize project structure if not exists
if [ ! -d ".elevenlabs" ]; then
    echo ""
    echo "📁 Creating .elevenlabs directory structure..."
    mkdir -p .elevenlabs/agent_configs
    mkdir -p .elevenlabs/tool_configs
    mkdir -p .elevenlabs/test_configs
    echo "✅ Directory structure created"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Review agent configuration: .elevenlabs/agent_configs/telehealth-companion.json"
echo "  2. Pull existing agents: elevenlabs agents pull"
echo "  3. Push local agents: elevenlabs agents push"
echo "  4. Check agent status: elevenlabs agents status"
echo ""
