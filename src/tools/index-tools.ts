import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import apiClient from '../utils/api-client.js';
import { createErrorResponse } from '../utils/error-handler.js';

/**
 * Meilisearch Index Management Tools
 * 
 * This module implements MCP tools for managing Meilisearch indexes.
 */

// Define types for index parameters
interface ListIndexesParams {
  limit?: number;
  offset?: number;
}

interface GetIndexParams {
  indexUid: string;
}

interface CreateIndexParams {
  indexUid: string;
  primaryKey?: string;
}

interface UpdateIndexParams {
  indexUid: string;
  primaryKey: string;
}

interface DeleteIndexParams {
  indexUid: string;
}

interface SwapIndexesParams {
  indexes: string;
}

/**
 * Register index management tools with the MCP server
 * 
 * @param server - The MCP server instance
 */
export const registerIndexTools = (server: McpServer) => {
  // List all indexes
  server.tool(
    'list-indexes',
    'List all indexes in the Meilisearch instance',
    {
      limit: z.number().min(1).max(100).optional().describe('Maximum number of indexes to return'),
      offset: z.number().min(0).optional().describe('Number of indexes to skip'),
    },
    async ({ limit, offset }: ListIndexesParams) => {
      try {
        const response = await apiClient.get('/indexes', {
          params: {
            limit,
            offset,
          },
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get index information
  server.tool(
    'get-index',
    'Get information about a specific Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
    },
    async ({ indexUid }: GetIndexParams) => {
      try {
        const response = await apiClient.get(`/indexes/${indexUid}`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Create a new index
  server.tool(
    'create-index',
    'Create a new Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier for the new index'),
      primaryKey: z.string().optional().describe('Primary key for the index'),
    },
    async ({ indexUid, primaryKey }: CreateIndexParams) => {
      try {
        const response = await apiClient.post('/indexes', {
          uid: indexUid,
          primaryKey,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Update an index
  server.tool(
    'update-index',
    'Update a Meilisearch index (currently only supports updating the primary key)',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      primaryKey: z.string().describe('New primary key for the index'),
    },
    async ({ indexUid, primaryKey }: UpdateIndexParams) => {
      try {
        const response = await apiClient.patch(`/indexes/${indexUid}`, {
          primaryKey,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Delete an index
  server.tool(
    'delete-index',
    'Delete a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index to delete'),
    },
    async ({ indexUid }: DeleteIndexParams) => {
      try {
        const response = await apiClient.delete(`/indexes/${indexUid}`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Swap indexes
  server.tool(
    'swap-indexes',
    'Swap two or more indexes in Meilisearch',
    {
      indexes: z.string().describe('JSON array of index pairs to swap, e.g. [["movies", "movies_new"]]'),
    },
    async ({ indexes }: SwapIndexesParams) => {
      try {
        // Parse the indexes string to ensure it's valid JSON
        const parsedIndexes = JSON.parse(indexes);
        
        // Ensure indexes is an array of arrays
        if (!Array.isArray(parsedIndexes) || !parsedIndexes.every(pair => Array.isArray(pair) && pair.length === 2)) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Indexes must be a JSON array of pairs, e.g. [["movies", "movies_new"]]' }],
          };
        }
        
        const response = await apiClient.post('/swap-indexes', parsedIndexes);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );
};

export default registerIndexTools; 
