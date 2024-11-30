#!/usr/bin/env bash
# wait-for-it.sh: Ожидает доступности указанного хоста и порта.

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

>&2 echo "$host:$port is available. Starting application..."
exec $cmd
