// src/utils/ragEngine.js
// A simple TF-IDF and Cosine Similarity implementation in vanilla JS.

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(word => word.length > 2);
}

function calculateTfIdf(docs) {
  const tfList = [];
  const df = {};
  
  // Calculate TF (Term Frequency)
  docs.forEach(doc => {
    const tokens = tokenize(doc.text);
    const tf = {};
    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
    
    // Normalize TF
    const totalTerms = tokens.length;
    for (let term in tf) {
      tf[term] = tf[term] / totalTerms;
      
      // Calculate DF (Document Frequency)
      if (!df[term]) df[term] = 0;
      df[term]++;
    }
    tfList.push(tf);
  });
  
  // Calculate IDF (Inverse Document Frequency)
  const idf = {};
  const N = docs.length;
  for (let term in df) {
    idf[term] = Math.log(N / (1 + df[term])); // +1 to avoid division by zero
  }
  
  // Calculate TF-IDF vectors
  const tfIdfVectors = tfList.map(tf => {
    const vec = {};
    for (let term in tf) {
      vec[term] = tf[term] * idf[term];
    }
    return vec;
  });
  
  return { tfIdfVectors, idf };
}

function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  const allTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  
  for (let term of allTerms) {
    const val1 = vec1[term] || 0;
    const val2 = vec2[term] || 0;
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export function searchChunks(query, chunks, topK = 3) {
  if (!chunks || chunks.length === 0) return [];
  
  // Include query as the last document to calculate its TF-IDF
  const docs = [...chunks, { text: query }];
  
  const { tfIdfVectors } = calculateTfIdf(docs);
  
  const queryVector = tfIdfVectors.pop(); // Remove and get query vector
  
  const results = chunks.map((chunk, index) => {
    const similarity = cosineSimilarity(queryVector, tfIdfVectors[index]);
    return {
      ...chunk,
      score: (similarity * 100).toFixed(2) // Return as percentage string
    };
  });
  
  // Sort by descending score
  results.sort((a, b) => b.score - a.score);
  
  // Filter out zero similarity to avoid irrelevant results
  const filtered = results.filter(r => r.score > 0);
  
  return filtered.slice(0, topK);
}
