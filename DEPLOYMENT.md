# Self-Hosted Deployment Guide

This guide explains how to deploy Addicting Word Games on your own infrastructure, migrated from Google Cloud Platform.

## Quick Start

```bash
# 1. Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# 2. Start services
./start.sh

# or manually:
docker build -t wordgames:latest .
docker-compose up -d
```

The app will be available at `http://localhost:8080`

## Architecture

- **App**: Python 3.11 + gunicorn running the webapp2 application
- **Web Server**: nginx for static files and reverse proxy
- **Database**: SQLite (in `/data/wordgames.db` volume)
- **Static Assets**: Can be served from R2/S3 (configure in `.env`)

## Migration from Google Cloud

### 1. Migrate Data from Google Cloud Datastore to SQLite

```bash
source .venv/bin/activate
python migrate_ndb_to_sqlite.py YOUR_GCP_PROJECT_ID --db wordgames.db
```

### 2. Migrate Static Files from GCS to R2/S3

```bash
# For SWF games
python migrate_swf_to_s3.py games.addictingwordgames.com your-r2-bucket

# For all static assets
python sync_gcs_to_r2.py
```

### 3. Update URLs to R2

```bash
python update_urls_to_r2.py
```

## Configuration

### Environment Variables

See `.env.example` for all configuration options:

- `LOCAL_DEBUG`: Set to `false` for production
- `WORDGAMES_DB`: Path to SQLite database
- `STRIPE_*`: Stripe API keys
- `AWS_*` / `S3_BUCKET`: R2/S3 configuration

### Docker Compose

Services defined in `docker-compose.yml`:
- **app**: Python application on port 8891
- **nginx**: Web server on port 8080

Volumes:
- `wordgames_data`: Persistent SQLite database

## Production Deployment

### With Nginx Reverse Proxy

Update `nginx.conf` for your domain:

```nginx
server_name addictingwordgames.com www.addictingwordgames.com;
```

Add SSL with Let's Encrypt:

```bash
docker-compose down
# Add certbot configuration
docker-compose up -d
```

### Systemd Service (optional)

Create `/etc/systemd/system/wordgames.service`:

```ini
[Unit]
Description=Addicting Word Games
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/addictingwordgames
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable wordgames
sudo systemctl start wordgames
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Check status
docker-compose ps

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Access SQLite database
docker-compose exec app sqlite3 /data/wordgames.db
```

## Troubleshooting

### App won't start

Check logs:
```bash
docker-compose logs app
```

Common issues:
- Missing `.env` file: Copy from `.env.example`
- Database permissions: Check `/data` volume permissions
- Missing sellerinfo.py: Should have Stripe keys from env

### Static files not loading

- Check nginx logs: `docker-compose logs nginx`
- Verify static files exist in `./static/`
- Check `GCLOUD_STATIC_BUCKET_URL` in code

### Database issues

Backup database:
```bash
docker-compose exec app cp /data/wordgames.db /app/backup.db
docker cp wordgames_app:/app/backup.db ./wordgames-backup.db
```

## Monitoring

Add monitoring with:
- Docker healthchecks
- Prometheus/Grafana for metrics
- Log aggregation (ELK stack)

## Backups

Automated backup script:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T app sqlite3 /data/wordgames.db ".backup /data/backup-$DATE.db"
docker cp wordgames_app:/data/backup-$DATE.db ./backups/
```

## Differences from Google App Engine

- No automatic scaling (use Docker Swarm/Kubernetes if needed)
- No built-in memcache (add Redis if needed)
- Static file serving via nginx instead of GCS
- Manual SSL certificate management
- SQLite instead of Datastore (consider PostgreSQL for high traffic)
