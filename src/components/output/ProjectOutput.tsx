import React, { useState, useEffect } from 'react';
import { Project } from '@/types';

interface ProjectOutputProps {
  project: Project;
  onBackClick?: () => void;
}

export const ProjectOutput: React.FC<ProjectOutputProps> = ({ project, onBackClick }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!project.images || project.images.length === 0) return;
    
    const totalImages = project.images.length;
    if (selectedImageIndex === null) return;
    
    if (direction === 'next') {
      setSelectedImageIndex((selectedImageIndex + 1) % totalImages);
    } else {
      setSelectedImageIndex(selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1);
    }
  };

  const closeModal = () => setSelectedImageIndex(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateImage('next');
          break;
        case 'Escape':
          e.preventDefault();
          closeModal();
          break;
      }
    };

    if (selectedImageIndex !== null) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedImageIndex, project.images]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900 border-green-500';
      case 'in-progress': return 'text-yellow-400 bg-yellow-900 border-yellow-500';
      case 'planned': return 'text-blue-400 bg-blue-900 border-blue-500';
      case 'encrypted': return 'text-red-400 bg-red-900 border-red-500';
      default: return 'text-gray-400 bg-gray-900 border-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'COMPLETED';
      case 'in-progress': return 'IN PROGRESS';
      case 'planned': return 'PLANNED';
      case 'encrypted': return 'CLASSIFIED';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="p-6 text-gray-300 max-h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-2xl text-green-400 font-mono font-bold break-words">{project.name}</h2>
          <span className={`px-3 py-1 text-xs font-mono rounded border w-fit ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-green-400 font-mono text-sm rounded border border-green-500 transition-colors duration-200 cursor-pointer w-fit whitespace-nowrap"
          >
            ← Back to Menu
          </button>
        )}
      </div>

      {/* Description - Overview */}
      <div className="mb-6">
        <h3 className="text-green-300 font-mono mb-3 text-lg">Project Overview</h3>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-300 leading-relaxed">{project.description}</p>
        </div>
      </div>

      {/* Technologies - Stack */}
      <div className="mb-6">
        <h3 className="text-blue-300 font-mono mb-3 text-lg">Technology Stack</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg text-sm font-mono border border-blue-500 transition-colors duration-200 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Project Images - Gallery */}
      {project.images && project.images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-cyan-300 font-mono mb-3 text-lg">Project Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.images.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${project.name} screenshot ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors duration-200 bg-gray-100"
                  onLoad={() => console.log('✅ Image loaded and should be visible:', image)}
                  onError={(e) => {
                    console.error('❌ Failed to load image:', image);
                  }}
                  style={{ minHeight: '128px' }}
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <span className="text-black opacity-0 group-hover:opacity-100 text-sm font-mono">
                    🔍︎
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Sample */}
      {project.codeSnippet && (
        <div className="mb-6">
          <h3 className="text-purple-300 font-mono mb-3 text-lg">Code Sample</h3>
          <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-600">
              <span className="text-xs text-gray-400 font-mono">Sample Implementation</span>
            </div>
            <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
              <code className="language-javascript">{project.codeSnippet}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Links */}
      {(project.liveUrl || project.githubUrl) && (
        <div className="mb-6">
          <h3 className="text-green-300 font-mono mb-3 text-lg">Project Links</h3>
          <div className="space-y-3">
            {project.liveUrl && (
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <div className="text-sm text-gray-400 font-mono">Live Demo</div>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline font-mono transition-colors duration-200"
                  >
                    {project.liveUrl}
                  </a>
                </div>
              </div>
            )}
            {project.githubUrl && (
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🐙</span>
                <div>
                  <div className="text-sm text-gray-400 font-mono">Source Code</div>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline font-mono transition-colors duration-200"
                  >
                    {project.githubUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImageIndex !== null && project.images && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-6"
          onClick={closeModal}
        >
          {/* Modal content: navigation buttons sit outside the image box so they don't block content */}
          <div
            className="relative flex items-center justify-center gap-6 max-w-[95vw] max-h-[95vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left navigation (outside image) */}
            {project.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                className="text-white bg-gray-800 hover:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg transition-colors duration-200"
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            {/* Image container - has its own rounded background so controls don't overlap */}
            <div className="bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center" style={{ maxWidth: '80vw', maxHeight: '80vh' }}>
              <img
                src={project.images[selectedImageIndex]}
                alt={`Project screenshot ${selectedImageIndex + 1}`}
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain bg-gray-900"
                style={{ display: 'block' }}
              />
            </div>

            {/* Right navigation (outside image) */}
            {project.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                className="text-white bg-gray-800 hover:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg transition-colors duration-200"
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>

          {/* Close button placed outside the image box (top-right of the viewport) */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg"
            aria-label="Close image viewer"
          >
            ×
          </button>

          {/* Image counter placed below the image area (not overlaying) */}
          {project.images.length > 0 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-gray-800 bg-opacity-75 px-3 py-1 rounded-full text-sm font-mono">
              {selectedImageIndex + 1} / {project.images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
