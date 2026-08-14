# LANDENI

A tiny full-stack starter used to bootstrap development in this repository.

- **`server/`** — Express + TypeScript JSON API (tasks CRUD), runs on port `3001`.
- **`web/`** — React + TypeScript client built with Vite, runs on port `5173` and proxies `/api` to the server.

The project uses [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces); a single install at the repo root sets up both packages.

## Prerequisites

- Node.js `>= 20` (this repo is developed with Node 22) and npm `>= 10`.

## Getting started

```bash
npm ci        # install all workspace dependencies
npm run dev   # start the API (:3001) and web client (:5173) together
```

Then open http://localhost:5173 and add a task. The web client calls the API through Vite's dev proxy.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Run API and web client together (hot reload). |
| `npm run dev:server` | Run only the API. |
| `npm run dev:web` | Run only the web client. |
| `npm run build` | Type-check and build both workspaces. |
| `npm run lint` | Lint the whole repo with ESLint. |
| `npm run typecheck` | Type-check both workspaces without emitting. |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health/uptime probe. |
| `GET` | `/api/tasks` | List tasks. |
| `POST` | `/api/tasks` | Create a task (`{ "title": "..." }`). |
| `PATCH` | `/api/tasks/:id` | Update a task's `done`/`title`. |
| `DELETE` | `/api/tasks/:id` | Delete a task. |

> Data is stored in memory and resets when the API restarts.

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm ci` and runs the API and web client as
persistent terminals, so a fresh Cloud Agent boots straight into a running dev stack.
