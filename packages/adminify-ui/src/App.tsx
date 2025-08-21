import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CommandList } from './components/CommandList'
import { CommandForm } from './components/CommandForm'
import { LoginForm } from './components/LoginForm'
import { Header } from './components/Header'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const queryClient = new QueryClient()

function AppContent() {
  const [selectedCommand, setSelectedCommand] = useState<string>()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CommandList 
                  onSelectCommand={setSelectedCommand}
                  selectedCommand={selectedCommand}
                />
              </div>
              
              <div>
                {selectedCommand ? (
                  <CommandForm commandId={selectedCommand} />
                ) : (
                  <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500 text-center">
                      Select a command from the list to view its details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App