'use client';

import React, { useState, useEffect } from 'react';

interface PuzzleGameProps {
  onComplete?: () => void;
  onStartTransition?: (callback: (targetPosition: ImagePosition) => void) => void;
}

interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  imagePosition: string;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onComplete, onStartTransition }) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [transitionStyle, setTransitionStyle] = useState<React.CSSProperties>({});

  // Initialize puzzle pieces (3x3 grid = 9 pieces)
  useEffect(() => {
    const initialPieces: PuzzlePiece[] = [];
    
    // Create pieces in correct positions first
    for (let i = 0; i < 9; i++) {
      initialPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        imagePosition: `${(i % 3) * -128}px ${Math.floor(i / 3) * -128}px`
      });
    }
    
    // Only shuffle a few specific pieces to make it solvable in 6 moves
    // Swap piece 1 with piece 2
    const temp1 = initialPieces[1].currentPosition;
    initialPieces[1].currentPosition = initialPieces[2].currentPosition;
    initialPieces[2].currentPosition = temp1;
    
    // Swap piece 4 with piece 5  
    const temp2 = initialPieces[4].currentPosition;
    initialPieces[4].currentPosition = initialPieces[5].currentPosition;
    initialPieces[5].currentPosition = temp2;
    
    // Swap piece 6 with piece 7
    const temp3 = initialPieces[6].currentPosition;
    initialPieces[6].currentPosition = initialPieces[7].currentPosition;
    initialPieces[7].currentPosition = temp3;
    
    setPieces(initialPieces);
  }, []);

  const handlePieceClick = (pieceId: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      // Swap the pieces
      const newPieces = [...pieces];
      const piece1Index = newPieces.findIndex(p => p.id === selectedPiece);
      const piece2Index = newPieces.findIndex(p => p.id === pieceId);
      
      const temp = newPieces[piece1Index].currentPosition;
      newPieces[piece1Index].currentPosition = newPieces[piece2Index].currentPosition;
      newPieces[piece2Index].currentPosition = temp;
      
      setPieces(newPieces);
      setSelectedPiece(null);
      setMoveCount(prev => prev + 1);
      
      // Check if puzzle is complete
      const isCompleted = newPieces.every(piece => piece.correctPosition === piece.currentPosition);
      if (isCompleted && !isComplete) {
        setIsComplete(true);
        // Start transition animation after 2 seconds
        setTimeout(() => {
          if (onStartTransition) {
            onStartTransition((targetPosition: ImagePosition) => {
              
              // Calculate exact transform from puzzle image to target position
              const puzzleElement = document.querySelector('[data-puzzle-complete]') as HTMLElement;
              if (puzzleElement) {
                const puzzleRect = puzzleElement.getBoundingClientRect();
                
                // Calculate the delta to move from current position to target
                const deltaX = targetPosition.centerX - (puzzleRect.left + puzzleRect.width / 2);
                const deltaY = targetPosition.centerY - (puzzleRect.top + puzzleRect.height / 2);
                
                // Calculate scale factor (target is smaller: 128px vs 384px)
                const scale = targetPosition.width / puzzleRect.width;
                
                console.log('Transition calculation:', {
                  puzzleRect,
                  targetPosition,
                  deltaX,
                  deltaY,
                  scale
                });
                
                // Apply precise transform
                setTransitionStyle({
                  transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale})`,
                  transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 1000
                });
                
                // Complete navigation after animation
                setTimeout(() => {
                  onComplete?.();
                }, 1100);
              }
            });
          } else {
            // Fallback if no transition handler
            setTimeout(() => {
              onComplete?.();
            }, 1000);
          }
        }, 2000); // 2 second delay as requested
      }
    }
  };

  const getPieceAtPosition = (position: number): PuzzlePiece | undefined => {
    return pieces.find(piece => piece.currentPosition === position);
  };

  const renderPuzzleGrid = () => {
    const grid = [];
    for (let position = 0; position < 9; position++) {
      const piece = getPieceAtPosition(position);
      grid.push(
        <div
          key={position}
          className={`
            w-32 h-32 border-2 border-gray-600 cursor-pointer transition-all duration-200 relative overflow-hidden
            ${selectedPiece === piece?.id ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'hover:border-gray-400'}
            ${piece?.correctPosition === position ? 'bg-green-900/20' : ''}
          `}
          onClick={() => piece && handlePieceClick(piece.id)}
        >
          {piece && (
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url('/profile-photo.png')`,
                backgroundPosition: piece.imagePosition,
                backgroundSize: '384px 384px', // 3x3 grid = 128px per piece * 3 = 384px
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Piece number indicator */}
              <div className="absolute top-1 left-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-400/30">
                {piece.id + 1}
              </div>
              
              {/* Correct position indicator */}
              {piece.correctPosition === position && (
                <div className="absolute top-1 right-1 w-6 h-6 bg-green-500/80 rounded-full flex items-center justify-center text-white text-sm">
                  ✓
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="p-6 text-center">
      {!isComplete ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl text-cyan-400 font-mono mb-2">🧩 Puzzle Challenge</h2>
            <p className="text-gray-300 mb-2">Arrange the pieces to complete the image</p>
            <div className="text-sm text-gray-400">
              <span>Moves: {moveCount}</span> | 
              <span className="ml-2">Click two pieces to swap them</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 max-w-md mx-auto mb-6">
            {renderPuzzleGrid()}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 Hint: Only 6 pieces are out of place - this should take exactly 6 moves!</p>
            <p>✨ Green border = correct position</p>
            <p>🎯 Goal: Swap the misplaced pieces back to their correct spots</p>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl text-green-400 font-mono mb-2">Puzzle Completed!</h2>
            <p className="text-gray-300 mb-2">Great job! You solved it in {moveCount} moves.</p>
          </div>

          {/* Complete image with precise transition animation */}
          <div className="flex justify-center mb-6 relative">
            <div 
              data-puzzle-complete="true"
              className="w-96 h-96 rounded-lg overflow-hidden shadow-2xl border-4 border-green-400"
              style={{
                backgroundImage: `url('/profile-photo.png')`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                transformOrigin: 'center center',
                ...transitionStyle
              }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-cyan-400 font-mono">🎯 Puzzle Complete! Transitioning to portfolio...</p>
            <p className="text-gray-400 text-sm">Your photo will remain visible in the about section</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
