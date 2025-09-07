import React from 'react';

interface TerminalHeaderProps {
  title: string;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-600">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-300 text-sm font-mono">{title}</span>
      </div>
    </div>
  );
};
