import { useEffect } from "react";
import { useAuthStore, useGameStore } from "./store/store";
import { AuthService } from "./services/authService";
import { AuthPage } from "./components/AuthPage";
import { MainMenu } from "./components/MainMenu";
import { GameRoom } from "./components/GameRoom";
import "./App.css";

function App() {
  const user = useAuthStore((state) => state.user);
  const userLoading = useAuthStore((state) => state.userLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setUserLoading = useAuthStore((state) => state.setUserLoading);

  const gameId = useGameStore((state) => state.gameId);
  const setGameId = useGameStore((state) => state.setGameId);
  const reset = useGameStore((state) => state.reset);

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserLoading]);

  if (userLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Block Buddies</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (gameId) {
    return (
      <GameRoom
        gameId={gameId}
        onLeave={() => {
          reset();
          setGameId(null);
        }}
      />
    );
  }

  return (
    <MainMenu
      onCreateGame={(id) => setGameId(id)}
      onJoinGame={(id) => setGameId(id)}
    />
  );
}

export default App;
