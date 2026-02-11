# TaskFlow — Kanban Board

A full-stack project management app with a **React** frontend and a **Python + SQLite** backend.

```
taskflow/
├── backend/          Python FastAPI + SQLAlchemy + SQLite
│   ├── main.py       All API routes
│   ├── models.py     SQLAlchemy ORM models (SQL)
│   ├── schemas.py    Pydantic request/response schemas
│   ├── database.py   DB engine & session setup
│   └── requirements.txt
└── frontend/         React + Vite
    ├── src/
    │   ├── App.jsx
    │   ├── api.js    All fetch calls to backend
    │   └── components/
    └── package.json
```

---

## Quick Start (run two terminals)

### Terminal 1 — Backend

```bash
cd taskflow/backend

# Create virtual environment (first time only)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

Server runs at **http://localhost:8000**
Interactive API docs: **http://localhost:8000/docs**

---

### Terminal 2 — Frontend

```bash
cd taskflow/frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

App runs at **http://localhost:5173**

---

## Features

| Feature | Details |
|---|---|
| Projects | Create, edit, delete projects with custom colours |
| Tasks | Full CRUD — title, description, status, priority |
| Kanban columns | To Do / In Progress / Done |
| Status change | Change task status inline from any card |
| Progress bar | Visual % complete per project |
| Demo data | Auto-seeded on first launch (3 projects, 10 tasks) |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /api/projects | List all projects |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/tasks?project_id= | List tasks for a project |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| POST | /api/seed | Seed demo data |

---

## Tech Stack

- **Frontend** — React 18, Vite 5, plain CSS (dark theme)
- **Backend** — Python 3.10+, FastAPI, Uvicorn
- **Database** — SQLite via SQLAlchemy ORM (file: `backend/taskflow.db`)
- **Schema validation** — Pydantic v2
