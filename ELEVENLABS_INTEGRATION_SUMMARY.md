# ElevenLabs CLI Integration Summary

## Overview

The Telehealth Insight Companion now has full ElevenLabs CLI integration for managing agent configurations as code. This enables:

- **Version Control**: Store agent configurations in Git
- **CI/CD Automation**: Deploy agents automatically via GitHub Actions
- **Configuration Management**: Pull and push agent configs between local and platform
- **Team Collaboration**: Share agent configurations across team members

## What's Been Set Up

### 1. Directory Structure

```
.elevenlabs/
├── agents.json                          # Agent registry
├── tools.json                           # Tool definitions
├── agent_configs/
│   └── telehealth-companion.json        # Main agent configuration
└── tool_configs/
    ├── get_report_context.json
    ├── get_lab_reference_ranges.json
    └── generate_summary.json
```

### 2. Configuration Files

#### Agent Configuration (`.elevenlabs/agent_configs/telehealth-companion.json`)
- **System Prompt**: Comprehensive instructions for empathetic, safe health guidance
- **Voice Settings**: Configurable voice, language, accent
- **Conversation Config**: Mode, duration, language detection, interruptions
- **Tools**: Integration with report context, lab references, summary generation
- **Model Config**: GPT-4 with temperature 0.3 for consistent, factual responses
- **Evaluation Criteria**: Clarity, empathy, accuracy, safety metrics
- **Widget Config**: Customization for embedded widget

#### Tool Configurations
- **get_report_context.json**: Client tool to fetch patient reports
- **get_lab_reference_ranges.json**: Server tool for lab value reference ranges
- **generate_summary.json**: Server tool to generate conversation summaries

### 3. CLI Scripts

#### Setup Script (`scripts/elevenlabs-cli-setup.sh`)
- Installs ElevenLabs CLI globally
- Verifies Node.js version (16.0.0+)
- Authenticates with API key
- Creates directory structure

#### Sync Utility (`scripts/elevenlabs-sync.js`)
Node.js utility for managing agent configurations:
- `list` - List all agents from platform
- `pull` - Import agents from platform
- `push` - Export agents to platform
- `status` - Check agent status
- `validate` - Validate local configurations
- `show` - Display agent configuration
- `edit` - Edit configuration in default editor

#### Command Reference (`scripts/elevenlabs-cli-commands.sh`)
Quick reference for all ElevenLabs CLI commands

### 4. NPM Scripts

Added to `package.json`:
```json
{
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
```

### 5. Tool Implementations

#### `lib/tools/getReportContext.ts`
- Fetches patient health reports from backend
- Formats report data for agent context
- Handles errors gracefully

#### `lib/tools/getLabReferenceRanges.ts`
- Provides standard reference ranges for 25+ lab values
- Normalizes lab names for lookup
- Returns descriptions for each lab value
- Exports `COMMON_LAB_REFERENCES` for use throughout app

#### `lib/tools/generateSummary.ts`
- Generates conversation summaries
- Supports multiple formats (text, PDF, JSON)
- Extracts key points from transcripts
- Formats output for download

### 6. CI/CD Integration

#### GitHub Actions Workflow (`.github/workflows/elevenlabs-deploy.yml`)
- **Validate Job**: Checks configuration syntax and structure
- **Deploy Job**: Pushes to platform on main branch
- **Pull Request Job**: Validates and previews changes
- Automatic notifications on success/failure

### 7. Environment Configuration

#### `.env.example`
Template for required environment variables:
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` - Agent ID
- `ELEVENLABS_API_KEY` - API key for CLI operations
- Optional: Workspace ID, SMTP settings, database URL

### 8. Documentation

#### `ELEVENLABS_CLI_GUIDE.md`
Comprehensive guide covering:
- Installation and authentication
- Project structure explanation
- Quick start workflows
- Common use cases
- CLI command reference
- Troubleshooting guide
- CI/CD integration examples
- Best practices

## Quick Start

### 1. Initial Setup

```bash
# Install ElevenLabs CLI
npm run elevenlabs:setup

# Or manually
npm install -g @elevenlabs/cli
elevenlabs auth login
```

### 2. Pull Existing Agent

```bash
# Import agent from platform
npm run elevenlabs:pull

# Or specific agent
node scripts/elevenlabs-sync.js pull agent_7101k5zvyjhmfg983brhmhkd98n6
```

### 3. View Configuration

```bash
npm run elevenlabs:show
```

### 4. Make Changes

```bash
# Edit configuration
npm run elevenlabs:edit

# Validate changes
npm run elevenlabs:validate

# Preview changes
npm run elevenlabs:push:dry
```

### 5. Deploy

```bash
# Push to platform
npm run elevenlabs:push
```

## Key Features

### Configuration as Code
- Store agent configuration in JSON files
- Version control with Git
- Review changes in pull requests
- Rollback to previous versions

### Automated Deployment
- GitHub Actions workflow
- Automatic validation on push
- Dry-run preview before deployment
- Automatic notifications

### Team Collaboration
- Share configurations via Git
- Review changes before deployment
- Consistent agent configuration across team
- Easy onboarding for new team members

### Tool Integration
Three tools integrated with agent:
1. **Get Report Context** - Access patient health data
2. **Get Lab Reference Ranges** - Provide lab value context
3. **Generate Summary** - Create downloadable summaries

## Configuration Management Workflow

### Updating Agent Prompt

1. Edit configuration:
   ```bash
   npm run elevenlabs:edit
   ```

2. Validate:
   ```bash
   npm run elevenlabs:validate
   ```

3. Preview:
   ```bash
   npm run elevenlabs:push:dry
   ```

4. Deploy:
   ```bash
   npm run elevenlabs:push
   ```

5. Commit to Git:
   ```bash
   git add .elevenlabs/
   git commit -m "Update agent system prompt"
   git push
   ```

### Adding New Tool

1. Create tool config in `.elevenlabs/tool_configs/`
2. Register in `.elevenlabs/tools.json`
3. Add to agent config in `agent_configs/telehealth-companion.json`
4. Implement tool logic in `lib/tools/`
5. Test locally
6. Push to platform

### Syncing with Team

1. Pull latest:
   ```bash
   npm run elevenlabs:pull
   ```

2. Review changes:
   ```bash
   git diff .elevenlabs/
   ```

3. Commit and push:
   ```bash
   git add .elevenlabs/
   git commit -m "Sync agent configuration"
   git push
   ```

## Security Considerations

### API Key Management
- Store API key in `.env.local` (not in Git)
- Use GitHub Secrets for CI/CD
- Rotate keys regularly
- Use service accounts for automation

### Configuration Safety
- Always use `--dry-run` before pushing
- Review changes in pull requests
- Validate configuration before deployment
- Keep backup of working configurations

### Tool Security
- Validate all tool inputs
- Implement proper error handling
- Use authentication for server tools
- Monitor tool usage

## Troubleshooting

### Authentication Issues
```bash
# Check login status
elevenlabs auth whoami

# Re-authenticate
elevenlabs auth login

# Or set API key
export ELEVENLABS_API_KEY='your-key'
```

### Configuration Validation
```bash
# Validate configuration
npm run elevenlabs:validate

# Show configuration
npm run elevenlabs:show

# Check for errors
node scripts/elevenlabs-sync.js validate
```

### Deployment Issues
```bash
# Preview changes first
npm run elevenlabs:push:dry

# Check agent status
npm run elevenlabs:status

# List all agents
npm run elevenlabs:list
```

## Next Steps

1. **Pull Existing Agent**: Import your agent from the platform
2. **Review Configuration**: Check `.elevenlabs/agent_configs/telehealth-companion.json`
3. **Test Locally**: Run the application and test agent
4. **Deploy**: Push configuration to platform
5. **Monitor**: Check agent status and conversation logs
6. **Iterate**: Update configuration based on feedback

## Resources

- [ElevenLabs CLI Docs](https://elevenlabs.io/docs/agents-platform/operate/cli)
- [Agent Configuration Guide](https://elevenlabs.io/docs/agents-platform/build/design-and-configure)
- [Prompting Guide](https://elevenlabs.io/docs/agents-platform/build/prompting-guide)
- [Tool Integration Guide](https://elevenlabs.io/docs/agents-platform/build/tools)

## Support

For issues or questions:
1. Check `ELEVENLABS_CLI_GUIDE.md` for detailed documentation
2. Review troubleshooting section above
3. Check ElevenLabs documentation
4. Open issue on GitHub

---

**Integration Date**: December 11, 2024  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready to Use
