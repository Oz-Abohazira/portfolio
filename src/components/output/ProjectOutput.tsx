import React from 'react';
import { Project } from '@/types';

interface ProjectOutputProps {
  project: Project;
  onBackClick?: () => void;
}

export const ProjectOutput: React.FC<ProjectOutputProps> = ({ project, onBackClick }) => {
  return (
    <div className="p-6 text-gray-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl text-green-400 font-mono">{project.name}</h2>
          {project.status === 'encrypted' && (
            <span className="ml-3 px-2 py-1 bg-red-900 text-red-300 text-xs font-mono rounded border border-red-500">
              CLASSIFIED
            </span>
          )}
        </div>
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-green-400 font-mono text-sm rounded border border-green-500 transition-colors duration-200 cursor-pointer"
          >
            ← Back to Menu
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="border-l-2 border-green-500 pl-4">
          <h3 className="text-green-300 font-mono mb-2">Description</h3>
          <p className="text-gray-300 leading-relaxed">{project.description}</p>
        </div>

        <div className="border-l-2 border-blue-500 pl-4">
          <h3 className="text-blue-300 font-mono mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-800 text-blue-400 rounded text-sm font-mono border border-blue-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {project.codeSnippet && (
          <div className="border-l-2 border-purple-500 pl-4">
            <h3 className="text-purple-300 font-mono mb-2">Code Sample</h3>
            <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-x-auto border border-gray-600">
              <code>{project.codeSnippet}</code>
            </pre>
          </div>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className="border-l-2 border-green-500 pl-4">
            <h3 className="text-green-300 font-mono mb-2">Links</h3>
            <div className="space-y-2">
              {project.liveUrl && (
                <div>
                  <span className="text-gray-400 font-mono text-sm">Live URL: </span>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline font-mono"
                  >
                    {project.liveUrl}
                  </a>
                </div>
              )}
              {project.githubUrl && (
                <div>
                  <span className="text-gray-400 font-mono text-sm">GitHub: </span>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline font-mono"
                  >
                    {project.githubUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
