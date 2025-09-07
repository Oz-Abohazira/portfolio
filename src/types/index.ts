// Types and interfaces for the portfolio application

export interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export interface OutputContent {
  type: 'default' | 'about' | 'skills' | 'contact' | 'project' | 'help';
  data?: any;
}

export interface Project {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'planned' | 'encrypted';
  description: string;
  technologies: string[];
  debugCommand: string;
  codeSnippet?: string;
  liveUrl?: string;
  githubUrl?: string;
  completionPercentage?: number;
  expectedCompletion?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
  phone: string;
  skills: {
    [category: string]: string[];
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

export interface CodeStyle {
  language: string;
  syntax: string;
  color: string;
  accent: string;
}
