import React from 'react';
import { personalInfo } from '@/data/projects';

interface SkillsOutputProps {
  onBackClick?: () => void;
}

export const SkillsOutput: React.FC<SkillsOutputProps> = ({ onBackClick }) => {
  // Define color schemes for different skill categories
  const categoryColors = {
    'Frontend Technologies': {
      border: 'border-blue-500',
      text: 'text-blue-300',
      skillBg: 'bg-blue-900',
      skillText: 'text-blue-300',
      skillBorder: 'border-blue-500'
    },
    'Backend Development': {
      border: 'border-purple-500',
      text: 'text-purple-300',
      skillBg: 'bg-purple-900',
      skillText: 'text-purple-300',
      skillBorder: 'border-purple-500'
    },
    'Database & Storage': {
      border: 'border-yellow-500',
      text: 'text-yellow-300',
      skillBg: 'bg-yellow-900',
      skillText: 'text-yellow-300',
      skillBorder: 'border-yellow-500'
    },
    'Integration & Tools': {
      border: 'border-cyan-500',
      text: 'text-cyan-300',
      skillBg: 'bg-cyan-900',
      skillText: 'text-cyan-300',
      skillBorder: 'border-cyan-500'
    },
    'Leadership & Management': {
      border: 'border-green-500',
      text: 'text-green-300',
      skillBg: 'bg-green-900',
      skillText: 'text-green-300',
      skillBorder: 'border-green-500'
    }
  };

  const getColors = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || categoryColors['Leadership & Management'];
  };

  return (
    <div className="p-5 text-gray-300 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-green-400 font-mono">Technical Skills</h2>
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-green-400 font-mono text-sm rounded border border-green-500 transition-colors duration-200 cursor-pointer"
          >
            ← Back to Menu
          </button>
        )}
      </div>
      
      <div className="space-y-5">
        {Object.entries(personalInfo.skills).map(([category, skills]) => {
          const colors = getColors(category);
          return (
            <div key={category} className={`border-l-3 ${colors.border} pl-4 bg-gray-800/30 p-4 rounded-r`}>
              <h3 className={`text-base ${colors.text} font-mono mb-3 font-semibold`}>{category}</h3>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 ${colors.skillBg} ${colors.skillText} rounded-full text-sm font-mono border ${colors.skillBorder} hover:opacity-80 transition-opacity duration-200`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
