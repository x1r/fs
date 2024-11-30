from decimal import Decimal
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import date, datetime


# Employee Schema
class EmployeeBase(BaseModel):
    full_name: str
    position: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    employee_id: int

    model_config = {"from_attributes": True}


# Client Schema
class ClientBase(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class ClientCreate(ClientBase):
    responsible_employee: Optional[int] = None


class ClientRead(ClientBase):
    client_id: int
    responsible_employee: Optional[int]

    model_config = {"from_attributes": True}


# Order Schema
class OrderBase(BaseModel):
    creation_date: Optional[date] = None
    status: Optional[str] = None
    client_id: Optional[int] = None
    total_cost: Optional[Decimal] = None


class OrderCreate(OrderBase):
    pass


class OrderRead(OrderBase):
    order_id: int

    model_config = {"from_attributes": True}


# Warehouse Schema
class WarehouseBase(BaseModel):
    location: Optional[str] = None
    responsible_employee: Optional[int] = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseRead(WarehouseBase):
    warehouse_id: int

    model_config = {"from_attributes": True}


# Equipment Schema
class EquipmentBase(BaseModel):
    equipment_type: str
    serial_number: str
    status: Optional[str] = None
    order_id: Optional[int] = None
    warehouse_id: Optional[int] = None


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentRead(EquipmentBase):
    equipment_id: int

    model_config = {"from_attributes": True}


# Task Schema
class TaskBase(BaseModel):
    description: str
    due_date: Optional[date] = None
    order_id: Optional[int] = None
    employee_id: Optional[int] = None


class TaskCreate(TaskBase):
    pass


class TaskRead(TaskBase):
    task_id: int

    model_config = {"from_attributes": True}


# Payment Schema
class PaymentBase(BaseModel):
    amount: Decimal
    payment_date: Optional[date] = None
    order_id: Optional[int] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentRead(PaymentBase):
    payment_id: int

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

# Schema for creating a new audit log
class AuditLogCreate(AuditLogBase):
    pass

# Schema for reading an audit log
class AuditLogRead(AuditLogBase):
    log_id: int

    model_config = {"from_attributes": True}


class ClientOrdersPayments(BaseModel):
    full_name: str
    creation_date: Optional[date]
    status: Optional[str]
    equipment_type: Optional[str]
    amount: Optional[Decimal]
    payment_date: Optional[date]

    model_config = {"from_attributes": True}

class EmployeeTasks(BaseModel):
    full_name: str
    description: Optional[str]
    due_date: Optional[date]
    creation_date: Optional[date]
    client_name: Optional[str]

    model_config = {"from_attributes": True}

class WarehouseEquipment(BaseModel):
    location: str
    equipment_type: str
    status: str
    equipment_count: int

    model_config = {"from_attributes": True}