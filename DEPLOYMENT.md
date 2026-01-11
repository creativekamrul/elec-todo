# Portainer Deployment Instructions

## Environment Variables Setup
When deploying via Portainer, you need to set these environment variables in your stack configuration:

```
NEXT_PUBLIC_SUPABASE_URL=https://mymbiakcxecjjfgsasnu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWJpYWtjeGVjampmZ3Nhc251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDEzMDcsImV4cCI6MjA4MzcxNzMwN30.xeUPfQ2HljE16j7oVLbVMHSGriblcVKl_M5qb1bw2_Q
```

## Portainer Stack Configuration
1. In Portainer, go to Stacks
2. Add new stack
3. Choose "Web editor" or "Git repository" (pointing to your GitHub)
4. Use the provided docker-compose.yml
5. In the "Environment variables" section, add the two variables above
6. Deploy the stack

## Docker Compose File
The docker-compose.yml is configured to:
- Build the image from your GitHub repository
- Expose port 3000
- Pass environment variables to the container
- Restart automatically unless stopped

## Access
Once deployed, access your app at: http://your-server-ip:3000