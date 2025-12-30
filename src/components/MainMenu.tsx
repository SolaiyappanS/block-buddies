import { useState } from "react";
import { AuthService } from "../services/authService";
import { GameService } from "../services/gameService";
import { useAuthStore } from "../store/store";
import "../styles/MainMenu.css";

interface MainMenuProps {
  onCreateGame: (gameId: string) => void;
  onJoinGame: (gameId: string) => void;
}

export function MainMenu({ onCreateGame, onJoinGame }: MainMenuProps) {
  const user = useAuthStore((state) => state.user);
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const gameId = await GameService.createGame(
        user.uid,
        user.email || "",
        1 // Always start with level 1
      );
      onCreateGame(gameId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!user || !gameCode.trim()) {
      setError("Please enter a game code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await GameService.joinGame(gameCode, user.uid, user.email || "");
      onJoinGame(gameCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join game");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.signout();
      useAuthStore.setState({ user: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    }
  };

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1>
          <i className="fas fa-cubes"></i> Block Buddies
        </h1>

        <div className="user-info">
          <p>
            <i className="fas fa-user"></i> {user?.email}
          </p>
          <p>Complete all 5 levels to win!</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="menu-actions">
          <div className="action-group">
            <h3>Create New Game</h3>
            <p className="action-description">Start a new game at Level 1. Other players can join using the game code.</p>
            <button
              onClick={handleCreateGame}
              disabled={loading}
              className="btn-primary"
            >
              <i className="fas fa-plus"></i> Create Game
            </button>
          </div>

          <div className="action-group">
            <h3>Join Existing Game</h3>
            <p className="action-description">Join a game that another player has created.</p>
            <input
              type="text"
              placeholder="Enter game code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={handleJoinGame}
              disabled={loading}
              className="btn-primary"
            >
              <i className="fas fa-sign-in-alt"></i> Join Game
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="btn-logout"
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
}
