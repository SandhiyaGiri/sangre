# ElevenLabs CLI Integration Guide

## Overview

This guide explains how to manage the Telehealth Insight Companion agent using the ElevenLabs CLI. The CLI allows you to:

- **Store agents as code** in version control
- **Pull agents** from the ElevenLabs platform to your local repository
- **Push agents** from your local repository to the platform
- **Manage configurations** programmatically
- **Integrate with CI/CD** pipelines

## Prerequisites

- Node.js 16.0.0 or higher
- ElevenLabs API key
- ElevenLabs CLI installed globally

## Installation

### 1. Install ElevenLabs CLI

```bash
npm install -g @elevenlabs/cli
```

Or use the setup script:

```bash
bash scripts/elevenlabs-cli-setup.sh
```

### 2. Authenticate

```bash
elevenlabs auth login
```

Or set your API key as an environment variable:

```bash
export ELEVENLABS_API_KEY='your-api-key-here'
```

Verify authentication:

```bash
elevenlabs auth whoami
```

## Project Structure

```
sangre/
├── .elevenlabs/                          # ElevenLabs configuration directory
│   ├── agents.json                       # Agent registry
│   ├── tools.json                        # Tool definitions
│   ├── agent_configs/                    # Agent configuration files
│   │   └── telehealth-companion.json     # Main agent config
│   └── tool_configs/                     # Tool configuration files
│       ├── get_report_context.json
│       ├── get_lab_reference_ranges.json
│       └── generate_summary.json
├── scripts/
│   ├── elevenlabs-cli-setup.sh           # Setup script
│   ├── elevenlabs-cli-commands.sh        # Command reference
│   └── elevenlabs-sync.js                # Sync utility
└── package.json                          # NPM scripts
```

## Quick Start

### Pull Agent from Platform

Import your existing agent from the ElevenLabs dashboard:

```bash
node scripts/elevenlabs-sync.js pull
```

Or pull a specific agent:

```bash
node scripts/elevenlabs-sync.js pull agent_7101k5zvyjhmfg983brhmhkd98n6
```

### View Agent Configuration

```bash
node scripts/elevenlabs-sync.js show telehealth-companion
```

### Edit Agent Configuration

```bash
node scripts/elevenlabs-sync.js edit telehealth-companion
```

This opens the configuration in your default editor (nano, vim, etc.).

### Validate Configuration

```bash
node scripts/elevenlabs-sync.js validate
```

### Push Changes to Platform

Preview changes (dry run):

```bash
node scripts/elevenlabs-sync.js push --dry-run
```

Apply changes:

```bash
node scripts/elevenlabs-sync.js push
```

### Check Agent Status

```bash
node scripts/elevenlabs-sync.js status
```

### List All Agents

```bash
node scripts/elevenlabs-sync.js list
```

## Agent Configuration

The main agent configuration is stored in `.elevenlabs/agent_configs/telehealth-companion.json`.

### Key Configuration Fields

#### Basic Information
- `name`: Agent display name
- `description`: Agent purpose and capabilities
- `system_prompt`: Core instructions for agent behavior

#### Voice & Language
- `language`: Primary language (en, ta, ml, kn, hi)
- `voice`: Voice settings (voice_id, accent, age, gender)
- `conversation_config.supported_languages`: List of supported languages

#### Conversation Settings
- `mode`: "voice_and_text", "voice_only", or "text_only"
- `max_duration_minutes`: Maximum conversation length
- `enable_interruptions`: Allow user interruptions
- `enable_language_detection`: Auto-detect user language
- `timeout_seconds`: Inactivity timeout
- `turn_eagerness`: How quickly agent responds (0.0-1.0)

#### Tools
- `tools`: Array of available tools (get_report_context, get_lab_reference_ranges, generate_summary)

#### Model Configuration
- `model`: LLM model (gpt-4, gpt-3.5-turbo, etc.)
- `temperature`: Creativity level (0.0-1.0, lower = more deterministic)
- `max_tokens`: Maximum response length
- `top_p`: Diversity parameter

#### Evaluation Criteria
- `evaluation_criteria`: Metrics to evaluate agent performance

#### Widget Configuration
- `widget_config`: Customization for embedded widget

## Common Workflows

### Workflow 1: Update Agent Prompt

1. Edit the configuration:
   ```bash
   node scripts/elevenlabs-sync.js edit telehealth-companion
   ```

2. Modify the `system_prompt` field

3. Validate changes:
   ```bash
   node scripts/elevenlabs-sync.js validate
   ```

4. Preview changes:
   ```bash
   node scripts/elevenlabs-sync.js push --dry-run
   ```

5. Push to platform:
   ```bash
   node scripts/elevenlabs-sync.js push
   ```

### Workflow 2: Add New Tool

1. Create tool configuration in `.elevenlabs/tool_configs/`:
   ```json
   {
     "id": "tool_name",
     "name": "Tool Display Name",
     "description": "What the tool does",
     "type": "server_tool",
     "endpoint": "https://api.example.com/tool",
     "parameters": { ... }
   }
   ```

2. Update `.elevenlabs/tools.json` to register the tool

3. Add tool to agent config in `agent_configs/telehealth-companion.json`:
   ```json
   "tools": [
     {
       "name": "tool_name",
       "description": "What the tool does",
       "enabled": true
     }
   ]
   ```

4. Push changes:
   ```bash
   node scripts/elevenlabs-sync.js push
   ```

### Workflow 3: Sync with Team

1. Pull latest changes from platform:
   ```bash
   node scripts/elevenlabs-sync.js pull
   ```

2. Commit to version control:
   ```bash
   git add .elevenlabs/
   git commit -m "Update agent configuration"
   ```

3. Push to repository:
   ```bash
   git push origin main
   ```

4. Team members pull and deploy:
   ```bash
   git pull origin main
   node scripts/elevenlabs-sync.js push
   ```

## CLI Commands Reference

### Authentication

```bash
# Login
elevenlabs auth login

# Check status
elevenlabs auth whoami

# Logout
elevenlabs auth logout
```

### Agent Management

```bash
# List all agents
elevenlabs agents list

# Create agent from template
elevenlabs agents add "Agent Name" --template assistant

# List templates
elevenlabs agents templates list

# Show template details
elevenlabs agents templates show assistant
```

### Synchronization

```bash
# Pull agents from platform
elevenlabs agents pull

# Pull specific agent
elevenlabs agents pull --agent agent_id

# Push agents to platform
elevenlabs agents push

# Preview changes (dry run)
elevenlabs agents push --dry-run
```

### Status & Monitoring

```bash
# Check agent status
elevenlabs agents status
```

### Sync Utility Commands

```bash
# List agents
node scripts/elevenlabs-sync.js list

# Pull agents
node scripts/elevenlabs-sync.js pull [agentId]

# Push agents
node scripts/elevenlabs-sync.js push [--dry-run]

# Check status
node scripts/elevenlabs-sync.js status

# Validate configuration
node scripts/elevenlabs-sync.js validate

# Show configuration
node scripts/elevenlabs-sync.js show [agentName]

# Edit configuration
node scripts/elevenlabs-sync.js edit [agentName]

# Show help
node scripts/elevenlabs-sync.js help
```

## NPM Scripts

Add these to your `package.json` for convenience:

```json
{
  "scripts": {
    "elevenlabs:setup": "bash scripts/elevenlabs-cli-setup.sh",
    "elevenlabs:list": "node scripts/elevenlabs-sync.js list",
    "elevenlabs:pull": "node scripts/elevenlabs-sync.js pull",
    "elevenlabs:push": "node scripts/elevenlabs-sync.js push",
    "elevenlabs:push:dry": "node scripts/elevenlabs-sync.js push --dry-run",
    "elevenlabs:status": "node scripts/elevenlabs-sync.js status",
    "elevenlabs:validate": "node scripts/elevenlabs-sync.js validate",
    "elevenlabs:show": "node scripts/elevenlabs-sync.js show",
    "elevenlabs:edit": "node scripts/elevenlabs-sync.js edit"
  }
}
```

Usage:

```bash
npm run elevenlabs:pull
npm run elevenlabs:push:dry
npm run elevenlabs:validate
```

## Configuration Best Practices

### System Prompt Guidelines

1. **Be Clear and Specific**: Define the agent's role and responsibilities
2. **Set Boundaries**: Specify what the agent should NOT do
3. **Provide Examples**: Include example interactions
4. **Define Safety Guardrails**: Outline safety rules and limitations
5. **Specify Language Support**: List supported languages and how to handle them

### Tool Configuration

1. **Describe Parameters Clearly**: Each parameter should have clear description
2. **Define Response Schema**: Specify expected response structure
3. **Handle Errors**: Define error handling behavior
4. **Test Thoroughly**: Validate tool integration before pushing

### Conversation Settings

1. **Set Appropriate Timeout**: Balance between responsiveness and cost
2. **Configure Language Detection**: Enable for multilingual support
3. **Adjust Temperature**: Lower for factual responses, higher for creative
4. **Set Max Duration**: Prevent runaway conversations

## Troubleshooting

### Authentication Issues

**Problem**: "Not authenticated" error

**Solution**:
```bash
elevenlabs auth login
# or
export ELEVENLABS_API_KEY='your-api-key'
```

### Configuration Validation Fails

**Problem**: "Invalid JSON" or "Missing required fields"

**Solution**:
1. Check JSON syntax: `node scripts/elevenlabs-sync.js validate`
2. Ensure required fields: `name`, `system_prompt`, `language`
3. Use `node scripts/elevenlabs-sync.js show` to view current config

### Push Fails

**Problem**: Changes won't push to platform

**Solution**:
1. Run dry-run first: `node scripts/elevenlabs-sync.js push --dry-run`
2. Check for validation errors: `node scripts/elevenlabs-sync.js validate`
3. Verify authentication: `elevenlabs auth whoami`
4. Check agent ID in `.elevenlabs/agents.json`

### Pull Overwrites Local Changes

**Problem**: Pulling from platform overwrites local changes

**Solution**:
1. Always commit changes before pulling: `git add . && git commit -m "message"`
2. Use version control to manage changes
3. Review changes before pushing: `node scripts/elevenlabs-sync.js push --dry-run`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Agent

on:
  push:
    branches: [main]
    paths:
      - '.elevenlabs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install ElevenLabs CLI
        run: npm install -g @elevenlabs/cli
      
      - name: Validate Configuration
        run: node scripts/elevenlabs-sync.js validate
      
      - name: Deploy Agent
        env:
          ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
        run: node scripts/elevenlabs-sync.js push
```

## Resources

- [ElevenLabs CLI Documentation](https://elevenlabs.io/docs/agents-platform/operate/cli)
- [Agent Configuration Guide](https://elevenlabs.io/docs/agents-platform/build/design-and-configure)
- [Prompting Guide](https://elevenlabs.io/docs/agents-platform/build/prompting-guide)
- [GitHub Repository](https://github.com/elevenlabs/cli)

## Support

For issues or questions:

1. Check the [ElevenLabs Documentation](https://elevenlabs.io/docs)
2. Review this guide's troubleshooting section
3. Check CLI help: `elevenlabs --help`
4. Open an issue on [GitHub](https://github.com/elevenlabs/cli/issues)

---

**Last Updated**: December 11, 2024  
**Version**: 1.0.0
