import React, { useState } from 'react';
import { Project } from '@/types';

interface ProjectOutputProps {
  project: Project;
  onBackClick?: () => void;
}

export const ProjectOutput: React.FC<ProjectOutputProps> = ({ project, onBackClick }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${project.name} screenshot ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-mono">
                    Click to enlarge
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
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Project screenshot"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
