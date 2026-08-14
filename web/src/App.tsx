import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchTasks,
  setTaskDone,
  type Task,
} from "./api";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const remaining = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = title.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    try {
      const created = await createTask(value);
      setTasks((prev) => [created, ...prev]);
      setTitle("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle(task: Task) {
    setError(null);
    try {
      const updated = await setTaskDone(task.id, !task.done);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDelete(task: Task) {
    setError(null);
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>LANDENI</h1>
        <p className="app__subtitle">A tiny full-stack task board</p>
      </header>

      <form className="composer" onSubmit={handleAdd}>
        <input
          className="composer__input"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="New task title"
        />
        <button className="composer__button" type="submit" disabled={busy || !title.trim()}>
          Add task
        </button>
      </form>

      {error && <p className="banner banner--error">{error}</p>}

      {loading ? (
        <p className="muted">Loading tasks…</p>
      ) : (
        <>
          <div className="meta">
            <span>
              {tasks.length} task{tasks.length === 1 ? "" : "s"}
            </span>
            <span>{remaining} remaining</span>
          </div>
          <ul className="list">
            {tasks.map((task) => (
              <li key={task.id} className={`item${task.done ? " item--done" : ""}`}>
                <label className="item__main">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggle(task)}
                  />
                  <span className="item__title">{task.title}</span>
                </label>
                <button
                  className="item__delete"
                  onClick={() => handleDelete(task)}
                  aria-label={`Delete ${task.title}`}
                >
                  ✕
                </button>
              </li>
            ))}
            {tasks.length === 0 && <li className="muted">No tasks yet. Add one above.</li>}
          </ul>
        </>
      )}
    </main>
  );
}
