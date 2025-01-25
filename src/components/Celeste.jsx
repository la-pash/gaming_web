import React, { useState, useEffect, useRef, useCallback } from 'react';

    const Celeste = ({ onClose, isVisible }) => {
      const canvasRef = useRef(null);
      const [player, setPlayer] = useState({
        x: 50,
        y: 300,
        width: 30,
        height: 50,
        velocityX: 0,
        velocityY: 0,
        grounded: false
      });

      const gravity = 0.5;
      const moveSpeed = 3;
      const jumpStrength = -10;
      const friction = 0.8;

      const platforms = [
        { x: 0, y: 400, width: 800, height: 20 },
        { x: 200, y: 300, width: 100, height: 20 },
        { x: 400, y: 200, width: 100, height: 20 },
        { x: 600, y: 100, width: 100, height: 20 }
      ];

      const keys = useRef({
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false
      });

      const handleKeyDown = useCallback((e) => {
        if (keys.current.hasOwnProperty(e.key)) {
          keys.current[e.key] = true;
        }
      }, []);

      const handleKeyUp = useCallback((e) => {
        if (keys.current.hasOwnProperty(e.key)) {
          keys.current[e.key] = false;
        }
      }, []);

      const checkCollision = (rect1, rect2) => {
        return (
          rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.y + rect1.height > rect2.y
        );
      };

      const update = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Apply gravity
        setPlayer(prev => ({
          ...prev,
          velocityY: prev.velocityY + gravity
        }));

        // Handle movement
        setPlayer(prev => ({
          ...prev,
          velocityX: keys.current.ArrowLeft ? -moveSpeed :
                    keys.current.ArrowRight ? moveSpeed :
                    prev.velocityX * friction
        }));

        // Apply velocity
        setPlayer(prev => ({
          ...prev,
          x: prev.x + prev.velocityX,
          y: prev.y + prev.velocityY
        }));

        // Check collisions with platforms
        setPlayer(prev => {
          let grounded = false;
          platforms.forEach(platform => {
            if (checkCollision({ ...prev }, platform)) {
              if (prev.velocityY > 0 && prev.y + prev.height <= platform.y + 10) {
                grounded = true;
                return {
                  ...prev,
                  y: platform.y - prev.height,
                  velocityY: 0
                };
              }
            }
          });
          return { ...prev, grounded };
        });

        // Handle jumping
        if (keys.current.ArrowUp && player.grounded) {
          setPlayer(prev => ({
            ...prev,
            velocityY: jumpStrength,
            grounded: false
          }));
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw platforms
        ctx.fillStyle = '#333';
        platforms.forEach(platform => {
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });

        // Draw player
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        requestAnimationFrame(update);
      }, [player, gravity, moveSpeed, jumpStrength, friction]);

      useEffect(() => {
        if (!isVisible || !canvasRef.current) return;

        const canvas = canvasRef.current;
        canvas.width = 800;
        canvas.height = 500;

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const animationFrame = requestAnimationFrame(update);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
          cancelAnimationFrame(animationFrame);
        };
      }, [isVisible, handleKeyDown, handleKeyUp, update]);

      return (
        <div className="celeste-container">
          <div className="celeste-header">
            <h2>Celeste</h2>
            <button onClick={onClose}>Close</button>
          </div>
          {isVisible && <canvas ref={canvasRef} className="celeste-canvas"></canvas>}
        </div>
      );
    };

    export default Celeste;
