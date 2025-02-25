/**
 * Global type declarations for external modules
 */

declare module '@modelcontextprotocol/sdk/server/mcp.js' {
  export class McpServer {
    constructor(options?: { name?: string; version?: string });
    
    tool(
      name: string,
      description: string,
      parameters: Record<string, any>,
      handler: (args: any, extra: any) => any | Promise<any>
    ): void;
    
    connect(transport: any): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/server/stdio.js' {
  export class StdioServerTransport {
    constructor();
  }
} 
