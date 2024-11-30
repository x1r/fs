from typing import List

from fastapi import FastAPI, Depends, status, HTTPException, APIRouter
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import engine, Base, get_db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .auth import create_access_token, get_current_user, get_password_hash, verify_password
from fastapi.middleware.cors import CORSMiddleware

from .schemas import ClientOrdersPayments, WarehouseEquipment, EmployeeTasks
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()

api_router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Укажите фронтенд-URL
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)


Base.metadata.create_all(bind=engine)

def role_required(allowed_roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        print(current_user.role)
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have the required permissions."
            )
        return current_user
    return role_checker


def setup_crud_routes(app, name, model, schema, schema_create, allowed_roles=None):
    allowed_roles = allowed_roles or ["manager", "admin", "technician", "warehouse_staff"]

    @app.post(f"/{name}/", response_model=schema)
    def create_item(
        item: schema_create,
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required(allowed_roles))
    ):
        return crud.create_entity(db=db, model=model, schema=item)

    @app.get(f"/{name}/", response_model=list[schema])
    def read_items(
        skip: int = 0,
        limit: int = 10,
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required(allowed_roles))
    ):
        return crud.get_entities(db=db, model=model, skip=skip, limit=limit)

    @app.get(f"/{name}/{{item_id}}", response_model=schema)
    def read_item(
        item_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required(allowed_roles))
    ):
        entity = crud.get_entity(db=db, model=model, entity_id=item_id)
        if not entity:
            raise HTTPException(status_code=404, detail=f"{name.capitalize()} not found")
        return entity

    @app.put(f"/{name}/{{item_id}}", response_model=schema)
    def update_item(
        item_id: int,
        item: schema_create,
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required(allowed_roles))
    ):
        updated = crud.update_entity(db=db, model=model, entity_id=item_id, schema=item)
        if not updated:
            raise HTTPException(status_code=404, detail=f"{name.capitalize()} not found")
        return updated

    @app.delete(f"/{name}/{{item_id}}")
    def delete_item(
        item_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required(allowed_roles))
    ):
        deleted = crud.delete_entity(db=db, model=model, entity_id=item_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"{name.capitalize()} not found")
        return {"message": f"{name.capitalize()} deleted successfully"}


setup_crud_routes(app, "clients", models.Client, schemas.ClientRead, schemas.ClientCreate, ["manager", "admin"])
setup_crud_routes(app, "orders", models.Order, schemas.OrderRead, schemas.OrderCreate, ["manager", "admin", "technician"])
setup_crud_routes(app, "employees", models.Employee, schemas.EmployeeRead, schemas.EmployeeCreate, ["manager", "admin"])
setup_crud_routes(app, "equipment", models.Equipment, schemas.EquipmentRead, schemas.EquipmentCreate, ["technician", "warehouse_staff", "manager", "admin"])
setup_crud_routes(app, "tasks", models.Task, schemas.TaskRead, schemas.TaskCreate, ["technician", "manager", "admin"])
setup_crud_routes(app, "warehouses", models.Warehouse, schemas.WarehouseRead, schemas.WarehouseCreate, ["warehouse_staff", "manager", "admin"])
setup_crud_routes(app, "payments", models.Payment, schemas.PaymentRead, schemas.PaymentCreate, ["manager", "admin"])
setup_crud_routes(app, "users", models.User, schemas.UserRead, schemas.UserCreate, ["manager", "admin"])
setup_crud_routes(app, "audit_log", models.AuditLog, schemas.AuditLogRead, schemas.AuditLogCreate, ["manager", "admin"])


@app.get("/client-orders-payments", response_model=List[ClientOrdersPayments])
def get_client_orders_payments(db: Session = Depends(get_db)):
    result = db.execute("""
        SELECT full_name, creation_date, status, equipment_type, amount, payment_date
        FROM public.client_orders_payments
    """).fetchall()
    return [dict(row) for row in result]

@app.get("/employee-tasks", response_model=List[EmployeeTasks])
def get_employee_tasks(db: Session = Depends(get_db)):
    result = db.execute("""
        SELECT full_name, description, due_date, creation_date, client_name
        FROM public.employee_tasks
    """).fetchall()
    return [dict(row) for row in result]

@app.get("/warehouse-equipment", response_model=List[WarehouseEquipment])
def get_warehouse_equipment(db: Session = Depends(get_db)):
    result = db.execute("""
        SELECT location, equipment_type, status, equipment_count
        FROM public.warehouse_equipment
    """).fetchall()
    return [dict(row) for row in result]



# Регистрация пользователя
@app.post("/register", response_model=schemas.UserRead)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print(user)
    existing_user = crud.get_user_by_username(db, username=user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user=user)


@app.get("/register")
def register_page(db: Session = Depends(get_db)):
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
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "full_name": user.full_name,
        "username": user.username,
        "is_active": user.is_active,
        "role": user.role
    }
@app.get("/")
def read_root():
    return {"message": "Welcome to API"}
