# Используем базовый образ Python
FROM python:3.10-slim

# Устанавливаем зависимости системы
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-openbsd \
    libffi-dev && \
    apt-get clean


# Создаём рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем приложение и скрипт ожидания
COPY ./app ./app
COPY ./wait-for-it.sh ./wait-for-it.sh

# Команда запуска
CMD ["./wait-for-it.sh", "db", "5432", "--", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
