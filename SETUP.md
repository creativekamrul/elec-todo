# Todo App Setup Instructions

## 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Go to your project settings > API
4. Copy the Project URL and anon public key

## 2. Configure Environment Variables

Create a `.env.local` file in the root of your project and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from your Supabase project.

## 3. Set up Database

1. In your Supabase project, go to the SQL Editor
2. Run the SQL from `database/schema.sql` to create the tables and policies

## 4. Run the App

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Features

- ✅ User authentication with Supabase Auth
- ✅ Add todos with title, due date, and tags
- ✅ Tag management system
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Responsive design with Tailwind CSS

## Pages

- `/` - Main todo page
- `/tags` - Manage your tags