import React, { useState } from 'react';
    import Tetris from './components/Tetris';
    import Celeste from './components/Celeste';
    import './index.css?inline';

    const games = {
      textBased: [
        { title: 'Zork', description: 'Classic text adventure', thumbnail: 'https://picsum.photos/300/180?random=1' },
        { title: 'A Dark Room', description: 'Minimalist survival', thumbnail: 'https://picsum.photos/300/180?random=2' },
        { title: 'Choice of Robots', description: 'Interactive fiction', thumbnail: 'https://picsum.photos/300/180?random=3' },
        { title: '80 Days', description: 'Steampunk adventure', thumbnail: 'https://picsum.photos/300/180?random=4' },
        { title: 'Sorcery!', description: 'Fantasy epic', thumbnail: 'https://picsum.photos/300/180?random=5' }
      ],
      twoD: [
        { title: 'Celeste', description: 'Precision platformer', thumbnail: 'https://picsum.photos/300/180?random=6', onClick: true },
        { title: 'Hollow Knight', description: 'Metroidvania', thumbnail: 'https://picsum.photos/300/180?random=7' },
        { title: 'Cuphead', description: 'Run and gun', thumbnail: 'https://picsum.photos/300/180?random=8' },
        { title: 'Dead Cells', description: 'Roguevania', thumbnail: 'https://picsum.photos/300/180?random=9' },
        { title: 'Ori and the Blind Forest', description: 'Platform adventure', thumbnail: 'https://picsum.photos/300/180?random=10' }
      ],
      // ... (other categories remain the same)
    };

    const GameCard = ({ title, description, thumbnail, onClick }) => (
      <div className="game-card" onClick={onClick}>
        <div className="game-thumbnail">
          <img src={thumbnail} alt={title} />
        </div>
        <div className="game-info">
          <h3 className="game-title">{title}</h3>
          <p className="game-description">{description}</p>
        </div>
      </div>
    );

    const CategorySection = ({ title, games, setShowTetris, setShowCeleste }) => (
      <div className="category">
        <h2>{title}</h2>
        <div className="games-grid">
          {games && games.map((game, index) => (
            <GameCard
              key={index}
              title={game.title}
              description={game.description}
              thumbnail={game.thumbnail}
              onClick={game.onClick ? 
                (game.title === 'Celeste' ? () => setShowCeleste(true) : () => setShowTetris(true)) 
                : undefined}
            />
          ))}
        </div>
      </div>
    );

    const App = () => {
      const [showTetris, setShowTetris] = useState(false);
      const [showCeleste, setShowCeleste] = useState(false);

      return (
        <div className="container">
          {showTetris ? (
            <Tetris onClose={() => setShowTetris(false)} />
          ) : showCeleste ? (
            <Celeste onClose={() => setShowCeleste(false)} isVisible={showCeleste} />
          ) : (
            <>
              <CategorySection 
                title="Text-Based Games" 
                games={games.textBased} 
                setShowTetris={setShowTetris}
                setShowCeleste={setShowCeleste}
              />
              <CategorySection 
                title="2D Games" 
                games={games.twoD} 
                setShowTetris={setShowTetris}
                setShowCeleste={setShowCeleste}
              />
              {/* Other category sections remain the same */}
            </>
          )}
        </div>
      );
    };

    export default App;
