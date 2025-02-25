import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Meilisearch MCP Server - Movies Demo
 *
 * This script demonstrates how to use the Meilisearch MCP server with a sample movie dataset.
 * It creates an index, adds documents, configures settings, and performs searches.
 */

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MEILISEARCH_HOST =
  process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || '';

// Create an axios instance for Meilisearch
const meilisearch = axios.create({
  baseURL: MEILISEARCH_HOST,
  headers: MEILISEARCH_API_KEY
    ? { Authorization: `Bearer ${MEILISEARCH_API_KEY}` }
    : {},
  timeout: 5000,
});

// Sample movie data
const movies = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    genres: ['Drama'],
    year: 1994,
    rating: 9.3,
  },
  {
    id: 2,
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    genres: ['Crime', 'Drama'],
    year: 1972,
    rating: 9.2,
  },
  {
    id: 3,
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genres: ['Action', 'Crime', 'Drama'],
    year: 2008,
    rating: 9.0,
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genres: ['Crime', 'Drama'],
    year: 1994,
    rating: 8.9,
  },
  {
    id: 5,
    title: 'The Lord of the Rings: The Return of the King',
    director: 'Peter Jackson',
    genres: ['Action', 'Adventure', 'Drama'],
    year: 2003,
    rating: 8.9,
  },
];

/**
 * Create a movies index
 */
async function createMoviesIndex() {
  try {
    const response = await meilisearch.post('/indexes', {
      uid: 'movies',
      primaryKey: 'id',
    });
    console.log('Index created:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating index:',
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Add movies to the index
 */
async function addMovies() {
  try {
    const response = await meilisearch.post(
      '/indexes/movies/documents',
      movies
    );
    console.log('Movies added:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error adding movies:',
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Update index settings
 */
async function updateSettings() {
  try {
    const settings = {
      searchableAttributes: ['title', 'director', 'genres'],
      filterableAttributes: ['genres', 'year', 'rating'],
      sortableAttributes: ['year', 'rating'],
    };

    const response = await meilisearch.patch(
      '/indexes/movies/settings',
      settings
    );
    console.log('Settings updated:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating settings:',
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Search for movies
 */
async function searchMovies(query, filters = null) {
  try {
    const params = { q: query };
    if (filters) {
      params.filter = filters;
    }

    const response = await meilisearch.post('/indexes/movies/search', params);
    console.log(`Search results for "${query}":`, response.data.hits);
    return response.data;
  } catch (error) {
    console.error(
      'Error searching movies:',
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Wait for a task to complete
 */
async function waitForTask(taskId) {
  try {
    let task;
    do {
      const response = await meilisearch.get(`/tasks/${taskId}`);
      task = response.data;

      if (['succeeded', 'failed', 'canceled'].includes(task.status)) {
        break;
      }

      console.log(`Task ${taskId} is ${task.status}. Waiting...`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } while (true);

    console.log(`Task ${taskId} ${task.status}`);
    return task;
  } catch (error) {
    console.error(
      'Error waiting for task:',
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Run the demo
 */
async function runDemo() {
  try {
    console.log('Starting Meilisearch Movies Demo...');

    // Create index
    const createIndexTask = await createMoviesIndex();
    await waitForTask(createIndexTask.taskUid);

    // Add movies
    const addMoviesTask = await addMovies();
    await waitForTask(addMoviesTask.taskUid);

    // Update settings
    const updateSettingsTask = await updateSettings();
    await waitForTask(updateSettingsTask.taskUid);

    // Perform searches
    await searchMovies('dark');
    await searchMovies('', 'genres = Drama AND year > 2000');
    await searchMovies('', 'rating > 9');

    console.log('Demo completed successfully!');
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

// Run the demo
runDemo();
