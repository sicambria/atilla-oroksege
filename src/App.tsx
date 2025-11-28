import { useState, useEffect } from 'react';
import { GameContainer } from './components/GameContainer';
import { MainMenu } from './components/MainMenu';

function App() {
  const [view, setView] = useState<'menu' | 'game'>('menu');
  const [gameConfig, setGameConfig] = useState({ playerCount: 4, difficulty: 'normal' });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleStartGame = (config: { playerCount: number; difficulty: string }) => {
    setGameConfig(config);
    setView('game');
  };

  return (
    <>
      {view === 'menu' ? (
        <MainMenu onStartGame={handleStartGame} />
      ) : (
        <GameContainer
          playerCount={gameConfig.playerCount}
          difficulty={gameConfig.difficulty}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </>
  );
}

export default App;
