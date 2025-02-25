import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import apiClient from '../utils/api-client.js';
import { createErrorResponse } from '../utils/error-handler.js';

/**
 * Meilisearch Settings Management Tools
 * 
 * This module implements MCP tools for managing index settings in Meilisearch.
 */

/**
 * Register settings management tools with the MCP server
 * 
 * @param server - The MCP server instance
 */
export const registerSettingsTools = (server: McpServer) => {
  // Get all settings
  server.tool(
    "get-settings",
    "Get all settings for a Meilisearch index",
    {
      indexUid: z.string().describe("Unique identifier of the index"),
    },
    async ({ indexUid }) => {
      try {
        const response = await apiClient.get(`/indexes/${indexUid}/settings`);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Update settings
  server.tool(
    "update-settings",
    "Update settings for a Meilisearch index",
    {
      indexUid: z.string().describe("Unique identifier of the index"),
      settings: z.string().describe("JSON object containing settings to update"),
    },
    async ({ indexUid, settings }) => {
      try {
        // Parse the settings string to ensure it's valid JSON
        const parsedSettings = JSON.parse(settings);
        
        // Ensure settings is an object
        if (typeof parsedSettings !== 'object' || parsedSettings === null || Array.isArray(parsedSettings)) {
          return {
            isError: true,
            content: [{ type: "text", text: "Settings must be a JSON object" }],
          };
        }
        
        const response = await apiClient.patch(`/indexes/${indexUid}/settings`, parsedSettings);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Reset settings
  server.tool(
    "reset-settings",
    "Reset all settings for a Meilisearch index to their default values",
    {
      indexUid: z.string().describe("Unique identifier of the index"),
    },
    async ({ indexUid }) => {
      try {
        const response = await apiClient.delete(`/indexes/${indexUid}/settings`);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get specific settings
  const specificSettingsTools = [
    {
      name: "get-searchable-attributes",
      endpoint: "searchable-attributes",
      description: "Get the searchable attributes setting",
    },
    {
      name: "get-displayed-attributes",
      endpoint: "displayed-attributes",
      description: "Get the displayed attributes setting",
    },
    {
      name: "get-filterable-attributes",
      endpoint: "filterable-attributes",
      description: "Get the filterable attributes setting",
    },
    {
      name: "get-sortable-attributes",
      endpoint: "sortable-attributes",
      description: "Get the sortable attributes setting",
    },
    {
      name: "get-ranking-rules",
      endpoint: "ranking-rules",
      description: "Get the ranking rules setting",
    },
    {
      name: "get-stop-words",
      endpoint: "stop-words",
      description: "Get the stop words setting",
    },
    {
      name: "get-synonyms",
      endpoint: "synonyms",
      description: "Get the synonyms setting",
    },
    {
      name: "get-distinct-attribute",
      endpoint: "distinct-attribute",
      description: "Get the distinct attribute setting",
    },
    {
      name: "get-typo-tolerance",
      endpoint: "typo-tolerance",
      description: "Get the typo tolerance setting",
    },
    {
      name: "get-faceting",
      endpoint: "faceting",
      description: "Get the faceting setting",
    },
    {
      name: "get-pagination",
      endpoint: "pagination",
      description: "Get the pagination setting",
    },
  ];

  // Create a tool for each specific setting
  specificSettingsTools.forEach(({ name, endpoint, description }) => {
    server.tool(
      name,
      description,
      {
        indexUid: z.string().describe("Unique identifier of the index"),
      },
      async ({ indexUid }) => {
        try {
          const response = await apiClient.get(`/indexes/${indexUid}/settings/${endpoint}`);
          return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
          };
        } catch (error) {
          return createErrorResponse(error);
        }
      }
    );
  });

  // Update specific settings
  const updateSettingsTools = [
    {
      name: "update-searchable-attributes",
      endpoint: "searchable-attributes",
      description: "Update the searchable attributes setting",
    },
    {
      name: "update-displayed-attributes",
      endpoint: "displayed-attributes",
      description: "Update the displayed attributes setting",
    },
    {
      name: "update-filterable-attributes",
      endpoint: "filterable-attributes",
      description: "Update the filterable attributes setting",
    },
    {
      name: "update-sortable-attributes",
      endpoint: "sortable-attributes",
      description: "Update the sortable attributes setting",
    },
    {
      name: "update-ranking-rules",
      endpoint: "ranking-rules",
      description: "Update the ranking rules setting",
    },
    {
      name: "update-stop-words",
      endpoint: "stop-words",
      description: "Update the stop words setting",
    },
    {
      name: "update-synonyms",
      endpoint: "synonyms",
      description: "Update the synonyms setting",
    },
    {
      name: "update-distinct-attribute",
      endpoint: "distinct-attribute",
      description: "Update the distinct attribute setting",
    },
    {
      name: "update-typo-tolerance",
      endpoint: "typo-tolerance",
      description: "Update the typo tolerance setting",
    },
    {
      name: "update-faceting",
      endpoint: "faceting",
      description: "Update the faceting setting",
    },
    {
      name: "update-pagination",
      endpoint: "pagination",
      description: "Update the pagination setting",
    },
  ];

  // Create an update tool for each specific setting
  updateSettingsTools.forEach(({ name, endpoint, description }) => {
    server.tool(
      name,
      description,
      {
        indexUid: z.string().describe("Unique identifier of the index"),
        value: z.string().describe("JSON value for the setting"),
      },
      async ({ indexUid, value }) => {
        try {
          // Parse the value string to ensure it's valid JSON
          const parsedValue = JSON.parse(value);
          
          const response = await apiClient.put(`/indexes/${indexUid}/settings/${endpoint}`, parsedValue);
          return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
          };
        } catch (error) {
          return createErrorResponse(error);
        }
      }
    );
  });

  // Reset specific settings
  const resetSettingsTools = [
    {
      name: "reset-searchable-attributes",
      endpoint: "searchable-attributes",
      description: "Reset the searchable attributes setting to its default value",
    },
    {
      name: "reset-displayed-attributes",
      endpoint: "displayed-attributes",
      description: "Reset the displayed attributes setting to its default value",
    },
    {
      name: "reset-filterable-attributes",
      endpoint: "filterable-attributes",
      description: "Reset the filterable attributes setting to its default value",
    },
    {
      name: "reset-sortable-attributes",
      endpoint: "sortable-attributes",
      description: "Reset the sortable attributes setting to its default value",
    },
    {
      name: "reset-ranking-rules",
      endpoint: "ranking-rules",
      description: "Reset the ranking rules setting to its default value",
    },
    {
      name: "reset-stop-words",
      endpoint: "stop-words",
      description: "Reset the stop words setting to its default value",
    },
    {
      name: "reset-synonyms",
      endpoint: "synonyms",
      description: "Reset the synonyms setting to its default value",
    },
    {
      name: "reset-distinct-attribute",
      endpoint: "distinct-attribute",
      description: "Reset the distinct attribute setting to its default value",
    },
    {
      name: "reset-typo-tolerance",
      endpoint: "typo-tolerance",
      description: "Reset the typo tolerance setting to its default value",
    },
    {
      name: "reset-faceting",
      endpoint: "faceting",
      description: "Reset the faceting setting to its default value",
    },
    {
      name: "reset-pagination",
      endpoint: "pagination",
      description: "Reset the pagination setting to its default value",
    },
  ];

  // Create a reset tool for each specific setting
  resetSettingsTools.forEach(({ name, endpoint, description }) => {
    server.tool(
      name,
      description,
      {
        indexUid: z.string().describe("Unique identifier of the index"),
      },
      async ({ indexUid }) => {
        try {
          const response = await apiClient.delete(`/indexes/${indexUid}/settings/${endpoint}`);
          return {
            content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
          };
        } catch (error) {
          return createErrorResponse(error);
        }
      }
    );
  });
};

export default registerSettingsTools; 
