import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import axios from 'axios';

import registerDocumentTools from './tools/document-tools.js';
import registerIndexTools from './tools/index-tools.js';
import registerSearchTools from './tools/search-tools.js';
import registerSettingsTools from './tools/settings-tools.js';
import registerSystemTools from './tools/system-tools.js';
import registerTaskTools from './tools/task-tools.js';
import registerVectorTools from './tools/vector-tools.js';

/**
 * Meilisearch MCP Server
 * 
 * This is the main entry point for the Meilisearch MCP server.
 * It integrates with Meilisearch to provide search capabilities to LLMs via the Model Context Protocol.
 */

// Import tool registration functions
// Server configuration
interface ServerConfig {
  host: string;
  apiKey: string;
}

// Initialize configuration from environment variables
const config: ServerConfig = {
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY || "",
};

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: config.host,
  headers: {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
  },
});

// Helper function to handle API errors
const handleApiError = (error: any): string => {
  if (error.response) {
    const { status, data } = error.response;
    return `Meilisearch API error (${status}): ${JSON.stringify(data)}`;
  }
  return `Error connecting to Meilisearch: ${error.message}`;
};

/**
 * Main function to initialize and start the MCP server
 */
async function main() {
  console.error("Starting Meilisearch MCP Server...");
  
  // Create the MCP server instance
  const server = new McpServer({
    name: "meilisearch",
    version: "1.0.0",
  });
  
  // Register all tools
  registerIndexTools(server);
  registerDocumentTools(server);
  registerSearchTools(server);
  registerSettingsTools(server);
  registerVectorTools(server);
  registerSystemTools(server);
  registerTaskTools(server);
  
  // Connect to the stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Meilisearch MCP Server is running on stdio transport");
}

// Start the server
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
