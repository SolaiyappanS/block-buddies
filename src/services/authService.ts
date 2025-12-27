import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { auth, database } from "../config/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string;
  createdAt: number;
  lastLevel: number;
}

export class AuthService {
  // Sign up with email and password
  static async signup(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store user profile in database
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: Date.now(),
      lastLevel: 1,
    };

    await set(ref(database, `users/${user.uid}`), userProfile);
    return user;
  }

  // Sign in with email and password
  static async signin(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  }

  // Sign out
  static async signout(): Promise<void> {
    await signOut(auth);
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  }

  // Update user last level
  static async updateLastLevel(uid: string, level: number): Promise<void> {
    await update(ref(database, `users/${uid}`), { lastLevel: level });
  }
}
