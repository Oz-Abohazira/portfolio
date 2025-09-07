import React, { useRef, useEffect } from 'react';
import { personalInfo } from '@/data/projects';
import CodeEvolutionBio from '../CodeEvolutionBio';

interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

interface AboutOutputProps {
  onBackClick?: () => void;
  onImagePositionReady?: (position: ImagePosition) => void;
}

export const AboutOutput: React.FC<AboutOutputProps> = ({ onBackClick, onImagePositionReady }) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for layout to be complete before measuring
    const measurePosition = () => {
      if (imageRef.current && onImagePositionReady) {
        const rect = imageRef.current.getBoundingClientRect();
        const position: ImagePosition = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2
        };
        
        console.log('Target image position measured:', position);
        onImagePositionReady(position);
      }
    };

    // Measure position after component mounts and layout is complete
    const timeoutId = setTimeout(measurePosition, 100);
    
    // Also measure on window resize for responsive behavior
    window.addEventListener('resize', measurePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measurePosition);
    };
  }, [onImagePositionReady]);
  return (
    <div className="p-4 text-gray-300 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-green-400 font-mono">Personal Information</h2>
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-green-400 font-mono text-sm rounded border border-green-500 transition-colors duration-200 cursor-pointer"
          >
            ← Back to Menu
          </button>
        )}
      </div>
      
      {/* Personal Info Card with Profile Image */}
      <div className="mb-4 p-4 bg-gray-800 rounded border border-gray-600">
        <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start">
          {/* Profile Image with ref for position tracking */}
          <div className="flex-shrink-0">
            <div 
              ref={imageRef}
              className="w-32 h-32 rounded-lg overflow-hidden shadow-lg border-2 border-green-400"
              data-profile-image="true"
              style={{
                backgroundImage: `url('/profile-photo.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
          
          {/* Personal Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="border-l-2 border-green-500 pl-3 mb-3">
              <h3 className="text-green-300 font-mono text-lg">{personalInfo.name}</h3>
              <p className="text-gray-400 font-mono text-sm">{personalInfo.title}</p>
              <p className="text-gray-400 font-mono text-sm">{personalInfo.location}</p>
            </div>
            
            <div className="border-l-2 border-blue-500 pl-3">
              <h3 className="text-blue-300 font-mono text-sm mb-2">Professional Summary</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{personalInfo.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Evolution Section */}
      <div>
        <CodeEvolutionBio />
      </div>
    </div>
  );
};
