import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import apiClient from '../utils/api-client.js';
import { createErrorResponse } from '../utils/error-handler.js';

/**
 * Meilisearch Search Tools
 * 
 * This module implements MCP tools for searching in Meilisearch indexes.
 */

// Define types for search parameters
interface SearchParams {
  indexUid: string;
  q: string;
  limit?: number;
  offset?: number;
  filter?: string;
  sort?: string[];
  facets?: string[];
  attributesToRetrieve?: string[];
  attributesToCrop?: string[];
  cropLength?: number;
  attributesToHighlight?: string[];
  highlightPreTag?: string;
  highlightPostTag?: string;
  showMatchesPosition?: boolean;
  matchingStrategy?: string;
}

interface MultiSearchParams {
  searches: string;
}

/**
 * Register search tools with the MCP server
 * 
 * @param server - The MCP server instance
 */
export const registerSearchTools = (server: McpServer) => {
  // Search in an index
  server.tool(
    'search',
    'Search for documents in a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      q: z.string().describe('Search query'),
      limit: z.number().min(1).max(1000).optional().describe('Maximum number of results to return (default: 20)'),
      offset: z.number().min(0).optional().describe('Number of results to skip (default: 0)'),
      filter: z.string().optional().describe('Filter query to apply'),
      sort: z.array(z.string()).optional().describe('Attributes to sort by, e.g. ["price:asc"]'),
      facets: z.array(z.string()).optional().describe('Facets to return'),
      attributesToRetrieve: z.array(z.string()).optional().describe('Attributes to include in results'),
      attributesToCrop: z.array(z.string()).optional().describe('Attributes to crop'),
      cropLength: z.number().optional().describe('Length at which to crop cropped attributes'),
      attributesToHighlight: z.array(z.string()).optional().describe('Attributes to highlight'),
      highlightPreTag: z.string().optional().describe('Tag to insert before highlighted text'),
      highlightPostTag: z.string().optional().describe('Tag to insert after highlighted text'),
      showMatchesPosition: z.boolean().optional().describe('Whether to include match positions in results'),
      matchingStrategy: z.string().optional().describe("Matching strategy: 'all' or 'last'"),
    },
    async ({ 
      indexUid, 
      q, 
      limit, 
      offset, 
      filter, 
      sort, 
      facets, 
      attributesToRetrieve, 
      attributesToCrop, 
      cropLength, 
      attributesToHighlight, 
      highlightPreTag, 
      highlightPostTag, 
      showMatchesPosition, 
      matchingStrategy 
    }: SearchParams) => {
      try {
        const response = await apiClient.post(`/indexes/${indexUid}/search`, {
          q,
          limit,
          offset,
          filter,
          sort,
          facets,
          attributesToRetrieve,
          attributesToCrop,
          cropLength,
          attributesToHighlight,
          highlightPreTag,
          highlightPostTag,
          showMatchesPosition,
          matchingStrategy,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Multi-search across multiple indexes
  server.tool(
    'multi-search',
    'Perform multiple searches in one request',
    {
      searches: z.string().describe('JSON array of search queries, each with indexUid and q fields'),
    },
    async ({ searches }: MultiSearchParams) => {
      try {
        // Parse the searches string to ensure it's valid JSON
        const parsedSearches = JSON.parse(searches);
        
        // Ensure searches is an array
        if (!Array.isArray(parsedSearches)) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Searches must be a JSON array' }],
          };
        }
        
        // Ensure each search has at least indexUid
        for (const search of parsedSearches) {
          if (!search.indexUid) {
            return {
              isError: true,
              content: [{ type: 'text', text: 'Each search must have an indexUid field' }],
            };
          }
        }
        
        const response = await apiClient.post('/multi-search', {
          queries: parsedSearches,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Facet search
  server.tool(
    'facet-search',
    'Search for facet values matching specific criteria',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      facetName: z.string().describe('Name of the facet to search'),
      facetQuery: z.string().optional().describe('Query to match against facet values'),
      filter: z.string().optional().describe('Filter to apply to the base search'),
    },
    async ({ indexUid, facetName, facetQuery, filter }) => {
      try {
        const params: Record<string, any> = {
          facetName,
        };
        
        if (facetQuery !== undefined) params.facetQuery = facetQuery;
        if (filter) params.filter = filter;
        
        const response = await apiClient.post(`/indexes/${indexUid}/facet-search`, params);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );
};

export default registerSearchTools; 
