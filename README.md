# Meilisearch MCP Server

[![smithery badge](https://smithery.ai/badge/@devlimelabs/meilisearch-ts-mcp)](https://smithery.ai/server/@devlimelabs/meilisearch-ts-mcp)

A Model Context Protocol (MCP) server implementation for Meilisearch, enabling AI assistants to interact with Meilisearch through a standardized interface.

## Features

- **Index Management**: Create, update, and delete indexes
- **Document Management**: Add, update, and delete documents
- **Search Capabilities**: Perform searches with various parameters and filters
- **Settings Management**: Configure index settings
- **Task Management**: Monitor and manage asynchronous tasks
- **System Operations**: Health checks, version information, and statistics
- **Vector Search**: Experimental vector search capabilities

## Installation

### Installing via Smithery

To install Meilisearch MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@devlimelabs/meilisearch-ts-mcp):

```bash
npx -y @smithery/cli install @devlimelabs/meilisearch-ts-mcp --client claude
```

### Manual Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/devlimelabs/meilisearch-ts-mcp.git
   cd meilisearch-ts-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   
4. Edit the `.env` file to configure your Meilisearch connection.

## Docker Setup

The Meilisearch MCP Server can be run in a Docker container for easier deployment and isolation.

### Using Docker Compose

The easiest way to get started with Docker is to use Docker Compose:

```bash
# Start the Meilisearch MCP Server
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down
```

### Building and Running the Docker Image Manually

You can also build and run the Docker image manually:

```bash
# Build the Docker image
docker build -t meilisearch-ts-mcp .

# Run the container
docker run -p 3000:3000 --env-file .env meilisearch-ts-mcp
```

## Development Setup

For developers who want to contribute to the Meilisearch MCP Server, we provide a convenient setup script:

```bash
# Clone the repository
git clone https://github.com/devlimelabs-ts-mcp/meilisearch-ts-mcp.git
cd meilisearch-ts-mcp

# Run the development setup script
./scripts/setup-dev.sh
```

The setup script will:
1. Create a `.env` file from `.env.example` if it doesn't exist
2. Install dependencies
3. Build the project
4. Run tests to ensure everything is working correctly

After running the setup script, you can start the server in development mode:

```bash
npm run dev
```

## Usage

### Building the Project

```bash
npm run build
```

### Running the Server

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## Claude Desktop Integration

The Meilisearch MCP Server can be integrated with Claude for Desktop, allowing you to interact with your Meilisearch instance directly through Claude.

### Automated Setup

We provide a setup script that automatically configures Claude for Desktop to work with the Meilisearch MCP Server:

```bash
# First build the project
npm run build

# Then run the setup script
node scripts/claude-desktop-setup.js
```

The script will:
1. Detect your operating system and locate the Claude for Desktop configuration file
2. Read your Meilisearch configuration from the `.env` file
3. Generate the necessary configuration for Claude for Desktop
4. Provide instructions for updating your Claude for Desktop configuration

### Manual Setup

If you prefer to manually configure Claude for Desktop:

1. Locate your Claude for Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add the following configuration (adjust paths as needed):

```json
{
  "mcpServers": {
    "meilisearch": {
      "command": "node",
      "args": ["/path/to/meilisearch-ts-mcp/dist/index.js"],
      "env": {
        "MEILISEARCH_HOST": "http://localhost:7700",
        "MEILISEARCH_API_KEY": "your-api-key"
      }
    }
  }
}
```

3. Restart Claude for Desktop to apply the changes.

4. In Claude, type: "I want to use the Meilisearch MCP server" to activate the integration.

## Cursor Integration

The Meilisearch MCP Server can also be integrated with [Cursor](https://cursor.com), an AI-powered code editor.

### Setting Up MCP in Cursor

1. Install and set up the Meilisearch MCP Server:
   ```bash
   git clone https://github.com/devlimelabs/meilisearch-ts-mcp.git
   cd meilisearch-ts-mcp
   npm install
   npm run build
   ```

2. Start the MCP server:
   ```bash
   npm start
   ```

3. In Cursor, open the Command Palette (Cmd/Ctrl+Shift+P) and search for "MCP: Connect to MCP Server".

4. Select "Connect to a local MCP server" and enter the following details:
   - **Name**: Meilisearch
   - **Command**: node
   - **Arguments**: /absolute/path/to/meilisearch-ts-mcp/dist/index.js
   - **Environment Variables**: 
     ```
     MEILISEARCH_HOST=http://localhost:7700
     MEILISEARCH_API_KEY=your-api-key
     ```

5. Click "Connect" to establish the connection.

6. You can now interact with your Meilisearch instance through Cursor by typing commands like "Search my Meilisearch index for documents about..."

## Available Tools

The Meilisearch MCP Server provides the following tools:

### Index Tools
- `create-index`: Create a new index
- `get-index`: Get information about an index
- `list-indexes`: List all indexes
- `update-index`: Update an index
- `delete-index`: Delete an index

### Document Tools
- `add-documents`: Add documents to an index
- `get-document`: Get a document by ID
- `get-documents`: Get multiple documents
- `update-documents`: Update documents
- `delete-document`: Delete a document by ID
- `delete-documents`: Delete multiple documents
- `delete-all-documents`: Delete all documents in an index

### Search Tools
- `search`: Search for documents
- `multi-search`: Perform multiple searches in a single request

### Settings Tools
- `get-settings`: Get index settings
- `update-settings`: Update index settings
- `reset-settings`: Reset index settings to default
- Various specific settings tools (synonyms, stop words, ranking rules, etc.)

### Task Tools
- `list-tasks`: List tasks with optional filtering
- `get-task`: Get information about a specific task
- `cancel-tasks`: Cancel tasks based on provided filters
- `wait-for-task`: Wait for a specific task to complete

### System Tools
- `health`: Check the health status of the Meilisearch server
- `version`: Get version information
- `info`: Get system information
- `stats`: Get statistics about indexes

### Vector Tools (Experimental)
- `enable-vector-search`: Enable vector search
- `get-experimental-features`: Get experimental features status
- `update-embedders`: Configure embedders
- `get-embedders`: Get embedders configuration
- `reset-embedders`: Reset embedders configuration
- `vector-search`: Perform vector search

## License

MIT
