from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, \
    JSON, text
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String(255), nullable=False)  # Фамилия
    first_name = Column(String(255), nullable=False)  # Имя
    middle_name = Column(String(255), nullable=True)  # Отчество
    course = Column(Integer, nullable=False)  # Курс
    group = Column(String(50), nullable=False)  # Группа
    faculty = Column(String(255), nullable=False)  # Факультет


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user", nullable=False)


class AuditLog(Base):
    __tablename__ = "audit_log"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    operation = Column(String(50), nullable=False)
    table_name = Column(String(255), nullable=False)
    changed_data = Column(JSON, nullable=True)
    changed_by = Column(String(50), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
