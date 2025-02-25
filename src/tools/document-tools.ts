import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import apiClient from '../utils/api-client.js';
import { createErrorResponse } from '../utils/error-handler.js';

/**
 * Meilisearch Document Management Tools
 * 
 * This module implements MCP tools for managing documents in Meilisearch indexes.
 */

// Define types for document parameters
interface GetDocumentsParams {
  indexUid: string;
  limit?: number;
  offset?: number;
  fields?: string[];
  filter?: string;
}

interface GetDocumentParams {
  indexUid: string;
  documentId: string;
  fields?: string[];
}

interface AddDocumentsParams {
  indexUid: string;
  documents: string;
  primaryKey?: string;
}

interface UpdateDocumentsParams {
  indexUid: string;
  documents: string;
  primaryKey?: string;
}

interface DeleteDocumentParams {
  indexUid: string;
  documentId: string;
}

interface DeleteDocumentsParams {
  indexUid: string;
  documentIds: string;
}

interface DeleteAllDocumentsParams {
  indexUid: string;
}

/**
 * Register document management tools with the MCP server
 * 
 * @param server - The MCP server instance
 */
export const registerDocumentTools = (server: McpServer) => {
  // Get documents from an index
  server.tool(
    'get-documents',
    'Get documents from a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      limit: z.number().min(1).max(1000).optional().describe('Maximum number of documents to return (default: 20)'),
      offset: z.number().min(0).optional().describe('Number of documents to skip (default: 0)'),
      fields: z.array(z.string()).optional().describe('Fields to return in the documents'),
      filter: z.string().optional().describe('Filter query to apply'),
    },
    async ({ indexUid, limit, offset, fields, filter }: GetDocumentsParams) => {
      try {
        const response = await apiClient.get(`/indexes/${indexUid}/documents`, {
          params: {
            limit,
            offset,
            fields: fields?.join(','),
            filter,
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

  // Get a single document by ID
  server.tool(
    'get-document',
    'Get a document by its ID from a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      documentId: z.string().describe('ID of the document to retrieve'),
      fields: z.array(z.string()).optional().describe('Fields to return in the document'),
    },
    async ({ indexUid, documentId, fields }: GetDocumentParams) => {
      try {
        const response = await apiClient.get(`/indexes/${indexUid}/documents/${documentId}`, {
          params: {
            fields: fields?.join(','),
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

  // Add documents to an index
  server.tool(
    'add-documents',
    'Add documents to a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      documents: z.string().describe('JSON array of documents to add'),
      primaryKey: z.string().optional().describe('Primary key for the documents'),
    },
    async ({ indexUid, documents, primaryKey }: AddDocumentsParams) => {
      try {
        // Parse the documents string to ensure it's valid JSON
        const parsedDocuments = JSON.parse(documents);
        
        // Ensure documents is an array
        if (!Array.isArray(parsedDocuments)) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Documents must be a JSON array' }],
          };
        }
        
        const params: Record<string, string> = {};
        if (primaryKey) {
          params.primaryKey = primaryKey;
        }
        
        const response = await apiClient.post(`/indexes/${indexUid}/documents`, parsedDocuments, {
          params,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Update documents in an index
  server.tool(
    'update-documents',
    'Update documents in a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      documents: z.string().describe('JSON array of documents to update'),
      primaryKey: z.string().optional().describe('Primary key for the documents'),
    },
    async ({ indexUid, documents, primaryKey }: UpdateDocumentsParams) => {
      try {
        // Parse the documents string to ensure it's valid JSON
        const parsedDocuments = JSON.parse(documents);
        
        // Ensure documents is an array
        if (!Array.isArray(parsedDocuments)) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Documents must be a JSON array' }],
          };
        }
        
        const params: Record<string, string> = {};
        if (primaryKey) {
          params.primaryKey = primaryKey;
        }
        
        const response = await apiClient.put(`/indexes/${indexUid}/documents`, parsedDocuments, {
          params,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Delete a document by ID
  server.tool(
    'delete-document',
    'Delete a document by its ID from a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      documentId: z.string().describe('ID of the document to delete'),
    },
    async ({ indexUid, documentId }: DeleteDocumentParams) => {
      try {
        const response = await apiClient.delete(`/indexes/${indexUid}/documents/${documentId}`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Delete multiple documents by ID
  server.tool(
    'delete-documents',
    'Delete multiple documents by their IDs from a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
      documentIds: z.string().describe('JSON array of document IDs to delete'),
    },
    async ({ indexUid, documentIds }: DeleteDocumentsParams) => {
      try {
        // Parse the document IDs string to ensure it's valid JSON
        const parsedDocumentIds = JSON.parse(documentIds);
        
        // Ensure document IDs is an array
        if (!Array.isArray(parsedDocumentIds)) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Document IDs must be a JSON array' }],
          };
        }
        
        const response = await apiClient.post(`/indexes/${indexUid}/documents/delete-batch`, parsedDocumentIds);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );

  // Delete all documents in an index
  server.tool(
    'delete-all-documents',
    'Delete all documents in a Meilisearch index',
    {
      indexUid: z.string().describe('Unique identifier of the index'),
    },
    async ({ indexUid }: DeleteAllDocumentsParams) => {
      try {
        const response = await apiClient.delete(`/indexes/${indexUid}/documents`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return createErrorResponse(error);
      }
    }
  );
};

export default registerDocumentTools; 
