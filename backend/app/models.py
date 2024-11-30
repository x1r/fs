from sqlalchemy import Column, ForeignKey, Integer, String, Text, Date, DECIMAL, create_engine, Boolean, TIMESTAMP, \
    JSON, text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


# Employee Model
class Employee(Base):
    __tablename__ = "employees"
    employee_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    position = Column(String(100))
    phone = Column(String(50))
    email = Column(String(255))

    clients = relationship("Client", back_populates="responsible_employee_relation")
    warehouses = relationship("Warehouse", back_populates="responsible_employee_relation")
    tasks = relationship("Task", back_populates="employee_relation")


# Client Model
class Client(Base):
    __tablename__ = "clients"
    client_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50))
    email = Column(String(255))
    address = Column(Text)
    responsible_employee = Column(Integer, ForeignKey("employees.employee_id"))

    responsible_employee_relation = relationship("Employee", back_populates="clients")
    orders = relationship("Order", back_populates="client_relation")


# Order Model
class Order(Base):
    __tablename__ = "orders"
    order_id = Column(Integer, primary_key=True, autoincrement=True)
    creation_date = Column(Date)
    status = Column(String(50))
    client_id = Column(Integer, ForeignKey("clients.client_id"))
    total_cost = Column(DECIMAL(10, 2))

    client_relation = relationship("Client", back_populates="orders")
    equipments = relationship("Equipment", back_populates="order_relation")
    tasks = relationship("Task", back_populates="order_relation")
    payments = relationship("Payment", back_populates="order_relation")


# Warehouse Model
class Warehouse(Base):
    __tablename__ = "warehouses"
    warehouse_id = Column(Integer, primary_key=True, autoincrement=True)
    location = Column(Text)
    responsible_employee = Column(Integer, ForeignKey("employees.employee_id"))

    responsible_employee_relation = relationship("Employee", back_populates="warehouses")
    equipments = relationship("Equipment", back_populates="warehouse_relation")


# Equipment Model
class Equipment(Base):
    __tablename__ = "equipments"
    equipment_id = Column(Integer, primary_key=True, autoincrement=True)
    equipment_type = Column(String(255))
    serial_number = Column(String(255))
    status = Column(String(50))
    order_id = Column(Integer, ForeignKey("orders.order_id"))
    warehouse_id = Column(Integer, ForeignKey("warehouses.warehouse_id"))

    order_relation = relationship("Order", back_populates="equipments")
    warehouse_relation = relationship("Warehouse", back_populates="equipments")


# Task Model
class Task(Base):
    __tablename__ = "tasks"
    task_id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(Text)
    due_date = Column(Date)
    order_id = Column(Integer, ForeignKey("orders.order_id"))
    employee_id = Column(Integer, ForeignKey("employees.employee_id"))

    order_relation = relationship("Order", back_populates="tasks")
    employee_relation = relationship("Employee", back_populates="tasks")


# Payment Model
class Payment(Base):
    __tablename__ = "payments"
    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    amount = Column(DECIMAL(10, 2))
    payment_date = Column(Date)
    order_id = Column(Integer, ForeignKey("orders.order_id"))

    order_relation = relationship("Order", back_populates="payments")


# Пользователи
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
