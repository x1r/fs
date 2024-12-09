#!/usr/bin/env bash

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for $host:$port..."
  sleep 1
done

>&2 echo "$host:$port is available. Initializing the database..."

python -c "from app.database import init_db; init_db()"

>&2 echo "Database initialized. Starting the application..."
exec $cmd
