import { useState, useEffect } from "react";
import { GameService, type GameState } from "../services/gameService";
import { useAuthStore, useGameStore } from "../store/store";
import { GameCanvas } from "./GameCanvas";
import { LevelDesigner } from "./LevelDesigner";
import "../styles/GameRoom.css";

interface GameRoomProps {
  gameId: string;
  onLeave: () => void;
}

export function GameRoom({ gameId, onLeave }: GameRoomProps) {
  const user = useAuthStore((state) => state.user);
  const gameState = useGameStore((state) => state.gameState);
  const setGameState = useGameStore((state) => state.setGameState);
  const [isCreator, setIsCreator] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to game state updates
    const unsubscribe = GameService.listenToGameState(
      gameId,
      (state: GameState) => {
        setGameState(state);
        if (user && state.creatorUid === user.uid) {
          setIsCreator(true);
        }
        if (state.status === "active") {
          setGameStarted(true);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [gameId, user, setGameState]);

  if (loading) {
    return (
      <div className="game-room loading">
        <div className="spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="game-room error">
        <p>Game not found</p>
        <button onClick={onLeave}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="game-room">
      {gameState.status === "waiting" && !gameStarted ? (
        <div className="game-lobby">
          <h2>Game Lobby</h2>
          <div className="lobby-info">
            <p className="game-code">
              Game Code:{" "}
              <strong>{gameId.substring(0, 12).toUpperCase()}</strong>
            </p>
            <p className="game-code-subtitle">
              Share this code with other players
            </p>

            <div className="players-in-lobby">
              <h3>Players ({Object.keys(gameState.players).length}/6)</h3>
              {Object.values(gameState.players).map((player) => (
                <div key={player.id} className="lobby-player">
                  <div
                    className="player-dot"
                    style={{ backgroundColor: player.color }}
                  ></div>
                  <span>{player.email}</span>
                  {player.id === gameState.creatorUid && (
                    <span className="creator-badge">Creator</span>
                  )}
                </div>
              ))}
            </div>

            {isCreator && (
              <div className="creator-section">
                <p className="creator-note">You are the game creator</p>
              </div>
            )}
          </div>

          {isCreator ? (
            <LevelDesigner
              gameId={gameId}
              onStart={() => setGameStarted(true)}
            />
          ) : (
            <div className="waiting-for-creator">
              <i className="fas fa-hourglass-half"></i>
              <p>Waiting for the game creator to start the game...</p>
            </div>
          )}
        </div>
      ) : (
        <GameCanvas gameId={gameId} onGameEnd={onLeave} />
      )}
    </div>
  );
}
