'use client';

import React, { useState, useEffect, useRef } from 'react';
import { projects, debugCommands, personalInfo } from '@/data/projects';
import { OutputContent, Project } from '@/types';
import CodeEvolutionBio from './CodeEvolutionBio';

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
  const lineIdCounterRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize terminal with welcome message
  useEffect(() => {
    // Start with dramatic typewriter for the first message
    setTimeout(() => {
      typewriterMessage('Welcome to the Interactive Portfolio Console', () => {
        // Then continue with the rest of the messages using standard typewriter speed
        const remainingMessages = [
          `Initializing Oz Abohazira\'s Portfolio System...`,
          'System Status: Online',
          'Type "show --help" to see available commands',
          ''
        ];

        remainingMessages.forEach((message, index) => {
          setTimeout(() => {
            addLine('output', message);
          }, (index + 1) * 1000); // Slightly faster timing since typewriter is faster
        });
      });
    }, 500); // Small delay before starting
  }, []);

  const typewriterMessage = (text: string, callback?: () => void) => {
    lineIdCounterRef.current += 1;
    const lineId = `line-${lineIdCounterRef.current}`;
    
    // Create empty line first
    const newLine: TerminalLine = {
      id: lineId,
      type: 'output',
      content: '',
      timestamp: new Date()
    };
    setHistory(prev => [...prev, newLine]);

    // Type each character
    let currentText = '';
    const characters = text.split('');
    
    characters.forEach((char, index) => {
      setTimeout(() => {
        currentText += char;
        setHistory(prev => 
          prev.map(line => 
            line.id === lineId 
              ? { ...line, content: currentText + (index < characters.length - 1 ? '▋' : '') }
              : line
          )
        );
        
        // When finished typing, remove cursor and call callback
        if (index === characters.length - 1) {
          setTimeout(() => {
            setHistory(prev => 
              prev.map(line => 
                line.id === lineId 
                  ? { ...line, content: currentText }
                  : line
              )
            );
            callback?.();
          }, 300);
        }
      }, index * 80); // 80ms per character for dramatic effect
    });
  };

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

  const addLine = (type: 'command' | 'output' | 'error', content: string) => {
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
                    className="bg-gray-800 p-3 rounded border-l-4 border-cyan-400 hover:bg-gray-700 hover:border-cyan-300 cursor-pointer transition-all duration-300 group hover:translate-x-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      setCurrentInput(cmd);
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
                  className="bg-gray-800 p-3 rounded border-l-4 border-cyan-400 hover:bg-gray-700 hover:border-cyan-300 cursor-pointer transition-all duration-300 group hover:translate-x-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${debugCommands.length * 100}ms` }}
                  onClick={() => {
                    setCurrentInput('show --help');
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
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg">
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">{project.name}</h2>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  project.status === 'completed' ? 'bg-green-600 text-white' :
                  project.status === 'planned' ? 'bg-blue-600 text-white' :
                  project.status === 'encrypted' ? 'bg-red-600 text-white' :
                  'bg-yellow-600 text-white'
                }`}>
                  {project.status.toUpperCase()}
                </span>
                {project.completionPercentage !== undefined && (
                  <span className="text-yellow-400">
                    {project.completionPercentage}% Complete
                  </span>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">{project.description}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.codeSnippet && project.status === 'completed' && (
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">Code Sample</h3>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{project.codeSnippet}</code>
                </pre>
              </div>
            )}

            {project.status === 'completed' && (project.liveUrl || project.githubUrl) && (
              <div className="flex space-x-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded transition-colors"
                  >
                    View Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
                  >
                    View Source Code
                  </a>
                )}
              </div>
            )}

            {project.status === 'planned' && project.expectedCompletion && (
              <div className="bg-blue-900 p-4 rounded">
                <p className="text-blue-300">
                  <span className="font-semibold">Expected Completion:</span> {project.expectedCompletion}
                </p>
              </div>
            )}

            {project.status === 'encrypted' && (
              <div className="bg-red-900 p-4 rounded border border-red-600">
                <p className="text-red-300 text-center">
                  🔒 This project is currently classified and under development
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Oz Abohazira Portfolio</h2>
            <p className="text-gray-400 mb-6">Interactive Developer Console</p>
            <p className="text-gray-500">
              Use the terminal on the left to explore my projects and skills.
            </p>
            <p className="text-yellow-400 mt-2">
              Start with: <code>show --help</code>
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
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 px-4 py-2 rounded transition-colors"
            >
              <span>←</span>
              <span>Back to Commands</span>
            </button>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
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
              <span className="animate-pulse text-green-400 animate-bounce">|</span>
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
