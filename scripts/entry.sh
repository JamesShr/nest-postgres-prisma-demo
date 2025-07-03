#!/bin/bash
set -e
bash /app/scripts/wait.sh $DATABASE_HOST:$DATABASE_PORT -t 5

export PGPASSWORD=$DATABASE_PASSWORD

initDB() {
  psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USERNAME -W -d postgres -c "CREATE DATABASE $DATABASE_DB;" &&
    psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USERNAME -W -d $DATABASE_DB -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" &&
    echo "Init database $DATABASE_DB successfully."
}

psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USERNAME -W -d postgres \
  -tc "SELECT 1 FROM pg_database WHERE datname = '$DATABASE_DB';" | grep -q 1 && echo "Database $DATABASE_DB already exists." || initDB


if [ "$NODE_ENV" = "production" ]; then
  npm run start:prod
else
  npm run start
fi