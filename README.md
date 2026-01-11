# ElecTodo

A personal simple todo application with no BS. Built with Next.js, Supabase, and Tailwind CSS.

**Author:** [creativekamrul](https://github.com/creativekamrul)

## Features

- ✅ Create and manage tasks with due dates
- 🏷️ Organize tasks with custom multi-tag support
- 📋 Kanban board view for better workflow management
- 🌙 Dark mode interface
- 🔒 Secure authentication with Supabase
- 📱 Responsive design
- 🐳 Docker deployment ready

## Quick Setup

### Option 1: Docker Compose (Recommended)

One-command deployment with Docker Compose.

📖 **For complete Docker setup instructions, see [QUICK-START.md](./QUICK-START.md) to get up and running with Docker.**

### Option 2: Local Development

1. **Clone and install:**
   ```bash
   git clone https://github.com/creativekamrul/elec-todo.git
   cd elec-todo
   npm install
   ```

2. **Set up environment:**
   - Copy [`.env.example`](./.env.example) to `.env.local`
   - Add your Supabase credentials

3. **Database Setup:**
   - Apply the database schema from [`database/schema.sql`](./database/schema.sql) to your Supabase project

4. **Run development server:**
   ```bash
   npm run dev
   ```

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## Deployment

### Portainer Deployment

For Portainer users, follow the deployment guide in [DEPLOYMENT.md](./DEPLOYMENT.md).

### Local Docker Compose

For local deployment using Docker Compose, refer to [QUICK-START.md](./QUICK-START.md).

## Project Structure

```
├── app/                 # Next.js app router pages
├── components/          # React components
├── contexts/           # React contexts (Auth)
├── database/           # Database schema
├── lib/                # Utility functions (Supabase client)
├── public/             # Static assets
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker configuration
└── nginx.conf          # Nginx configuration
```

## Technology Stack

- **Frontend**: Next.js 16.1.1, React 19.2.3
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Docker, Docker Compose, Portainer

## Configuration

### Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Schema

The application uses a multi-tag system with the following tables:
- `todos` - Task items
- `tags` - Available tags
- `todo_tags` - Many-to-many relationship between todos and tags

See [`database/schema.sql`](./database/schema.sql) for the complete schema.

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Color Scheme

The application uses a dark theme with the following colors:
- Dark/Full Black: `#000814`
- Blue: `#0077b6`
- White: `#f6fff8`
- Red: `#c1121f`
- Ocean Blue: `#90e0ef`
- Tag Colors: `#48cae4`, `#8ecae6`, `#ffb703`, `#ffc300`, `#ffc8dd`, `#a8dadc`, `#dee2e6`

## Support

For setup and deployment issues:

- 📖 [SETUP.md](./SETUP.md) - Complete setup guide
- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- 📖 [QUICK-START.md](./QUICK-START.md) - Docker quick start

## License

This project is open source and available under the [MIT License](LICENSE).

---

**ElecTodo** - Personal task management, simplified.