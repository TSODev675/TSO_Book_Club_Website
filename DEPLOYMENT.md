# TSO Book Club production operations

Production URL: <https://tso.bookclub.csir.co.za>

## Architecture

Host Nginx terminates Let's Encrypt TLS and proxies to `127.0.0.1:8080`. The
frontend container serves the React/Vite static build and proxies API, admin,
health, static, and media paths to Django. Django runs under Gunicorn. PostgreSQL
17 stores application data in a named volume. Static, media, and database data
survive container replacement. The database and backend publish no host ports.

There is no Celery or Redis. The application currently defines no uploaded file
fields, but a persistent media volume is provisioned for future uploads.

## Environment

Create `/opt/tso-bookclub/.env` from `.env.example`, use unique generated values,
and set mode `600`. Never commit it. Required values include Django secret/host/
origin settings, `DATABASE_URL`, matching PostgreSQL credentials, frontend URL,
and Gmail SMTP credentials.

## Routine deployment

`sudo -u deploy /opt/tso-bookclub/scripts/deploy.sh` (or the configured Ubuntu
deployment account) fetches `main`, builds images, applies migrations, collects
static files, replaces containers without deleting volumes, and checks health.

GitHub's `production` environment requires `PRODUCTION_HOST`, `PRODUCTION_USER`,
`PRODUCTION_PORT`, and `PRODUCTION_SSH_KEY`. Configure environment reviewers if
manual production approval is desired. The workflow prevents concurrent deploys.

## Backup and restore

Run `scripts/backup.sh` from cron. It writes mode-restricted PostgreSQL custom
format backups under `/opt/tso-bookclub/backups` and retains 14 days. Copy backups
off-host for disaster recovery. Test restoration periodically on a separate DB.

To restore during an approved maintenance window, stop backend/frontend traffic,
take a fresh backup, then run `scripts/restore.sh /absolute/path/db.dump` and
restart the services. Restore replaces database objects and must never be run as
part of routine deployment.

## Rollback

Find the last known-good commit, check it out on `main` (normally via a revert),
then rerun `scripts/deploy.sh`. If a migration is not backward compatible, restore
the pre-deploy database backup before starting the old application. Never use
`docker compose down -v`.

## Health and diagnostics

Use `curl -fsS https://tso.bookclub.csir.co.za/health/`, `docker compose ps`, and
`docker compose logs --tail=200`. Confirm HTTP redirects to HTTPS and test login,
registration email, static assets, API authorization, and database persistence
after each release. Let's Encrypt renewal is managed by Certbot's system timer;
verify with `sudo certbot renew --dry-run`.
