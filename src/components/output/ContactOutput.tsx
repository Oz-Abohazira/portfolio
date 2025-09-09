'use client';

import React, { useState, useEffect } from 'react';
import { personalInfo } from '@/data/projects';

interface ContactOutputProps {
  onBackClick?: () => void;
}

interface Challenge {
  id: string;
  type: 'pattern' | 'debug' | 'logic';
  question: string;
  code: string;
  options: string[];
  correct: number;
  reward: 'email' | 'phone' | 'linkedin' | 'github';
  hint: string;
}

export const ContactOutput: React.FC<ContactOutputProps> = ({ onBackClick }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [unlockedContacts, setUnlockedContacts] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [showHint, setShowHint] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [autoSelected, setAutoSelected] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load saved progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('contactChallengeProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);

        // Check if progress is less than 30 days old
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        const isExpired = progress.lastUpdated && (Date.now() - progress.lastUpdated) > thirtyDaysMs;

        if (!isExpired) {
          setIsLoadingProgress(true); // Prevent saving during load

          // Set all state at once to avoid triggering multiple saves
          setCurrentChallenge(progress.currentChallenge || 0);
          setUnlockedContacts(progress.unlockedContacts || []);
          setGameComplete(progress.gameComplete || false);
          setAttempts(progress.attempts || 3);
          setProgressLoaded(true);

          // Check if all contacts are unlocked (fallback check)
          const allContacts = ['email', 'phone', 'linkedin', 'github'];
          const hasAllContacts = allContacts.every(contact =>
            (progress.unlockedContacts || []).includes(contact)
          );

          if (hasAllContacts && !progress.gameComplete) {
            setGameComplete(true);
          }

          // Allow saving again after a short delay
          setTimeout(() => {
            setIsLoadingProgress(false);
            setProgressLoaded(false);
            setHasInitialized(true); // Mark initialization as complete
          }, 3000);
        } else {
          // Clear expired progress
          localStorage.removeItem('contactChallengeProgress');
        }
      } catch (error) {
        console.warn('Failed to load contact challenge progress:', error);
        localStorage.removeItem('contactChallengeProgress');
      }
    } else {
      // No saved progress found - mark as initialized
      setHasInitialized(true);
    }
  }, []); // Empty dependency array - only run once on mount

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    // Don't save while loading progress or before initialization
    if (isLoadingProgress || !hasInitialized) {
      return;
    }

    const progress = {
      currentChallenge,
      unlockedContacts,
      gameComplete,
      attempts,
      lastUpdated: Date.now()
    };
    localStorage.setItem('contactChallengeProgress', JSON.stringify(progress));
  }, [currentChallenge, unlockedContacts, gameComplete, attempts, isLoadingProgress, hasInitialized]);

  // Utility function to reset progress (for development/testing)
  const resetProgress = () => {
    localStorage.removeItem('contactChallengeProgress');
    setCurrentChallenge(0);
    setUnlockedContacts([]);
    setGameComplete(false);
    setAttempts(3);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(true);
    setIsCorrect(false);
    setAutoSelected(false);
    setProgressLoaded(false);
  };

  const challenges: Challenge[] = [
    {
      id: 'array-method',
      type: 'pattern',
      question: 'What will this JavaScript code output?',
      code: `const numbers = [1, 2, 3, 4, 5];
const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2);
console.log(result);`,
      options: ['[2, 4, 6, 8, 10]', '[4, 8]', '[2, 4]', '[1, 3, 5]'],
      correct: 1,
      reward: 'email',
      hint: 'Filter finds even numbers (2,4), then map doubles them → [4,8]'
    },
    {
      id: 'python-logic',
      type: 'logic',
      question: 'What design pattern is being implemented here?',
      code: `class DatabaseConnection:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance`,
      options: ['Factory Pattern', 'Observer Pattern', 'Singleton Pattern', 'Strategy Pattern'],
      correct: 2,
      reward: 'linkedin',
      hint: 'Only one instance can exist - prevents multiple database connections'
    },
    {
      id: 'react-hook',
      type: 'debug',
      question: 'What\'s the main issue with this React component?',
      code: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }); // Missing dependency array
  
  return <div>{user?.name}</div>;
}`,
      options: ['Missing useState import', 'Infinite re-renders', 'Wrong hook order', 'Invalid JSX'],
      correct: 1,
      reward: 'phone',
      hint: 'useEffect without dependencies runs after every render → infinite loop'
    },
    {
      id: 'algorithm',
      type: 'logic',
      question: 'What\'s the time complexity of this algorithm?',
      code: `function findPairs(arr, target) {
  const seen = new Set();
  
  for (let num of arr) {
    if (seen.has(target - num)) {
      return [num, target - num];
    }
    seen.add(num);
  }
  return null;
}`,
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
      correct: 0,
      reward: 'github',
      hint: 'Single loop through array, Set operations are O(1) → linear time'
    }
  ];

  // Check if game should be complete based on unlocked contacts
  useEffect(() => {
    const allContacts = ['email', 'phone', 'linkedin', 'github'];
    const hasAllContacts = allContacts.every(contact => unlockedContacts.includes(contact));
    
    if (hasAllContacts && !gameComplete) {
      setGameComplete(true);
    }
  }, [unlockedContacts, gameComplete]);  // Handle auto-selection when attempts run out
  useEffect(() => {
    if (attempts === 0 && !showResult) {
      const challenge = challenges[currentChallenge];
      setSelectedAnswer(challenge.correct);
      setIsCorrect(true);
      setAutoSelected(true);
      setUnlockedContacts(prev => [...prev, challenge.reward]);
      setShowResult(true);
      
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setShowHint(true);
          setAttempts(3);
          setAutoSelected(false);
        } else {
          setGameComplete(true);
        }
      }, 2500);
    }
  }, [attempts, currentChallenge, showResult, challenges]);

  const contactInfo = {
    email: personalInfo.contact.email,
    phone: personalInfo.phone,
    linkedin: personalInfo.contact.linkedin,
    github: personalInfo.contact.github
  };

  const contactIcons = {
    email: '�',
    phone: '📱',
    linkedin: '💼',
    github: '🐙'
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const challenge = challenges[currentChallenge];
    const correct = selectedAnswer === challenge.correct;
    setIsCorrect(correct);
    setAutoSelected(false); // Reset auto-selected flag for manual attempts

    if (correct) {
      setUnlockedContacts(prev => [...prev, challenge.reward]);
      setShowResult(true);
      
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setShowHint(true);
          setAttempts(3);
        } else {
          setGameComplete(true);
        }
      }, 2500);
    } else {
      setAttempts(prev => prev - 1);
      if (attempts <= 1) {
        setShowHint(true);
      }
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  const getContactDisplay = (type: string) => {
    if (!unlockedContacts.includes(type)) {
      return "🔒 LOCKED - Complete challenge to unlock";
    }
    
    const info = contactInfo[type as keyof typeof contactInfo];
    if (type === 'linkedin' || type === 'github') {
      return (
        <a 
          href={info} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline break-all"
        >
          {info}
        </a>
      );
    }
    if (type === 'email') {
      return (
        <a 
          href={`mailto:${info}`}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {info}
        </a>
      );
    }
    if (type === 'phone') {
      return (
        <a 
          href={`tel:${info}`}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {info}
        </a>
      );
    }
    return info;
  };

  if (gameComplete) {
    return (
      <div className="p-4 text-gray-300 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-cyan-400">ACCESS GRANTED! - Contact Information</h2>
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-green-400 font-mono text-sm rounded border border-green-500 transition-colors duration-200 cursor-pointer"
            >
              ← Back to Menu
            </button>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-4 border border-green-500/50 mb-4">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="text-base font-semibold text-green-400">Security Clearance: APPROVED</h3>
            <p className="text-xs text-gray-300">You&apos;ve demonstrated sufficient technical knowledge</p>
          </div>

          <div className="grid gap-3">
            {Object.entries(contactInfo).map(([type]) => (
              <div key={type} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{contactIcons[type as keyof typeof contactIcons]}</span>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 capitalize font-mono">{type}</div>
                    <div className="text-gray-200 text-sm">{getContactDisplay(type)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <div className="text-green-400 text-xs">
              ✓ All contact methods unlocked successfully
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
          <h3 className="text-green-400 font-mono mb-2 text-base">Ready to Connect</h3>
          <p className="text-gray-300 text-sm">
            I&apos;m always open to discussing new opportunities, collaborating on projects,
            or just having a conversation about technology and software development.
          </p>
        </div>
      </div>
    );
  }

  const challenge = challenges[currentChallenge];

  return (
    <div className="p-4 text-gray-300 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-cyan-400">🔐 Contact Security Challenge</h2>
          {progressLoaded && (
            <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded border border-blue-500/50 font-mono animate-in fade-in">
              📚 Progress Loaded
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

      <p className="text-sm text-gray-400 mb-4 italic">
        Solve the Challenge to gain full contact access
      </p>

      {/* Progress Bar */}
      <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs text-gray-400">
            Challenge {currentChallenge + 1} of {challenges.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentChallenge + 1) / challenges.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Unlocked Contacts Display */}
      <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 mb-3">
        <h3 className="text-xs font-semibold text-yellow-400 mb-2">🏆 Unlocked Contacts</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(contactInfo).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <span className="text-sm">{contactIcons[type as keyof typeof contactIcons]}</span>
              <span className={`text-xs ${unlockedContacts.includes(type) ? 'text-green-400' : 'text-gray-500'}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              {unlockedContacts.includes(type) ? (
                <span className="text-green-400 text-xs">✓</span>
              ) : (
                <span className="text-gray-500 text-xs">🔒</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Challenge */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-400 font-mono uppercase tracking-wide">
              {challenge.type} Challenge
            </span>
            <span className="text-xs text-gray-400">
              Attempts: {attempts}/3
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">{challenge.question}</h3>
          
          <div className="bg-gray-800 rounded p-3 mb-3 border border-gray-600">
            <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
              {challenge.code}
            </pre>
          </div>
        </div>

        {showResult && (
          <div className={`mb-3 p-2 rounded text-center text-sm font-semibold ${
            isCorrect ? 'bg-green-900/50 text-green-400 border border-green-500' : 'bg-red-900/50 text-red-400 border border-red-500'
          }`}>
            {isCorrect ? (
              autoSelected ? '🤝 Let me help you there! Contact unlocked!' : '🎉 Correct! Contact unlocked!'
            ) : '❌ Incorrect. Try again!'}
          </div>
        )}

        {showHint && (
          <div className="mb-3 p-2 bg-yellow-900/30 border border-yellow-500 rounded">
            <div className="text-xs text-yellow-400 font-semibold">💡 Hint:</div>
            <div className="text-xs text-yellow-300">{challenge.hint}</div>
          </div>
        )}

        <div className="space-y-2 mb-3">
          {challenge.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-2 rounded border text-xs transition-colors ${
                selectedAnswer === index
                  ? 'bg-blue-900/50 border-blue-500 text-blue-300'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="font-mono mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null || showResult}
          className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
            selectedAnswer === null || showResult
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
          }`}
        >
          {showResult ? 'Processing...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default ContactOutput;
