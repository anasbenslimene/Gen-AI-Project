// src/utils/chunker.js
/**
 * Splits text into chunks of roughly maxChunkSize, trying to break at sentence boundaries.
 * 
 * @param {string} text - The full text of a page.
 * @param {number} pageNumber - The page number.
 * @param {number} maxChunkSize - Maximum length of a chunk.
 * @returns {Array} Array of chunk objects { text, pageNumber }.
 */
export function chunkText(text, pageNumber, maxChunkSize = 1000) {
  if (!text) return [];
  
  const chunks = [];
  // Split by sentences roughly using punctuation
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += " " + sentence.trim();
    } else {
      if (currentChunk.trim()) {
        chunks.push({
          text: currentChunk.trim(),
          pageNumber: pageNumber
        });
      }
      currentChunk = sentence.trim();
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      pageNumber: pageNumber
    });
  }
  
  return chunks;
}
