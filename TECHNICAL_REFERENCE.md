# Block Buddies - Technical Reference

## Architecture Overview

```
App.tsx (Main Router)
├── AuthPage (Login/Signup)
├── MainMenu (Game Creation/Joining)
└── GameRoom (Level Container)
    └── GameCanvas (Game Loop & Rendering)
```

## Data Structures

### Level Interface
```typescript
interface Level {
  number: number;
  gridSize: number;
  playerStartPositions: { x: number; y: number }[];
  rocks: { x: number; y: number }[];
  obstacles: { x: number; y: number; type: "river" | "lava" | "wind" }[];
  exit: { x: number; y: number };
}
```

### GameState Interface
```typescript
interface GameState {
  id: string;                        // Unique game identifier
  creatorUid: string;                // Firebase UID of creator
  levelNumber: number;               // Current level (1-5)
  gridSize: number;                  // Grid size (15x15)
  players: Record<string, Player>;   // Active players by UID
  gameObjects: Record<string, GameObject>; // Rocks, obstacles, exit
  status: "active" | "completed";    // Game status
  createdAt: number;                 // Timestamp
}
```

### GameObject Interface
```typescript
interface GameObject {
  id: string;
  type: "rock" | "exit" | "obstacle";
  x: number;
  y: number;
  obstacleType?: "river" | "lava" | "wind";  // For obstacles
  originalObstacleType?: "river" | "lava" | "wind"; // For rock covering
  covered?: boolean;                 // Rock is covering obstacle
}
```

### Player Interface
```typescript
interface Player {
  id: string;
  uid: string;                   // Firebase UID
  email: string;
  x: number;                     // Grid position
  y: number;
  color: string;                 // Display color
}
```

## Game Loop Flow

### Per-Frame Update
1. Listen to Firebase `listenToGameState()` for real-time updates
2. Update local player/object state
3. Render game canvas with current positions
4. Check for level completion conditions

### Player Movement
```
Player presses key
  ↓
validateMove() - Check bounds
  ↓
checkCollisions() - Players, rocks, obstacles, exit
  ↓
If obstacle hit → showAlert() → resetLevel()
If rock hit → handleRockPush()
If clear → updatePlayerPosition()
If exit & all players → checkAllPlayersAtExit()
```

### Rock Push Mechanics
```
Player moves into rock position
  ↓
handleRockPush()
  ↓
Calculate push direction (rockPos - playerPos)
  ↓
Check new rock position valid?
  ├─ Out of bounds? STOP
  ├─ Collision with object? STOP
  └─ Clear? CONTINUE
  ↓
Is there an obstacle at new position?
  ├─ YES: Move rock & mark obstacle as covered
  └─ NO: Move rock normally
  ↓
Move player to where rock was
```

### Level Progression
```
All players at exit position
  ↓
checkAllPlayersAtExit() returns true
  ↓
levelNumber++
  ↓
levelNumber > 5?
  ├─ NO: loadNextLevel() → Delete game → Create new at level N+1
  └─ YES: Show congratulations → onGameEnd()
```

## Firebase Database Structure

```
/games/{gameId}
├── id: string
├── creatorUid: string
├── levelNumber: number
├── gridSize: number
├── status: "active" | "completed"
├── createdAt: number
├── players
│   └── {uid}
│       ├── id: string
│       ├── uid: string
│       ├── email: string
│       ├── x: number
│       ├── y: number
│       └── color: string
└── gameObjects
    └── {objectId}
        ├── id: string
        ├── type: "rock" | "exit" | "obstacle"
        ├── x: number
        ├── y: number
        ├── obstacleType?: string
        ├── originalObstacleType?: string
        └── covered?: boolean
```

## Key Functions

### GameService Methods

#### `getLevel(levelNumber: number): Level | null`
Retrieves the built-in level definition by number

#### `createGame(creatorUid: string, email: string, levelNumber: number = 1): Promise<string>`
- Creates new game at specified level
- Initializes game objects from level data
- Returns game ID
- Automatically sets game status to "active"

#### `joinGame(gameId: string, playerUid: string, email: string): Promise<void>`
- Adds player to existing game
- Uses level-specific starting positions
- Validates game exists and not full (max 6 players)

#### `updatePlayerPosition(gameId: string, playerId: string, x: number, y: number): Promise<void>`
Updates player's grid coordinates in real-time

#### `moveGameObject(gameId: string, objectId: string, x: number, y: number): Promise<void>`
Moves a game object (rock) to new position

#### `updateGameObject(gameId: string, objectId: string, updates: Partial<GameObject>): Promise<void>`
Updates any properties of a game object (e.g., covered status)

#### `listenToGameState(gameId: string, callback): Unsubscribe`
Sets up real-time listener for game state changes

### GameCanvas Methods

#### `handleMove(newX: number, newY: number): Promise<void>`
Processes player movement with collision detection

#### `handleRockPush(rockX: number, rockY: number, rockId: string): Promise<void>`
Implements rock physics and collision

#### `checkAllPlayersAtExit(): void`
Verifies all players reached exit, triggers progression

#### `loadNextLevel(levelNumber: number): Promise<void>`
Deletes current game, creates next level

#### `resetLevel(): Promise<void>`
Restarts current level after obstacle collision

#### `restartFromFirstLevel(): Promise<void>`
Restarts entire game from Level 1

## Collision Detection

### Obstacle Collision
```typescript
const objectAtPos = gameObjects.find(obj => 
  obj.x === newX && obj.y === newY
);

if (objectAtPos?.type === "obstacle") {
  showAlert("error", "You hit an obstacle! Restarting level...");
  resetLevel();
}
```

### Rock Collision with Obstacle
```typescript
const obstacleAtPos = gameObjects.find(obj =>
  obj.type === "obstacle" &&
  obj.x === newRockX &&
  obj.y === newRockY
);

if (obstacleAtPos) {
  // Rock covers obstacle
  await updateGameObject(gameId, obstacleAtPos.id, {
    covered: true
  });
}
```

## Performance Considerations

1. **Real-time Updates**: Uses Firebase `onValue()` for live synchronization
2. **Grid Size**: Fixed 15x15 grid (450 cells) for consistent performance
3. **Object Count**: Max ~6 players + 30 game objects per level
4. **Rendering**: React re-renders on state changes (optimized with local state)
5. **Event Handling**: Arrow key listeners cleaned up on unmount

## Common Issues & Solutions

### Rock Not Moving
- **Cause**: Rock at boundary or collision detected
- **Solution**: Check console for collision message

### Obstacle Reappearing Too Soon
- **Cause**: Rock moved away, obstacle re-enabled
- **Solution**: This is intentional! Rock must stay to keep obstacle covered

### All Players Not at Exit
- **Cause**: One or more players haven't reached the yellow door
- **Solution**: Wait for all players to reach same position as exit

### Game Won't Progress to Next Level
- **Cause**: Not all players at exit, or database write failed
- **Solution**: Check that ALL players are on the exit tile

## Testing Checklist

- [ ] Level 1 loads with correct rock positions
- [ ] Player can move with arrow keys
- [ ] Player can push rocks
- [ ] Obstacles block movement and show alert
- [ ] Rock covers obstacle when pushed onto it
- [ ] Obstacle reappears when rock moves away
- [ ] Level progresses when all players reach exit
- [ ] Level counter updates correctly
- [ ] All 5 levels load properly
- [ ] Game completes after Level 5
- [ ] Reset level button works
- [ ] Restart from Level 1 button works
- [ ] Multiple players can join same game
- [ ] Game code sharing works correctly
