# Block Buddies - Architecture & Development

## System Architecture

### Frontend Stack

- **React 18**: Component-based UI
- **TypeScript**: Type-safe development
- **Vite**: Fast bundler and dev server
- **Zustand**: Lightweight state management
- **FontAwesome**: Icon library

### Backend & Services

- **Firebase Authentication**: User login/signup
- **Firebase Realtime Database**: Game state synchronization
- **UUID**: Unique ID generation

## Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Application                    │
├─────────────────────────────────────────────────────────┤
│  App.tsx (Main Router)                                  │
│  ├─ AuthPage (No Auth)                                  │
│  ├─ MainMenu (Authenticated)                            │
│  └─ GameRoom (In Game)                                  │
├─────────────────────────────────────────────────────────┤
│               Components Layer                           │
│  ├─ Auth.tsx (Login/Signup Forms)                       │
│  ├─ GameCanvas.tsx (Game Rendering)                     │
│  ├─ LevelDesigner.tsx (Level Editor)                    │
│  └─ GameRoom.tsx (Lobby Manager)                        │
├─────────────────────────────────────────────────────────┤
│              Services Layer (Business Logic)             │
│  ├─ authService.ts (Firebase Auth)                      │
│  └─ gameService.ts (Game Logic)                         │
├─────────────────────────────────────────────────────────┤
│            State Management (Zustand)                    │
│  ├─ AuthStore (User, Loading)                           │
│  └─ GameStore (GameID, GameState, CurrentPlayer)        │
├─────────────────────────────────────────────────────────┤
│              Firebase Services                           │
│  ├─ Authentication API                                  │
│  └─ Realtime Database API                               │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Input (Keyboard)
        │
        ▼
  GameCanvas Component
        │
        ├─ Update Player Position
        │        │
        │        ▼
        │  GameService.updatePlayerPosition()
        │        │
        │        ▼
        │  Firebase Realtime DB
        │        │
        │        ▼
        └─ GameService.listenToGameState()
                 │
                 ▼
           Update Zustand Store
                 │
                 ▼
           Re-render Components
                 │
                 ▼
           Display Updated Game State
```

## Component Hierarchy

```
App
├── AuthPage
│   ├── Login
│   └── Signup
├── MainMenu
│   └── (User Profile & Game Options)
└── GameRoom
    ├── GameLobby (waiting state)
    │   ├── PlayersList
    │   └── LevelDesigner
    └── GameCanvas (active state)
        ├── Grid
        ├── GameObjects
        └── Players
```

## State Management Flow

### AuthStore

```typescript
User Action (Login/Signup)
        │
        ▼
AuthService.signin/signup()
        │
        ▼
Firebase Auth Update
        │
        ▼
onAuthStateChanged() callback
        │
        ▼
setUser() → AuthStore
        │
        ▼
App re-renders based on user state
```

### GameStore

```typescript
User Action (Create/Join Game)
        │
        ▼
GameService.createGame/joinGame()
        │
        ▼
Firebase DB Update
        │
        ▼
GameService.listenToGameState()
        │
        ▼
setGameState() → GameStore
        │
        ▼
Components re-render with new game state
```

## Key Design Patterns

### 1. Service Pattern

Business logic is separated into services (`authService`, `gameService`) making it easy to test and maintain.

```typescript
// Usage in components
const game = await GameService.createGame(uid, email, level);
```

### 2. Observer Pattern

Firebase listeners notify components of state changes in real-time.

```typescript
GameService.listenToGameState(gameId, (newState) => {
  setGameState(newState);
});
```

### 3. State Management Pattern

Zustand stores manage global state without prop drilling.

```typescript
const gameId = useGameStore((state) => state.gameId);
```

### 4. Component Composition

Reusable components for forms, buttons, and UI elements.

```typescript
<GameCanvas gameId={gameId} onGameEnd={handleEnd} />
```

## Real-time Synchronization

### Flow

1. **Player Input**: User presses arrow key
2. **Position Update**: `GameService.updatePlayerPosition()` called
3. **Firebase Update**: Player position written to database
4. **Listener Triggered**: Other clients' listeners fire
5. **State Update**: `setGameState()` updates Zustand store
6. **Re-render**: Components re-render with new positions

### Latency Handling

- Optimistic updates in component state
- Real-time sync from Firebase
- Collision detection on database side

## Security Considerations

1. **Authentication**: Firebase Auth handles password hashing and session management
2. **Database Rules**: Restrict access based on user ID
3. **User Data**: Only users can read/write their own profiles
4. **Game Data**: All players can read game state, but only participants can write

## Performance Optimizations

1. **Code Splitting**: Separate entry points for dev and prod
2. **Asset Caching**: FontAwesome fonts cached in browser
3. **Lazy Rendering**: Only visible game objects rendered
4. **Efficient Updates**: Only changed properties updated in Firebase
5. **Debouncing**: Position updates throttled to prevent excessive writes

## Error Handling

### Firebase Errors

```typescript
try {
  await GameService.joinGame(gameId, uid, email);
} catch (error) {
  if (error.code === "permission-denied") {
    // Handle permission error
  }
}
```

### Network Errors

- Automatic Firebase retry mechanism
- UI shows loading state during operations
- Error messages displayed to user

## Testing Strategy

### Unit Tests

- Test services independently
- Mock Firebase calls
- Test state management logic

### Integration Tests

- Test component + service interaction
- Mock Firebase Database

### E2E Tests

- Full game flow with real Firebase
- Multiple player simulation

## Deployment

### Environment Variables

Create `.env.local`:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project
```

### Build Process

```bash
npm run build  # Creates optimized dist folder
npm run preview  # Test production build locally
```

### Hosting Options

- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages
- AWS S3 + CloudFront

## Database Indexes

Recommended Firebase Realtime Database indexes:

```json
{
  "rules": {
    "games": {
      ".indexOn": ["status", "createdAt"]
    },
    "users": {
      ".indexOn": ["createdAt", "lastLevel"]
    }
  }
}
```

## Monitoring & Analytics

### Firebase Analytics

Automatically tracks:

- User authentication events
- App usage patterns
- Performance metrics

### Custom Events

```typescript
// Log custom game events
logEvent(analytics, "level_completed", {
  level_number: 5,
  players_count: 3,
});
```

## Scaling Considerations

### Current Limitations

- Max 6 players per game
- 15x15 grid
- Unlimited games (but cleanup needed)

### Future Scaling

- Archive old games
- Database sharding
- Caching layer
- CDN for static assets
- Load balancing for Firebase

## Development Workflow

### 1. Feature Development

```bash
npm run dev  # Start dev server
# Make changes
# Test in browser
```

### 2. Type Checking

```bash
npm run type-check  # Check TypeScript errors
```

### 3. Linting

```bash
npm run lint  # Check code style
```

### 4. Building

```bash
npm run build  # Compile for production
npm run preview  # Test production build
```

## Git Workflow

### Branch Naming

- `feature/game-title`: New features
- `fix/bug-description`: Bug fixes
- `refactor/component-name`: Code improvements

### Commit Messages

```
feat: Add level designer component
fix: Fix player collision detection
refactor: Extract game logic to service
docs: Update setup guide
```

## Code Organization Best Practices

1. **Components**: Should only handle UI and user interactions
2. **Services**: Should handle business logic and API calls
3. **Store**: Should manage global state only
4. **Utils**: Helper functions for common operations
5. **Types**: All TypeScript interfaces grouped

## Documentation Standards

- JSDoc comments for functions
- README for each major component
- CHANGELOG for version updates
- Architecture diagrams for complex flows

## Version Management

Current version: 1.0.0

Semantic Versioning:

- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

## Debugging Tips

1. **React DevTools**: Browser extension for React debugging
2. **Firebase Console**: Monitor database and auth
3. **Network Tab**: Check API calls
4. **Console Logs**: Use `console.log` strategically
5. **Breakpoints**: Use browser debugger

## Performance Profiling

```bash
npm run build -- --analyze  # Analyze bundle size
```

## Common Issues & Solutions

| Issue           | Root Cause                 | Solution                     |
| --------------- | -------------------------- | ---------------------------- |
| Slow updates    | Too many listeners         | Unsubscribe unused listeners |
| Memory leak     | References not cleared     | Cleanup in useEffect return  |
| Stale state     | Component not re-rendering | Check Zustand store update   |
| Firebase errors | Rules issue                | Check Firebase console rules |

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev/)
