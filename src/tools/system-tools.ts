import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import apiClient from '../utils/api-client.js';
import { createErrorResponse } from '../utils/error-handler.js';

/**
 * Meilisearch System Tools
 * 
 * This module implements MCP tools for system operations in Meilisearch.
 */

/**
 * Register system tools with the MCP server
 * 
 * @param server - The MCP server instance
 */
export const registerSystemTools = (server: McpServer) => {
  // Get health status
  server.tool(
    'health',
    'Check if the Meilisearch server is healthy',
    {},
    async () => {
      try {
        const response = await apiClient.get('/health');
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get version information
  server.tool(
    'version',
    'Get the version information of the Meilisearch server',
    {},
    async () => {
      try {
        const response = await apiClient.get('/version');
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get system information
  server.tool(
    'info',
    'Get the system information of the Meilisearch server',
    {},
    async () => {
      try {
        const response = await apiClient.get('/');
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get statistics
  server.tool(
    'stats',
    'Get statistics about all indexes or a specific index',
    {
      indexUid: z.string().optional().describe('Unique identifier of the index (optional, if not provided stats for all indexes will be returned)'),
    },
    async ({ indexUid }) => {
      try {
        const endpoint = indexUid ? `/indexes/${indexUid}/stats` : '/stats';
        const response = await apiClient.get(endpoint);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Get all tasks (with optional filtering)
  server.tool(
    'get-tasks',
    'Get information about tasks with optional filtering',
    {
      limit: z.number().min(0).optional().describe('Maximum number of tasks to return'),
      from: z.number().min(0).optional().describe('Task uid from which to start fetching'),
      status: z.enum(['enqueued', 'processing', 'succeeded', 'failed', 'canceled']).optional().describe('Status of tasks to return'),
      type: z.enum(['indexCreation', 'indexUpdate', 'indexDeletion', 'documentAddition', 'documentUpdate', 'documentDeletion', 'settingsUpdate', 'dumpCreation', 'taskCancelation']).optional().describe('Type of tasks to return'),
      indexUids: z.array(z.string()).optional().describe('UIDs of the indexes on which tasks were performed'),
    },
    async ({ limit, from, status, type, indexUids }) => {
      try {
        const params: Record<string, any> = {};
        if (limit !== undefined) params.limit = limit;
        if (from !== undefined) params.from = from;
        if (status) params.status = status;
        if (type) params.type = type;
        if (indexUids && indexUids.length > 0) params.indexUids = indexUids.join(',');
        
        const response = await apiClient.get('/tasks', { params });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Delete tasks
  server.tool(
    'delete-tasks',
    'Delete tasks based on provided filters',
    {
      statuses: z.array(z.enum(['succeeded', 'failed', 'canceled'])).optional().describe('Statuses of tasks to delete'),
      types: z.array(z.enum(['indexCreation', 'indexUpdate', 'indexDeletion', 'documentAddition', 'documentUpdate', 'documentDeletion', 'settingsUpdate', 'dumpCreation', 'taskCancelation'])).optional().describe('Types of tasks to delete'),
      indexUids: z.array(z.string()).optional().describe('UIDs of the indexes on which tasks to delete were performed'),
      uids: z.array(z.number()).optional().describe('UIDs of the tasks to delete'),
      canceledBy: z.array(z.number()).optional().describe('UIDs of the tasks that canceled tasks to delete'),
      beforeUid: z.number().optional().describe('Delete tasks whose uid is before this value'),
      beforeStartedAt: z.string().optional().describe('Delete tasks that started processing before this date (ISO 8601 format)'),
      beforeFinishedAt: z.string().optional().describe('Delete tasks that finished processing before this date (ISO 8601 format)'),
    },
    async ({ statuses, types, indexUids, uids, canceledBy, beforeUid, beforeStartedAt, beforeFinishedAt }) => {
      try {
        const body: Record<string, any> = {};
        if (statuses && statuses.length > 0) body.statuses = statuses;
        if (types && types.length > 0) body.types = types;
        if (indexUids && indexUids.length > 0) body.indexUids = indexUids;
        if (uids && uids.length > 0) body.uids = uids;
        if (canceledBy && canceledBy.length > 0) body.canceledBy = canceledBy;
        if (beforeUid !== undefined) body.beforeUid = beforeUid;
        if (beforeStartedAt) body.beforeStartedAt = beforeStartedAt;
        if (beforeFinishedAt) body.beforeFinishedAt = beforeFinishedAt;
        
        const response = await apiClient.post('/tasks/delete', body);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );
};

export default registerSystemTools; 
