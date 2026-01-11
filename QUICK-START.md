# Quick Start with Docker Compose

## Prerequisites
- Docker and Docker Compose installed
- Supabase project URL and Anon Key

## One-Command Deployment

Create a `.env` file in the same directory as docker-compose.yml:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then run:
```bash
docker-compose up -d
```

The app will be available at: http://localhost:3000

## What this compose file does:

1. **Clones the repository** from GitHub directly in the container
2. **Installs dependencies** with npm install
3. **Builds the Next.js app** with npm run build  
4. **Starts the production server** with npm start
5. **Maps port 3000** for external access
6. **Persists data** with Docker volumes

## Environment Variables Required

Get these from your Supabase project dashboard → Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key

## Management Commands

```bash
# View logs
docker-compose logs -f

# Stop the app
docker-compose down

# Restart the app
docker-compose restart

# Update to latest version
docker-compose down
docker volume rm elect-todo-elect-todo-app
docker-compose up -d
```

## Access
- **Web App**: http://localhost:3000
- **Portainer**: If using Portainer, add the environment variables in the stack configuration

## Troubleshooting

If the app doesn't start, check:
1. Environment variables are set correctly
2. Supabase project is accessible
3. Port 3000 is not already in use