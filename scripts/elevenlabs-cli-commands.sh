#!/bin/bash

# ElevenLabs CLI Common Commands
# Quick reference for managing agents via CLI

echo "🎯 ElevenLabs CLI Common Commands"
echo "=================================="
echo ""

# Authentication
echo "🔐 AUTHENTICATION"
echo "  Login to ElevenLabs:"
echo "    elevenlabs auth login"
echo ""
echo "  Check login status:"
echo "    elevenlabs auth whoami"
echo ""
echo "  Logout:"
echo "    elevenlabs auth logout"
echo ""

# Agent Management
echo "👤 AGENT MANAGEMENT"
echo "  List all agents:"
echo "    elevenlabs agents list"
echo ""
echo "  Create new agent from template:"
echo "    elevenlabs agents add 'Agent Name' --template assistant"
echo ""
echo "  Available templates:"
echo "    - default (complete configuration)"
echo "    - minimal (essential fields only)"
echo "    - voice-only (voice interactions)"
echo "    - text-only (text conversations)"
echo "    - customer-service (empathetic support)"
echo "    - assistant (general-purpose)"
echo ""
echo "  List available templates:"
echo "    elevenlabs agents templates list"
echo ""
echo "  Show template details:"
echo "    elevenlabs agents templates show <template>"
echo ""

# Synchronization
echo "🔄 SYNCHRONIZATION"
echo "  Pull agents from platform (import):"
echo "    elevenlabs agents pull"
echo ""
echo "  Pull specific agent:"
echo "    elevenlabs agents pull --agent <agent_id>"
echo ""
echo "  Push agents to platform (export):"
echo "    elevenlabs agents push"
echo ""
echo "  Preview changes (dry run):"
echo "    elevenlabs agents push --dry-run"
echo ""

# Status & Monitoring
echo "📊 STATUS & MONITORING"
echo "  Check agent status:"
echo "    elevenlabs agents status"
echo ""

# Tool Management
echo "🔧 TOOL MANAGEMENT"
echo "  List all tools:"
echo "    elevenlabs tools list"
echo ""
echo "  Create new tool:"
echo "    elevenlabs tools add 'Tool Name'"
echo ""

# Testing
echo "🧪 TESTING"
echo "  List all tests:"
echo "    elevenlabs tests list"
echo ""
echo "  Create new test:"
echo "    elevenlabs tests add 'Test Name'"
echo ""
echo "  Run tests:"
echo "    elevenlabs tests run"
echo ""

echo "=================================="
echo "For more help: elevenlabs --help"
echo ""
