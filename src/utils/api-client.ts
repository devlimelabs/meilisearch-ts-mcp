import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import config from '../config.js';

/**
 * Meilisearch API client
 * 
 * This module provides a configured Axios instance for making requests to the Meilisearch API.
 */

/**
 * Creates a configured Axios instance for Meilisearch API requests
 * 
 * @returns An Axios instance with base configuration
 */
export const createApiClient = () => {
  const instance = axios.create({
    baseURL: config.host,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: config.timeout,
  });

  return {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
      instance.get(url, config),
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
      instance.post(url, data, config),
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
      instance.put(url, data, config),
    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
      instance.patch(url, data, config),
    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
      instance.delete(url, config),
  };
};

// Create and export a singleton instance of the API client
export const apiClient = createApiClient();

// Re-export for direct use
export default apiClient; 
