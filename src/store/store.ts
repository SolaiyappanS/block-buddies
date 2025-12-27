import { create } from "zustand";
import type { User } from "firebase/auth";
import type { GameState, Player } from "../services/gameService";

export interface AuthStore {
  user: User | null;
  userLoading: boolean;
  setUser: (user: User | null) => void;
  setUserLoading: (loading: boolean) => void;
}

export interface GameStore {
  gameId: string | null;
  gameState: GameState | null;
  currentPlayer: Player | null;
  setGameId: (id: string | null) => void;
  setGameState: (state: GameState | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  reset: () => void;
}

// Auth store
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userLoading: true,
  setUser: (user) => set({ user }),
  setUserLoading: (loading) => set({ userLoading: loading }),
}));

// Game store
export const useGameStore = create<GameStore>((set) => ({
  gameId: null,
  gameState: null,
  currentPlayer: null,
  setGameId: (id) => set({ gameId: id }),
  setGameState: (state) => set({ gameState: state }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  reset: () => set({ gameId: null, gameState: null, currentPlayer: null }),
}));
