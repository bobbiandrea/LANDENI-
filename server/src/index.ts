import cors from "cors";
import express, { type Request, type Response } from "express";
import { randomUUID } from "node:crypto";

interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? "0.0.0.0";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data store. Seeded so a fresh boot has something to show.
const tasks: Task[] = [
  {
    id: randomUUID(),
    title: "Welcome to LANDENI — try adding a task",
    done: false,
    createdAt: new Date().toISOString(),
  },
];

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/tasks", (_req: Request, res: Response) => {
  res.json(tasks);
});

app.post("/api/tasks", (req: Request, res: Response) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const task: Task = {
    id: randomUUID(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: "task not found" });
    return;
  }
  if (typeof req.body?.done === "boolean") {
    task.done = req.body.done;
  }
  if (typeof req.body?.title === "string" && req.body.title.trim()) {
    task.title = req.body.title.trim();
  }
  res.json(task);
});

app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "task not found" });
    return;
  }
  const [removed] = tasks.splice(index, 1);
  res.json(removed);
});

app.listen(PORT, HOST, () => {
  console.log(`[landeni-api] listening on http://${HOST}:${PORT}`);
});
