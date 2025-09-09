'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine, OutputContent } from '@/types';
import { TerminalCommandHandler } from '@/utils/terminalCommandHandler';
import { TerminalHeader } from './ui/TerminalHeader';
import { TerminalHistory } from './ui/TerminalHistory';
import { TerminalInput } from './ui/TerminalInput';
import { OutputPanel } from './output/OutputPanel';

export default function ModularTerminal() {
  // State management
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [outputContent, setOutputContent] = useState<OutputContent>({ type: 'default' });
  const [puzzleCompleted, setPuzzleCompleted] = useState<boolean>(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Command handler instance
  const commandHandler = useRef<TerminalCommandHandler | null>(null);

  // Initialize command handler and welcome message
  useEffect(() => {
    commandHandler.current = new TerminalCommandHandler(setHistory, setOutputContent);
    
    // Start with SLOW dramatic typewriter for the first message
    setTimeout(() => {
      commandHandler.current?.typewriterMessage('Initializing Code-Driven Portfolio...', () => {
        // Then continue with FASTER typewriter for the rest
        setTimeout(() => {
          commandHandler.current?.typewriterMessage('🧩 System ready. Awaiting puzzle confirmation...', () => {
            setTimeout(() => {
              commandHandler.current?.typewriterMessage('💡 Complete the visual puzzle to unlock portfolio access.', () => {
                setTimeout(() => {
                  commandHandler.current?.addLine('output', '');
                }, 200);
              }, 20); // Faster typewriter (was 30)
            }, 300);
          }, 20); // Faster typewriter (was 30)
        }, 400);
      }, 80); // Faster dramatic typing (was 120)
    }, 500);
  }, []);

  // Auto-focus input and scroll to bottom
  useEffect(() => {
    if (puzzleCompleted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [history, puzzleCompleted]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Handle reset progress command
  useEffect(() => {
    if (outputContent.type === 'reset-progress') {
      // Reset puzzle completion
      setPuzzleCompleted(false);

      // Clear contact challenge progress from localStorage
      localStorage.removeItem('contactChallengeProgress');

      // Reset output content to default (which will show the puzzle)
      setOutputContent({ type: 'default' });

      console.log('🔄 Progress reset: Puzzle and contact challenges have been reset');
    }
  }, [outputContent.type]);

  // Handle clear terminal command - reset to initial state
  useEffect(() => {
    if (outputContent.type === 'clear-terminal') {
      // Reset puzzle completion
      setPuzzleCompleted(false);

      // Reset output content to default
      setOutputContent({ type: 'default' });

      // Reinitialize welcome message after a short delay
      setTimeout(() => {
        if (commandHandler.current) {
          commandHandler.current.typewriterMessage('Initializing Code-Driven Portfolio...', () => {
            setTimeout(() => {
              commandHandler.current?.typewriterMessage('🧩 System ready. Awaiting puzzle confirmation...', () => {
                setTimeout(() => {
                  commandHandler.current?.typewriterMessage('💡 Complete the visual puzzle to unlock portfolio access.', () => {
                    setTimeout(() => {
                      commandHandler.current?.addLine('output', '');
                    }, 200);
                  }, 20);
                }, 300);
              }, 20);
            }, 400);
          }, 80);
        }
      }, 500);
    }
  }, [outputContent.type]);

  // Handle command execution
  const handleCommand = (command: string) => {
    commandHandler.current?.processCommand(command);
  };

  // Handle command execution from output panel clicks
  const handleOutputCommand = (command: string) => {
    commandHandler.current?.processCommand(command);
  };

  // Handle puzzle transition start - get position and execute transition
  const handlePuzzleTransitionStart = (callback: (targetPosition: { x: number; y: number; width: number; height: number; centerX: number; centerY: number }) => void) => {
    // Temporarily switch to about to measure position, but don't show it yet
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '-9999px';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = `
      <div class="flex-shrink-0">
        <div 
          class="w-32 h-32 rounded-lg"
          style="
            background-image: url('/profile-photo.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          "
        ></div>
      </div>
    `;
    
    document.body.appendChild(tempDiv);
    const imageElement = tempDiv.querySelector('div') as HTMLElement;
    
    if (imageElement) {
      // Simulate the position where it will be in about section
      // Calculate relative to the output panel
      const outputPanel = document.querySelector('.bg-gray-900:nth-child(2)');
      const outputRect = outputPanel?.getBoundingClientRect();
      
      if (outputRect) {
        const targetPosition = {
          x: outputRect.left + 20, // padding
          y: outputRect.top + 100,  // header + padding + some offset
          width: 128,
          height: 128,
          centerX: outputRect.left + 20 + 64, // x + width/2
          centerY: outputRect.top + 80 + 64   // y + height/2
        };
        
        console.log('Calculated target position:', targetPosition);
        callback(targetPosition);
      }
    }
    
    // Clean up
    document.body.removeChild(tempDiv);
  };

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    setPuzzleCompleted(true);
    // Immediately go to about section without terminal animations
    commandHandler.current?.setOutputContentDirect({ type: 'about' });
    
    // Add helpful message after the transition completes (3.1 seconds total: 2s celebration + 1.1s animation)
    setTimeout(() => {
      commandHandler.current?.typewriterMessage('🎉 Puzzle completed! Portfolio access granted.', () => {
        setTimeout(() => {
          commandHandler.current?.typewriterMessage('To see all options type <span class="text-green-400 font-mono bg-gray-800 px-2 py-1 rounded border border-green-500">show --help</span> or press the <span class="px-3 py-1 bg-gray-700 text-green-400 font-mono text-sm rounded border border-green-500 inline-block">← Back to Menu</span> button on the top right', () => {
            setTimeout(() => {
              commandHandler.current?.addLine('output', '');
            }, 100);
          }, 20);
        }, 200);
      }, 30);
    }, 3200); // Wait for transition to complete
  };

  // Handle back to menu navigation (immediate, no animation)
  const handleBackToMenu = () => {
    // Set help content immediately without typing animation
    commandHandler.current?.setOutputContentDirect({ type: 'help' });
  };

  // Click to focus input
  const handleTerminalClick = () => {
    if (puzzleCompleted && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-2rem)]">
          
          {/* Terminal Panel */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl flex flex-col">
            <TerminalHeader title="portfolio-terminal ~ zsh" />
            
            <div 
              ref={terminalRef}
              className="flex-1 p-4 overflow-y-auto cursor-text"
              onClick={handleTerminalClick}
            >
              <TerminalHistory history={history} />
              <TerminalInput
                currentInput={currentInput}
                onInputChange={setCurrentInput}
                onCommand={handleCommand}
                inputRef={inputRef}
                disabled={!puzzleCompleted}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl flex flex-col">
            <TerminalHeader title="output-display" />
            <OutputPanel 
              content={outputContent} 
              onCommandExecute={handleOutputCommand}
              onBackToMenu={handleBackToMenu}
              onPuzzleComplete={handlePuzzleComplete}
              onPuzzleTransitionStart={handlePuzzleTransitionStart}
              puzzleCompleted={puzzleCompleted}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
