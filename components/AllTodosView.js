'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AllTodosView({ user, onTodoUpdated }) {
  const [todos, setTodos] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at')
  const [filterTag, setFilterTag] = useState('')

  useEffect(() => {
    if (user && supabase) {
      fetchTodos()
      fetchTags()
    }
  }, [user, sortBy, filterTag])

  const fetchTodos = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    let query = supabase
      .from('todos')
      .select(`
        *,
        todo_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq('user_id', user.id)

    // Apply tag filter
    if (filterTag) {
      query = query.eq('todo_tags.tags.id', filterTag)
    }

    // Apply sorting
    const sortField = sortBy === 'due_date' ? 'due_date' : 'created_at'
    const sortOrder = sortBy === 'due_date' ? { ascending: true } : { ascending: false }
    query = query.order(sortField, sortOrder)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching todos:', error)
    } else {
      // Transform the data to have a flat tags array
      const transformedData = (data || []).map(todo => ({
        ...todo,
        tags: todo.todo_tags ? todo.todo_tags.map(tt => tt.tags).filter(Boolean) : []
      }))
      setTodos(transformedData)
    }
    setLoading(false)
  }

  const fetchTags = async () => {
    if (!supabase) return
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) {
      console.error('Error fetching tags:', error)
    } else {
      setTags(data || [])
    }
  }

  const toggleTodo = async (todoId, currentStatus) => {
    if (!supabase) return
    
    const { error } = await supabase
      .from('todos')
      .update({ completed: !currentStatus })
      .eq('id', todoId)

    if (error) {
      console.error('Error toggling todo:', error)
    } else {
      fetchTodos()
      onTodoUpdated && onTodoUpdated()
    }
  }

  const deleteTodo = async (todoId) => {
    if (!supabase) return
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)

    if (error) {
      console.error('Error deleting todo:', error)
    } else {
      fetchTodos()
      onTodoUpdated && onTodoUpdated()
    }
  }

  const getTagColor = (tagName) => {
    return '#fcca46'
  }

  const isOverdue = (todo) => {
    if (!todo.due_date) return false
    return new Date(todo.due_date) < new Date()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getPriorityIndicator = (todo) => {
    if (!todo.due_date || todo.completed) return null
    
    const now = new Date()
    const dueDate = new Date(todo.due_date)
    const diffTime = dueDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#c1121f', color: '#f6fff8' }}>Overdue</span>
    } else if (diffDays <= 1) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#ffb703', color: 'rgba(0, 8, 20, 1)' }}>Due Soon</span>
    } else if (diffDays <= 3) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#ffc300', color: '#000814' }}>Upcoming</span>
    }
    
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: '#90e0ef' }}>Loading tasks...</div>
      </div>
    )
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const pendingCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="space-y-6">
      {/* Stats and Filters */}
      <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: '#003554', border: '1px solid #0077b6' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats */}
          <div>
            {/* <h3 className="text-lg font-medium mb-4" style={{ color: '#f6fff8' }}>Task Overview</h3> */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#ffffffff' }}>Total Tasks</span>
                <span className="text-sm font-medium" style={{ color: '#ffffffff' }}>{todos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#ffffffff' }}>Pending</span>
                <span className="text-sm font-medium" style={{ color: '#48cae4' }}>{pendingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#ffffffff' }}>Completed</span>
                <span className="text-sm font-medium" style={{ color: '#48cae4' }}>{completedCount}</span>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#90e0ef' }}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg outline-none"
              style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef' }}
            >
              <option value="created_at">Newest First</option>
              <option value="due_date">Due Date</option>
            </select>
          </div>

          {/* Filter by Tag */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#90e0ef' }}>Filter by Tag</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full px-3 py-2 rounded-lg outline-none"
              style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef' }}
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.filter(todo => !todo.completed).map((todo) => (
          <div
            key={todo.id}
            className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}
            style={{ 
              backgroundColor: '#000000', 
              opacity: todo.completed ? 0.75 : 1
            }}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className="mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all"
                  style={{ 
                    backgroundColor: todo.completed ? '#48cae4' : 'transparent',
                    borderColor: todo.completed ? '#48cae4' : '#90e0ef'
                  }}
                  onMouseEnter={(e) => { if (!todo.completed) e.target.style.backgroundColor = '#0077b6'; }}
                  onMouseLeave={(e) => { if (!todo.completed) e.target.style.backgroundColor = 'transparent'; }}
                >
                  {todo.completed && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#000814' }}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-medium ${todo.completed ? 'line-through' : ''}`}
                    style={{ color: todo.completed ? '#90e0ef' : '#f6fff8' }}>
                    {todo.title}
                  </h3>
                  
                  {/* Tags and Metadata */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {todo.tags.map((tag) => (
                          <span 
                            key={tag.id} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                            style={{ backgroundColor: getTagColor(tag.name), color: '#000814' }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {getPriorityIndicator(todo)}
                    
                    {todo.due_date && (
                      <span className="text-sm"
                        style={{ color: (isOverdue(todo) && !todo.completed) ? '#c1121f' : '#90e0ef' }}
                      >
                        📅 {formatDate(todo.due_date)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: '#c1121f' }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#c1121f'; e.target.style.color = '#f6fff8'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#c1121f'; }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {todos.length === 0 && (
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-12 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No tasks yet</h3>
            <p className="text-gray-400">Click the + button to create your first task</p>
          </div>
        )}
      </div>
    </div>
  )
}