from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash


# CRUD для универсальной сущности
def get_entity(db: Session, model, entity_id: int):
    return db.query(model).filter(model.id == entity_id).first()

def get_entities(db: Session, model, skip: int = 0, limit: int = 10):
    return db.query(model).offset(skip).limit(limit).all()

def create_entity(db: Session, model, schema):
    db_entity = model(**schema.dict())
    db.add(db_entity)
    db.commit()
    db.refresh(db_entity)
    return db_entity

def update_entity(db: Session, model, entity_id: int, schema):
    db_entity = db.query(model).filter(model.id == entity_id).first()
    if not db_entity:
        return None
    for key, value in schema.dict().items():
        setattr(db_entity, key, value)
    db.commit()
    db.refresh(db_entity)
    return db_entity

def delete_entity(db: Session, model, entity_id: int):
    db_entity = db.query(model).filter(model.id == entity_id).first()
    if db_entity:
        db.delete(db_entity)
        db.commit()
    return db_entity

# Пользователи
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        full_name=user.full_name,
        username=user.username,
        hashed_password=hashed_password,
        is_active=True,
        role="user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user