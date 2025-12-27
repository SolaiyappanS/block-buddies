# Block Buddies - Setup & Configuration Guide

## Quick Start

### 1. Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 2. Production Build

```bash
npm run build
npm run preview
```

## Firebase Configuration

The Firebase configuration is already set up in `src/config/firebase.ts`. The app is connected to:

- **Project**: block-buddies-3cb0b
- **API Key**: AIzaSyC5k0oqkZcK093yJCAMKYYmEkLwfE2nTQQ
- **Database URL**: https://block-buddies-3cb0b-default-rtdb.firebaseio.com

### Database Structure

```
/games
  /{gameId}
    /players
      /{playerId}
        - uid: string
        - email: string
        - x: number
        - y: number
        - color: string
    /gameObjects
      /{objectId}
        - type: "rock" | "exit" | "obstacle"
        - x: number
        - y: number
        - obstacleType?: "river" | "lava" | "wind"
    - creatorUid: string
    - levelNumber: number
    - gridSize: number
    - status: "waiting" | "active" | "completed"
    - createdAt: number

/users
  /{uid}
    - uid: string
    - email: string
    - displayName: string
    - createdAt: number
    - lastLevel: number
```

## Game Codes

Game codes are generated using UUID format and can be shared between players. Only the first 8 characters are displayed for simplicity:

- Full UUID: `550e8400-e29b-41d4-a716-446655440000`
- Displayed: `550e8400`

## Adding New Levels

To add new levels with predefined layouts, update `src/services/gameService.ts` and create a level configuration system.

### Example Level Config:

```typescript
const LEVELS = {
  1: {
    gridSize: 15,
    objects: [
      { type: "rock", x: 5, y: 5 },
      { type: "river", x: 10, y: 10 },
      { type: "exit", x: 14, y: 14 },
    ],
  },
};
```

## Customization

### Grid Size

Change in `GameCanvas.tsx`:

```typescript
const GRID_SIZE = 15; // Change to desired size
const PIXEL_SIZE = 30; // Pixels per grid cell on screen
```

### Player Colors

Modify in `gameService.ts`:

```typescript
const PLAYER_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
];
```

### Obstacle Types

Add new obstacles in `GameObject` interface and `LevelDesigner.tsx`:

```typescript
type TileType = "empty" | "rock" | "exit" | "river" | "lava" | "wind" | "ice";
```

## Key Components

### AuthPage.tsx

Handles authentication UI with toggle between login and signup.

**Props**: None
**State**:

- `isLogin`: Boolean to toggle between login/signup

### MainMenu.tsx

Main menu after authentication where users can create or join games.

**Props**:

- `onCreateGame(gameId)`: Called when game is created
- `onJoinGame(gameId)`: Called when joining a game

**State**:

- `lastLevel`: User's last completed level
- `gameCode`: Code entered to join a game

### GameRoom.tsx

Game lobby and game state manager.

**Props**:

- `gameId`: Current game ID
- `onLeave()`: Called when leaving the game

**State**:

- `isCreator`: Whether current user is the game creator
- `gameStarted`: Whether the game has been started

### GameCanvas.tsx

Main game rendering component with real-time player synchronization.

**Props**:

- `gameId`: Current game ID
- `onGameEnd()`: Called when leaving the game

**Features**:

- Real-time position updates
- Keyboard controls (Arrow Keys/WASD)
- Level completion detection

### LevelDesigner.tsx

Visual level editor for game creators.

**Props**:

- `gameId`: Current game ID
- `onStart()`: Called when game starts

**Tile Types**:

- Empty: No object
- Rock: Pushable block
- Exit: Goal destination
- River: Water obstacle
- Lava: Fire obstacle
- Wind: Air obstacle

## State Management (Zustand)

### AuthStore

```typescript
interface AuthStore {
  user: User | null;
  userLoading: boolean;
  setUser(user): void;
  setUserLoading(loading): void;
}
```

### GameStore

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
```

## Services

### AuthService

Static methods for authentication:

- `signup(email, password, displayName)`
- `signin(email, password)`
- `signout()`
- `getCurrentUser()`
- `onAuthStateChanged(callback)`
- `getUserProfile(uid)`
- `updateLastLevel(uid, level)`

### GameService

Static methods for game operations:

- `createGame(creatorUid, email, levelNumber)`
- `joinGame(gameId, playerUid, email)`
- `updatePlayerPosition(gameId, playerId, x, y)`
- `addGameObject(gameId, type, x, y, obstacleType?)`
- `moveGameObject(gameId, objectId, x, y)`
- `removeGameObject(gameId, objectId)`
- `getGameState(gameId)`
- `listenToGameState(gameId, callback)`
- `updateGameLevel(gameId, levelNumber)`
- `updateGameStatus(gameId, status)`
- `leaveGame(gameId, playerId)`
- `deleteGame(gameId)`

## Styling

All styles are organized by component:

- `Auth.css`: Login/signup forms
- `AuthPage.css`: Auth page layout
- `MainMenu.css`: Main menu styling
- `GameRoom.css`: Game lobby and room
- `Game.css`: Game canvas and players
- `LevelDesigner.css`: Level editor UI

Color scheme:

- Primary: #667eea (Purple/Blue)
- Secondary: #764ba2 (Dark Purple)
- Success: #28a745 (Green)
- Danger: #dc3545 (Red)
- Warning: #ffc107 (Yellow)

## Game Flow Diagram

```
                    ┌─────────────────┐
                    │   AuthPage      │
                    │ Login/Signup    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   MainMenu      │
                    │ Create/Join     │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                        │
                ▼                        ▼
        ┌──────────────┐        ┌──────────────┐
        │  GameRoom    │        │  GameRoom    │
        │  (Creator)   │        │  (Player)    │
        └────────┬─────┘        └────────┬─────┘
                 │                       │
                 ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │LevelDesigner │◄──────►│   Waiting    │
        │   (Design)   │        │   (Lobby)    │
        └────────┬─────┘        └──────────────┘
                 │
                 ▼
        ┌──────────────┐
        │ GameCanvas   │
        │ (Playing)    │
        └──────────────┘
```

## Troubleshooting

### Build Errors

- Ensure Node.js >= 20.19.0
- Clear `node_modules` and reinstall: `npm ci`
- Check TypeScript errors: `npm run build`

### Runtime Errors

- Check browser console for errors
- Verify Firebase configuration
- Ensure Firebase Database is enabled

### Firebase Issues

- Confirm Email/Password auth is enabled
- Check database rules allow read/write
- Verify API key is correct in `firebase.ts`

### Game Issues

- Game code must be exact match (case-sensitive)
- Maximum 6 players per game
- Only creator can start the game
- Clear browser cache if experiencing lag

## Performance Tips

1. **Large Grids**: Use grid size <= 20 for smooth performance
2. **Multiplayer**: Ensure good internet connection
3. **Objects**: Limit to < 100 game objects per level
4. **Updates**: Real-time updates may cause lag with many players

## Future Enhancements

- [ ] Offline mode with sync
- [ ] Custom grid sizes
- [ ] Time-based levels
- [ ] Achievements system
- [ ] Replay feature
- [ ] Level difficulty ratings
- [ ] Custom player names/avatars
- [ ] Spectator mode
- [ ] Team challenges
- [ ] Cross-platform support

## Support

For issues, check:

1. Firebase console logs
2. Browser developer console
3. Network tab for failed requests
4. Database rules in Firebase console
