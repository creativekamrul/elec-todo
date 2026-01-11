'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import TagManager from '@/components/TagManager'
import UserProfileDropdown from '@/components/UserProfileDropdown'
import Link from 'next/link'

export default function TagsPage() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400">You need to be signed in to manage tags.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Navigation */}
      <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ElecTodo
                </h1>
              </div>
            </div>

            {/* Navigation and User Actions */}
            <div className="flex items-center gap-4">
              {/* Home Link */}
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>

              {/* User Profile Dropdown */}
              <UserProfileDropdown user={user} onSignOut={signOut} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Manage Tags</h2>
          <p className="text-gray-400 mt-2">
            Create and manage tags to organize your tasks
          </p>
        </div>

        <TagManager user={user} />
      </main>
    </div>
  )
}