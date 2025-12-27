import { ref, set, get, update, onValue, remove } from "firebase/database";
import { database } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";

export interface Player {
  id: string;
  uid: string;
  email: string;
  x: number;
  y: number;
  color: string;
}

export interface GameObject {
  id: string;
  type: "rock" | "exit" | "obstacle";
  x: number;
  y: number;
  obstacleType?: "river" | "lava" | "wind"; // for obstacle type
}

export interface GameState {
  id: string;
  creatorUid: string;
  levelNumber: number;
  gridSize: number;
  players: Record<string, Player>;
  gameObjects: Record<string, GameObject>;
  status: "waiting" | "active" | "completed";
  createdAt: number;
}

const PLAYER_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
];

export class GameService {
  // Create a new game
  static async createGame(
    creatorUid: string,
    email: string,
    levelNumber: number = 1
  ): Promise<string> {
    const gameId = uuidv4();
    const gridSize = 15;

    const gameState: GameState = {
      id: gameId,
      creatorUid,
      levelNumber,
      gridSize,
      players: {
        [creatorUid]: {
          id: creatorUid,
          uid: creatorUid,
          email,
          x: 0,
          y: 0,
          color: PLAYER_COLORS[0],
        },
      },
      gameObjects: {},
      status: "waiting",
      createdAt: Date.now(),
    };

    await set(ref(database, `games/${gameId}`), gameState);
    return gameId;
  }

  // Join an existing game
  static async joinGame(
    gameId: string,
    playerUid: string,
    email: string
  ): Promise<void> {
    const gameRef = ref(database, `games/${gameId}`);
    const snapshot = await get(gameRef);
    const game = snapshot.val();

    if (!game) throw new Error("Game not found");
    if (Object.keys(game.players).length >= 6) throw new Error("Game is full");

    const playerCount = Object.keys(game.players).length;
    const player: Player = {
      id: playerUid,
      uid: playerUid,
      email,
      x: playerCount,
      y: 0,
      color: PLAYER_COLORS[playerCount % PLAYER_COLORS.length],
    };

    await update(ref(database, `games/${gameId}/players/${playerUid}`), player);
  }

  // Update player position
  static async updatePlayerPosition(
    gameId: string,
    playerId: string,
    x: number,
    y: number
  ): Promise<void> {
    await update(ref(database, `games/${gameId}/players/${playerId}`), {
      x,
      y,
    });
  }

  // Add game object (rock, exit, obstacle)
  static async addGameObject(
    gameId: string,
    type: GameObject["type"],
    x: number,
    y: number,
    obstacleType?: string
  ): Promise<void> {
    const objectId = uuidv4();
    const gameObject: GameObject = {
      id: objectId,
      type,
      x,
      y,
      obstacleType: obstacleType as any,
    };
    await set(
      ref(database, `games/${gameId}/gameObjects/${objectId}`),
      gameObject
    );
  }

  // Update game object position
  static async moveGameObject(
    gameId: string,
    objectId: string,
    x: number,
    y: number
  ): Promise<void> {
    await update(ref(database, `games/${gameId}/gameObjects/${objectId}`), {
      x,
      y,
    });
  }

  // Remove game object
  static async removeGameObject(
    gameId: string,
    objectId: string
  ): Promise<void> {
    await remove(ref(database, `games/${gameId}/gameObjects/${objectId}`));
  }

  // Get game state
  static async getGameState(gameId: string): Promise<GameState | null> {
    const snapshot = await get(ref(database, `games/${gameId}`));
    return snapshot.val();
  }

  // Listen to game state changes
  static listenToGameState(
    gameId: string,
    callback: (gameState: GameState) => void
  ) {
    return onValue(ref(database, `games/${gameId}`), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
  }

  // Update game level
  static async updateGameLevel(
    gameId: string,
    levelNumber: number
  ): Promise<void> {
    await update(ref(database, `games/${gameId}`), { levelNumber });
  }

  // Update game status
  static async updateGameStatus(
    gameId: string,
    status: "waiting" | "active" | "completed"
  ): Promise<void> {
    await update(ref(database, `games/${gameId}`), { status });
  }

  // Leave game
  static async leaveGame(gameId: string, playerId: string): Promise<void> {
    await remove(ref(database, `games/${gameId}/players/${playerId}`));
  }

  // Delete game
  static async deleteGame(gameId: string): Promise<void> {
    await remove(ref(database, `games/${gameId}`));
  }
}
