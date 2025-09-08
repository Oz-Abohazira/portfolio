import { projects } from '@/data/projects';
import { TerminalLine, OutputContent } from '@/types';

export class TerminalCommandHandler {
  private history: TerminalLine[] = [];
  private setHistory: (history: TerminalLine[]) => void;
  private setOutputContent: (content: OutputContent) => void;
  private lineIdCounter: number = 0;

  constructor(
    setHistory: (history: TerminalLine[]) => void,
    setOutputContent: (content: OutputContent) => void
  ) {
    this.setHistory = setHistory;
    this.setOutputContent = setOutputContent;
  }

  // Set output content immediately without typing animation
  setOutputContentDirect = (content: OutputContent): void => {
    this.setOutputContent(content);
  };

  addLine = (type: 'command' | 'output' | 'error', content: string): void => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    
    this.history = [...this.history, newLine];
    this.setHistory(this.history);
  };

  // Dramatic typewriter effect for special messages (character by character)
  typewriterMessage = (text: string, callback?: () => void, speed: number = 80): void => {
    this.lineIdCounter += 1;
    const lineId = `typewriter-${this.lineIdCounter}`;
    
    // Create empty line first
    const newLine: TerminalLine = {
      id: lineId,
      type: 'output',
      content: '',
      timestamp: new Date()
    };
    this.history = [...this.history, newLine];
    this.setHistory(this.history);

    // Type each character
    let currentText = '';
    const characters = text.split('');
    
    characters.forEach((char, index) => {
      setTimeout(() => {
        currentText += char;
        this.history = this.history.map(line => 
          line.id === lineId 
            ? { ...line, content: currentText + (index < characters.length - 1 ? '▋' : '') }
            : line
        );
        this.setHistory(this.history);
        
        // When finished typing, remove cursor and call callback
        if (index === characters.length - 1) {
          setTimeout(() => {
            this.history = this.history.map(line => 
              line.id === lineId 
                ? { ...line, content: currentText }
                : line
            );
            this.setHistory(this.history);
            callback?.();
          }, 300);
        }
      }, index * speed); // Dramatic typing speed
    });
  };

  processCommand = (command: string): void => {
    const trimmedCommand = command.trim().toLowerCase();
    
    // Add command to history
    this.addLine('command', `$ ${command}`);

    // Process command with delay for realistic terminal feel
    setTimeout(() => {
      this.executeCommand(trimmedCommand);
    }, 300);
  };

  private executeCommand = (command: string): void => {
    switch (command) {
      case 'show --commands':
      case 'show --help':
        this.typewriterMessage('Accessing command database...', () => {
          setTimeout(() => {
            this.typewriterMessage('Loading available commands...', () => {
              setTimeout(() => {
                this.typewriterMessage('Command executed. Check output panel →', () => {
                  this.setOutputContent({ type: 'help' });
                }, 20);
              }, 200);
            }, 20);
          }, 300);
        }, 20);
        break;

      case 'show --about':
        this.typewriterMessage('Scanning personal data files...', () => {
          setTimeout(() => {
            this.typewriterMessage('Decrypting profile information...', () => {
              setTimeout(() => {
                this.typewriterMessage('Loading personal information →', () => {
                  this.setOutputContent({ type: 'about' });
                }, 20);
              }, 200);
            }, 20);
          }, 300);
        }, 20);
        break;

      case 'show --skills':
        this.typewriterMessage('Analyzing technical capabilities...', () => {
          setTimeout(() => {
            this.typewriterMessage('Compiling skill matrix...', () => {
              setTimeout(() => {
                this.typewriterMessage('Displaying technical skills →', () => {
                  this.setOutputContent({ type: 'skills' });
                }, 20);
              }, 200);
            }, 20);
          }, 300);
        }, 20);
        break;

      case 'show --contact':
        this.typewriterMessage('Establishing communication channels...', () => {
          setTimeout(() => {
            this.typewriterMessage('Retrieving contact protocols...', () => {
              setTimeout(() => {
                this.typewriterMessage('Loading contact information →', () => {
                  this.setOutputContent({ type: 'contact' });
                }, 20);
              }, 200);
            }, 20);
          }, 300);
        }, 20);
        break;

      case '--clear':
        this.history = [];
        this.setHistory(this.history);
        this.setOutputContent({ type: 'default' });
        setTimeout(() => {
          this.typewriterMessage('System cleared successfully', () => {
            setTimeout(() => {
              this.typewriterMessage('Console ready for new commands', () => {
                setTimeout(() => {
                  this.typewriterMessage('Type "show --help" to see available options', () => {
                    setTimeout(() => {
                      this.addLine('output', '');
                    }, 100);
                  }, 20);
                }, 150);
              }, 20);
            }, 150);
          }, 20);
        }, 100);
        break;

      default:
        this.handleProjectCommand(command);
    }
  };

  private handleProjectCommand = (command: string): void => {
    const project = projects.find(p => p.debugCommand === command);
    if (project) {
      this.typewriterMessage('Accessing project database...', () => {
        setTimeout(() => {
          this.typewriterMessage(`Fetching ${project.name} metadata...`, () => {
            setTimeout(() => {
              if (project.status === 'encrypted') {
                this.typewriterMessage('WARNING: Classified project detected', () => {
                  setTimeout(() => {
                    this.typewriterMessage(`Loading ${project.name} details →`, () => {
                      this.setOutputContent({ type: 'project', data: project as unknown as Record<string, unknown> });
                    }, 20);
                  }, 200);
                }, 20);
              } else {
                this.typewriterMessage(`Loading ${project.name} details →`, () => {
                  this.setOutputContent({ type: 'project', data: project as unknown as Record<string, unknown> });
                }, 20);
              }
            }, 200);
          }, 20);
        }, 300);
      }, 20);
    } else {
      this.typewriterMessage(`Command not recognized: ${command}`, () => {
        setTimeout(() => {
          this.typewriterMessage('Suggestion: Type "show --help" to see available commands', undefined, 20);
        }, 200);
      }, 20);
    }
  };

  getHistory = (): TerminalLine[] => this.history;
  
  clearHistory = (): void => {
    this.history = [];
    this.setHistory(this.history);
  };
}
