import * as pdfjsLib from 'pdfjs-dist';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

import { chunkText } from '../utils/chunker';

export async function processPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async function(event) {
      try {
        const typedarray = new Uint8Array(event.target.result);
        
        // Load the PDF document
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const numPages = pdf.numPages;
        
        let fullText = '';
        let chunks = [];
        
        // Extract text from each page
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
          
          // Split page text into chunks
          const pageChunks = chunkText(pageText, i, 800); // 800 characters per chunk approx
          chunks = [...chunks, ...pageChunks];
        }
        
        resolve({
          fileName: file.name,
          numPages: numPages,
          fullText: fullText,
          chunks: chunks
        });
      } catch (error) {
        console.error("Error processing PDF:", error);
        reject(error);
      }
    };
    
    reader.onerror = function(error) {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}
