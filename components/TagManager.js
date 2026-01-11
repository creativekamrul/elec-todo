'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TagManager({ user }) {
  const [tags, setTags] = useState([])
  const [newTagName, setNewTagName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && supabase) {
      fetchTags()
    }
  }, [user])

  const fetchTags = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) {
      console.error('Error fetching tags:', error)
      
      // Provide specific error message for missing tables
      if (error.code === 'PGRST116') {
        console.warn('Tags table not found - please run SQL schema in Supabase')
      }
    } else {
      setTags(data || [])
    }
    setLoading(false)
  }

  const addTag = async (e) => {
    e.preventDefault()
    if (!newTagName.trim() || !supabase) return

    // Check if tag already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      alert('A tag with this name already exists')
      return
    }

    const { error } = await supabase
      .from('tags')
      .insert({
        name: newTagName.trim(),
        user_id: user.id
      })

    if (error) {
      console.error('Error adding tag:', error)
      alert('Error adding tag: ' + error.message)
    } else {
      setNewTagName('')
      fetchTags()
    }
  }

  const deleteTag = async (tagId) => {
    if (!supabase) return
    
    if (confirm('Are you sure you want to delete this tag? This will remove it from all todos.')) {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)

      if (error) {
        console.error('Error deleting tag:', error)
        alert('Error deleting tag: ' + error.message)
      } else {
        fetchTags()
      }
    }
  }

  const getTagColor = (tagName) => {
    const colors = ['#48cae4', '#8ecae6', '#ffb703', '#ffc300', '#ffc8dd', '#a8dadc', '#dee2e6']
    let hash = 0
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: '#90e0ef' }}>Loading tags...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Tag Form */}
      <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: '#003554', border: '1px solid #0077b6' }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: '#f6fff8' }}>Create New Tag</h3>
        <form onSubmit={addTag} className="flex gap-3">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name"
            className="flex-1 px-4 py-2 rounded-lg outline-none"
            style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef' }}
            maxLength={50}
            required
          />
          <button
            type="submit"
            disabled={!newTagName.trim()}
            className="px-6 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: newTagName.trim() ? '#0077b6' : '#90e0ef', 
              color: newTagName.trim() ? '#f6fff8' : '#000814',
              cursor: newTagName.trim() ? 'pointer' : 'not-allowed'
            }}
            onMouseEnter={(e) => { if (newTagName.trim()) e.target.style.backgroundColor = '#005f8a'; }}
            onMouseLeave={(e) => { if (newTagName.trim()) e.target.style.backgroundColor = '#0077b6'; }}
          >
            Create Tag
          </button>
        </form>
      </div>

      {/* Tags List */}
      <div className="rounded-lg shadow-sm" style={{ backgroundColor: '#003554', border: '1px solid #0077b6' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #0077b6' }}>
          <h3 className="text-lg font-medium" style={{ color: '#f6fff8' }}>
            Your Tags ({tags.length})
          </h3>
          <p className="text-sm mt-1" style={{ color: '#90e0ef' }}>
            Tags help you organize and categorize your tasks
          </p>
        </div>
        
        <div className="p-6">
          {tags.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4" style={{ color: '#90e0ef' }}>
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#f6fff8' }}>No tags yet</h3>
              <p className="mb-4" style={{ color: '#90e0ef' }}>Create your first tag to start organizing your tasks</p>
              <p className="text-sm" style={{ color: '#48cae4' }}>
                Tip: Use tags like "Work", "Personal", "Urgent" to categorize tasks
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow"
                  style={{ border: '1px solid #90e0ef', backgroundColor: '#003554' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTagColor(tag.name) }}></div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                      style={{ backgroundColor: getTagColor(tag.name), color: '#000814' }}>
                      {tag.name}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: '#c1121f' }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#c1121f'; e.target.style.color = '#f6fff8'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#c1121f'; }}
                    title="Delete tag"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="rounded-lg p-6" style={{ backgroundColor: '#0077b6', border: '1px solid #48cae4' }}>
        <h3 className="text-lg font-medium mb-3" style={{ color: '#f1faee' }}>💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm" style={{ color: '#f6fff8' }}>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#90e0ef' }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Use descriptive names like "Work Project" or "Home Maintenance" for better organization</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#90e0ef' }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>In the Kanban board, you can select up to 5 tags to filter your tasks</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#90e0ef' }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Tags are color-coded automatically for easy visual identification</span>
          </li>
        </ul>
      </div>
    </div>
  )
}