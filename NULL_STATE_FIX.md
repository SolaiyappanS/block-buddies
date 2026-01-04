# Null State Handling After Player Exit Fix

## Problem
After both players reached the exit and were removed from the game via `leaveGame()`, the game would be deleted. The Firebase listener would receive a null snapshot, triggering the callback with `null` as the gameState. The GameCanvas component wasn't properly handling this null state, causing:

```
TypeError: Cannot convert undefined or null to object
at Object.keys(<anonymous>)
```

## Root Cause
When all players exit and `loadNextLevel()` calls `deleteGame()`, the Firebase database entry is deleted. The listener fires with `snapshot.exists() = false`, so it calls the callback with `null`. The GameCanvas was trying to access properties on the null state without proper checks.

## Solution

### 1. **Null Check in Listener Callback** 
```typescript
// Handle both cases: when game exists and when it's deleted
if (newGameState) {
  // Game exists - update normally
  const playersObj = newGameState.players || {};
  setPlayers(playersObj);
  setGameObjects(newGameState.gameObjects || {});
} else {
  // Game was deleted - set empty state
  setPlayers({});
  setGameObjects({});
  setCurrentPlayer(null);
  
  // Only trigger level completion if we're already in that state
  if (allPlayersAtExit) {
    // Handle level completion...
  }
}
```

### 2. **Safe Object Access**
- Always initialize `playersObj` and `gameObjects` with fallback empty objects
- Use optional chaining in render: `gameState?.levelNumber`
- Check if objects exist before calling `Object.keys()` or `Object.values()`

### 3. **Graceful Game Deletion Handling**
When `newGameState` is null, it means:
- The game was successfully deleted from Firebase
- All players have exited
- We should trigger level progression if `allPlayersAtExit` is true
- Otherwise, redirect to menu if game disappears unexpectedly

## Benefits
✅ No more null reference errors  
✅ Proper handling of game deletion after level completion  
✅ Graceful transitions between levels  
✅ Clear separation of concerns (game exists vs. deleted)

## Code Changes
[src/components/GameCanvas.tsx](src/components/GameCanvas.tsx#L36-L78)
- Enhanced listener callback with comprehensive null handling
- Safe initialization of state objects
- Added logic to handle game deletion scenario
- Conditional level completion triggering
