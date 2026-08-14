export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTasks(): Promise<Task[]> {
  return handle<Task[]>(await fetch("/api/tasks"));
}

export async function createTask(title: string): Promise<Task> {
  return handle<Task>(
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }),
  );
}

export async function setTaskDone(id: string, done: boolean): Promise<Task> {
  return handle<Task>(
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    }),
  );
}

export async function deleteTask(id: string): Promise<Task> {
  return handle<Task>(await fetch(`/api/tasks/${id}`, { method: "DELETE" }));
}
