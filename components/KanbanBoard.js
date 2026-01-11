'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function KanbanBoard({ user }) {
  const [todos, setTodos] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTagSelector, setShowTagSelector] = useState(false)

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
        todo_tags (
          tag_id,
          tags (
            id,
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching todos:', error)
    } else {
      // Transform the data to include tags as a flat array
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
    }
  }

  const toggleTagSelection = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId)
      } else {
        return [...prev, tagId].slice(0, 5) // Limit to 5 tags
      }
    })
  }

  const filteredTodos = selectedTags.length > 0 
    ? todos.filter(todo => todo.tags && todo.tags.some(tag => selectedTags.includes(tag.id)))
    : todos

  const todoColumns = [
    { id: 'todo', title: 'To Do', filter: (todo) => !todo.completed && !isOverdue(todo) },
    { id: 'overdue', title: 'Overdue', filter: (todo) => !todo.completed && isOverdue(todo) },
    { id: 'done', title: 'Done', filter: (todo) => todo.completed }
  ]

  const isOverdue = (todo) => {
    if (!todo.due_date) return false
    return new Date(todo.due_date) < new Date()
  }

  const getTagColor = (tagName) => {
    return '#fcca46'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: '#90e0ef' }}>Loading Kanban board...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tag Selector */}
      <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: '#003554', border: '1px solid #0077b6' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium" style={{ color: '#f6fff8' }}>Filter by Tags</h3>
            <p className="text-sm mt-1" style={{ color: '#90e0ef' }}>
              {selectedTags.length > 0 
                ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
                : 'Showing all tasks'
              }
            </p>
          </div>
          <button
            onClick={() => setShowTagSelector(!showTagSelector)}
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ backgroundColor: '#0077b6', color: '#f6fff8' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#005f8a'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#0077b6'; }}
          >
            {showTagSelector ? 'Hide Tags' : 'Select Tags'}
          </button>
        </div>

        {showTagSelector && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTagSelection(tag.id)}
                className="px-3 py-1 rounded-full text-sm font-medium transition-all"
                style={{ 
                  backgroundColor: selectedTags.includes(tag.id) ? '#0077b6' : '#90e0ef', 
                  color: selectedTags.includes(tag.id) ? '#f6fff8' : '#000814'
                }}
                onMouseEnter={(e) => { 
                  if (!selectedTags.includes(tag.id)) {
                    e.target.style.backgroundColor = '#48cae4'; 
                    e.target.style.color = '#000814';
                  }
                }}
                onMouseLeave={(e) => { 
                  if (!selectedTags.includes(tag.id)) {
                    e.target.style.backgroundColor = '#90e0ef'; 
                    e.target.style.color = '#000814';
                  }
                }}
              >
                {tag.name}
              </button>
            ))}
            {tags.length === 0 && (
              <p className="text-sm" style={{ color: '#90e0ef' }}>
                No tags available. <a href="/tags" style={{ color: '#48cae4' }}>Create tags here</a>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todoColumns.map((column) => (
          <div key={column.id} className="rounded-lg" style={{ backgroundColor: '#003554' }}>
            <div className="px-4 py-3 rounded-t-lg border" style={{ backgroundColor: '#0077b6', borderColor: '#90e0ef' }}>
              <h3 className="font-semibold" style={{ color: '#f6fff8' }}>{column.title}</h3>
              <p className="text-sm mt-1" style={{ color: '#90e0ef' }}>
                {filteredTodos.filter(column.filter).length} task{filteredTodos.filter(column.filter).length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="p-4 space-y-3 min-h-[400px]">
              {filteredTodos
                .filter(column.filter)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    style={{ backgroundColor: '#000000', border: '1px solid #90e0ef' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${todo.completed ? 'line-through' : ''}`}
                          style={{ color: todo.completed ? '#90e0ef' : '#f6fff8' }}>
                          {todo.title}
                        </h4>
                        
                        {todo.tags && todo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {todo.tags.map((tag) => (
                              <span key={tag.id} className="inline-block px-2 py-1 rounded-full text-xs font-medium" 
                                style={{ backgroundColor: getTagColor(tag.name), color: '#000814' }}>
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {todo.due_date && (
                          <p className="text-xs mt-2"
                            style={{ color: (isOverdue(todo) && !todo.completed) ? '#c1121f' : '#90e0ef' }}
                          >
                            📅 {formatDate(todo.due_date)}
                            {isOverdue(todo) && !todo.completed && ' (Overdue)'}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleTodo(todo.id, todo.completed)}
                          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                          style={{ 
                            backgroundColor: todo.completed ? '#48cae4' : 'transparent',
                            borderColor: todo.completed ? '#48cae4' : '#90e0ef'
                          }}
                          onMouseEnter={(e) => { if (!todo.completed) e.target.style.backgroundColor = '#0077b6'; }}
                          onMouseLeave={(e) => { if (!todo.completed) e.target.style.backgroundColor = 'transparent'; }}
                        >
                          {todo.completed && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#000814' }}>
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="transition-colors"
                          style={{ color: '#c1121f' }}
                          onMouseEnter={(e) => { e.target.style.color = '#90e0ef'; }}
                          onMouseLeave={(e) => { e.target.style.color = '#c1121f'; }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              
              {filteredTodos.filter(column.filter).length === 0 && (
                <div className="text-center py-8" style={{ color: '#90e0ef' }}>
                  <p className="text-sm">No tasks in this column</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}