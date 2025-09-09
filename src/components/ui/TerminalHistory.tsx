import React from 'react';
import { TerminalLine } from '@/types';

interface TerminalHistoryProps {
  history: TerminalLine[];
}

export const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history }) => {
  // Check if content contains HTML tags
  const containsHtml = (content: string) => {
    return /<[^>]*>/.test(content);
  };

  return (
    <div className="space-y-1 mb-4">
      {history.map((line) => (
        <div
          key={line.id}
          className={`font-mono text-sm ${
            line.type === 'command'
              ? 'text-green-400'
              : line.type === 'error'
              ? 'text-red-400'
              : 'text-gray-300'
          }`}
        >
          {containsHtml(line.content) ? (
            <span dangerouslySetInnerHTML={{ __html: line.content }} />
          ) : (
            <span>{line.content}</span>
          )}
        </div>
      ))}
    </div>
  );
};
