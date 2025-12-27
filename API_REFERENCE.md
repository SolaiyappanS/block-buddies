# Block Buddies - API Reference

## Firebase Configuration

### File: `src/config/firebase.ts`

Initializes Firebase with the provided configuration and exports auth and database instances.

```typescript
import { auth } from "./config/firebase";
import { database } from "./config/firebase";
```

---

## Authentication Service

### File: `src/services/authService.ts`

Handles all user authentication operations.

#### Types

```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string;
  createdAt: number;
  lastLevel: number;
}
```

#### Methods

##### `signup(email, password, displayName): Promise<User>`

Creates a new user account with email and password.

**Parameters:**

- `email` (string): User's email address
- `password` (string): User's password (min 6 characters)
- `displayName` (string): User's display name

**Returns:** Firebase User object

**Throws:** Authentication error if email exists or password is too short

**Example:**

```typescript
try {
  const user = await AuthService.signup(
    "user@example.com",
    "password123",
    "John Doe"
  );
  console.log("User created:", user.uid);
} catch (error) {
  console.error("Signup failed:", error);
}
```

---

##### `signin(email, password): Promise<User>`

Signs in an existing user.

**Parameters:**

- `email` (string): User's email address
- `password` (string): User's password

**Returns:** Firebase User object

**Throws:** Authentication error if credentials are invalid

**Example:**

```typescript
const user = await AuthService.signin("user@example.com", "password123");
```

---

##### `signout(): Promise<void>`

Signs out the current user.

**Example:**

```typescript
await AuthService.signout();
```

---

##### `getCurrentUser(): User | null`

Gets the currently authenticated user synchronously.

**Returns:** Firebase User object or null

**Example:**

```typescript
const user = AuthService.getCurrentUser();
if (user) {
  console.log("Logged in as:", user.email);
}
```

---

##### `onAuthStateChanged(callback): () => void`

Listens for authentication state changes.

**Parameters:**

- `callback` (function): Called when auth state changes, receives User or null

**Returns:** Unsubscribe function

**Example:**

```typescript
const unsubscribe = AuthService.onAuthStateChanged((user) => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("User logged out");
  }
});

// Later, unsubscribe when component unmounts
unsubscribe();
```

---

##### `getUserProfile(uid): Promise<UserProfile | null>`

Fetches a user's profile from the database.

**Parameters:**

- `uid` (string): User's unique ID

**Returns:** UserProfile object or null if not found

**Example:**

```typescript
const profile = await AuthService.getUserProfile("user-uid-123");
console.log("Last level:", profile.lastLevel);
```

---

##### `updateLastLevel(uid, level): Promise<void>`

Updates the user's last completed level.

**Parameters:**

- `uid` (string): User's unique ID
- `level` (number): Level number

**Example:**

```typescript
await AuthService.updateLastLevel("user-uid-123", 5);
```

---

## Game Service

### File: `src/services/gameService.ts`

Manages all game-related operations and real-time synchronization.

#### Types

```typescript
interface Player {
  id: string;
  uid: string;
  email: string;
  x: number;
  y: number;
  color: string;
}

interface GameObject {
  id: string;
  type: "rock" | "exit" | "obstacle";
  x: number;
  y: number;
  obstacleType?: "river" | "lava" | "wind";
}

interface GameState {
  id: string;
  creatorUid: string;
  levelNumber: number;
  gridSize: number;
  players: Record<string, Player>;
  gameObjects: Record<string, GameObject>;
  status: "waiting" | "active" | "completed";
  createdAt: number;
}
```

#### Methods

##### `createGame(creatorUid, email, levelNumber): Promise<string>`

Creates a new game instance.

**Parameters:**

- `creatorUid` (string): Creator's user ID
- `email` (string): Creator's email
- `levelNumber` (number): Starting level (default: 1)

**Returns:** Generated game ID

**Example:**

```typescript
const gameId = await GameService.createGame(
  "user-uid-123",
  "user@example.com",
  1
);
console.log("Game created:", gameId);
```

---

##### `joinGame(gameId, playerUid, email): Promise<void>`

Adds a player to an existing game.

**Parameters:**

- `gameId` (string): ID of the game to join
- `playerUid` (string): Player's user ID
- `email` (string): Player's email

**Throws:** Error if game is full or not found

**Example:**

```typescript
try {
  await GameService.joinGame("game-id-123", "player-uid", "player@example.com");
  console.log("Joined game successfully");
} catch (error) {
  console.error("Failed to join:", error.message);
}
```

---

##### `updatePlayerPosition(gameId, playerId, x, y): Promise<void>`

Updates a player's position on the grid.

**Parameters:**

- `gameId` (string): Game ID
- `playerId` (string): Player's user ID
- `x` (number): X coordinate (0-14)
- `y` (number): Y coordinate (0-14)

**Example:**

```typescript
await GameService.updatePlayerPosition("game-id", "player-uid", 5, 10);
```

---

##### `addGameObject(gameId, type, x, y, obstacleType?): Promise<void>`

Adds a game object (rock, exit, obstacle) to the game.

**Parameters:**

- `gameId` (string): Game ID
- `type` (string): "rock", "exit", or "obstacle"
- `x` (number): X coordinate
- `y` (number): Y coordinate
- `obstacleType` (string, optional): "river", "lava", or "wind" (for obstacle type)

**Example:**

```typescript
// Add a rock
await GameService.addGameObject("game-id", "rock", 5, 5);

// Add exit
await GameService.addGameObject("game-id", "exit", 14, 14);

// Add lava obstacle
await GameService.addGameObject("game-id", "obstacle", 8, 8, "lava");
```

---

##### `moveGameObject(gameId, objectId, x, y): Promise<void>`

Moves an existing game object to a new position.

**Parameters:**

- `gameId` (string): Game ID
- `objectId` (string): Object's unique ID
- `x` (number): New X coordinate
- `y` (number): New Y coordinate

**Example:**

```typescript
await GameService.moveGameObject("game-id", "object-id-123", 10, 10);
```

---

##### `removeGameObject(gameId, objectId): Promise<void>`

Removes a game object from the game.

**Parameters:**

- `gameId` (string): Game ID
- `objectId` (string): Object's unique ID

**Example:**

```typescript
await GameService.removeGameObject("game-id", "object-id-123");
```

---

##### `getGameState(gameId): Promise<GameState | null>`

Fetches the current game state.

**Parameters:**

- `gameId` (string): Game ID

**Returns:** GameState object or null if not found

**Example:**

```typescript
const gameState = await GameService.getGameState("game-id-123");
console.log("Players:", Object.keys(gameState.players).length);
```

---

##### `listenToGameState(gameId, callback): () => void`

Listens for real-time updates to game state.

**Parameters:**

- `gameId` (string): Game ID
- `callback` (function): Called with updated GameState

**Returns:** Unsubscribe function

**Important:** Must unsubscribe when component unmounts to prevent memory leaks

**Example:**

```typescript
useEffect(() => {
  const unsubscribe = GameService.listenToGameState("game-id", (newState) => {
    console.log("Game updated:", newState);
    setGameState(newState);
  });

  return () => unsubscribe();
}, []);
```

---

##### `updateGameLevel(gameId, levelNumber): Promise<void>`

Updates the current level.

**Parameters:**

- `gameId` (string): Game ID
- `levelNumber` (number): New level number

**Example:**

```typescript
await GameService.updateGameLevel("game-id", 2);
```

---

##### `updateGameStatus(gameId, status): Promise<void>`

Updates the game status.

**Parameters:**

- `gameId` (string): Game ID
- `status` (string): "waiting", "active", or "completed"

**Example:**

```typescript
await GameService.updateGameStatus("game-id", "active");
```

---

##### `leaveGame(gameId, playerId): Promise<void>`

Removes a player from the game.

**Parameters:**

- `gameId` (string): Game ID
- `playerId` (string): Player's user ID

**Example:**

```typescript
await GameService.leaveGame("game-id", "player-uid");
```

---

##### `deleteGame(gameId): Promise<void>`

Permanently deletes a game.

**Parameters:**

- `gameId` (string): Game ID

**Example:**

```typescript
await GameService.deleteGame("game-id");
```

---

## State Management

### File: `src/store/store.ts`

Uses Zustand for lightweight state management.

#### AuthStore

```typescript
interface AuthStore {
  user: User | null;
  userLoading: boolean;
  setUser(user): void;
  setUserLoading(loading): void;
}

const useAuthStore = create<AuthStore>((set) => ({...}));
```

**Usage:**

```typescript
const user = useAuthStore((state) => state.user);
const setUser = useAuthStore((state) => state.setUser);
```

---

#### GameStore

```typescript
interface GameStore {
  gameId: string | null;
  gameState: GameState | null;
  currentPlayer: Player | null;
  setGameId(id): void;
  setGameState(state): void;
  setCurrentPlayer(player): void;
  reset(): void;
}

const useGameStore = create<GameStore>((set) => ({...}));
```

**Usage:**

```typescript
const gameId = useGameStore((state) => state.gameId);
const setGameState = useGameStore((state) => state.setGameState);
```

---

## Component Hooks

### Using Auth in Components

```typescript
import { useAuthStore } from "../store/store";

function MyComponent() {
  const user = useAuthStore((state) => state.user);

  if (!user) return <p>Not logged in</p>;
  return <p>Welcome, {user.email}</p>;
}
```

---

### Using Game State in Components

```typescript
import { useGameStore } from "../store/store";

function GameComponent() {
  const gameState = useGameStore((state) => state.gameState);
  const gameId = useGameStore((state) => state.gameId);

  // Your component logic
}
```

---

## Error Handling

### Common Firebase Errors

```typescript
try {
  await GameService.joinGame(gameId, uid, email);
} catch (error) {
  if (error.code === "auth/user-not-found") {
    console.log("User does not exist");
  } else if (error.code === "database/permission-denied") {
    console.log("Permission denied");
  } else {
    console.log("Error:", error.message);
  }
}
```

---

## Rate Limiting

Position updates should not exceed 10 per second:

```typescript
// Good: Throttle updates
let lastUpdate = 0;
const updatePosition = (x, y) => {
  const now = Date.now();
  if (now - lastUpdate >= 100) {
    // Max 10 updates/sec
    GameService.updatePlayerPosition(gameId, uid, x, y);
    lastUpdate = now;
  }
};
```

---

## Database Structure

### Users Collection

```
/users/{uid}
  - uid: string
  - email: string
  - displayName: string
  - createdAt: timestamp
  - lastLevel: number
```

### Games Collection

```
/games/{gameId}
  - id: string
  - creatorUid: string
  - levelNumber: number
  - gridSize: number
  - status: "waiting" | "active" | "completed"
  - createdAt: timestamp
  - players: {playerId: Player}
  - gameObjects: {objectId: GameObject}
```

---

## Limits & Quotas

- **Max players per game**: 6
- **Max game objects**: 100 per game
- **Grid size**: 15x15 (adjustable)
- **Session timeout**: No limit (Firebase handles)
- **Concurrent games**: Unlimited

---

## Migration Guide

### From v0.x to v1.0

Breaking changes:

- `getGameState` now requires gameId parameter
- Player colors are auto-assigned based on join order
- Grid size is fixed at 15x15

---

## Best Practices

1. **Always unsubscribe** from listeners in useEffect cleanup
2. **Check for null** before accessing player or game data
3. **Use error handling** for all async operations
4. **Validate input** before calling services
5. **Batch updates** when possible to reduce database calls

---

## Support

For API issues or questions:

- Check Firebase console for errors
- Review component examples in src/components
- Check console for detailed error messages
