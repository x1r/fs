import json

from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .auth import create_access_token, get_current_user, verify_password
from .database import engine, Base, get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()

api_router = APIRouter()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:80/"], allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"], )

Base.metadata.create_all(bind=engine)


def setup_crud_routes(api, name, model, schema, schema_create):
    @api.post(f"/{name}/", response_model=schema)
    def create_item(item: schema_create, db: Session = Depends(get_db), ):
        return crud.create_entity(db=db, model=model, schema=item)

    @api.get(f"/{name}/", response_model=list[schema])
    def read_items(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), ):
        return crud.get_entities(db=db, model=model, skip=skip, limit=limit)

    @api.get(f"/{name}/{{item_id}}", response_model=schema)
    def read_item(item_id: int, db: Session = Depends(get_db), ):
        entity = crud.get_entity(db=db, model=model, entity_id=item_id)
        if not entity:
            raise HTTPException(status_code=404, detail=f"{name.capitalize()} not found")
        return entity

    @api.patch(f"/{name}/{{item_id}}", response_model=schema)
    def update_item_partial(item_id: int, item: schema_create, db: Session = Depends(get_db), ):
        updated = crud.update_entity_partial(db=db, model=model, entity_id=item_id, schema=item)
        if not updated:
            raise HTTPException(status_code=404, detail=f"{name.capitalize()} not found")
        return updated

    @api.delete(f"/{name}/{{item_id}}")
    def delete_item(item_id: int, db: Session = Depends(get_db), ):
        deleted = crud.delete_entity(db=db, model=model, entity_id=item_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"{name.capitalize()} not found")
        return {"message": f"{name.capitalize()} deleted successfully"}

    @api.get(f"/count/{name}/", response_model=int)
    def get_count(db: Session = Depends(get_db)):
        return crud.get_count(db=db, model=model)


setup_crud_routes(app, "students", models.Student, schemas.StudentRead, schemas.StudentCreate)
setup_crud_routes(app, "users", models.User, schemas.UserRead, schemas.UserCreate)
# setup_crud_routes(app, "audit_log", models.AuditLog, schemas.AuditLogRead, schemas.AuditLogCreate)


@app.get("/audit-logs/")
def get_audit_logs(db: Session = Depends(get_db)):
    audit_logs = db.query(models.AuditLog).all()
    return [
        {"operation": log.operation, "table_name": log.table_name,
         "changed_data": json.dumps(log.changed_data, indent=2) if log.changed_data else None,
         "changed_by": log.changed_by,
         "timestamp": log.timestamp.isoformat() if log.timestamp else None, }
        for log in audit_logs]


# Регистрация пользователя
@app.post("/register", response_model=schemas.UserRead)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print(user)
    existing_user = crud.get_user_by_username(db, username=user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user=user)


@app.get("/register")
def register_page():
    return {"message": "Register"}


# Получение токена
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(form_data)
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    print(f"user:{user.username}\nrole:{user.role}")
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token}


# Защищённый эндпоинт
@app.get("/me/", response_model=schemas.UserRead)
def read_users_me(current_user: schemas.UserRead = Depends(get_current_user)):
    return current_user


@app.get("/get_user_by_username")
def get_user_by_username(username: str = Query(...), db: Session = Depends(get_db)):
    print(username)
    user = crud.get_user_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "full_name": user.full_name, "username": user.username, "is_active": user.is_active,
            "role": user.role}


@app.get("/")
def read_root():
    return {"message": "Welcome to API"}
