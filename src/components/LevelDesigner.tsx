import { useState } from "react";
import { GameService } from "../services/gameService";
import "../styles/LevelDesigner.css";

const GRID_SIZE = 15;
const PIXEL_SIZE = 30;

interface LevelDesignerProps {
  gameId: string;
  onStart: () => void;
}

type TileType = "empty" | "rock" | "exit" | "river" | "lava" | "wind";

export function LevelDesigner({ gameId, onStart }: LevelDesignerProps) {
  const [selectedTile, setSelectedTile] = useState<TileType>("rock");
  const [grid, setGrid] = useState<TileType[][]>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("empty"))
  );

  const handleTileClick = (x: number, y: number) => {
    const newGrid = grid.map((row) => [...row]);
    newGrid[y][x] = selectedTile;
    setGrid(newGrid);
  };

  const handleClear = () => {
    setGrid(
      Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill("empty"))
    );
  };

  const handleStart = async () => {
    try {
      // Place exit
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const tile = grid[y][x];
          if (tile === "rock") {
            await GameService.addGameObject(gameId, "rock", x, y);
          } else if (tile === "exit") {
            await GameService.addGameObject(gameId, "exit", x, y);
          } else if (tile === "river" || tile === "lava" || tile === "wind") {
            await GameService.addGameObject(gameId, "obstacle", x, y, tile);
          }
        }
      }
      await GameService.updateGameStatus(gameId, "active");
      onStart();
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  return (
    <div className="level-designer">
      <h2>Design Level</h2>

      <div className="designer-tools">
        <div className="tile-selector">
          <h3>Tiles</h3>
          <button
            className={selectedTile === "empty" ? "active" : ""}
            onClick={() => setSelectedTile("empty")}
          >
            <i className="fas fa-eraser"></i> Empty
          </button>
          <button
            className={selectedTile === "rock" ? "active" : ""}
            onClick={() => setSelectedTile("rock")}
          >
            <i className="fas fa-cube"></i> Rock
          </button>
          <button
            className={selectedTile === "exit" ? "active" : ""}
            onClick={() => setSelectedTile("exit")}
          >
            <i className="fas fa-door-open"></i> Exit
          </button>
          <button
            className={selectedTile === "river" ? "active" : ""}
            onClick={() => setSelectedTile("river")}
          >
            <i className="fas fa-water"></i> River
          </button>
          <button
            className={selectedTile === "lava" ? "active" : ""}
            onClick={() => setSelectedTile("lava")}
          >
            <i className="fas fa-fire"></i> Lava
          </button>
          <button
            className={selectedTile === "wind" ? "active" : ""}
            onClick={() => setSelectedTile("wind")}
          >
            <i className="fas fa-wind"></i> Wind
          </button>
        </div>
      </div>

      <div className="level-grid">
        {grid.map((row, y) =>
          row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              className={`grid-cell ${tile}`}
              style={{
                width: `${PIXEL_SIZE}px`,
                height: `${PIXEL_SIZE}px`,
              }}
              onClick={() => handleTileClick(x, y)}
              title={`${x}, ${y}`}
            >
              {tile === "rock" && <i className="fas fa-cube"></i>}
              {tile === "exit" && <i className="fas fa-door-open"></i>}
              {tile === "river" && <i className="fas fa-water"></i>}
              {tile === "lava" && <i className="fas fa-fire"></i>}
              {tile === "wind" && <i className="fas fa-wind"></i>}
            </div>
          ))
        )}
      </div>

      <div className="designer-actions">
        <button onClick={handleClear} className="btn-secondary">
          <i className="fas fa-redo"></i> Clear
        </button>
        <button onClick={handleStart} className="btn-primary">
          <i className="fas fa-play"></i> Start Game
        </button>
      </div>
    </div>
  );
}
