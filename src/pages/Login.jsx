import { useState } from "react";
import { login, demoAccounts } from "../auth/authService.js";
import "./Login.css";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(username, password);
      onSuccess(user);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function fillDemo(account) {
    setUsername(account.username);
    setPassword(account.password);
    setError("");
  }

  return (
    <div className="login">
      <section className="login__brand" aria-hidden="true">
        <div className="login__logo">
          <span className="login__mark">C</span>
          <span>Connect Projects</span>
        </div>
        <p className="login__pitch">Every project, task and deadline in one place.</p>
        <ul className="login__roles">
          <li><strong>Admin</strong> manages users and sees every project</li>
          <li><strong>Project Lead</strong> runs projects and reviews reports</li>
          <li><strong>Team Member</strong> tracks assigned tasks</li>
        </ul>
      </section>

      <main className="login__panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h1>Sign in</h1>
          <p className="login__lead">Use the username and password your admin gave you.</p>

          {error && (
            <p className="login__error" role="alert">{error}</p>
          )}

          <label className="field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!error}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="field__password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button type="submit" className="login__submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="demo">
            <p className="demo__title">Demo accounts</p>
            <ul>
              {demoAccounts.map((a) => (
                <li key={a.username}>
                  <button type="button" onClick={() => fillDemo(a)}>
                    <strong>{a.role}</strong>
                    <span>{a.username} / {a.password}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="demo__note">Remove this block when the real login API is connected.</p>
          </div>
        </form>
      </main>
    </div>
  );
}
