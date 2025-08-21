import React from 'react'
import type { UseFormRegister } from 'react-hook-form'
import type { CommandField } from '../types'

interface InputFieldProps {
  field: CommandField
  register: UseFormRegister<any>
}

export const InputField: React.FC<InputFieldProps> = ({ field, register }) => {
  const fieldName = field.name

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center">
        <input
          id={fieldName}
          type="checkbox"
          {...register(fieldName)}
          defaultChecked={field.defaultValue}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={fieldName} className="ml-2 block text-sm text-gray-900">
          {field.label}
          {field.char && <span className="text-gray-500 ml-1">(-{field.char})</span>}
        </label>
      </div>
    )
  }

  if (field.type === 'select' && field.options) {
    return (
      <div>
        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
          {field.char && <span className="text-gray-500 ml-1">(-{field.char})</span>}
        </label>
        <select
          id={fieldName}
          {...register(fieldName, { required: field.required })}
          multiple={field.multiple}
          defaultValue={field.defaultValue}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div>
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {field.char && <span className="text-gray-500 ml-1">(-{field.char})</span>}
      </label>
      <input
        id={fieldName}
        type="text"
        {...register(fieldName, { required: field.required })}
        defaultValue={field.defaultValue}
        placeholder={field.placeholder}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  )
}