import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Claude for Desktop Setup Helper
 *
 * This script helps users set up the Meilisearch MCP server for use with Claude for Desktop.
 * It generates the necessary configuration and provides instructions.
 */

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Get the absolute path to the built index.js file
const indexPath = path.resolve(projectRoot, 'dist', 'index.js');

// Get user's home directory
const homeDir = os.homedir();

// Default Claude for Desktop config path based on OS
let claudeConfigPath;
if (process.platform === 'darwin') {
  claudeConfigPath = path.join(
    homeDir,
    'Library',
    'Application Support',
    'Claude',
    'claude_desktop_config.json'
  );
} else if (process.platform === 'win32') {
  claudeConfigPath = path.join(
    homeDir,
    'AppData',
    'Roaming',
    'Claude',
    'claude_desktop_config.json'
  );
} else if (process.platform === 'linux') {
  claudeConfigPath = path.join(
    homeDir,
    '.config',
    'Claude',
    'claude_desktop_config.json'
  );
} else {
  console.error(
    'Unsupported platform. Please manually configure Claude for Desktop.'
  );
  process.exit(1);
}

// Read environment variables from .env file
let meilisearchHost = process.env.MEILISEARCH_HOST;
let meilisearchApiKey = process.env.MEILISEARCH_API_KEY;

try {
  const envPath = path.resolve(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');

    for (const line of envLines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key === 'MEILISEARCH_HOST' && value) {
          meilisearchHost = value.trim();
        } else if (key === 'MEILISEARCH_API_KEY' && value) {
          meilisearchApiKey = value.trim();
        }
      }
    }
  }
} catch (error) {
  console.warn('Could not read .env file:', error.message);
}

// Generate Claude for Desktop configuration
const claudeConfig = {
  mcpServers: {
    meilisearch: {
      command: 'node',
      args: [indexPath],
      env: {
        MEILISEARCH_HOST: meilisearchHost,
        MEILISEARCH_API_KEY: meilisearchApiKey,
      },
    },
  },
};

// Check if Claude config file exists
let existingConfig = {};
try {
  if (fs.existsSync(claudeConfigPath)) {
    const configContent = fs.readFileSync(claudeConfigPath, 'utf8');
    existingConfig = JSON.parse(configContent);
    console.log('Found existing Claude for Desktop configuration.');
  }
} catch (error) {
  console.warn(
    'Could not read existing Claude for Desktop configuration:',
    error.message
  );
}

// Merge configurations
const mergedConfig = {
  ...existingConfig,
  mcpServers: {
    ...(existingConfig.mcpServers || {}),
    ...claudeConfig.mcpServers,
  },
};

// Output the configuration
console.log('\n=== Claude for Desktop Configuration ===\n');
console.log(JSON.stringify(mergedConfig, null, 2));
console.log('\n');

// Ask if user wants to update the configuration
console.log(
  'To use this configuration with Claude for Desktop, you can either:'
);
console.log(
  `1. Manually update your configuration file at: ${claudeConfigPath}`
);
console.log('2. Run the following command to automatically update it:');
console.log(
  `\n   node -e "require('fs').writeFileSync('${claudeConfigPath.replace(
    /\\/g,
    '\\\\'
  )}', JSON.stringify(${JSON.stringify(mergedConfig)}, null, 2))"\n`
);
console.log(
  'After updating the configuration, restart Claude for Desktop to apply the changes.'
);
console.log(
  '\nYou can then use the Meilisearch MCP server with Claude by typing: "I want to use the Meilisearch MCP server."'
);
