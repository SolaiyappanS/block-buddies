import { useState } from "react";
import { Login, Signup } from "./Auth";
import "../styles/AuthPage.css";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>
          <i className="fas fa-cubes"></i> Block Buddies
        </h1>
        <p className="subtitle">A Multiplayer Puzzle Game</p>

        {isLogin ? (
          <>
            <Login onSuccess={() => {}} />
            <p className="toggle-text">
              Don't have an account?{" "}
              <button onClick={() => setIsLogin(false)}>Sign Up</button>
            </p>
          </>
        ) : (
          <>
            <Signup onSuccess={() => {}} />
            <p className="toggle-text">
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)}>Login</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
