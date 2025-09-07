import React from 'react';
import { TerminalLine } from '@/types';

interface TerminalHistoryProps {
  history: TerminalLine[];
}

export const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history }) => {
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
          <span>{line.content}</span>
        </div>
      ))}
    </div>
  );
};
