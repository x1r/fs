from pydantic import BaseModel
import json
from datetime import datetime
from typing import Optional, Any, Dict

from pydantic import BaseModel


class StudentBase(BaseModel):
    last_name: str  # Фамилия
    first_name: str  # Имя
    middle_name: Optional[str] = None  # Отчество
    course: int  # Курс
    group: str  # Группа
    faculty: str  # Факультет


class StudentCreate(StudentBase):
    pass


class StudentRead(StudentBase):
    id: int  # Идентификатор студента

    model_config = {"from_attributes": True}


# Пользователи
class UserBase(BaseModel):
    full_name: str
    username: str
    is_active: bool
    role: str


class UserCreate(BaseModel):
    full_name: str
    username: str
    password: str


class UserRead(UserBase):
    id: int

    model_config = {"from_attributes": True}


class AuditLogBase(BaseModel):
    operation: str
    table_name: str
    changed_data: Optional[Dict[str, Any]] = None
    changed_by: str
    timestamp: Optional[datetime] = None

    def to_display_dict(self):
        return {
            "operation": self.operation,
            "table_name": self.table_name,
            "changed_data": json.dumps(self.changed_data, indent=2),  # Преобразуем в отформатированный JSON
            "changed_by": self.changed_by,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }


# Schema for creating a new audit log
class AuditLogCreate(AuditLogBase):
    pass


# Schema for reading an audit log
class AuditLogRead(AuditLogBase):
    log_id: int

    model_config = {"from_attributes": True}
