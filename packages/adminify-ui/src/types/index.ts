export interface CommandField {
  name: string
  type: 'text' | 'checkbox' | 'select'
  label: string
  required: boolean
  defaultValue?: any
  placeholder?: string
  options?: string[]
  multiple?: boolean
  char?: string
}

export interface CommandSchema {
  id: string
  description?: string
  examples?: string[]
  fields: CommandField[]
}