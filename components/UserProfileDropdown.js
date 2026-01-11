'use client'

import { useState, useRef, useEffect } from 'react'

export default function UserProfileDropdown({ user, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        style={{ background: 'linear-gradient(to right, #0077b6, #48cae4)', color: '#f6fff8' }}
        onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(to right, #005f8a, #90e0ef)'; }}
        onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(to right, #0077b6, #48cae4)'; }}
      >
        {user.email?.charAt(0).toUpperCase() || 'U'}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50" style={{ backgroundColor: '#003554', border: '1px solid #0077b6' }}>
          {/* User Info */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #0077b6' }}>
            <p className="text-sm font-medium" style={{ color: '#f6fff8' }}>Signed in as</p>
            <p className="text-sm truncate mt-1" style={{ color: '#90e0ef' }}>{user.email}</p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                onSignOut()
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
              style={{ color: '#90e0ef' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#0077b6'; e.target.style.color = '#c1121f'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#90e0ef'; }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}