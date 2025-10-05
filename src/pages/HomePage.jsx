import Button from '../components/button.jsx';

// pages/HomePage.jsx
// Purpose: Landing page and entry point for new or returning players.
// Props:
//  - onStartNewGame(): called when the host flow should start
//  - onJoinGame(): called when a player wants to join an existing room
// Notes: Keep this page purely presentational. Game state lives in `src/App.js`.
const HomePage = ({ onStartNewGame, onJoinGame }) => {
  return (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">Am I the Liar?</h1>
        <p className="text-xl text-white mb-12 drop-shadow">A Word Deception Game</p>
        
        <div className="space-y-4">
          <Button onClick={onStartNewGame} variant="primary" className="w-64 text-lg">
            Start a New Game
          </Button>
          <Button onClick={onJoinGame} variant="secondary" className="w-64 text-lg">
            Join a Game
          </Button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
