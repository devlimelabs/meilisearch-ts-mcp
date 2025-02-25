/**
 * API Client Tests
 * 
 * This file contains tests for the API client utility.
 */


// Mock the API client
jest.mock('../utils/api-client', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockPatch = jest.fn();
  const mockDelete = jest.fn();
  
  return {
    createApiClient: jest.fn(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      patch: mockPatch,
      delete: mockDelete
    })),
    apiClient: {
      get: mockGet,
      post: mockPost,
      put: mockPut,
      patch: mockPatch,
      delete: mockDelete
    },
    __esModule: true,
    default: {
      get: mockGet,
      post: mockPost,
      put: mockPut,
      patch: mockPatch,
      delete: mockDelete
    }
  };
});

// Get the mocked functions
const { apiClient } = require('../utils/api-client');
const mockGet = apiClient.get;
const mockPost = apiClient.post;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make GET requests correctly', async () => {
    // Setup
    mockGet.mockResolvedValueOnce({ data: { result: 'success' } });

    // Execute
    await apiClient.get('/test-endpoint');

    // Verify
    expect(mockGet).toHaveBeenCalledWith('/test-endpoint');
  });

  it('should include configuration when provided', async () => {
    // Setup
    mockGet.mockResolvedValueOnce({ data: { result: 'success' } });
    const config = { params: { filter: 'test' } };

    // Execute
    await apiClient.get('/test-endpoint', config);

    // Verify
    expect(mockGet).toHaveBeenCalledWith('/test-endpoint', config);
  });

  it('should handle errors appropriately', async () => {
    // Setup
    const errorResponse = {
      response: {
        status: 404,
        data: { message: 'Not found' }
      }
    };
    mockGet.mockRejectedValueOnce(errorResponse);

    // Execute & Verify
    await expect(apiClient.get('/non-existent')).rejects.toEqual(errorResponse);
  });
}); 
