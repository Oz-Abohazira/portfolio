import React from 'react';
import { OutputContent, Project } from '@/types';
import { HelpOutput } from './HelpOutput';
import { AboutOutput } from './AboutOutput';
import { SkillsOutput } from './SkillsOutput';
import { ContactOutput } from './ContactOutput';
import { ProjectOutput } from './ProjectOutput';
import { PuzzleGame } from './PuzzleGame';

interface OutputPanelProps {
  content: OutputContent;
  onCommandExecute?: (command: string) => void;
  onBackToMenu?: () => void;
  onPuzzleComplete?: () => void;
  onPuzzleTransitionStart?: (callback: (targetPosition: { x: number; y: number; width: number; height: number; centerX: number; centerY: number }) => void) => void;
  puzzleCompleted?: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ 
  content, 
  onCommandExecute, 
  onBackToMenu,
  onPuzzleComplete,
  onPuzzleTransitionStart,
  puzzleCompleted
}) => {
  const renderContent = () => {
    switch (content.type) {
      case 'help':
        return <HelpOutput onCommandClick={onCommandExecute} />;
      case 'about':
        return <AboutOutput onBackClick={onBackToMenu} />;
      case 'skills':
        return <SkillsOutput onBackClick={onBackToMenu} />;
      case 'contact':
        return <ContactOutput onBackClick={onBackToMenu} />;
      case 'project':
        return content.data ? <ProjectOutput project={content.data as unknown as Project} onBackClick={onBackToMenu} /> : null;
      default:
        if (!puzzleCompleted) {
          return <PuzzleGame onComplete={onPuzzleComplete} onStartTransition={onPuzzleTransitionStart} />;
        } else {
          return (
            <div className="p-6 text-gray-400 text-center">
              <div className="mb-4">
                <div className="text-6xl mb-4">💻</div>
                <h2 className="text-xl text-green-400 font-mono mb-2">Oz Abohazira Portfolio</h2>
                <p className="text-gray-300 mb-4">Full Stack Developer</p>
              </div>
              <div className="space-y-2 text-sm">
                <p>Welcome to my interactive portfolio terminal.</p>
                <p>Type <span className="text-green-400 font-mono">show --help</span> to explore available commands.</p>
                <p>Each command will load detailed information in this output panel.</p>
              </div>
            </div>
          );
        }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900">
      {renderContent()}
    </div>
  );
};
