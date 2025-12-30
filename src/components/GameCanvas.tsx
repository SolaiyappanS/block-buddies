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

interface Alert {
  type: "error" | "success";
  message: string;
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
  const [alert, setAlert] = useState<Alert | null>(null);
  const [allPlayersAtExit, setAllPlayersAtExit] = useState(false);

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
      if (!currentPlayer || !user || allPlayersAtExit) return;

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

      handleMove(newX, newY);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPlayer, players, user, gameId, gameObjects, allPlayersAtExit]);

  const handleMove = async (newX: number, newY: number) => {
    if (!user) return;

    // Check for collisions with players
    const occupiedByPlayer = Object.values(players).some(
      (p) => p.x === newX && p.y === newY
    );

    if (occupiedByPlayer) {
      return;
    }

    // Check for rocks and obstacles
    const objectAtPos = Object.values(gameObjects).find(
      (obj) => obj.x === newX && obj.y === newY
    );

    if (objectAtPos) {
      if (objectAtPos.type === "rock") {
        // Try to push the rock
        await handleRockPush(newX, newY, objectAtPos.id);
        return;
      } else if (objectAtPos.type === "obstacle") {
        // Hit an obstacle - restart level
        showAlert(
          "error",
          `You hit an obstacle! Restarting level...`
        );
        setTimeout(() => {
          resetLevel();
        }, 2000);
        return;
      } else if (objectAtPos.type === "exit") {
        // Player reached exit
        await GameService.updatePlayerPosition(gameId, user.uid, newX, newY);
        checkAllPlayersAtExit();
        return;
      }
    }

    // Normal movement
    await GameService.updatePlayerPosition(gameId, user.uid, newX, newY);
  };

  const handleRockPush = async (
    rockX: number,
    rockY: number,
    rockId: string
  ) => {
    if (!user || !currentPlayer) return;

    // Calculate direction of push
    const pushDirX = rockX - currentPlayer.x;
    const pushDirY = rockY - currentPlayer.y;

    const newRockX = rockX + pushDirX;
    const newRockY = rockY + pushDirY;

    // Check if new position is valid
    if (newRockX < 0 || newRockX >= GRID_SIZE || newRockY < 0 || newRockY >= GRID_SIZE) {
      return; // Can't push rock off the grid
    }

    // Check if there's an object at the new rock position
    const objectAtNewPos = Object.values(gameObjects).find(
      (obj) => obj.x === newRockX && obj.y === newRockY && obj.id !== rockId
    );

    if (objectAtNewPos) {
      return; // Can't push rock into another object
    }

    // Check if there's an obstacle at the new position
    const obstacleAtPos = Object.values(gameObjects).find(
      (obj) =>
        obj.type === "obstacle" &&
        obj.x === newRockX &&
        obj.y === newRockY
    );

    // Move rock and cover the obstacle if there's one
    const rock = gameObjects[rockId];
    if (rock && obstacleAtPos) {
      // Rock is moving onto an obstacle - cover it
      await GameService.moveGameObject(gameId, rockId, newRockX, newRockY);
      // Update the obstacle to be hidden (covered by rock)
      await GameService.updateGameObject(gameId, obstacleAtPos.id, {
        covered: true,
      });
    } else if (rock) {
      // Normal rock movement
      await GameService.moveGameObject(gameId, rockId, newRockX, newRockY);
    }

    // Move player to where rock was
    await GameService.updatePlayerPosition(gameId, user.uid, rockX, rockY);
  };

  const checkAllPlayersAtExit = () => {
    const exitObject = Object.values(gameObjects).find(
      (obj) => obj.type === "exit"
    );

    if (!exitObject) return;

    const allAtExit = Object.values(players).every(
      (player) => player.x === exitObject.x && player.y === exitObject.y
    );

    if (allAtExit) {
      setAllPlayersAtExit(true);
      const nextLevel = (gameState?.levelNumber || 1) + 1;
      const totalLevels = GameService.getTotalLevels();

      if (nextLevel > totalLevels) {
        setMessage("🎉 You completed all levels! Congratulations!");
      } else {
        setMessage(`🎉 Level Complete! Moving to Level ${nextLevel}...`);
        setTimeout(() => {
          loadNextLevel(nextLevel);
        }, 3000);
      }
    }
  };

  const loadNextLevel = async (levelNumber: number) => {
    const totalLevels = GameService.getTotalLevels();
    if (levelNumber > totalLevels) {
      // Game completed
      setMessage("🎉 You completed all levels!");
      setTimeout(() => {
        onGameEnd();
      }, 2000);
      return;
    }

    // Delete current game and create new one at next level
    if (user) {
      try {
        await GameService.deleteGame(gameId);
        await GameService.createGame(
          user.uid,
          user.email || "",
          levelNumber
        );
        // The game state will be updated via the listener
        setAllPlayersAtExit(false);
        setMessage("");
      } catch (error) {
        console.error("Failed to load next level:", error);
        showAlert("error", "Failed to load next level");
      }
    }
  };

  const resetLevel = async () => {
    if (user) {
      try {
        await GameService.deleteGame(gameId);
        const levelNumber = gameState?.levelNumber || 1;
        await GameService.createGame(
          user.uid,
          user.email || "",
          levelNumber
        );
        setAlert(null);
      } catch (error) {
        console.error("Failed to reset level:", error);
        showAlert("error", "Failed to reset level");
      }
    }
  };

  const restartFromFirstLevel = async () => {
    if (user) {
      try {
        await GameService.deleteGame(gameId);
        await GameService.createGame(
          user.uid,
          user.email || "",
          1
        );
        setAlert(null);
      } catch (error) {
        console.error("Failed to restart:", error);
        showAlert("error", "Failed to restart game");
      }
    }
  };

  const showAlert = (type: "error" | "success", message: string) => {
    setAlert({ type, message });
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
        <h2>Level {gameState?.levelNumber || 1} / {GameService.getTotalLevels()}</h2>
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

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <p>{alert.message}</p>
          <div className="alert-buttons">
            <button onClick={resetLevel} className="btn-primary">
              Restart Level
            </button>
            <button onClick={restartFromFirstLevel} className="btn-secondary">
              Start From Level 1
            </button>
          </div>
        </div>
      )}

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
                display: (obj as any).covered ? "none" : "flex",
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
          <i className="fas fa-arrow-keys"></i> Use Arrow Keys or WASD to move • Push rocks to solve puzzles
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
