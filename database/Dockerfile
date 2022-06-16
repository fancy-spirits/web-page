FROM postgres
ENV POSTGRES_DB fancy_spirits
COPY "1 - init-users.sh" /docker-entrypoint-initdb.d/
COPY "2 - schema.sql" /docker-entrypoint-initdb.d/