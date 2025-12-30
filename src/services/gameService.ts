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
  originalObstacleType?: "river" | "lava" | "wind"; // stores original obstacle type when rock covers it
  covered?: boolean; // Indicates if rock is covering an obstacle
}

export interface GameState {
  id: string;
  gameCode: string; // Short code for joining (first 8 chars of ID in uppercase)
  creatorUid: string;
  levelNumber: number;
  gridSize: number;
  players: Record<string, Player>;
  gameObjects: Record<string, GameObject>;
  status: "waiting" | "active" | "completed";
  createdAt: number;
}

export interface Level {
  number: number;
  gridSize: number;
  playerStartPositions: { x: number; y: number }[];
  rocks: { x: number; y: number }[];
  obstacles: { x: number; y: number; type: "river" | "lava" | "wind" }[];
  exit: { x: number; y: number };
}

const PLAYER_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
];

// 5 Built-in levels with static design
const BUILTIN_LEVELS: Level[] = [
  // Level 1: Simple tutorial level
  {
    number: 1,
    gridSize: 15,
    playerStartPositions: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    rocks: [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
    ],
    obstacles: [
      { x: 10, y: 5, type: "lava" },
      { x: 10, y: 6, type: "lava" },
      { x: 10, y: 7, type: "lava" },
    ],
    exit: { x: 14, y: 14 },
  },
  // Level 2: More rocks and obstacles
  {
    number: 2,
    gridSize: 15,
    playerStartPositions: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    rocks: [
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 7 },
    ],
    obstacles: [
      { x: 6, y: 5, type: "river" },
      { x: 6, y: 6, type: "river" },
      { x: 10, y: 10, type: "lava" },
      { x: 11, y: 10, type: "lava" },
    ],
    exit: { x: 13, y: 13 },
  },
  // Level 3: Complex puzzle with wind obstacles
  {
    number: 3,
    gridSize: 15,
    playerStartPositions: [
      { x: 0, y: 7 },
      { x: 1, y: 7 },
      { x: 2, y: 7 },
    ],
    rocks: [
      { x: 4, y: 5 },
      { x: 4, y: 6 },
      { x: 4, y: 7 },
      { x: 4, y: 8 },
      { x: 4, y: 9 },
      { x: 8, y: 7 },
      { x: 9, y: 7 },
      { x: 10, y: 7 },
    ],
    obstacles: [
      { x: 7, y: 3, type: "wind" },
      { x: 7, y: 4, type: "wind" },
      { x: 7, y: 11, type: "wind" },
      { x: 7, y: 12, type: "wind" },
      { x: 12, y: 5, type: "lava" },
      { x: 12, y: 6, type: "lava" },
    ],
    exit: { x: 14, y: 7 },
  },
  // Level 4: Challenging maze-like level
  {
    number: 4,
    gridSize: 15,
    playerStartPositions: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    rocks: [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
      { x: 5, y: 3 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 9, y: 3 },
      { x: 9, y: 4 },
      { x: 11, y: 7 },
      { x: 11, y: 8 },
      { x: 11, y: 9 },
    ],
    obstacles: [
      { x: 5, y: 7, type: "river" },
      { x: 6, y: 7, type: "river" },
      { x: 10, y: 10, type: "lava" },
      { x: 10, y: 11, type: "lava" },
      { x: 2, y: 10, type: "wind" },
      { x: 3, y: 10, type: "wind" },
    ],
    exit: { x: 13, y: 13 },
  },
  // Level 5: Ultimate challenge
  {
    number: 5,
    gridSize: 15,
    playerStartPositions: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    rocks: [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
      { x: 6, y: 2 },
      { x: 6, y: 5 },
      { x: 9, y: 3 },
      { x: 9, y: 4 },
      { x: 9, y: 5 },
      { x: 12, y: 2 },
      { x: 12, y: 3 },
      { x: 12, y: 4 },
      { x: 12, y: 5 },
      { x: 5, y: 8 },
      { x: 5, y: 9 },
      { x: 5, y: 10 },
      { x: 10, y: 9 },
      { x: 10, y: 10 },
    ],
    obstacles: [
      { x: 2, y: 8, type: "lava" },
      { x: 3, y: 8, type: "lava" },
      { x: 4, y: 8, type: "lava" },
      { x: 7, y: 8, type: "river" },
      { x: 8, y: 8, type: "river" },
      { x: 11, y: 8, type: "wind" },
      { x: 12, y: 8, type: "wind" },
      { x: 13, y: 8, type: "wind" },
    ],
    exit: { x: 14, y: 14 },
  },
];

export class GameService {
  // Get built-in level
  static getLevel(levelNumber: number): Level | null {
    return BUILTIN_LEVELS.find((level) => level.number === levelNumber) || null;
  }

  // Get total number of levels
  static getTotalLevels(): number {
    return BUILTIN_LEVELS.length;
  }
  // Create a new game with level 1 loaded
  static async createGame(
    creatorUid: string,
    email: string,
    levelNumber: number = 1
  ): Promise<string> {
    const gameId = uuidv4();
    const level = this.getLevel(levelNumber);

    if (!level) {
      throw new Error(`Level ${levelNumber} not found`);
    }

    const gridSize = level.gridSize;
    const players: Record<string, Player> = {};

    // Add creator as first player
    const firstPlayerPos = level.playerStartPositions[0] || { x: 0, y: 0 };
    players[creatorUid] = {
      id: creatorUid,
      uid: creatorUid,
      email,
      x: firstPlayerPos.x,
      y: firstPlayerPos.y,
      color: PLAYER_COLORS[0],
    };

    // Create game objects from level
    const gameObjects: Record<string, GameObject> = {};

    // Add rocks
    level.rocks.forEach((rock) => {
      const objectId = uuidv4();
      gameObjects[objectId] = {
        id: objectId,
        type: "rock",
        x: rock.x,
        y: rock.y,
      };
    });

    // Add obstacles
    level.obstacles.forEach((obstacle) => {
      const objectId = uuidv4();
      gameObjects[objectId] = {
        id: objectId,
        type: "obstacle",
        x: obstacle.x,
        y: obstacle.y,
        obstacleType: obstacle.type,
        originalObstacleType: obstacle.type,
      };
    });

    // Add exit
    const exitId = uuidv4();
    gameObjects[exitId] = {
      id: exitId,
      type: "exit",
      x: level.exit.x,
      y: level.exit.y,
    };

    const gameState: GameState = {
      id: gameId,
      gameCode: gameId.substring(0, 8).toUpperCase(),
      creatorUid,
      levelNumber,
      gridSize,
      players,
      gameObjects,
      status: "waiting",
      createdAt: Date.now(),
    };

    await set(ref(database, `games/${gameId}`), gameState);
    return gameId;
  }

  // Join an existing game by game code or full ID
  static async joinGame(
    gameCodeOrId: string,
    playerUid: string,
    email: string
  ): Promise<string> {
    let actualGameId = gameCodeOrId;

    // If it's a short code, find the actual game ID
    if (gameCodeOrId.length === 8 || gameCodeOrId.length < 36) {
      const gamesRef = ref(database, "games");
      const snapshot = await get(gamesRef);
      
      if (!snapshot.exists()) throw new Error("Game not found");
      
      const games = snapshot.val();
      const foundGame = Object.entries(games).find(([_, game]: [string, any]) => 
        game.gameCode === gameCodeOrId.toUpperCase()
      );

      if (!foundGame) throw new Error("Game not found with code: " + gameCodeOrId);
      actualGameId = foundGame[0];
    }

    const gameRef = ref(database, `games/${actualGameId}`);
    const snapshot = await get(gameRef);
    const game = snapshot.val();

    if (!game) throw new Error("Game not found");
    if (game.status !== "waiting") throw new Error("Game has already started");
    if (Object.keys(game.players).length >= 6) throw new Error("Game is full");

    const level = this.getLevel(game.levelNumber);
    if (!level) throw new Error(`Level ${game.levelNumber} not found`);

    const playerCount = Object.keys(game.players).length;
    const playerPos = level.playerStartPositions[playerCount] || {
      x: playerCount,
      y: 0,
    };

    const player: Player = {
      id: playerUid,
      uid: playerUid,
      email,
      x: playerPos.x,
      y: playerPos.y,
      color: PLAYER_COLORS[playerCount % PLAYER_COLORS.length],
    };

    await update(ref(database, `games/${actualGameId}/players/${playerUid}`), player);
    return actualGameId;
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
    const gameObject: any = {
      id: objectId,
      type,
      x,
      y,
    };

    // Only add obstacleType if it's provided
    if (obstacleType) {
      gameObject.obstacleType = obstacleType;
    }

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

  // Update game object properties
  static async updateGameObject(
    gameId: string,
    objectId: string,
    updates: Partial<GameObject>
  ): Promise<void> {
    await update(ref(database, `games/${gameId}/gameObjects/${objectId}`), updates);
  }

  // Get game state
  static async getGameState(gameId: string): Promise<GameState | null> {
    const snapshot = await get(ref(database, `games/${gameId}`));
    return snapshot.val();
  }

  // Listen to game state changes
  static listenToGameState(
    gameId: string,
    callback: (gameState: GameState | null) => void
  ) {
    return onValue(ref(database, `games/${gameId}`), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
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

  // Start the game (change status from waiting to active)
  static async startGame(gameId: string): Promise<void> {
    await this.updateGameStatus(gameId, "active");
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
