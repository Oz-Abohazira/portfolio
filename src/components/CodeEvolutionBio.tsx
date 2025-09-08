'use client';

import React, { useState, useEffect, useRef } from 'react';
import { personalInfo } from '@/data/projects';

interface CodeStyle {
  language: string;
  syntax: string;
  color: string;
  accent: string;
}

export default function CodeEvolutionBio() {
  const [currentStyle, setCurrentStyle] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const isHoveredRef = useRef(false);
  
  const codeStyles: CodeStyle[] = [
    {
      language: "JavaScript",
      syntax: `const developer = {
  name: "${personalInfo.name}",
  experience: "9+ years",
  passion: "solving complex problems",
  approach: "full-stack innovation",
  impact: "reducing operational timelines",
  expertise: ["automation", "optimization"]
};

console.log(\`Hello! I'm \${developer.name}\`);`,
      color: "text-yellow-400",
      accent: "border-yellow-400"
    },
    {
      language: "Python", 
      syntax: `class Developer:
    def __init__(self):
        self.name = "${personalInfo.name}"
        self.skills = ["automation", "system integration"]
        self.achievement = "50% timeline reduction"
        self.leadership = "7+ developers mentored"
    
    def solve_problems(self):
        return "innovative solutions delivered"
        
print(f"Initializing {Developer().name}...")`,
      color: "text-green-400",
      accent: "border-green-400"
    },
    {
      language: "C#",
      syntax: `public class Developer 
{
    public string Name => "${personalInfo.name}";
    public string[] Expertise => new[] {
        "Enterprise Solutions", 
        "Team Leadership",
        "Process Automation"
    };
    
    public string GetImpact() => 
        "75% cost savings + efficient workflows";
}

// Ready for your next challenge`,
      color: "text-purple-400",
      accent: "border-purple-400"
    },
    {
      language: "TypeScript",
      syntax: `interface Developer {
  name: string;
  experience: number;
  specialties: string[];
  currentGoal: string;
}

const ozAbuhatzira: Developer = {
  name: "${personalInfo.name}",
  experience: 9,
  specialties: ["Full-Stack", "Leadership", "Innovation"],
  currentGoal: "Building exceptional digital experiences"
};

export default ozAbuhatzira;`,
      color: "text-blue-400",
      accent: "border-blue-400"
    }
  ];

  useEffect(() => {
    // Show bio after first code style loads
    const bioTimer = setTimeout(() => {
      // For now set to false
      setShowBio(false);
    }, 3000);

    // Cycle through code styles
    const styleTimer = setInterval(() => {
      // Only switch if not hovered
      if (!isHoveredRef.current) {
        setIsTransitioning(true);
        
        setTimeout(() => {
          setCurrentStyle((prev) => (prev + 1) % codeStyles.length);
          setIsTransitioning(false);
        }, 300);
      }
    }, 4500);

    return () => {
      clearTimeout(bioTimer);
      clearInterval(styleTimer);
    };
  }, [codeStyles.length]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-3xl font-bold text-cyan-400 mb-3">
          Developer Profile Analysis
        </h2>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400 font-mono">
            Runtime: {codeStyles[currentStyle].language} | Status: ACTIVE
          </span>
        </div>
      </div>

      {/* Code Evolution Display */}
      <div className="perspective-1000">
        <div 
          className={`bg-gray-900 rounded-lg p-6 border-2 transition-all duration-700 transform-style-preserve-3d ${
            codeStyles[currentStyle].accent
          } ${
            isTransitioning ? 'opacity-50 scale-95 rotate-x-12' : 'opacity-100 scale-100 rotate-x-0'
          }`}
          style={{
            boxShadow: `0 20px 40px -12px ${codeStyles[currentStyle].color.replace('text-', 'rgba(var(--')}, 0.25)`,
            transformStyle: 'preserve-3d'
          }}
          onMouseEnter={() => isHoveredRef.current = true}
          onMouseLeave={() => isHoveredRef.current = false}
        >
          {/* Code Editor Header */}
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-800 rounded-t border-b border-gray-700">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm text-gray-400 font-mono">
              {codeStyles[currentStyle].language.toLowerCase()}-profile.{
                codeStyles[currentStyle].language === 'JavaScript' ? 'js' :
                codeStyles[currentStyle].language === 'TypeScript' ? 'ts' :
                codeStyles[currentStyle].language === 'Python' ? 'py' : 'cs'
              }
            </div>
            <div className="flex space-x-1">
              <div className="w-4 h-1 bg-gray-600 rounded"></div>
              <div className="w-4 h-1 bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Code Content */}
          <div className="relative">
            <pre className={`${codeStyles[currentStyle].color} transition-all duration-700 transform font-mono text-sm leading-6`}>
              <code>{codeStyles[currentStyle].syntax}</code>
            </pre>
            
            {/* Syntax Highlighting Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Language Indicator */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${codeStyles[currentStyle].color} bg-gray-800 border ${codeStyles[currentStyle].accent}`}>
              {codeStyles[currentStyle].language}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              Compiled successfully ✓
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section with 3D Transform */}
      {showBio && (
        <div className="perspective-1000 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 border border-gray-700 transform-style-preserve-3d shadow-2xl">
            <div className="relative">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center transform rotate-3">
                  <span className="text-white font-bold text-sm">OZ</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{personalInfo.name}</h3>
                  <p className="text-cyan-400 text-sm font-semibold">{personalInfo.title}</p>
                </div>
              </div>

              {/* Bio Content */}
              <div className="space-y-4">
                <div className="text-gray-300 leading-relaxed">
                  {personalInfo.bio}
                </div>
                
                {/* Location & Contact Quick Info */}
                <div className="flex justify-between gap-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-yellow-400">📍</span>
                    <span className="text-gray-400">{personalInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-400">✉️</span>
                    <span className="text-gray-400">{personalInfo.contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-blue-400">📞</span>
                    <span className="text-gray-500 italic">Encrypted.. Authorization Needed</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-20 transform rotate-12"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-20 transform -rotate-12"></div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {codeStyles.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStyle ? 'bg-cyan-400 w-8' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
