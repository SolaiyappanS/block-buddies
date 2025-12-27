import { useState, useEffect } from "react";
import {
  GameService,
  type Player,
  type GameObject,
} from "../services/gameService";
import { useGameStore, useAuthStore } from "../store/store";
import "../styles/Game.css";

const GRID_SIZE = 15;
const PIXEL_SIZE = 30; // pixels per cell

interface GameProps {
  gameId: string;
  onGameEnd: () => void;
}

export function GameCanvas({ gameId, onGameEnd }: GameProps) {
  const user = useAuthStore((state) => state.user);
  const gameState = useGameStore((state) => state.gameState);
  const setGameState = useGameStore((state) => state.setGameState);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [gameObjects, setGameObjects] = useState<Record<string, GameObject>>(
    {}
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [message, setMessage] = useState("");

  // Listen to game state changes
  useEffect(() => {
    const unsubscribe = GameService.listenToGameState(
      gameId,
      (newGameState) => {
        setGameState(newGameState);
        setPlayers(newGameState.players);
        setGameObjects(newGameState.gameObjects);

        if (user) {
          const player = newGameState.players[user.uid];
          if (player) {
            setCurrentPlayer(player);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [gameId, user, setGameState]);

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentPlayer || !user) return;

      let newX = currentPlayer.x;
      let newY = currentPlayer.y;

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          newY = Math.max(0, currentPlayer.y - 1);
          e.preventDefault();
          break;
        case "arrowdown":
        case "s":
          newY = Math.min(GRID_SIZE - 1, currentPlayer.y + 1);
          e.preventDefault();
          break;
        case "arrowleft":
        case "a":
          newX = Math.max(0, currentPlayer.x - 1);
          e.preventDefault();
          break;
        case "arrowright":
        case "d":
          newX = Math.min(GRID_SIZE - 1, currentPlayer.x + 1);
          e.preventDefault();
          break;
        default:
          return;
      }

      // Check for collisions and interactions
      const occupiedByPlayer = Object.values(players).some(
        (p) => p.x === newX && p.y === newY
      );

      if (!occupiedByPlayer) {
        GameService.updatePlayerPosition(gameId, user.uid, newX, newY);
        checkLevelCompletion(newX, newY);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPlayer, players, user, gameId]);

  const checkLevelCompletion = (x: number, y: number) => {
    const exitObject = Object.values(gameObjects).find(
      (obj) => obj.type === "exit" && obj.x === x && obj.y === y
    );

    if (exitObject) {
      setMessage("🎉 Level Complete! Moving to next level...");
      setTimeout(() => {
        if (user) {
          const nextLevel = (gameState?.levelNumber || 1) + 1;
          GameService.updateGameLevel(gameId, nextLevel);
          GameService.updatePlayerPosition(gameId, user.uid, 0, 0);
          setMessage("");
        }
      }, 2000);
    }
  };

  const handleLeaveGame = () => {
    if (user) {
      GameService.leaveGame(gameId, user.uid);
      onGameEnd();
    }
  };

  const canvasWidth = GRID_SIZE * PIXEL_SIZE;
  const canvasHeight = GRID_SIZE * PIXEL_SIZE;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Level {gameState?.levelNumber || 1}</h2>
        <div className="game-info">
          <span>
            <i className="fas fa-users"></i> Players:{" "}
            {Object.keys(players).length}/6
          </span>
          <span>
            <i className="fas fa-gamepad"></i> Game Code:{" "}
            {gameId.substring(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {message && <div className="game-message">{message}</div>}

      <div className="game-canvas-wrapper">
        <div
          className="game-canvas"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        >
          {/* Grid background */}
          <div className="grid-background"></div>

          {/* Game objects */}
          {Object.values(gameObjects).map((obj) => (
            <div
              key={obj.id}
              className={`game-object ${obj.type}`}
              style={{
                left: `${obj.x * PIXEL_SIZE}px`,
                top: `${obj.y * PIXEL_SIZE}px`,
                width: `${PIXEL_SIZE}px`,
                height: `${PIXEL_SIZE}px`,
              }}
            >
              {obj.type === "rock" && <i className="fas fa-cube"></i>}
              {obj.type === "exit" && <i className="fas fa-door-open"></i>}
              {obj.type === "obstacle" && (
                <span title={obj.obstacleType}>
                  {obj.obstacleType === "river" && (
                    <i className="fas fa-water"></i>
                  )}
                  {obj.obstacleType === "lava" && (
                    <i className="fas fa-fire"></i>
                  )}
                  {obj.obstacleType === "wind" && (
                    <i className="fas fa-wind"></i>
                  )}
                </span>
              )}
            </div>
          ))}

          {/* Players */}
          {Object.values(players).map((player) => (
            <div
              key={player.id}
              className={`player ${player.id === user?.uid ? "current" : ""}`}
              style={{
                left: `${player.x * PIXEL_SIZE}px`,
                top: `${player.y * PIXEL_SIZE}px`,
                width: `${PIXEL_SIZE}px`,
                height: `${PIXEL_SIZE}px`,
                backgroundColor: player.color,
              }}
              title={player.email}
            >
              <span className="player-label">
                {player.email.charAt(0).toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="game-controls">
        <p className="controls-text">
          <i className="fas fa-arrow-keys"></i> Use Arrow Keys or WASD to move
        </p>
        <button onClick={handleLeaveGame} className="btn-leave">
          <i className="fas fa-sign-out-alt"></i> Leave Game
        </button>
      </div>

      <div className="players-list">
        <h3>Players</h3>
        {Object.values(players).map((player) => (
          <div key={player.id} className="player-item">
            <div
              className="player-color"
              style={{ backgroundColor: player.color }}
            ></div>
            <span>{player.email}</span>
            {player.id === user?.uid && <span className="you-badge">YOU</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
