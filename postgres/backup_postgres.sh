#!/usr/bin/env bash
# Automated PostgreSQL Daily Backup Script
BACKUP_DIR="/home/anmol/Containers/postgres/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/postgres_backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating compressed PostgreSQL backup at ${BACKUP_FILE}..."
docker exec postgres pg_dumpall -U postgres | gzip > "$BACKUP_FILE"

# Keep last 7 daily backups, delete older ones
find "$BACKUP_DIR" -type f -name "postgres_backup_*.sql.gz" -mtime +7 -delete

echo "PostgreSQL backup completed successfully: $(du -h "$BACKUP_FILE" | cut -f1)"
