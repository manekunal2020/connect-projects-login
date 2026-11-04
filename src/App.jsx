import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { getStoredUser, logout } from "./auth/authService.js";
import "./pages/Dashboard.css"; // shared design tokens (colors, fonts)

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());

  function handleLogout() {
    logout();
    setUser(null);
  }

  if (!user) return <Login onSuccess={setUser} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
