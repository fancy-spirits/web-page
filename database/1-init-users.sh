#!/bin/bash

PGPASSWORD=$POSTGRES_ADMIN_PASSWORD psql -v ON_ERROR_STOP=1 --username "$POSTGRES_ADMIN_USER" --dbname "$POSTGRES_DB" -c "CREATE USER \"$POSTGRES_FANCY_SPIRITS_USER\" WITH PASSWORD \"$POSTGRES_FANCY_SPIRITS_PASSWORD\";" 