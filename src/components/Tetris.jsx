import React, { useState, useEffect, useCallback } from 'react';

    const width = 10;
    const height = 20;

    const createBoard = () => Array.from(Array(height), () => Array(width).fill(0));

    const shapes = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[0, 1, 0], [1, 1, 1]], // T
      [[1, 1, 0], [0, 1, 1]], // Z
      [[0, 1, 1], [1, 1, 0]], // S
      [[1, 0, 0], [1, 1, 1]], // L
      [[0, 0, 1], [1, 1, 1]] // J
    ];

    const Tetris = ({ onClose }) => {
      const [board, setBoard] = useState(createBoard());
      const [currentPiece, setCurrentPiece] = useState(null);
      const [position, setPosition] = useState({ x: 0, y: 0 });
      const [gameOver, setGameOver] = useState(false);

      const randomPiece = () => {
        const piece = shapes[Math.floor(Math.random() * shapes.length)];
        return {
          shape: piece,
          width: piece[0].length,
          height: piece.length
        };
      };

      const startGame = useCallback(() => {
        setBoard(createBoard());
        const newPiece = randomPiece();
        setCurrentPiece(newPiece);
        setPosition({ x: Math.floor(width / 2) - Math.floor(newPiece.width / 2), y: 0 });
        setGameOver(false);
      }, []);

      useEffect(() => {
        startGame();
      }, [startGame]);

      const movePiece = (direction) => {
        if (!currentPiece) return;
        
        let newX = position.x;
        if (direction === 'left') newX--;
        if (direction === 'right') newX++;
        
        if (collision(newX, position.y, currentPiece.shape)) return;
        
        setPosition(prev => ({ ...prev, x: newX }));
      };

      const rotatePiece = () => {
        if (!currentPiece) return;
        
        const rotated = currentPiece.shape[0].map((_, i) =>
          currentPiece.shape.map(row => row[i]).reverse()
        );
        
        if (collision(position.x, position.y, rotated)) return;
        
        setCurrentPiece(prev => ({
          ...prev,
          shape: rotated,
          width: rotated[0].length,
          height: rotated.length
        }));
      };

      const collision = (x, y, shape) => {
        for (let row = 0; row < shape.length; row++) {
          for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] &&
              (board[y + row] && board[y + row][x + col]) !== 0) {
              return true;
            }
          }
        }
        return false;
      };

      const dropPiece = useCallback(() => {
        if (!currentPiece || gameOver) return;
        
        if (collision(position.x, position.y + 1, currentPiece.shape)) {
          const newBoard = board.map(row => [...row]);
          
          currentPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
              if (value) {
                newBoard[position.y + dy][position.x + dx] = 1;
              }
            });
          });
          
          setBoard(newBoard);
          clearLines(newBoard);
          
          const newPiece = randomPiece();
          const newPosition = {
            x: Math.floor(width / 2) - Math.floor(newPiece.width / 2),
            y: 0
          };
          
          if (collision(newPosition.x, newPosition.y, newPiece.shape)) {
            setGameOver(true);
            return;
          }
          
          setCurrentPiece(newPiece);
          setPosition(newPosition);
        } else {
          setPosition(prev => ({ ...prev, y: prev.y + 1 }));
        }
      }, [board, currentPiece, gameOver, position]);

      const clearLines = (board) => {
        const newBoard = board.filter(row => row.some(cell => cell === 0));
        const linesCleared = height - newBoard.length;
        const emptyRows = Array.from({ length: linesCleared }, () => Array(width).fill(0));
        setBoard([...emptyRows, ...newBoard]);
      };

      useEffect(() => {
        const handleKeyDown = (e) => {
          if (gameOver) return;
          
          switch (e.key) {
            case 'ArrowLeft':
              movePiece('left');
              break;
            case 'ArrowRight':
              movePiece('right');
              break;
            case 'ArrowDown':
              dropPiece();
              break;
            case 'ArrowUp':
              rotatePiece();
              break;
            default:
              break;
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [movePiece, dropPiece, gameOver]);

      useEffect(() => {
        const interval = setInterval(() => {
          dropPiece();
        }, 1000);

        return () => clearInterval(interval);
      }, [dropPiece]);

      return (
        <div className="tetris-container">
          <div className="tetris-header">
            <h2>Tetris Effect</h2>
            <button onClick={onClose}>Close</button>
          </div>
          <div className="tetris-board">
            {board.map((row, y) => (
              <div key={y} className="tetris-row">
                {row.map((cell, x) => {
                  const isPiece = currentPiece?.shape[y - position.y]?.[x - position.x];
                  return (
                    <div
                      key={x}
                      className={`tetris-cell ${cell || isPiece ? 'filled' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          {gameOver && (
            <div className="game-over">
              <h3>Game Over!</h3>
              <button onClick={startGame}>Play Again</button>
            </div>
          )}
        </div>
      );
    };

    export default Tetris;
