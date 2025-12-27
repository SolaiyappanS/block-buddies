# Block Buddies - Troubleshooting Guide

## 🔍 Common Issues & Solutions

---

## Installation & Setup

### Issue: npm install fails

**Symptoms**: Error during `npm install`

**Solutions**:

1. Clear npm cache:

   ```bash
   npm cache clean --force
   ```

2. Delete and reinstall:

   ```bash
   rm -r node_modules
   npm install
   ```

3. Use npm ci instead:
   ```bash
   npm ci
   ```

---

### Issue: Node version incompatible

**Symptoms**: "Node.js 20.19+ required" error

**Solutions**:

1. Check your version:

   ```bash
   node --version
   ```

2. Update Node.js:

   - Visit https://nodejs.org/
   - Download LTS version
   - Reinstall

3. Use NVM (Node Version Manager):
   ```bash
   nvm install 20
   nvm use 20
   ```

---

### Issue: Port 5173 already in use

**Symptoms**: "Port 5173 is already in use"

**Solutions**:

1. Kill process on port 5173:

   ```bash
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. Use different port:
   ```bash
   npm run dev -- --port 3000
   ```

---

## Firebase Configuration

### Issue: Firebase errors in console

**Symptoms**: "Firebase is not initialized" or connection errors

**Solutions**:

1. Verify firebase.ts configuration:

   ```typescript
   // Check src/config/firebase.ts
   // Ensure all values are correct
   ```

2. Clear browser storage:

   - Open DevTools (F12)
   - Application → Clear storage
   - Refresh page

3. Verify Firebase credentials:
   - Visit Firebase Console
   - Check API key is correct
   - Ensure authentication is enabled

---

### Issue: Cannot connect to database

**Symptoms**: "Failed to read from database" or timeout errors

**Solutions**:

1. Check database exists:

   - Firebase Console
   - Realtime Database
   - Should show green status

2. Enable database:

   - Firebase Console
   - Create Realtime Database
   - Start in test mode

3. Fix database rules:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

---

### Issue: Authentication not working

**Symptoms**: Can't sign up or log in

**Solutions**:

1. Enable Email/Password auth:

   - Firebase Console
   - Authentication
   - Sign-in method
   - Enable Email/Password

2. Check password requirements:

   - Minimum 6 characters
   - No special restrictions

3. Clear auth state:
   ```typescript
   await AuthService.signout();
   ```

---

## Game Issues

### Issue: Can't create game

**Symptoms**: "Create Game" button does nothing

**Solutions**:

1. Check if logged in:

   - Reload page
   - Log in again

2. Check database:

   - Firebase Console
   - Realtime Database
   - Verify rules allow writes

3. Check console for errors:
   - Open DevTools (F12)
   - Check Console tab
   - Look for red errors

---

### Issue: Can't join game

**Symptoms**: "Game not found" error

**Solutions**:

1. Verify game code:

   - Copy exact code including spaces
   - Check for typos
   - Game codes are case-sensitive

2. Check if game exists:

   - Creator may have deleted it
   - Ask creator for new code

3. Check player limit:
   - Maximum 6 players per game
   - Game may be full

---

### Issue: Players can't see each other

**Symptoms**: Other players don't appear on screen

**Solutions**:

1. Refresh page:

   ```
   F5 or Ctrl+R
   ```

2. Check internet connection:

   - Ensure stable connection
   - Check Firebase connectivity

3. Verify players are in same game:

   - Both should see same game code
   - Check in game lobby

4. Clear browser cache:
   - DevTools → Application → Clear

---

### Issue: Game is slow or laggy

**Symptoms**: Movements are delayed, updates are slow

**Solutions**:

1. Check internet speed:

   - Use speedtest.net
   - Ensure minimum 1 Mbps

2. Close other tabs:

   - Reduce memory usage
   - Close other applications

3. Lower game grid size:

   - Edit `GameCanvas.tsx`
   - Change `GRID_SIZE` to smaller number

4. Disable browser extensions:

   - AdBlock, VPN, etc. can cause slowness

5. Check Firebase usage:
   - Firebase Console
   - Look for usage spikes
   - May need to scale

---

### Issue: Controls not working

**Symptoms**: Can't move with arrow keys or WASD

**Solutions**:

1. Check if game is active:

   - Must be in "active" status
   - Wait for creator to start

2. Test keyboard:

   - Make sure arrow keys work in other apps
   - Try WASD instead (or vice versa)

3. Check for input focus:

   - Click on game canvas
   - Ensure it has focus

4. Verify controls:
   - Arrow Keys: Up/Down/Left/Right
   - WASD: W/A/S/D

---

### Issue: Level won't start

**Symptoms**: "Start Game" button disabled or not working

**Solutions**:

1. Only creator can start:

   - Must be game creator
   - Other players see waiting screen

2. Place exit door first:

   - Designer must place at least one exit
   - Place it somewhere on grid

3. Check level design:

   - Click grid cells to place objects
   - Selected tile should be highlighted

4. Check permissions:
   - Ensure you're the creator
   - Check in game lobby

---

## Authentication Issues

### Issue: Can't create account

**Symptoms**: "Email already in use" or signup fails

**Solutions**:

1. Use different email:

   - Each account needs unique email
   - Try another email address

2. Check password:

   - Minimum 6 characters
   - Try without special characters

3. Clear browser data:

   - DevTools → Application → Clear Storage
   - Reload and try again

4. Check email format:
   - Must be valid email (user@domain.com)
   - No spaces allowed

---

### Issue: Can't log in

**Symptoms**: "Invalid email or password" error

**Solutions**:

1. Verify credentials:

   - Check email spelling
   - Verify password is correct
   - Passwords are case-sensitive

2. Reset password:

   - Email must be registered
   - Check email provider's spam folder
   - May need password reset feature

3. Check caps lock:
   - Ensure caps lock is off
   - Passwords are case-sensitive

---

### Issue: Session expires

**Symptoms**: Get logged out unexpectedly

**Solutions**:

1. Log in again:

   - Session should persist
   - Clearing cache may log you out

2. Don't clear cookies:

   - Firebase uses browser storage
   - Clearing storage logs you out

3. Check browser settings:
   - Ensure third-party cookies allowed
   - Check cookie settings

---

## Performance & Speed

### Issue: Page loads slowly

**Symptoms**: Takes > 5 seconds to load

**Solutions**:

1. Check internet speed:

   - Slow internet causes delays
   - Test with speedtest.net

2. Clear browser cache:

   ```
   Ctrl+Shift+Delete → Clear browsing data
   ```

3. Disable browser extensions:

   - Ad blockers can slow pages
   - Try incognito mode

4. Check if Firebase is responding:
   - Visit https://status.firebase.google.com/
   - Check for outages

---

### Issue: Movements lag

**Symptoms**: Player moves but with delay

**Solutions**:

1. Check internet connection:

   - Ping test
   - Should be < 100ms

2. Reduce grid size:

   - Smaller grid = faster
   - Edit `GameCanvas.tsx`

3. Close unnecessary tabs:

   - Frees up memory
   - Improves responsiveness

4. Clear database:
   - Too many objects slow game
   - Remove old game data

---

## Styling & UI Issues

### Issue: Icons not showing

**Symptoms**: Icons appear blank or as boxes

**Solutions**:

1. Check FontAwesome import:

   ```typescript
   // main.tsx should have:
   import "@fortawesome/fontawesome-free/css/all.min.css";
   ```

2. Clear cache and rebuild:

   ```bash
   npm run build
   npm run preview
   ```

3. Verify fonts loaded:
   - DevTools → Network
   - Look for font files
   - Check for 404 errors

---

### Issue: Colors not showing correctly

**Symptoms**: UI appears monochrome or wrong colors

**Solutions**:

1. Check CSS files:

   - Verify all .css files in styles/ folder
   - Check for missing imports

2. Clear browser cache:

   - Hard refresh: Ctrl+Shift+R
   - Clear all cache

3. Rebuild CSS:
   ```bash
   npm run build
   ```

---

### Issue: UI looks broken on mobile

**Symptoms**: Layout messed up on small screens

**Solutions**:

1. Currently desktop-only:

   - Mobile support not yet implemented
   - Planned for v1.1.0

2. For testing:

   - Use mobile browser in desktop mode
   - DevTools → Toggle device mode

3. Workaround:
   - Use full zoom
   - Rotate device
   - Use landscape mode

---

## Development Issues

### Issue: TypeScript errors on save

**Symptoms**: Red squiggles in editor

**Solutions**:

1. Check TypeScript version:

   ```bash
   npm run type-check
   ```

2. Fix errors:

   - Read error message
   - Check file mentioned
   - Fix syntax

3. Reload editor:
   - Close and reopen VS Code
   - TypeScript should re-scan

---

### Issue: Hot Module Replacement (HMR) not working

**Symptoms**: Changes don't reload automatically

**Solutions**:

1. Restart dev server:

   ```bash
   npm run dev
   ```

2. Check firewall:

   - HMR uses WebSocket
   - Firewall may block it

3. Manual refresh:
   - Press F5 to refresh manually
   - Changes should appear

---

### Issue: Build fails

**Symptoms**: `npm run build` shows errors

**Solutions**:

1. Check TypeScript errors:

   ```bash
   npm run type-check
   ```

2. Fix errors:

   - Read error messages
   - Most are syntax errors

3. Clear dist folder:

   ```bash
   rm -r dist
   npm run build
   ```

4. Check dependencies:
   ```bash
   npm ci
   npm run build
   ```

---

## Database Issues

### Issue: Game data not saving

**Symptoms**: Progress lost after refresh

**Solutions**:

1. Check database rules:

   - Firebase Console
   - Verify rules allow writes
   - Test rules in simulator

2. Check user authentication:

   - Must be logged in
   - User UID must match

3. Verify database exists:
   - Firebase Console
   - Realtime Database
   - Should show green status

---

### Issue: Too much data being written

**Symptoms**: Firebase usage very high, high costs

**Solutions**:

1. Reduce update frequency:

   - Don't update every frame
   - Throttle updates to 10/sec max

2. Clean up old games:

   - Archive games older than 30 days
   - Delete test data

3. Optimize database writes:
   - Only update changed fields
   - Batch updates when possible

---

### Issue: Database quota exceeded

**Symptoms**: "Quota exceeded" errors

**Solutions**:

1. Upgrade Firebase plan:

   - Firebase Console
   - Upgrade to pay-as-you-go
   - Or use Spark plan limit

2. Reduce game objects:

   - Limit to < 100 per game
   - Clean up old data

3. Optimize queries:
   - Use indexes
   - Reduce read/write operations

---

## Browser-Specific Issues

### Chrome

```
Issue: Cache problems
Solution: Ctrl+Shift+Delete → Clear cache
          Hard refresh: Ctrl+Shift+R
```

### Firefox

```
Issue: CORS errors
Solution: Check console for actual error
          Reload page
          Clear cache: Ctrl+Shift+Delete
```

### Safari

```
Issue: LocalStorage disabled
Solution: Settings → Privacy → Allow cookies
          Check "Block all cookies" is OFF
```

### Edge

```
Issue: WebSocket connection fails
Solution: Check antivirus/firewall
          Try incognito mode
          Disable extensions
```

---

## Advanced Debugging

### Enable verbose logging

```typescript
// In authService.ts or gameService.ts
console.log("Debug:", variableName);
```

### Check Firebase Realtime Database

1. Firebase Console
2. Realtime Database
3. Browse data in real-time
4. Check structure matches expectations

### Monitor network requests

1. DevTools → Network tab
2. Look for failed requests
3. Check response status codes
4. Check response body for errors

### Inspect state

```typescript
// Check Zustand store
const store = useAuthStore.getState();
console.log("Auth store:", store);

const gameStore = useGameStore.getState();
console.log("Game store:", gameStore);
```

---

## When All Else Fails

### Nuclear Option (Start Fresh)

```bash
# 1. Back up your code (save any changes)
# 2. Clear everything
rm -r node_modules dist .cache

# 3. Reinstall
npm ci

# 4. Rebuild
npm run build

# 5. Test
npm run dev
```

### Contact Support

If still stuck:

1. Check Firebase Status: https://status.firebase.google.com/
2. Check GitHub Issues
3. Review Firebase Documentation: https://firebase.google.com/docs
4. Check React Documentation: https://react.dev
5. Ask in Firebase Support

---

## Prevention Tips

1. **Regular backups**: Save your Firebase data
2. **Version control**: Use Git for code changes
3. **Test changes**: Test locally before deploying
4. **Monitor usage**: Check Firebase console weekly
5. **Keep updated**: Update dependencies monthly
6. **Clean up**: Delete old games and test data
7. **Document changes**: Keep CHANGELOG updated

---

## Useful Commands

```bash
# Reset everything
npm cache clean --force
rm -r node_modules dist
npm install

# Quick rebuild
npm run build

# Check for issues
npm run lint
npm run type-check

# View build size
npm run build -- --analyze

# Development
npm run dev

# Production
npm run preview
```

---

## Further Help

- **TypeScript Errors**: https://www.typescriptlang.org/docs/
- **React Issues**: https://react.dev/reference/react/useEffect
- **Firebase Docs**: https://firebase.google.com/docs
- **Vite Troubleshooting**: https://vitejs.dev/guide/troubleshooting.html
- **Console Errors**: Google the error message!

---

**Last Updated**: December 27, 2025

Remember: Most issues are solved by:

1. Clearing cache & storage
2. Restarting dev server
3. Reloading page
4. Checking Firebase Console

🍀 Good luck! 🍀
