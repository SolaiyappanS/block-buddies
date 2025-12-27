# Block Buddies - Multiplayer 2D Puzzle Game

A real-time multiplayer 2D puzzle game built with React, TypeScript, Vite, and Firebase. Players work together to solve puzzles and reach the exit door while navigating obstacles like rivers, lava, and strong winds.

## Features

- **Multiplayer Support**: 2-6 players can join a game using a game code
- **Real-time Synchronization**: Live game state updates using Firebase Realtime Database
- **User Authentication**: Email/password authentication with Firebase
- **Progress Persistence**: Players can resume from the level they left off
- **Dynamic Level Design**: Creator can design levels with obstacles and game elements
- **Multiple Obstacles**: Rivers, lava, and wind effects to solve puzzles
- **Responsive UI**: Beautiful, interactive interface with FontAwesome icons

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account with Realtime Database enabled

## Installation

1. **Clone the repository**

   ```bash
   cd block-buddies
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Login/Signup forms
│   ├── AuthPage.tsx    # Authentication page wrapper
│   ├── GameCanvas.tsx  # Main game rendering
│   ├── GameRoom.tsx    # Game lobby and room manager
│   ├── LevelDesigner.tsx # Level creation tool
│   └── MainMenu.tsx    # Main menu screen
├── config/             # Configuration files
│   └── firebase.ts     # Firebase initialization
├── services/           # Business logic services
│   ├── authService.ts  # Authentication logic
│   └── gameService.ts  # Game state management
├── store/              # State management (Zustand)
│   └── store.ts        # Global state stores
├── styles/             # CSS stylesheets
│   ├── Auth.css
│   ├── AuthPage.css
│   ├── Game.css
│   ├── GameRoom.css
│   ├── LevelDesigner.css
│   └── MainMenu.css
├── App.tsx             # Main application component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Game Flow

### 1. Authentication

- New users sign up with email and password
- Existing users log in to resume their progress
- User data is stored in Firebase with last completed level

### 2. Main Menu

- Create a new game (as creator)
- Join existing game with game code
- View resume level information
- Logout option

### 3. Game Lobby

- **Creator**: Design the level using the Level Designer tool
  - Place rocks, obstacles (river/lava/wind), and exit door
  - Click on grid cells to place/remove objects
  - Start game when ready
- **Players**: Wait for creator to start the game
  - See all connected players
  - See game code to share with others

### 4. Gameplay

- **Controls**:
  - Arrow Keys or WASD to move
  - Move around the grid avoiding obstacles
  - Push rocks to solve puzzles
  - Reach the exit door to complete the level
- **Real-time Multiplayer**: All players see each other moving
- **Obstacles**:
  - Rivers: Water barriers
  - Lava: Danger zones
  - Wind: Air currents

### 5. Level Progression

- Complete current level to unlock next level
- Progress is automatically saved to Firebase
- Resume from where you left off

## Firebase Setup

The app uses the provided Firebase configuration. Make sure your Firebase project has:

1. **Authentication**: Email/Password provider enabled
2. **Realtime Database**: Rules configured for read/write access

### Example Firebase Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "games": {
      ".read": true,
      ".write": true,
      "$gameId": {
        "players": {
          "$playerId": {
            ".read": true,
            ".write": true
          }
        }
      }
    }
  }
}
```

## Key Technologies

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Firebase**:
  - Authentication: User login/signup
  - Realtime Database: Game state synchronization
- **Zustand**: State management
- **FontAwesome**: Icons
- **UUID**: Unique ID generation

## Game Mechanics

### Grid System

- 15x15 grid (adjustable)
- Each cell is 30x30 pixels on screen
- One player/object per cell

### Objects

- **Player**: Can move in 4 directions
- **Rock**: Can be pushed by players
- **Exit**: Goal destination to complete level
- **Obstacles**: Rivers, lava, wind (impassable or special mechanics)

### Multiplayer Logic

- Real-time position updates via Firebase
- Collision detection prevents multiple objects in same cell
- Game state synchronized across all players

## API Reference

### AuthService

```typescript
// Sign up new user
AuthService.signup(email, password, displayName): Promise<User>

// Sign in existing user
AuthService.signin(email, password): Promise<User>

// Sign out
AuthService.signout(): Promise<void>

// Get user profile
AuthService.getUserProfile(uid): Promise<UserProfile>

// Update last completed level
AuthService.updateLastLevel(uid, level): Promise<void>
```

### GameService

```typescript
// Create new game
GameService.createGame(creatorUid, email, levelNumber): Promise<string>

// Join existing game
GameService.joinGame(gameId, playerId, email): Promise<void>

// Update player position
GameService.updatePlayerPosition(gameId, playerId, x, y): Promise<void>

// Add game object (rock, exit, obstacle)
GameService.addGameObject(gameId, type, x, y, obstacleType?): Promise<void>

// Listen to game state changes
GameService.listenToGameState(gameId, callback): () => void
```

## Development Tips

1. **Local Testing**: Use multiple browser windows to simulate multiplayer
2. **Game Code**: Share the game code (first 8 characters) with other players
3. **Level Designer**: Click cells to toggle between empty, rocks, and obstacles
4. **Real-time Updates**: Changes appear instantly across all connected clients

## Future Enhancements

- [ ] Additional obstacle types and mechanics
- [ ] Puzzle difficulty levels
- [ ] Leaderboard and achievements
- [ ] Chat system for players
- [ ] Undo/redo functionality
- [ ] Mobile support
- [ ] Sound effects and background music
- [ ] Custom level sharing
- [ ] Power-ups and special items
- [ ] Time-based challenges

## Troubleshooting

**Can't create game**: Ensure Firebase Realtime Database is enabled
**Players can't see each other**: Check Firebase rules and network connection
**Game code not working**: Make sure game code is entered correctly
**Can't log back in**: Verify email/password match Firebase records

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue in the repository.
