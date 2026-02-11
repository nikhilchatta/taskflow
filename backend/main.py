from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db, Base

# Create all SQL tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TaskFlow API", version="1.0.0", description="Kanban board backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Projects ──────────────────────────────────────────────────────────────────

@app.get("/api/projects", response_model=List[schemas.Project])
def list_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()


@app.post("/api/projects", response_model=schemas.Project, status_code=201)
def create_project(payload: schemas.ProjectCreate, db: Session = Depends(get_db)):
    project = models.Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, payload: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@app.delete("/api/projects/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


# ── Tasks ─────────────────────────────────────────────────────────────────────

@app.get("/api/tasks", response_model=List[schemas.Task])
def list_tasks(project_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Task)
    if project_id:
        query = query.filter(models.Task.project_id == project_id)
    return query.all()


@app.post("/api/tasks", response_model=schemas.Task, status_code=201)
def create_task(payload: schemas.TaskCreate, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    task = models.Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.put("/api/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, payload: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()


# ── Seed ──────────────────────────────────────────────────────────────────────

@app.post("/api/seed")
def seed_data(db: Session = Depends(get_db)):
    if db.query(models.Project).count() > 0:
        return {"message": "Already seeded"}

    p1 = models.Project(name="Website Redesign",  description="Redesign the company website with modern UI",  color="#6366f1")
    p2 = models.Project(name="Mobile App",         description="Build a cross-platform mobile application",   color="#f59e0b")
    p3 = models.Project(name="API Development",    description="Develop RESTful microservices",                color="#10b981")
    db.add_all([p1, p2, p3])
    db.flush()  # get IDs before committing

    tasks = [
        models.Task(title="Create wireframes",       description="Design wireframes for all pages",          status="done",        priority="high",   project_id=p1.id),
        models.Task(title="Design UI mockups",        description="Create high-fidelity Figma mockups",       status="in_progress", priority="high",   project_id=p1.id),
        models.Task(title="Implement homepage",       description="Code the responsive homepage",             status="todo",        priority="medium", project_id=p1.id),
        models.Task(title="SEO optimisation",         description="Add meta tags and structured data",        status="todo",        priority="low",    project_id=p1.id),

        models.Task(title="Setup React Native",       description="Initialise the project with Expo",         status="done",        priority="high",   project_id=p2.id),
        models.Task(title="User authentication",      description="Implement login / signup flow",            status="in_progress", priority="high",   project_id=p2.id),
        models.Task(title="Push notifications",       description="Integrate Firebase Cloud Messaging",       status="todo",        priority="low",    project_id=p2.id),

        models.Task(title="Database schema",          description="Design normalised SQL schema",             status="done",        priority="high",   project_id=p3.id),
        models.Task(title="CRUD endpoints",           description="Implement all resource endpoints",         status="in_progress", priority="high",   project_id=p3.id),
        models.Task(title="API documentation",        description="Write OpenAPI / Swagger docs",             status="todo",        priority="medium", project_id=p3.id),
    ]
    db.add_all(tasks)
    db.commit()
    return {"message": "Seeded successfully"}
