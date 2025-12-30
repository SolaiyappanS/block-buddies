# Block Buddies - Quick Reference Card

## 🎮 Game Overview
A cooperative multi-player puzzle game where players must work together to reach the exit door in each of 5 challenging levels.

## 🎯 Objective
Guide all players to the exit door on each level. All players must reach it together to progress.

## 🕹️ Controls
- **Arrow Keys** (↑↓←→) or **WASD** - Move character
- **Click Buttons** - Interact with UI

## 🧩 Key Mechanics

### Rock Pushing
- Move into a rock and push it away from you
- Rocks move in the direction you push them
- Can't push rocks off the grid or into other objects
- **Strategy**: Use rocks to create safe paths!

### Obstacles
- **River** (💧) - Water hazard, impassable
- **Lava** (🔥) - Fire hazard, impassable  
- **Wind** (💨) - Wind hazard, blocks passage

### Rock Covering Obstacles
```
Player pushes rock → Rock lands on obstacle
→ Obstacle hidden by rock
→ Player can use this path safely
→ Move rock away → Obstacle reappears
```

## 📊 Level Progression

| Level | Players | Difficulty | Features |
|-------|---------|-----------|----------|
| 1 | 3 | Beginner | Tutorial with lava |
| 2 | 2 | Easy | River & lava mixed |
| 3 | 3 | Medium | Wind obstacles added |
| 4 | 3 | Hard | Maze-like layout |
| 5 | 2 | Expert | All types combined |

## ⚠️ Alert System
If you touch an obstacle → Popup appears with options:
1. **Restart Level** - Try again at current level
2. **Start From Level 1** - Reset entire game

## 👥 Multi-Player Rules
- **Max Players**: 6 per game
- **Exit Requirement**: ALL must reach exit simultaneously
- **Sharing**: Game code allows friends to join
- **Synchronization**: Real-time position updates

## 🚀 Getting Started

### Creating a Game
1. Click "Create Game"
2. Share the code with friends
3. Level 1 starts automatically

### Joining a Game
1. Click "Join Existing Game"
2. Enter the game code
3. Spawn at your starting position

## 🏆 Winning
- Complete all 5 levels
- Reach the exit on Level 5
- See the congratulations message!

## 💡 Pro Tips

### Planning
- ✓ Scout the level before moving
- ✓ Identify obstacles you need to cover
- ✓ Plan your rock movements carefully

### Teamwork
- ✓ Communicate with other players
- ✓ Coordinate who goes where
- ✓ Make sure everyone can reach the exit

### Problem Solving
- ✓ Remember: rocks can cover hazards
- ✓ Use rocks as stepping stones
- ✓ Work around obstacles strategically

## ❌ Common Mistakes
- ❌ Pushing rocks randomly without a plan
- ❌ Forgetting that ALL players must reach exit
- ❌ Not planning safe paths for all players
- ❌ Pushing rocks off reachable positions

## 🎨 Game Elements

### Colors
- 🔴 Red/Pink - Player 1
- 🟢 Teal - Player 2
- 🔵 Blue - Player 3
- 🟠 Orange - Player 4
- 💚 Green - Player 5
- 💛 Yellow - Player 6

### Icons
- 🧱 Brown cube - Rock (pushable)
- 🚪 Yellow door - Exit (goal)
- 💧 Blue - River (obstacle)
- 🔥 Red - Lava (obstacle)
- 💨 Gray - Wind (obstacle)

## 📱 Grid System
- **Size**: 15 × 15 cells
- **Cell Size**: 30 × 30 pixels
- **Grid Line**: Visible reference grid
- **Boundaries**: Walls prevent movement beyond grid

## 🔄 Game Loop
1. Players move with keyboard
2. Check for collisions
3. If obstacle hit → Alert popup
4. If all at exit → Progress level
5. Load next level data
6. Repeat until Level 5 complete

## ⏱️ Timing
- Immediate feedback on actions
- 3-second pause when level completes
- Instant alert on obstacle collision
- Real-time multi-player synchronization

## 🛠️ Troubleshooting

**Q: Can't move the rock?**
- A: Rock might be at boundary or blocked

**Q: Obstacle reappeared?**
- A: You moved the rock away (intentional mechanic)

**Q: Won't progress to next level?**
- A: All players must be at exit position

**Q: Game won't start?**
- A: Make sure you're authenticated

## 📚 Documentation
- **GAMEPLAY_GUIDE.md** - Detailed player guide
- **TECHNICAL_REFERENCE.md** - Developer documentation
- **IMPLEMENTATION_SUMMARY.md** - Feature overview

## 🎪 Game Features
- ✅ 5 unique levels
- ✅ 6-player support
- ✅ Real-time multiplayer
- ✅ Rock physics
- ✅ Obstacle system
- ✅ Level progression
- ✅ Game saving
- ✅ Responsive design

## 🔐 Security
- Firebase authentication required
- Real-time database synchronization
- User data protected
- Game codes for access control

## 📊 Statistics
- **Max Grid Size**: 15 × 15 cells
- **Total Levels**: 5
- **Total Rocks per Level**: 3-18
- **Total Obstacles per Level**: 2-8
- **Build Size**: Optimized for production

---

**Version**: 1.0.0
**Last Updated**: December 30, 2025
**Status**: Production Ready ✅

For detailed guides, see documentation files in project root.
