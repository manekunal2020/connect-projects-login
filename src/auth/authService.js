/*
 * Auth service.
 * Right now this checks against demo users so the UI works on its own.
 * To connect your Spring Boot backend, replace the body of login() with:
 *
 *   const res = await fetch("/api/auth/login", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ username, password }),
 *   });
 *   if (!res.ok) throw new Error("Incorrect username or password.");
 *   return res.json(); // expected: { token, name, role }
 */

const DEMO_USERS = [
  { username: "admin", password: "admin123", name: "Ananya Kulkarni", role: "Admin" },
  { username: "lead", password: "lead123", name: "Priya Nair", role: "Project Lead" },
  { username: "member", password: "member123", name: "Meera Joshi", role: "Team Member" },
];

const KEY = "cp_user";

export const demoAccounts = DEMO_USERS.map(({ username, password, role }) => ({ username, password, role }));

export async function login(username, password) {
  await new Promise((r) => setTimeout(r, 600)); // simulate network
  const match = DEMO_USERS.find(
    (u) => u.username === username.trim().toLowerCase() && u.password === password
  );
  if (!match) throw new Error("Incorrect username or password.");
  const user = { username: match.username, name: match.name, role: match.role };
  sessionStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem(KEY);
}
