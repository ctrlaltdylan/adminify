import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { CommandSchema } from '../types'

// Re-export types for backward compatibility
export type { CommandField, CommandSchema } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useCommands = () => {
  return useQuery({
    queryKey: ['commands'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/commands`)
      return response.data.commands as CommandSchema[]
    },
  })
}

export const useCommand = (id: string) => {
  return useQuery({
    queryKey: ['command', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/commands/${id}`)
      return response.data.command as CommandSchema
    },
    enabled: !!id,
  })
}