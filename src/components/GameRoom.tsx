import { useState, useEffect } from "react";
import { GameService, type GameState } from "../services/gameService";
import { useGameStore } from "../store/store";
import { GameCanvas } from "./GameCanvas";
import "../styles/GameRoom.css";

interface GameRoomProps {
  gameId: string;
  onLeave: () => void;
}

export function GameRoom({ gameId, onLeave }: GameRoomProps) {
  const gameState = useGameStore((state) => state.gameState);
  const setGameState = useGameStore((state) => state.setGameState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to game state updates
    const unsubscribe = GameService.listenToGameState(
      gameId,
      (state: GameState | null) => {
        setGameState(state);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [gameId, setGameState]);

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

  // Game always starts directly in active state
  return (
    <GameCanvas gameId={gameId} onGameEnd={onLeave} />
  );
}
