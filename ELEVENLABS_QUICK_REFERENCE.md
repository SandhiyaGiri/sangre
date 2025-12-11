# ElevenLabs CLI Quick Reference

## Installation & Setup

```bash
# Install CLI globally
npm install -g @elevenlabs/cli

# Or use setup script
npm run elevenlabs:setup

# Authenticate
elevenlabs auth login
# or
export ELEVENLABS_API_KEY='your-api-key'
```

## NPM Commands

```bash
# Setup
npm run elevenlabs:setup

# Pull from platform
npm run elevenlabs:pull

# Push to platform
npm run elevenlabs:push

# Preview changes (dry run)
npm run elevenlabs:push:dry

# Check status
npm run elevenlabs:status

# Validate configuration
npm run elevenlabs:validate

# Show configuration
npm run elevenlabs:show

# Edit configuration
npm run elevenlabs:edit

# List all agents
npm run elevenlabs:list
```

## Direct CLI Commands

```bash
# Authentication
elevenlabs auth login
elevenlabs auth whoami
elevenlabs auth logout

# Agent Management
elevenlabs agents list
elevenlabs agents pull
elevenlabs agents pull --agent <agent_id>
elevenlabs agents push
elevenlabs agents push --dry-run
elevenlabs agents status

# Templates
elevenlabs agents templates list
elevenlabs agents templates show <template>

# Create agent
elevenlabs agents add "Agent Name" --template assistant
```

## Sync Utility Commands

```bash
# List agents
node scripts/elevenlabs-sync.js list

# Pull agents
node scripts/elevenlabs-sync.js pull [agentId]

# Push agents
node scripts/elevenlabs-sync.js push [--dry-run]

# Check status
node scripts/elevenlabs-sync.js status

# Validate
node scripts/elevenlabs-sync.js validate

# Show config
node scripts/elevenlabs-sync.js show [agentName]

# Edit config
node scripts/elevenlabs-sync.js edit [agentName]

# Help
node scripts/elevenlabs-sync.js help
```

## Configuration Files

### Main Agent Config
- **Location**: `.elevenlabs/agent_configs/telehealth-companion.json`
- **Key Fields**:
  - `name`: Agent display name
  - `system_prompt`: Core instructions
  - `language`: Primary language
  - `voice`: Voice settings
  - `conversation_config`: Conversation behavior
  - `tools`: Available tools
  - `model_config`: LLM settings

### Tool Configs
- **Location**: `.elevenlabs/tool_configs/`
- **Files**:
  - `get_report_context.json` - Fetch patient reports
  - `get_lab_reference_ranges.json` - Lab value references
  - `generate_summary.json` - Conversation summaries

### Registries
- **agents.json**: Agent registry
- **tools.json**: Tool definitions

## Common Workflows

### Update Agent Prompt

```bash
# 1. Edit configuration
npm run elevenlabs:edit

# 2. Validate
npm run elevenlabs:validate

# 3. Preview
npm run elevenlabs:push:dry

# 4. Deploy
npm run elevenlabs:push

# 5. Commit
git add .elevenlabs/
git commit -m "Update agent prompt"
git push
```

### Pull Latest from Platform

```bash
# 1. Pull
npm run elevenlabs:pull

# 2. Review
git diff .elevenlabs/

# 3. Commit
git add .elevenlabs/
git commit -m "Sync agent configuration"
git push
```

### Add New Tool

1. Create config in `.elevenlabs/tool_configs/`
2. Register in `.elevenlabs/tools.json`
3. Add to agent config
4. Implement in `lib/tools/`
5. Test and deploy

## Environment Variables

```bash
# Required
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_7101k5zvyjhmfg983brhmhkd98n6
ELEVENLABS_API_KEY=your-api-key

# Optional
ELEVENLABS_CLI_WORKSPACE_ID=workspace-id
ELEVENLABS_CLI_AGENT_ID=agent-id
```

## Troubleshooting

### Not Authenticated
```bash
elevenlabs auth login
# or
export ELEVENLABS_API_KEY='your-key'
```

### Configuration Invalid
```bash
npm run elevenlabs:validate
npm run elevenlabs:show
```

### Push Fails
```bash
npm run elevenlabs:push:dry
npm run elevenlabs:validate
elevenlabs auth whoami
```

## Key Features

✅ Version control agent configurations  
✅ Pull/push between local and platform  
✅ Validate configurations  
✅ Preview changes before deployment  
✅ CI/CD integration with GitHub Actions  
✅ Team collaboration via Git  
✅ Tool management and integration  

## Documentation

- **ELEVENLABS_CLI_GUIDE.md** - Comprehensive guide
- **ELEVENLABS_INTEGRATION_SUMMARY.md** - Integration overview
- **ELEVENLABS_QUICK_REFERENCE.md** - This file

## Resources

- [ElevenLabs CLI Docs](https://elevenlabs.io/docs/agents-platform/operate/cli)
- [Agent Configuration](https://elevenlabs.io/docs/agents-platform/build/design-and-configure)
- [Prompting Guide](https://elevenlabs.io/docs/agents-platform/build/prompting-guide)
- [GitHub CLI Repo](https://github.com/elevenlabs/cli)

## Agent ID

**Current Agent**: `agent_7101k5zvyjhmfg983brhmhkd98n6`

---

**Quick Reference v1.0** | Last Updated: Dec 11, 2024
