'use client';

import React, { useState, useEffect, useRef } from 'react';
import { projects, debugCommands, personalInfo } from '@/data/projects';
import { OutputContent, Project } from '@/types';
import CodeEvolutionBio from './CodeEvolutionBio';
import { ProjectOutput } from './output/ProjectOutput';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export default function Terminal() {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping] = useState(false);
  const [outputContent, setOutputContent] = useState<OutputContent>({ type: 'default' });
  const [showMatrixRain, setShowMatrixRain] = useState(true);
  const lineIdCounterRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Matrix rain effect
  useEffect(() => {
    if (!showMatrixRain) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    canvas.style.background = 'rgba(0, 0, 0, 0.9)';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: Math.floor(columns) }, () => 1);
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw,18);
    
    // Clean up after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      setShowMatrixRain(false);
    }, 2750);
    
    return () => {
      clearInterval(interval);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    };
  }, [showMatrixRain]);

  const addLine = React.useCallback((type: 'command' | 'output' | 'error', content: string) => {
    lineIdCounterRef.current += 1;
    const lineId = `line-${lineIdCounterRef.current}`;
    
    if (type === 'command') {
      // Commands appear instantly (user input)
      const newLine: TerminalLine = {
        id: lineId,
        type,
        content,
        timestamp: new Date()
      };
      setHistory(prev => [...prev, newLine]);
    } else {
      // Output and error messages use typewriter effect
      const newLine: TerminalLine = {
        id: lineId,
        type,
        content: '', // Start empty for typewriter effect
        timestamp: new Date()
      };
      setHistory(prev => [...prev, newLine]);
      
      // Add typewriter effect for this specific line
      let currentIndex = 0;
      const typeSpeed = 30; // Slightly faster than welcome message
      
      const typeInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setHistory(prev => 
            prev.map(line => 
              line.id === lineId 
                ? { ...line, content: content.substring(0, currentIndex + 1) + '▊' }
                : line
            )
          );
          currentIndex++;
        } else {
          // Remove cursor when done
          setHistory(prev => 
            prev.map(line => 
              line.id === lineId 
                ? { ...line, content: content }
                : line
            )
          );
          clearInterval(typeInterval);
        }
      }, typeSpeed);
    }
  }, []);

  const finalizeBootSequence = React.useCallback(() => {
    const finalMessages = [
      '',
      '✨ System initialization complete!',
      'Portfolio console ready for exploration',
      'I will start you off by showing you how to navigate',
      'Type "show --help" to discover available commands',
      'Begin your journey through my digital portfolio',
      ''
    ];

    finalMessages.forEach((msg, index) => {
      setTimeout(() => {
        addLine('output', msg);
        if (index === finalMessages.length - 1) {
          // Focus the input after boot sequence
          setTimeout(() => {
            inputRef.current?.focus();
            handleCommand('show --help');
          }, 400);
        }
        
      }, index * 400);
    });
  }, [addLine]);

  const showAsciiName = React.useCallback(() => {
    const asciiArt = [
      '═════',
      'OZ ABOHAZIRA',           
      'Full Stack Developer',           
      'Code. Create. Innovate. Repeat.',
      '════════════════════════',
    ];

    asciiArt.forEach((line, index) => {
      setTimeout(() => {
        addLine('output', line);
        if (index === asciiArt.length - 1) {
          setTimeout(() => {
            finalizeBootSequence();
          }, 300);
        }
      }, index * 200);
    });
  }, [addLine, finalizeBootSequence]);

  const startBootSequence = React.useCallback(() => {
    const bootMessages = [
      { text: 'BIOS v2.4.1 - Portfolio System', delay: 100 },
      { text: '', delay: 100 },
      { text: 'Loading operating system...', delay: 300 },
      { text: '████████████████████████ 100%', delay: 500 },
      { text: '', delay: 200 },
      { text: ' Location: Dunwoody, GA', delay: 200 },
      { text: ' Network Status: Connected to Opportunities', delay: 200 },
      { text: '', delay: 300 },
    ];

    let totalDelay = 0;
    bootMessages.forEach((msg, index) => {
      totalDelay += msg.delay;
      setTimeout(() => {
        if (msg.text) {
          addLine('output', msg.text);
        } else {
          addLine('output', '');
        }
        
        // After last boot message, show the dramatic ASCII name
        if (index === bootMessages.length - 1) {
          setTimeout(() => {
            showAsciiName();
          }, 500);
        }
      }, totalDelay);
    });
  }, [addLine, showAsciiName]);

  // Initialize terminal with impressive boot sequence
  useEffect(() => {
    // Start matrix effect immediately
    setTimeout(() => {
      // After matrix effect, start boot sequence
      setTimeout(() => {
        startBootSequence();
      }, 3200);
    }, 100);
  }, [startBootSequence]);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal is clicked
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    // Add command to history
    addLine('command', `$ ${command}`);

    // Process command
    setTimeout(() => {
      processCommand(trimmedCommand);
    }, 300);
  };

  const processCommand = (command: string) => {
    switch (command) {
      case 'show --commands':
      case 'show --help':
        addLine('output', 'Accessing command database...');
        setTimeout(() => {
          addLine('output', 'Loading available commands...');
          setTimeout(() => {
            addLine('output', 'Command executed. Check output panel →');
            setOutputContent({ type: 'help' });
          }, 500);
        }, 300);
        break;

      case 'show --about':
        addLine('output', 'Scanning personal data files...');
        setTimeout(() => {
          addLine('output', 'Decrypting profile information...');
          setTimeout(() => {
            addLine('output', 'Loading personal information →');
            setOutputContent({ type: 'about' });
          }, 400);
        }, 300);
        break;

      case 'show --skills':
        addLine('output', 'Analyzing technical capabilities...');
        setTimeout(() => {
          addLine('output', 'Compiling skill matrix...');
          setTimeout(() => {
            addLine('output', 'Displaying technical skills →');
            setOutputContent({ type: 'skills' });
          }, 400);
        }, 300);
        break;

      case 'show --contact':
        addLine('output', 'Establishing communication channels...');
        setTimeout(() => {
          addLine('output', 'Retrieving contact protocols...');
          setTimeout(() => {
            addLine('output', 'Loading contact information →');
            setOutputContent({ type: 'contact' });
          }, 400);
        }, 300);
        break;

      case '--clear':
        setHistory([]);
        setOutputContent({ type: 'default' });
        // Add system cleared message after clearing
        setTimeout(() => {
          addLine('output', 'System cleared successfully');
          addLine('output', '');
        }, 100);
        break;

      case 'show --history':
        addLine('output', 'Command History:');
        const commandHistory = history.filter(line => line.type === 'command');
        commandHistory.forEach(cmd => {
          addLine('output', `  ${cmd.content}`);
        });
        break;

      case 'reset-progress':
        addLine('output', 'Initiating system reset protocol...');
        setTimeout(() => {
          addLine('output', 'Clearing puzzle completion status...');
          setTimeout(() => {
            addLine('output', 'Resetting contact challenge progress...');
            setTimeout(() => {
              addLine('output', 'System reset complete. Puzzle and challenges have been reset.');
              setTimeout(() => {
                addLine('output', 'You can now complete the puzzle and challenges again!');
                setOutputContent({ type: 'reset-progress' });
              }, 400);
            }, 400);
          }, 400);
        }, 300);
        break;

      default:
        // Check if it's a project command
        const project = projects.find(p => p.debugCommand === command);
        if (project) {
          addLine('output', 'Accessing project database...');
          setTimeout(() => {
            addLine('output', `Fetching ${project.name} metadata...`);
            setTimeout(() => {
              if (project.status === 'encrypted') {
                addLine('output', 'WARNING: Classified project detected');
                setTimeout(() => {
                  addLine('output', `Loading ${project.name} details →`);
                  setOutputContent({ type: 'project', data: project as unknown as Record<string, unknown> });
                }, 300);
              } else {
                addLine('output', `Loading ${project.name} details →`);
                setOutputContent({ type: 'project', data: project as unknown as Record<string, unknown> });
              }
            }, 400);
          }, 300);
        } else {
          addLine('error', `Command not recognized: ${command}`);
          setTimeout(() => {
            addLine('output', 'Suggestion: Type "show --help" to see available commands');
          }, 200);
        }
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete for debug commands
      const matches = debugCommands.filter(cmd => 
        cmd.startsWith(currentInput.toLowerCase())
      );
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    }
  };

  const renderOutputPanel = () => {
    const renderContent = () => {
      switch (outputContent.type) {
        case 'help':
          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Available Commands</h2>
              <p className="text-gray-400 mb-4">Click on any command to execute it:</p>
              <div className="grid gap-3">
                {debugCommands.filter(cmd => cmd !== 'show --commands' && cmd !== 'show --help').map((cmd, index) => (
                  <div 
                    key={cmd} 
                    className="max-w-[99%] bg-gray-800 p-3 rounded border-l-4 border-cyan-400 hover:bg-gray-700 hover:border-cyan-300 cursor-pointer transition-all duration-300 group hover:translate-x-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      // setCurrentInput(cmd);
                      handleCommand(cmd);
                    }}
                  >
                    <code className="text-green-400 group-hover:text-green-300 transition-colors duration-200">{cmd}</code>
                    <span className="text-gray-400 text-sm ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      ← Click to execute
                    </span>
                  </div>
                ))}
                {/* Show combined help commands at the bottom */}
                <div 
                  key="help-commands" 
                  className="max-w-[99%] bg-gray-800 p-3 rounded border-l-4 border-cyan-400 hover:bg-gray-700 hover:border-cyan-300 cursor-pointer transition-all duration-300 group hover:translate-x-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${debugCommands.length * 100}ms` }}
                  onClick={() => {
                    // setCurrentInput('show --help');
                    handleCommand('show --help');
                  }}
                >
                  <code className="text-green-400 group-hover:text-green-300 transition-colors duration-200">show --commands / show --help</code>
                  <span className="text-gray-400 text-sm ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                    ← Click to execute
                  </span>
                </div>
              </div>
            </div>
          );

      case 'about':
        return <CodeEvolutionBio />;

      case 'skills':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">Technical Skills</h2>
            <div className="space-y-8">
              {Object.entries(personalInfo.skills).map(([category, skillList], categoryIndex) => (
                <div key={category} className="animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${categoryIndex * 200}ms` }}>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4 border-b-2 border-yellow-400/30 pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                    {skillList.map((skill, skillIndex) => (
                      <div 
                        key={skill} 
                        className="bg-gray-800 p-3 rounded-lg border-l-4 border-green-400 hover:border-green-300 hover:bg-gray-700 transition-all duration-300 hover:translate-x-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${(categoryIndex * 200) + (skillIndex * 50)}ms` }}
                      >
                        <div className="flex items-center">
                          <span className="text-green-400 mr-3 text-lg">▸</span>
                          <span className="text-white font-medium">{skill}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Information</h2>
            <div className="space-y-3">
              {Object.entries(personalInfo.contact).map(([key, value]) => (
                <div key={key} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 capitalize font-medium">{key}:</span>
                    <a 
                      href={key === 'email' ? `mailto:${value}` : value} 
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      target={key === 'email' ? undefined : '_blank'}
                      rel={key === 'email' ? undefined : 'noopener noreferrer'}
                    >
                      {value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'project':
        const project = outputContent.data as unknown as Project;
        return <ProjectOutput project={project} />;

      case 'reset-progress':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-lg">
              <h2 className="text-3xl font-bold text-green-400 mb-4">🔄 System Reset Complete</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All puzzle and challenge progress has been successfully reset. You can now:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Complete the contact form puzzle again</li>
                <li>Re-attempt any previously solved challenges</li>
                <li>Experience the portfolio journey fresh</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Next Steps</h3>
              <p className="text-gray-300 mb-3">Start exploring the portfolio again with:</p>
              <div className="space-y-2">
                <code className="block bg-gray-900 p-2 rounded text-green-400">show --help</code>
                <code className="block bg-gray-900 p-2 rounded text-green-400">show --about</code>
                <code className="block bg-gray-900 p-2 rounded text-green-400">show --skills</code>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4 animate-bounce">💻</div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-2 animate-in fade-in slide-in-from-bottom-4">Oz Abohazira Portfolio</h2>
            <p className="text-gray-400 mb-6 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>Interactive Developer Console</p>
            <p className="text-gray-500 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
              Use the terminal on the left to explore my projects and skills.
            </p>
            <p className="text-yellow-400 mt-2 animate-in fade-in slide-in-from-bottom-4 animate-pulse" style={{ animationDelay: '600ms' }}>
              Start with: <code className="bg-gray-800 px-2 py-1 rounded">show --help</code>
            </p>
          </div>
        );
      }
    };

    return (
      <div className="h-full flex flex-col">
        {/* Back Button - Show when not on default or help screen */}
        {outputContent.type !== 'default' && outputContent.type !== 'help' && (
          <div className="mb-4">
            <button
              onClick={() => setOutputContent({ type: 'help' })}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 px-4 py-2 rounded transition-colors hover:shadow-lg hover:scale-105 transform duration-200"
            >
              <span>←</span>
              <span>Back to Commands</span>
            </button>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-none">
          {renderContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex overflow-y-auto">
      {/* Left Side - Terminal */}
      <div className="w-1/2 border-r border-gray-700 min-h-screen">
        <div 
          className="min-h-screen bg-black text-green-400 font-mono p-4 cursor-text flex flex-col"
          onClick={focusInput}
        >
          {/* Terminal Header */}
          <div className="border border-gray-700 rounded-t-lg bg-gray-900 px-4 py-2 flex items-center mb-4 hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse hover:animate-bounce cursor-pointer"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse hover:animate-bounce cursor-pointer" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse hover:animate-bounce cursor-pointer" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="ml-4 text-gray-300 text-sm animate-in fade-in slide-in-from-top-2 duration-500">
              Terminal - Oz Abohazira Portfolio
            </div>
          </div>

          {/* Terminal Content */}
          <div className="border border-t-0 border-gray-700 rounded-b-lg bg-black p-4 flex flex-col">
            {/* History */}
            <div 
              ref={terminalRef}
              className="mb-4"
            >
              {history.map((line, index) => (
                <div 
                  key={line.id} 
                  className={`mb-1 animate-in fade-in slide-in-from-left-4 duration-300 ${
                    line.type === 'command' ? 'text-yellow-400 font-semibold' : 
                    line.type === 'error' ? 'text-red-400 animate-pulse' : 
                    'text-green-400'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {line.content}
                </div>
              ))}
            </div>

            {/* Current Input - positioned right after history */}
            <form onSubmit={handleInputSubmit} className="flex items-center">
              <span className="text-yellow-400 mr-2 animate-pulse">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="flex-1 bg-transparent outline-none text-green-400 font-mono focus:text-green-300 transition-colors duration-200"
                placeholder={isTyping ? "Processing..." : "Enter debug command..."}
                autoFocus
              />
              <span className="animate-pulse text-green-400">|</span>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Output Panel */}
      <div className="w-1/2 bg-gray-900 min-h-screen">
        <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
          {/* Output Panel Header */}
          <div className="border border-gray-700 rounded-t-lg bg-gray-800 px-4 py-2 flex items-center mb-4 hover:bg-gray-700 transition-all duration-300 hover:shadow-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse hover:animate-bounce cursor-pointer"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse hover:animate-bounce cursor-pointer" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse hover:animate-bounce cursor-pointer" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="ml-4 text-gray-300 text-sm animate-in fade-in slide-in-from-top-2 duration-500">
              Output Panel - Debug Results
            </div>
          </div>

          {/* Output Panel Content */}
          <div className="border border-t-0 border-gray-700 rounded-b-lg bg-gray-900 p-4 flex-1">
            {renderOutputPanel()}
          </div>
        </div>
      </div>
    </div>
  );
}