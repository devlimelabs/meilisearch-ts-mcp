import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import apiClient from '../utils/api-client.js';
import { createErrorResponse } from '../utils/error-handler.js';

/**
 * Meilisearch Vector Search Tools
 * 
 * This module implements MCP tools for vector search capabilities in Meilisearch.
 * Note: Vector search is an experimental feature in Meilisearch.
 */

/**
 * Register vector search tools with the MCP server
 * 
 * @param server - The MCP server instance
 */
export const registerVectorTools = (server: McpServer) => {
  // Enable vector search experimental feature
  server.tool(
    "enable-vector-search",
    "Enable the vector search experimental feature in Meilisearch",
    {},
    async () => {
      try {
        const response = await apiClient.post('/experimental-features', {
          vectorStore: true,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get experimental features status
  server.tool(
    "get-experimental-features",
    "Get the status of experimental features in Meilisearch",
    {},
    async () => {
      try {
        const response = await apiClient.get('/experimental-features');
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Update embedders configuration
  server.tool(
    "update-embedders",
    "Configure embedders for vector search",
    {
      indexUid: z.string().describe("Unique identifier of the index"),
      embedders: z.string().describe("JSON object containing embedder configurations"),
    },
    async ({ indexUid, embedders }) => {
      try {
        // Parse the embedders string to ensure it's valid JSON
        const parsedEmbedders = JSON.parse(embedders);
        
        // Ensure embedders is an object
        if (typeof parsedEmbedders !== 'object' || parsedEmbedders === null || Array.isArray(parsedEmbedders)) {
          return {
            isError: true,
            content: [{ type: "text", text: "Embedders must be a JSON object" }],
          };
        }
        
        const response = await apiClient.patch(`/indexes/${indexUid}/settings/embedders`, parsedEmbedders);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get embedders configuration
  server.tool(
    "get-embedders",
    "Get the embedders configuration for an index",
    {
      indexUid: z.string().describe("Unique identifier of the index"),
    },
    async ({ indexUid }) => {
      try {
        const response = await apiClient.get(`/indexes/${indexUid}/settings/embedders`);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Reset embedders configuration
  server.tool(
    "reset-embedders",
    "Reset the embedders configuration for an index",
    {
      indexUid: z.string().describe("Unique identifier of the index"),
    },
    async ({ indexUid }) => {
      try {
        const response = await apiClient.delete(`/indexes/${indexUid}/settings/embedders`);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Perform vector search
  server.tool(
    "vector-search",
    "Perform a vector search in a Meilisearch index",
    {
      indexUid: z.string().describe("Unique identifier of the index"),
      vector: z.string().describe("JSON array representing the vector to search for"),
      limit: z.number().min(1).max(1000).optional().describe("Maximum number of results to return (default: 20)"),
      offset: z.number().min(0).optional().describe("Number of results to skip (default: 0)"),
      filter: z.string().optional().describe("Filter to apply (e.g., 'genre = horror AND year > 2020')"),
      embedder: z.string().optional().describe("Name of the embedder to use (if omitted, a 'vector' must be provided)"),
      attributes: z.array(z.string()).optional().describe("Attributes to include in the vector search"),
      query: z.string().optional().describe("Text query to search for (if using 'embedder' instead of 'vector')"),
      hybrid: z.boolean().optional().describe("Whether to perform a hybrid search (combining vector and text search)"),
      hybridRatio: z.number().min(0).max(1).optional().describe("Ratio of vector vs text search in hybrid search (0-1, default: 0.5)"),
    },
    async ({ indexUid, vector, limit, offset, filter, embedder, attributes, query, hybrid, hybridRatio }) => {
      try {
        const searchParams: Record<string, any> = {};
        
        // Add required vector parameter
        if (vector) {
          try {
            searchParams.vector = JSON.parse(vector);
          } catch (parseError) {
            return {
              isError: true,
              content: [{ type: "text", text: "Vector must be a valid JSON array" }],
            };
          }
        }
        
        // Add embedder parameters
        if (embedder) {
          searchParams.embedder = embedder;
          
          if (query !== undefined) {
            searchParams.q = query;
          }
        }
        
        // Ensure we have either vector or (embedder + query)
        if (!vector && (!embedder || query === undefined)) {
          return {
            isError: true,
            content: [{ type: "text", text: "Either 'vector' or both 'embedder' and 'query' must be provided" }],
          };
        }
        
        // Add optional parameters
        if (limit !== undefined) searchParams.limit = limit;
        if (offset !== undefined) searchParams.offset = offset;
        if (filter) searchParams.filter = filter;
        if (attributes?.length) searchParams.attributes = attributes;
        if (hybrid !== undefined) searchParams.hybrid = hybrid;
        if (hybridRatio !== undefined) searchParams.hybridRatio = hybridRatio;
        
        const response = await apiClient.post(`/indexes/${indexUid}/search`, searchParams);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );
};

export default registerVectorTools; 
