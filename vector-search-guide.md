# Vector Search with Meilisearch MCP

This guide explains how to use the vector search capabilities in the Meilisearch MCP server. Vector search allows for semantic similarity matching, enabling more sophisticated search experiences.

## Overview

Vector search in Meilisearch enables:
- Semantic search based on the meaning of content
- Similar document recommendations
- Hybrid search combining keyword and semantic results
- Multi-modal search experiences

## Enabling Vector Search

Vector search is an experimental feature in Meilisearch. Before using it, you must enable it:

```
# Enable vector search experimental feature
enable-vector-search
```

## Setting Up Vector Search

### 1. Configure Embedders

First, configure an embedder for your index:

```
# Example: Configure OpenAI embedder
update-embedders {
  "indexUid": "my-index",
  "embedders": {
    "openai-embedder": {
      "source": "openAi",
      "model": "text-embedding-3-small",
      "dimensions": 1536
    }
  }
}
```

Common embedder sources include:
- `openAi` - OpenAI embeddings
- `huggingFace` - HuggingFace models
- `ollama` - Ollama local models
- `rest` - Custom REST API endpoint
- `userProvided` - Pre-computed embeddings

### 2. Add Documents with Vectors

You can add documents with pre-computed vectors:

```
# Add documents with vector embeddings
add-documents {
  "indexUid": "my-index",
  "documents": [
    {
      "id": "1",
      "title": "Vector search guide",
      "content": "This is about vector search...",
      "_vectors": {
        "openai-embedder": [0.123, 0.456, ...]
      }
    }
  ]
}
```

Alternatively, if you've configured an embedder, Meilisearch can generate the embeddings automatically from your text fields.

## Performing Vector Searches

### Basic Vector Search

If you have a vector representation of your query:

```
# Vector search
search {
  "indexUid": "my-index",
  "vector": [0.123, 0.456, ...],
  "limit": 10
}
```

### Hybrid Search

Combine traditional keyword search with vector search:

```
# Hybrid search
search {
  "indexUid": "my-index",
  "q": "machine learning techniques",
  "vector": [0.123, 0.456, ...],
  "hybridEmbedder": "openai-embedder",
  "hybridSemanticRatio": 0.7
}
```

The `hybridSemanticRatio` controls the balance between semantic (vector) and lexical (keyword) search:
- 0.0: Only keyword search
- 1.0: Only vector search
- 0.5: Equal weight to both

### Finding Similar Documents

Find documents similar to an existing document:

```
# Similar documents search
similar-documents {
  "indexUid": "my-index",
  "id": "doc123",
  "embedder": "openai-embedder",
  "limit": 5
}
```

## Multi-Index Vector Search

Perform vector searches across multiple indexes:

```
# Multi-index vector search
multi-search {
  "queries": [
    {
      "indexUid": "products", 
      "vector": [0.1, 0.2, ...],
      "hybridEmbedder": "openai-embedder",
      "limit": 5
    },
    {
      "indexUid": "articles",
      "vector": [0.1, 0.2, ...],
      "hybridEmbedder": "openai-embedder",
      "limit": 5
    }
  ],
  "federation": {
    "limit": 10
  }
}
```

## Best Practices

1. **Choose the right embedder**: Different models have different strengths and capabilities.

2. **Experiment with hybrid ratios**: The ideal balance between vector and keyword search depends on your content and use case.

3. **Pre-compute embeddings** when possible to improve indexing performance.

4. **Use filters** with vector search to constrain results to relevant subsets.

5. **Consider reranking** for critical applications to improve result quality.

## Potential Use Cases

- **Semantic code search**: Find code examples by describing functionality
- **Similar product recommendations**: "Show me products like this one"
- **Research document similarity**: Find related academic papers or reports
- **Natural language queries**: Search for concepts rather than exact keywords
- **Content discovery**: Find content with similar themes or topics

## Limitations

- Vector search is an experimental feature and may change in future Meilisearch releases
- Vector search performs best with larger datasets where semantic similarity matters
- Compute requirements increase with vector dimensions and dataset size
