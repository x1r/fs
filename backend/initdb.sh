#!/bin/bash

# Initialize the database
python -c "from app.database import init_db; init_db()"

# Start the application
exec "$@"
