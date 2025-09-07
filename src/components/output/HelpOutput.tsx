import React from 'react';
import { commands } from '@/data/projects';

interface Command {
  command: string;
  description: string;
}

interface HelpOutputProps {
  onCommandClick?: (command: string) => void;
}

export const HelpOutput: React.FC<HelpOutputProps> = ({ onCommandClick }) => {
  const handleCommandClick = (command: string) => {
    if (onCommandClick) {
      onCommandClick(command);
    }
  };

  return (
    <div className="p-4 text-gray-300 h-full overflow-y-auto">
      <h2 className="text-lg text-green-400 mb-3 font-mono">Available Commands</h2>
      <div className="space-y-2">
        {commands.map((cmd: Command) => (
          <div 
            key={cmd.command} 
            className="border-l-2 border-green-500 pl-3 hover:bg-gray-800 p-2 rounded-r cursor-pointer transition-colors duration-200"
            onClick={() => handleCommandClick(cmd.command)}
          >
            <div className="text-green-300 font-mono text-sm hover:text-green-200">{cmd.command}</div>
            <div className="text-xs text-gray-400 mt-0.5">{cmd.description}</div>
            <div className="text-xs text-gray-500 mt-0.5">Click to execute →</div>
          </div>
        ))}
      </div>
      {/* <div className="mt-4 text-xs text-gray-400">
        <p>Click any command above to execute it, or type it manually in the terminal.</p>
        <p>Use <span className="text-green-400 font-mono">--clear</span> to reset the terminal.</p>
      </div> */}
    </div>
  );
};
