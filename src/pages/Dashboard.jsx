import { useMemo, useState } from "react";
import "./Dashboard.css";

/* ---------- Mock data (replace with API calls, e.g. GET /api/dashboard) ---------- */
const PROJECTS = [
  { id: 1, name: "Website Redesign", lead: "Priya Nair", status: "On track", progress: 72, due: "2026-11-28", tasks: 34, done: 24 },
  { id: 2, name: "Mobile App v2", lead: "Arjun Mehta", status: "At risk", progress: 41, due: "2026-11-15", tasks: 58, done: 24 },
  { id: 3, name: "Data Migration", lead: "Sana Qureshi", status: "On track", progress: 88, due: "2026-11-10", tasks: 21, done: 18 },
  { id: 4, name: "Client Portal", lead: "Rohan Desai", status: "Delayed", progress: 29, due: "2026-11-06", tasks: 40, done: 12 },
  { id: 5, name: "Internal Wiki", lead: "Priya Nair", status: "Completed", progress: 100, due: "2026-10-30", tasks: 16, done: 16 },
];

const TASKS = [
  { id: 101, title: "Finalize homepage wireframes", project: "Website Redesign", due: "2026-11-05", priority: "High", status: "In progress" },
  { id: 102, title: "Fix login token refresh bug", project: "Mobile App v2", due: "2026-11-04", priority: "High", status: "To do" },
  { id: 103, title: "Validate customer table import", project: "Data Migration", due: "2026-11-07", priority: "Medium", status: "In progress" },
  { id: 104, title: "Write API docs for invoices", project: "Client Portal", due: "2026-11-09", priority: "Low", status: "To do" },
  { id: 105, title: "Review accessibility audit", project: "Website Redesign", due: "2026-11-12", priority: "Medium", status: "To do" },
];

const ACTIVITY = [
  { id: 1, who: "Priya Nair", what: "completed", target: "Header component", when: "12 min ago" },
  { id: 2, who: "Arjun Mehta", what: "commented on", target: "Fix login token refresh bug", when: "1 hr ago" },
  { id: 3, who: "Sana Qureshi", what: "moved", target: "Validate customer table import to In progress", when: "3 hr ago" },
  { id: 4, who: "Rohan Desai", what: "created task", target: "Write API docs for invoices", when: "Yesterday" },
  { id: 5, who: "Admin", what: "added", target: "Meera Joshi to Client Portal", when: "Yesterday" },
];

const WORKLOAD = [
  { name: "Priya", open: 9 },
  { name: "Arjun", open: 14 },
  { name: "Sana", open: 6 },
  { name: "Rohan", open: 11 },
  { name: "Meera", open: 4 },
];

const ROLES = ["Admin", "Project Lead", "Team Member"];

const NAV = [
  { key: "dashboard", label: "Dashboard", roles: ROLES },
  { key: "projects", label: "Projects", roles: ROLES },
  { key: "tasks", label: "My tasks", roles: ROLES },
  { key: "reports", label: "Reports & analytics", roles: ["Admin", "Project Lead"] },
  { key: "users", label: "User management", roles: ["Admin"] },
  { key: "settings", label: "Settings", roles: ROLES },
];

const TODAY = new Date("2026-11-04");

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const daysLeft = (iso) => Math.ceil((new Date(iso) - TODAY) / 86400000);

const statusClass = (s) => "tag tag--" + s.toLowerCase().replace(/\s+/g, "-");

/* ---------- Small components ---------- */
function Stat({ label, value, note, tone }) {
  return (
    <div className={`stat ${tone ? "stat--" + tone : ""}`}>
      <p className="stat__value">{value}</p>
      <p className="stat__label">{label}</p>
      {note && <p className="stat__note">{note}</p>}
    </div>
  );
}

function ProgressBar({ value, status }) {
  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className={`bar__fill bar__fill--${status.toLowerCase().replace(/\s+/g, "-")}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Sidebar({ user, active, onNavigate, onLogout }) {
  const role = user.role;
  const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">C</span>
        <span className="brand__name">Connect Projects</span>
      </div>
      <nav aria-label="Main">
        <ul className="nav">
          {NAV.filter((n) => n.roles.includes(role)).map((n) => (
            <li key={n.key}>
              <button
                className={`nav__item ${active === n.key ? "is-active" : ""}`}
                aria-current={active === n.key ? "page" : undefined}
                onClick={() => onNavigate(n.key)}
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar__foot">
        <div className="avatar" aria-hidden="true">{initials}</div>
        <div className="sidebar__who">
          <p className="sidebar__user">{user.name}</p>
          <p className="sidebar__role">{role}</p>
        </div>
        <button className="sidebar__logout" onClick={onLogout}>Log out</button>
      </div>
    </aside>
  );
}

/* ---------- Page ---------- */
export default function Dashboard({ user, onLogout }) {
  const role = user.role;
  const [active, setActive] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const visibleProjects = useMemo(() => {
    let list = PROJECTS;
    if (role === "Team Member") list = list.filter((p) => [1, 2].includes(p.id));
    if (role === "Project Lead") list = list.filter((p) => ["Priya Nair", "Arjun Mehta"].includes(p.lead));
    if (filter !== "All") list = list.filter((p) => p.status === filter);
    if (query.trim()) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [role, filter, query]);

  const totals = useMemo(() => {
    const base = PROJECTS;
    return {
      projects: base.length,
      active: base.filter((p) => p.status !== "Completed").length,
      tasksOpen: base.reduce((a, p) => a + (p.tasks - p.done), 0),
      overdue: base.filter((p) => daysLeft(p.due) < 0 && p.status !== "Completed").length,
    };
  }, []);

  const maxLoad = Math.max(...WORKLOAD.map((w) => w.open));
  const atRisk = PROJECTS.filter((p) => p.status === "At risk" || p.status === "Delayed");

  return (
    <div className="shell">
      <Sidebar user={user} active={active} onNavigate={setActive} onLogout={onLogout} />

      <div className="main">
        <header className="topbar">
          <div>
            <h1 className="topbar__title">Dashboard</h1>
            <p className="topbar__sub">Wednesday, 4 November 2026</p>
          </div>
          <div className="topbar__tools">
            <label className="search">
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                placeholder="Search projects"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button className="btn btn--primary">New project</button>
          </div>
        </header>

        <main className="content">
          {/* Attention strip: the one memorable element */}
          {atRisk.length > 0 && role !== "Team Member" && (
            <section className="attention" aria-label="Projects needing attention">
              <h2 className="attention__title">
                {atRisk.length} projects need attention
              </h2>
              <ul className="attention__list">
                {atRisk.map((p) => (
                  <li key={p.id}>
                    <span className={statusClass(p.status)}>{p.status}</span>
                    <strong>{p.name}</strong>
                    <span className="muted">
                      {daysLeft(p.due) < 0
                        ? `${Math.abs(daysLeft(p.due))} days past due`
                        : `due in ${daysLeft(p.due)} days`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="stats" aria-label="Summary">
            <Stat label="Projects" value={totals.projects} note={`${totals.active} active`} />
            <Stat label="Open tasks" value={totals.tasksOpen} note="across all projects" />
            <Stat label="Due this week" value={TASKS.filter((t) => daysLeft(t.due) <= 7).length} note="assigned to you" />
            <Stat label="Overdue projects" value={totals.overdue} tone={totals.overdue ? "alert" : undefined} />
          </section>

          <div className="grid">
            {/* Projects */}
            <section className="panel panel--wide">
              <div className="panel__head">
                <h2>Projects</h2>
                <div className="chips" role="group" aria-label="Filter by status">
                  {["All", "On track", "At risk", "Delayed", "Completed"].map((s) => (
                    <button
                      key={s}
                      className={`chip ${filter === s ? "is-on" : ""}`}
                      aria-pressed={filter === s}
                      onClick={() => setFilter(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {visibleProjects.length === 0 ? (
                <p className="empty">No projects match this filter. Clear the filter or create a new project.</p>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Lead</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleProjects.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.name}</strong>
                            <span className="muted block">{p.done} of {p.tasks} tasks done</span>
                          </td>
                          <td>{p.lead}</td>
                          <td><span className={statusClass(p.status)}>{p.status}</span></td>
                          <td className="progress-cell">
                            <ProgressBar value={p.progress} status={p.status} />
                            <span className="pct">{p.progress}%</span>
                          </td>
                          <td>{fmtDate(p.due)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* My tasks */}
            <section className="panel">
              <div className="panel__head">
                <h2>My tasks</h2>
                <button className="link" onClick={() => setActive("tasks")}>View all tasks</button>
              </div>
              <ul className="tasks">
                {TASKS.map((t) => {
                  const d = daysLeft(t.due);
                  return (
                    <li key={t.id} className="task">
                      <input type="checkbox" id={`t${t.id}`} />
                      <label htmlFor={`t${t.id}`}>
                        <span className="task__title">{t.title}</span>
                        <span className="muted block">{t.project}</span>
                      </label>
                      <span className={`due ${d <= 0 ? "due--hot" : ""}`}>
                        {d < 0 ? "Overdue" : d === 0 ? "Today" : fmtDate(t.due)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Workload (Admin / Lead only) */}
            {role !== "Team Member" && (
              <section className="panel">
                <div className="panel__head">
                  <h2>Team workload</h2>
                  <span className="muted">Open tasks per person</span>
                </div>
                <ul className="load">
                  {WORKLOAD.map((w) => (
                    <li key={w.name}>
                      <span className="load__name">{w.name}</span>
                      <span className="load__track">
                        <span
                          className={`load__fill ${w.open >= 12 ? "is-heavy" : ""}`}
                          style={{ width: `${(w.open / maxLoad) * 100}%` }}
                        />
                      </span>
                      <span className="load__n">{w.open}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Activity */}
            <section className="panel">
              <div className="panel__head">
                <h2>Recent activity</h2>
              </div>
              <ul className="feed">
                {ACTIVITY.map((a) => (
                  <li key={a.id}>
                    <p>
                      <strong>{a.who}</strong> {a.what} <em>{a.target}</em>
                    </p>
                    <span className="muted">{a.when}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
