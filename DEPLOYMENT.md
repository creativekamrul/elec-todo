# Docker Deployment Guide for Elect Todo App

This guide will help you deploy the Elect Todo app on your local home server using Docker and Docker Compose.

## Prerequisites

1. **Docker and Docker Compose** installed on your home server
2. **Supabase project** set up and running
3. **Environment variables** configured

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard:
- Go to Settings → API
- Copy the Project URL and anon public key

### 2. Deploy the App

```bash
# Build and start the app
docker-compose up -d

# This will start:
# - Your Next.js app on port 8282
```

### 3. Configure Nginx Proxy Manager

In your Nginx Proxy Manager dashboard:

1. **Add a new Proxy Host**
   - **Domain Names**: your-domain.com or your-local-domain
   - **Scheme**: http
   - **Forward Hostname/IP**: your-server-ip (or localhost if same machine)
   - **Forward Port**: 8282
   - **Block Common Exploits**: ✅ enabled

2. **SSL Certificate** (if using HTTPS)
   - Go to the SSL tab
   - Request a new certificate or use existing
   - Enable Force SSL for secure connection

3. **Custom Headers** (optional but recommended)
   - Add `X-Forwarded-For` with value `$remote_addr`
   - Add `X-Forwarded-Proto` with value `$scheme`

### 4. Access Your App

- **Via Proxy Manager**: `http://your-domain.com` or `https://your-domain.com`
- **Direct**: `http://your-server-ip:8282` (bypassing proxy manager)

## Management Commands

### View Logs
```bash
# View app logs
docker-compose logs -f app
```

### Stop the App
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Update the App
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Advanced Configuration

### Custom Domain in Nginx Proxy Manager

1. In Nginx Proxy Manager, add a new Proxy Host with your custom domain
2. Add DNS A record pointing to your server IP
3. Configure SSL certificate through the Proxy Manager UI

### Custom App Port

To change the app port from 8282, modify `docker-compose.yml`:
```yaml
services:
  app:
    ports:
      - "YOUR_PORT:3000"  # Change YOUR_PORT to desired port
```

Then update your Nginx Proxy Manager proxy host to use the new forward port.

## Security Considerations

1. **Firewall**: Only open necessary ports (8282 for app, 80/443 for Proxy Manager)
2. **Updates**: Regularly update Docker images:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
3. **Backups**: Backup your Supabase database regularly
4. **Environment**: Keep `.env.local` secure and never commit to git

## Troubleshooting

### Common Issues

**App not accessible:**
```bash
# Check if containers are running
docker-compose ps

# Check app logs
docker-compose logs app
```

**Supabase connection errors:**
- Verify environment variables in `.env.local`
- Check Supabase project status
- Ensure correct URL and API keys

**Build failures:**
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose up -d --build
```

**Port conflicts:**
- Change port mappings in `docker-compose.yml`
- Check what's using the ports: `netstat -tulpn`

### Performance Monitoring

Monitor container resource usage:
```bash
# Real-time stats
docker stats

# Disk usage
docker system df
```

## File Structure

```
elect-todo/
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Service orchestration
├── .dockerignore          # Files to exclude from Docker build
├── .env.local             # Environment variables (create this)
└── DEPLOYMENT.md         # This deployment guide
```

## Support

For issues related to:
- **Docker**: Check Docker documentation
- **Supabase**: Check Supabase dashboard status
- **App**: Check application logs with `docker-compose logs app`

## Updates and Maintenance

### Regular Updates
```bash
# Update Docker images monthly
docker-compose pull
docker-compose up -d

# Check for app updates
git pull
docker-compose up -d --build
```

### Backup Strategy
- **Database**: Use Supabase backup features
- **Configuration**: Backup `.env.local` and `docker-compose.yml`
- **Nginx Proxy Manager**: Export proxy host configurations