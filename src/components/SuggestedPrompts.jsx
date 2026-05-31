import React from 'react';

const SUGGESTIONS = [
  "Summarize the main concepts of this course",
  "Explain the most important definitions",
  "Generate 5 quiz questions about this material",
  "What are the key takeaways from the first chapter?"
];

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="prompts-container">
      {SUGGESTIONS.map((prompt, index) => (
        <button 
          key={index} 
          className="prompt-chip"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
