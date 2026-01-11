'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (!supabase) {
      alert('Please configure your Supabase credentials in .env.local file')
      setLoading(false)
      return
    }

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password)
      } else {
        result = await signIn(email, password)
      }
      
      if (result?.error) {
        alert(result.error.message || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#000814' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0077b6] to-[#90e0ef] bg-clip-text text-transparent">
            ElecTodo
          </h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#f6fff8' }}>
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: '#90e0ef' }}>
          {isSignUp ? 'Sign up to get started with your personal task manager' : 'Welcome back! Please sign in to continue'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 shadow-lg sm:rounded-lg sm:px-10" style={{ backgroundColor: '#003554' }}>
          <form className="space-y-6" onSubmit={handleAuth}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#90e0ef' }}>
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm outline-none transition-all"
                  style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef', placeholderColor: '#90e0ef' }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#90e0ef' }}>
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm outline-none transition-all"
                  style={{ backgroundColor: '#0077b6', color: '#f6fff8', border: '1px solid #90e0ef', placeholderColor: '#90e0ef' }}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              {isSignUp && (
                <p className="mt-1 text-xs" style={{ color: '#90e0ef' }}>
                  Must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors"
                style={{ backgroundColor: '#0077b6', color: '#f6fff8', borderColor: '#0077b6' }}
                onMouseEnter={(e) => { if (!loading && email && password) e.target.style.backgroundColor = '#005f8a'; }}
                onMouseLeave={(e) => { if (!loading && email && password) e.target.style.backgroundColor = '#0077b6'; }}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isSignUp ? 'Sign Up' : 'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#0077b6' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ backgroundColor: '#003554', color: '#90e0ef' }}>Or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium transition-colors"
                style={{ color: '#48cae4' }}
                onMouseEnter={(e) => { e.target.style.color = '#90e0ef'; }}
                onMouseLeave={(e) => { e.target.style.color = '#48cae4'; }}
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-medium text-white mb-4">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Create and manage tasks with due dates
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Organize tasks with custom tags
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Kanban board view for better workflow
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your data is securely stored and private
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}