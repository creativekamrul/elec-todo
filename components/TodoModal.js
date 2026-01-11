'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function TodoModal({ isOpen, onClose, user, onTodoAdded }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user && supabase) {
      fetchTags()
    }
  }, [isOpen, user])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !supabase) return

    setLoading(true)

    // First, create the todo
    const { data: todoData, error: todoError } = await supabase
      .from('todos')
      .insert([
        {
          title: title.trim(),
          due_date: dueDate || null,
          user_id: user.id
        }
      ])
      .select()

    if (todoError) {
      console.error('Error adding todo:', todoError)
      alert('Error adding todo: ' + todoError.message)
      setLoading(false)
      return
    }

    const newTodo = todoData[0]

    // Then, add the tag associations
    if (selectedTags.length > 0) {
      const tagAssociations = selectedTags.map(tagId => ({
        todo_id: newTodo.id,
        tag_id: tagId
      }))

      const { error: tagError } = await supabase
        .from('todo_tags')
        .insert(tagAssociations)

      if (tagError) {
        console.error('Error adding tags:', tagError)
        alert('Error adding tags: ' + tagError.message)
        setLoading(false)
        return
      }
    }

    // Reset form and close modal
    setTitle('')
    setDueDate('')
    setSelectedTags([])
    onTodoAdded && onTodoAdded(newTodo)
    onClose()
    setLoading(false)
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 10)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#000000' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #0077b6' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#f6fff8' }}>Add New Task</h2>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: '#90e0ef' }}
            onMouseEnter={(e) => { e.target.style.color = '#f6fff8'; }}
            onMouseLeave={(e) => { e.target.style.color = '#90e0ef'; }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: '#90e0ef' }}>
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none transition-all"
              style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef' }}
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Due Date Input */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-2" style={{ color: '#90e0ef' }}>
              Due Date (Optional)
            </label>
            <input
              id="dueDate"
              type="date"
              value={formatDueDate(dueDate)}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none transition-all"
              style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef' }}
            />
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#90e0ef' }}>
              Tags (Optional)
            </label>
            <div className="space-y-2">
              {tags.length === 0 ? (
                <p className="text-sm" style={{ color: '#90e0ef' }}>
                  No tags available.{' '}
                  <a href="/tags" className="hover:underline" target="_blank" style={{ color: '#48cae4' }}>
                    Create tags here
                  </a>
                </p>
              ) : (
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                      style={{ 
                        backgroundColor: '#fcca46',
                        border: '1px solid #fcca46'
                      }}
                      
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags([...selectedTags, tag.id])
                          } else {
                            setSelectedTags(selectedTags.filter(id => id !== tag.id))
                          }
                        }}
                        className="w-4 h-4 rounded"
                        style={{ 
                          accentColor: '#48cae4',
                          backgroundColor: '#0077b6',
                          border: '1px solid #90e0ef'
                        }}
                      />
                      <span className="flex-1" style={{ color: '#000000' }}>
                        {tag.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#0077b6', color: '#f6fff8' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#005f8a'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#0077b6'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors"
              style={{ 
                backgroundColor: (loading || !title.trim()) ? '#48cae4' : '#0077b6', 
                color: '#f6fff8',
                cursor: (loading || !title.trim()) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => { 
                if (!loading && title.trim()) {
                  e.target.style.backgroundColor = '#005f8a'; 
                }
              }}
              onMouseLeave={(e) => { 
                if (!loading && title.trim()) {
                  e.target.style.backgroundColor = '#0077b6'; 
                }
              }}
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}