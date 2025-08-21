import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCommand } from '../hooks/useCommands'
import { InputField } from './InputField'
import axios from 'axios'

interface CommandFormProps {
  commandId: string
}

interface CommandOutput {
  success: boolean
  output: string
  error?: string
  timestamp: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const CommandForm: React.FC<CommandFormProps> = ({ commandId }) => {
  const { data: command, isLoading, error } = useCommand(commandId)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [commandOutput, setCommandOutput] = useState<CommandOutput | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const onSubmit = async (data: any) => {
    const args: Record<string, any> = {}
    const flags: Record<string, any> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('arg:')) {
        args[key.replace('arg:', '')] = value
      } else if (key.startsWith('flag:')) {
        flags[key.replace('flag:', '')] = value
      }
    })

    setIsExecuting(true)
    setCommandOutput(null)

    try {
      const response = await axios.post(`${API_URL}/api/execute`, {
        commandId,
        args,
        flags,
      })
      
      setCommandOutput({
        success: true,
        output: response.data.output || 'Command executed successfully',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      setCommandOutput({
        success: false,
        output: '',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const clearOutput = () => {
    setCommandOutput(null)
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading command: {(error as Error).message}
      </div>
    )
  }

  if (!command) {
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {command.id}
        </h3>
        
        {command.description && (
          <p className="text-sm text-gray-600 mb-4">{command.description}</p>
        )}

        {command.examples && command.examples.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {command.examples.map((example, index) => (
                <li key={index} className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {command.fields.map((field) => (
            <InputField key={field.name} field={field} register={register} />
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isExecuting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing...
                </>
              ) : (
                'Execute Command'
              )}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              disabled={isExecuting}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Reset
            </button>
            {commandOutput && (
              <button
                type="button"
                onClick={clearOutput}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Output
              </button>
            )}
          </div>
        </form>

        {Object.keys(errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">
              Please fill in all required fields.
            </p>
          </div>
        )}

        {commandOutput && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Command Output</h4>
              <span className="text-xs text-gray-500">
                {new Date(commandOutput.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                commandOutput.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              {commandOutput.success ? (
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-4 w-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">Success</span>
                  </div>
                  <pre className="text-sm text-green-700 whitespace-pre-wrap font-mono">
                    {commandOutput.output}
                  </pre>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-4 w-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-red-800">Error</span>
                  </div>
                  <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                    {commandOutput.error}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}