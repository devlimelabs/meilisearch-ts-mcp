/**
 * Error handling utilities for Meilisearch API responses
 */


/**
 * Formats Meilisearch API errors for consistent error messaging
 * 
 * @param error - The error from the API request
 * @returns A formatted error message
 */
export const handleApiError = (error: any): string => {
  // If it's an Axios error with a response
  if (error.isAxiosError && error.response) {
    const { status, data } = error.response;
    // Return formatted error with status code and response data
    return `Meilisearch API error (${status}): ${JSON.stringify(data)}`;
  }
  
  // If it's a network error or other error
  return `Error connecting to Meilisearch: ${error.message}`;
};

/**
 * Creates a standardized error response object for MCP tools
 * 
 * @param error - The error from the API request
 * @returns An MCP tool response object with error flag
 */
export const createErrorResponse = (error: any) => {
  return {
    isError: true,
    content: [{ type: "text", text: handleApiError(error) }],
  };
};

export default {
  handleApiError,
  createErrorResponse,
}; 
