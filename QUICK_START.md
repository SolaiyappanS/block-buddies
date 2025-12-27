# Block Buddies - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### Step 1: Install & Run

```bash
cd block-buddies
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Step 2: Create Account

1. Click **Sign Up**
2. Enter name, email, and password
3. Click **Sign Up** button

### Step 3: Create Your First Game

1. Click **Create Game** button
2. You'll see a game code at the top (e.g., "550E8400")
3. Share this code with friends

### Step 4: Design the Level

1. Select tiles from the tools:

   - **Rock** (🧱): Pushable blocks
   - **Exit** (🚪): Goal location
   - **River** (💧): Water barrier
   - **Lava** (🔥): Fire obstacle
   - **Wind** (💨): Air obstacle

2. Click on grid cells to place/remove objects
3. Click **Clear** to start over

### Step 5: Start Playing

1. Click **Start Game** button
2. Game begins when creator starts
3. Share the game code with players to join

### Step 6: Play

- Use **Arrow Keys** or **WASD** to move
- Move around the grid
- Avoid obstacles
- Reach the exit door to complete the level

---

## 🎮 Multiplayer Guide

### For the Game Creator:

1. Create a new game
2. Share the game code with other players
3. Wait for players to join in the lobby
4. Design the level
5. Click **Start Game**

### For Joining Players:

1. Go to main menu
2. Enter the game code you received
3. Click **Join Game**
4. Wait in the lobby for the game to start
5. Play together!

---

## 🎯 Game Rules

- **Objective**: Reach the exit door (🚪) to complete the level
- **Obstacles**: Avoid rivers (💧), lava (🔥), and wind (💨)
- **Rocks**: Can be pushed to solve puzzles
- **Multiplayer**: All players are on the same grid at the same time
- **No Collision**: Two players can't be in the same cell

---

## ⌨️ Controls

| Key                | Action     |
| ------------------ | ---------- |
| ⬆️ Arrow Up / W    | Move Up    |
| ⬇️ Arrow Down / S  | Move Down  |
| ⬅️ Arrow Left / A  | Move Left  |
| ➡️ Arrow Right / D | Move Right |

---

## 💾 Saving Progress

Your progress is automatically saved! When you log back in, you can resume from the level where you left off.

---

## 👥 Multi-Player (2-6 Players)

- Each player has a unique color
- See all players' positions in real-time
- Work together to solve puzzles
- All players must reach the exit

---

## 🔐 Account Security

- Use a secure password (recommended: 8+ characters, mix of letters, numbers)
- Only you can log in with your email and password
- Your progress is tied to your account
- Can't log in from multiple devices simultaneously (security feature)

---

## 🐛 Troubleshooting

| Problem                      | Solution                                     |
| ---------------------------- | -------------------------------------------- |
| Can't create account         | Email already in use, try another email      |
| Game code not working        | Double-check the code is correct             |
| Players can't see each other | Refresh the page, check internet connection  |
| Can't move                   | Check if there's another player in that cell |
| Level won't start            | Make sure the creator clicks **Start Game**  |

---

## 📱 Tips & Tricks

1. **Game Code**: Write down the game code so players don't forget it
2. **Level Design**: Simple levels are easier to understand
3. **Teamwork**: Communicate with other players for better puzzle solving
4. **Testing**: Test your levels before playing with friends
5. **Obstacles**: Use obstacles to create interesting puzzle challenges

---

## 🎯 Example Level

Here's a simple puzzle level to start with:

```
. . . . . . . . . . . . . . .
. X . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . R R . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . E

Legend:
X = Start Position
R = Rock
E = Exit
. = Empty Space
```

Players start at position (1, 1) and need to push rocks to create a path to the exit at (14, 14).

---

## 🔗 Quick Links

- [Full Setup Guide](./SETUP_GUIDE.md)
- [Game Documentation](./GAME_README.md)
- [Firebase Console](https://console.firebase.google.com/)

---

## 🎉 Have Fun!

Enjoy playing Block Buddies with your friends! 🎮✨

For more help, check out the detailed guides above.
