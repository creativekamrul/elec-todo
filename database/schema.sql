-- Create tags table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create junction table for many-to-many relationship between todos and tags
CREATE TABLE todo_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(todo_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_todo_tags_todo_id ON todo_tags(todo_id);
CREATE INDEX idx_todo_tags_tag_id ON todo_tags(tag_id);

-- Row Level Security (RLS) policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy for tags: Users can only access their own tags
CREATE POLICY "Users can view own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

-- Policy for todos: Users can only access their own todos
CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS for todo_tags table
ALTER TABLE todo_tags ENABLE ROW LEVEL SECURITY;

-- Policies for todo_tags through todos
CREATE POLICY "Users can view todo_tags through own todos" ON todo_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM todos 
      WHERE todos.id = todo_tags.todo_id 
      AND auth.uid() = todos.user_id
    )
  );

CREATE POLICY "Users can insert todo_tags through own todos" ON todo_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM todos 
      WHERE todos.id = todo_tags.todo_id 
      AND auth.uid() = todos.user_id
    )
  );

CREATE POLICY "Users can delete todo_tags through own todos" ON todo_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM todos 
      WHERE todos.id = todo_tags.todo_id 
      AND auth.uid() = todos.user_id
    )
  );