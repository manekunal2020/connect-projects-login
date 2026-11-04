# Connect Projects - Frontend (Login + Dashboard)

React + Vite frontend for the Connect Projects Platform.

## Run
    npm install
    npm run dev

Open http://localhost:5173

## Demo logins
| Role         | Username | Password  |
|--------------|----------|-----------|
| Admin        | admin    | admin123  |
| Project Lead | lead     | lead123   |
| Team Member  | member   | member123 |

## Structure
- src/App.jsx                 shows Login until a user is signed in, then the Dashboard
- src/auth/authService.js     login(), logout(), getStoredUser() (demo users for now)
- src/pages/Login.jsx / .css  login page
- src/pages/Dashboard.jsx / .css  dashboard (menu and panels change by role)

## Connecting the backend
- In src/auth/authService.js, replace the body of login() with a POST to /api/auth/login
  (instructions are in the file comment). Expected response: { token, name, role }.
- Dashboard data is mock data at the top of src/pages/Dashboard.jsx; replace it with API calls.
- Remove the "Demo accounts" block in Login.jsx before going live.
