import React from 'react'
import { useCommands } from '../hooks/useCommands'

interface CommandListProps {
  onSelectCommand: (commandId: string) => void
  selectedCommand?: string
}

export const CommandList: React.FC<CommandListProps> = ({ 
  onSelectCommand, 
  selectedCommand 
}) => {
  const { data: commands, isLoading, error } = useCommands()

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading commands: {(error as Error).message}
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Available Commands
        </h3>
        <ul className="divide-y divide-gray-200">
          {commands?.map((command) => (
            <li
              key={command.id}
              className={`py-3 px-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedCommand === command.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectCommand(command.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {command.id}
                  </p>
                  {command.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {command.description}
                    </p>
                  )}
                </div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}