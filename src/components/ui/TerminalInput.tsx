import React, { KeyboardEvent } from 'react';

interface TerminalInputProps {
  currentInput: string;
  onInputChange: (value: string) => void;
  onCommand: (command: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  currentInput,
  onInputChange,
  onCommand,
  inputRef,
  disabled = false
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' && currentInput.trim()) {
      onCommand(currentInput);
      onInputChange('');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-green-400 font-mono">$</span>
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => disabled ? null : onInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className={`flex-1 bg-transparent border-none outline-none font-mono ${
          disabled ? 'text-gray-600 cursor-not-allowed' : 'text-green-400'
        }`}
        placeholder={disabled ? "Complete the puzzle to unlock terminal..." : "Type command here..."}
        autoFocus={!disabled}
        disabled={disabled}
      />
      <div className={`w-2 h-4 animate-pulse ${disabled ? 'bg-gray-600' : 'bg-green-400'}`}></div>
    </div>
  );
};
