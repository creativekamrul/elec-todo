'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Auth from '@/components/Auth'
import TodoModal from '@/components/TodoModal'
import UserProfileDropdown from '@/components/UserProfileDropdown'
import AllTodosView from '@/components/AllTodosView'
import KanbanBoard from '@/components/KanbanBoard'
import Link from 'next/link'

export default function Home() {
  const { user, signOut } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentView, setCurrentView] = useState('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  if (!user) {
    return <Auth />
  }

  const handleTodoAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleTodoUpdated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000814' }}>
      {/* Header Navigation */}
      <nav className="shadow-lg" style={{ backgroundColor: '#003554', borderBottom: '1px solid #0077b6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0077b6] to-[#90e0ef] bg-clip-text text-transparent">
                  ElecTodo
                </h1>
              </div>
            </div>

            {/* Navigation and User Actions */}
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="hidden sm:flex rounded-lg p-1" style={{ backgroundColor: '#0077b6' }}>
                <button
                  onClick={() => setCurrentView('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'all'
                      ? 'bg-[#000814] text-[#f6fff8] shadow-sm'
                      : 'text-[#90e0ef] hover:text-[#f6fff8]'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setCurrentView('kanban')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'kanban'
                      ? 'bg-[#000814] text-[#f6fff8] shadow-sm'
                      : 'text-[#90e0ef] hover:text-[#f6fff8]'
                  }`}
                >
                  Kanban Board
                </button>
              </div>

              {/* Mobile View Toggle */}
              <div className="sm:hidden">
                <select
                  value={currentView}
                  onChange={(e) => setCurrentView(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef' }}
                >
                  <option value="all">List View</option>
                  <option value="kanban">Kanban Board</option>
                </select>
              </div>

              {/* Tags Link */}
              <Link
                href="/tags"
                className="hidden sm:flex items-center px-4 py-2 rounded-lg transition-colors"
                style={{ color: '#90e0ef' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#0077b6'; e.target.style.color = '#f6fff8'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#90e0ef'; }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Tags
              </Link>

              {/* Add Todo Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 rounded-lg transition-colors shadow-sm"
                style={{ backgroundColor: '#0077b6', color: '#f6fff8' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#005f8a'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = '#0077b6'; }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Task</span>
              </button>

              {/* User Profile Dropdown */}
              <UserProfileDropdown user={user} onSignOut={signOut} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Add Button */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg transition-colors flex items-center justify-center"
          style={{ backgroundColor: '#0077b6', color: '#ffffffff' }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#005f8a'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = '#0077b6'; }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className="mb-8">
          <h2 className="text-3xl font-bold" style={{ color: '#f6fff8' }}>
            {currentView === 'all' ? 'All Tasks' : 'Kanban Board'}
          </h2>
          <p className="mt-2" style={{ color: '#90e0ef' }}>
            {currentView === 'all' 
              ? 'Manage and track all your tasks in one place'
              : 'Visualize your workflow with Kanban columns'
            }
          </p>
        </div> */}

        {/* View Content */}
        <div key={refreshTrigger}>
          {currentView === 'all' ? (
            <AllTodosView user={user} onTodoUpdated={handleTodoUpdated} />
          ) : (
            <KanbanBoard user={user} />
          )}
        </div>
      </main>

      {/* Todo Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onTodoAdded={handleTodoAdded}
      />
    </div>
  )
}