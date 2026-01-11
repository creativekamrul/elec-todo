'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function TodoList() {
  const { user } = useAuth()
  const [todos, setTodos] = useState([])
  const [tags, setTags] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && supabase) {
      fetchTodos()
      fetchTags()
    }
  }, [user])

  const fetchTodos = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    const { data, error } = await supabase
      .from('todos')
      .select(`
        *,
        tags (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching todos:', error)
      
      // Provide specific error message for missing tables
      if (error.code === 'PGRST116') {
        console.warn('Todos table not found - please run SQL schema in Supabase')
      }
    } else {
      setTodos(data || [])
    }
    setLoading(false)
  }

  const fetchTags = async () => {
    if (!supabase) return
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching tags:', error)
    } else {
      setTags(data || [])
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim() || !supabase) return

    const { error } = await supabase
      .from('todos')
      .insert({
        title: title.trim(),
        due_date: dueDate || null,
        tag_id: selectedTag || null,
        user_id: user.id
      })

    if (error) {
      console.error('Error adding todo:', error)
      
      // Provide more specific error messages
      if (error.code === 'PGRST116') {
        alert('Database tables not found. Please run the SQL schema in your Supabase project.')
      } else if (error.code === '42501') {
        alert('Permission denied. Please check that RLS policies are set up correctly.')
      } else {
        alert(`Error adding todo: ${error.message}`)
      }
    } else {
      setTitle('')
      setDueDate('')
      setSelectedTag('')
      fetchTodos()
    }
  }

  const toggleTodo = async (id, completed) => {
    if (!supabase) return
    
    const { error } = await supabase
      .from('todos')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error updating todo:', error)
    } else {
      fetchTodos()
    }
  }

  const deleteTodo = async (id) => {
    if (!supabase) return
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error)
    } else {
      fetchTodos()
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && !dueDate.startsWith(new Date().toISOString().split('T')[0])
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">My Todos</h1>
      
      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              />
            </div>
            
            <div className="flex-1">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
              >
                <option value="">Select a tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Todo
            </button>
          </div>
        </div>
      </form>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-4 p-4 border rounded-lg ${
                todo.completed 
                  ? 'bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700' 
                  : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-600'
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, !todo.completed)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              
              <div className="flex-1">
                <div className={`font-medium ${todo.completed ? 'line-through text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {todo.title}
                </div>
                
                <div className="flex gap-4 mt-1">
                  {todo.tags && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                      {todo.tags.name}
                    </span>
                  )}
                  
                  {todo.due_date && (
                    <span className={`text-xs ${isOverdue(todo.due_date) ? 'text-red-600 font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      Due: {formatDate(todo.due_date)}
                      {isOverdue(todo.due_date) && ' (Overdue)'}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}