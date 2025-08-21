import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Adminify - CLI Command UI
          </h1>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={logout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}