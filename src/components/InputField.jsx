import React from 'react'

const InputField = () => {
  return (
    <div>
          <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
          <div className="relative">
            <input
              type={type}
              id={id}
              name={name}
              required
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder={placeholder}
            />
            {icon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {icon}
              </div>
            )}
          </div>
        </div>
  )
}

export default InputField