#!/usr/bin/env node

/**
 * ElevenLabs Agent Configuration Sync Utility
 * Manages pulling and pushing agent configurations between local and ElevenLabs platform
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ELEVENLABS_DIR = path.join(__dirname, '..', '.elevenlabs');
const AGENTS_CONFIG = path.join(ELEVENLABS_DIR, 'agents.json');
const AGENT_CONFIGS_DIR = path.join(ELEVENLABS_DIR, 'agent_configs');

class ElevenLabsSync {
  constructor() {
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(ELEVENLABS_DIR)) {
      fs.mkdirSync(ELEVENLABS_DIR, { recursive: true });
    }
    if (!fs.existsSync(AGENT_CONFIGS_DIR)) {
      fs.mkdirSync(AGENT_CONFIGS_DIR, { recursive: true });
    }
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      error: '\x1b[31m',   // red
      warning: '\x1b[33m', // yellow
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  checkAuth() {
    try {
      execSync('elevenlabs auth whoami', { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  listAgents() {
    this.log('📋 Listing all agents from ElevenLabs platform...', 'info');
    try {
      const output = execSync('elevenlabs agents list', { encoding: 'utf-8' });
      this.log(output, 'info');
      return output;
    } catch (error) {
      this.log(`Failed to list agents: ${error.message}`, 'error');
      return null;
    }
  }

  pullAgents(agentId = null) {
    this.log('⬇️  Pulling agents from ElevenLabs platform...', 'info');
    try {
      let command = 'elevenlabs agents pull';
      if (agentId) {
        command += ` --agent ${agentId}`;
      }
      const output = execSync(command, { encoding: 'utf-8' });
      this.log('✅ Agents pulled successfully', 'success');
      this.log(output, 'info');
      this.updateAgentsRegistry();
      return true;
    } catch (error) {
      this.log(`Failed to pull agents: ${error.message}`, 'error');
      return false;
    }
  }

  pushAgents(dryRun = false) {
    this.log('⬆️  Pushing agents to ElevenLabs platform...', 'info');
    try {
      let command = 'elevenlabs agents push';
      if (dryRun) {
        command += ' --dry-run';
        this.log('🔍 Running in dry-run mode (no changes will be made)', 'warning');
      }
      const output = execSync(command, { encoding: 'utf-8' });
      this.log('✅ Agents pushed successfully', 'success');
      this.log(output, 'info');
      if (!dryRun) {
        this.updateAgentsRegistry();
      }
      return true;
    } catch (error) {
      this.log(`Failed to push agents: ${error.message}`, 'error');
      return false;
    }
  }

  checkStatus() {
    this.log('📊 Checking agent status...', 'info');
    try {
      const output = execSync('elevenlabs agents status', { encoding: 'utf-8' });
      this.log(output, 'info');
      return true;
    } catch (error) {
      this.log(`Failed to check status: ${error.message}`, 'error');
      return false;
    }
  }

  updateAgentsRegistry() {
    this.log('📝 Updating agents registry...', 'info');
    try {
      if (fs.existsSync(AGENTS_CONFIG)) {
        const config = JSON.parse(fs.readFileSync(AGENTS_CONFIG, 'utf-8'));
        config.last_synced = new Date().toISOString();
        fs.writeFileSync(AGENTS_CONFIG, JSON.stringify(config, null, 2));
        this.log('✅ Registry updated', 'success');
      }
    } catch (error) {
      this.log(`Failed to update registry: ${error.message}`, 'warning');
    }
  }

  validateConfig() {
    this.log('🔍 Validating agent configuration...', 'info');
    try {
      const configFiles = fs.readdirSync(AGENT_CONFIGS_DIR)
        .filter(f => f.endsWith('.json'));

      if (configFiles.length === 0) {
        this.log('⚠️  No agent configuration files found', 'warning');
        return false;
      }

      let allValid = true;
      configFiles.forEach(file => {
        try {
          const config = JSON.parse(
            fs.readFileSync(path.join(AGENT_CONFIGS_DIR, file), 'utf-8')
          );
          
          // Basic validation
          if (!config.name || !config.system_prompt) {
            this.log(`❌ ${file}: Missing required fields (name, system_prompt)`, 'error');
            allValid = false;
          } else {
            this.log(`✅ ${file}: Valid`, 'success');
          }
        } catch (error) {
          this.log(`❌ ${file}: Invalid JSON - ${error.message}`, 'error');
          allValid = false;
        }
      });

      return allValid;
    } catch (error) {
      this.log(`Validation failed: ${error.message}`, 'error');
      return false;
    }
  }

  showConfig(agentName = 'telehealth-companion') {
    this.log(`📄 Showing configuration for ${agentName}...`, 'info');
    try {
      const configPath = path.join(AGENT_CONFIGS_DIR, `${agentName}.json`);
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        console.log(JSON.stringify(config, null, 2));
        return true;
      } else {
        this.log(`Configuration file not found: ${configPath}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`Failed to show config: ${error.message}`, 'error');
      return false;
    }
  }

  editConfig(agentName = 'telehealth-companion') {
    this.log(`✏️  Opening configuration for editing: ${agentName}...`, 'info');
    try {
      const configPath = path.join(AGENT_CONFIGS_DIR, `${agentName}.json`);
      if (!fs.existsSync(configPath)) {
        this.log(`Configuration file not found: ${configPath}`, 'error');
        return false;
      }

      // Open with default editor
      const editor = process.env.EDITOR || 'nano';
      execSync(`${editor} "${configPath}"`, { stdio: 'inherit' });
      this.log('✅ Configuration updated', 'success');
      return true;
    } catch (error) {
      this.log(`Failed to edit config: ${error.message}`, 'error');
      return false;
    }
  }

  printHelp() {
    console.log(`
🎯 ElevenLabs Agent Configuration Sync Utility
==============================================

Usage: node elevenlabs-sync.js <command> [options]

Commands:
  list              List all agents from ElevenLabs platform
  pull [agentId]    Pull agents from platform (import)
  push [--dry-run]  Push agents to platform (export)
  status            Check agent status
  validate          Validate local agent configurations
  show [agentName]  Show agent configuration
  edit [agentName]  Edit agent configuration
  help              Show this help message

Examples:
  node elevenlabs-sync.js list
  node elevenlabs-sync.js pull
  node elevenlabs-sync.js push --dry-run
  node elevenlabs-sync.js validate
  node elevenlabs-sync.js show telehealth-companion
  node elevenlabs-sync.js edit telehealth-companion

Environment:
  ELEVENLABS_API_KEY  Your ElevenLabs API key (required)
  EDITOR              Editor for editing configs (default: nano)

For more information, visit: https://elevenlabs.io/docs/agents-platform/operate/cli
    `);
  }
}

// Main execution
const sync = new ElevenLabsSync();
const command = process.argv[2];
const arg = process.argv[3];

if (!sync.checkAuth()) {
  sync.log('❌ Not authenticated. Please run: elevenlabs auth login', 'error');
  process.exit(1);
}

switch (command) {
  case 'list':
    sync.listAgents();
    break;
  case 'pull':
    sync.pullAgents(arg);
    break;
  case 'push':
    sync.pushAgents(arg === '--dry-run');
    break;
  case 'status':
    sync.checkStatus();
    break;
  case 'validate':
    sync.validateConfig() ? process.exit(0) : process.exit(1);
    break;
  case 'show':
    sync.showConfig(arg);
    break;
  case 'edit':
    sync.editConfig(arg);
    break;
  case 'help':
  case '--help':
  case '-h':
    sync.printHelp();
    break;
  default:
    sync.log(`Unknown command: ${command}`, 'error');
    sync.printHelp();
    process.exit(1);
}
