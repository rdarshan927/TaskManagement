/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          light: '#3B82F6', // blue-500
          DEFAULT: '#2563EB', // blue-600
          dark: '#1D4ED8',   // blue-700
        },
        secondary: {
          light: '#10B981', // emerald-500
          DEFAULT: '#059669', // emerald-600
          dark: '#047857',   // emerald-700
        },
        tertiary: {
          light: '#8B5CF6', // violet-500
          DEFAULT: '#7C3AED', // violet-600
          dark: '#6D28D9',   // violet-700
        },
        
        // 2 Neutral colors
        neutral: {
          light: '#F3F4F6', // gray-100
          DEFAULT: '#E5E7EB', // gray-200
          dark: '#D1D5DB',   // gray-300
        },
        dark: {
          light: '#6B7280', // gray-500
          DEFAULT: '#4B5563', // gray-600
          dark: '#374151',   // gray-700
        },
        
        // 1 Accent color
        accent: {
          light: '#F59E0B', // amber-500
          DEFAULT: '#D97706', // amber-600
          dark: '#B45309',   // amber-700
        },
        
        // Status colors
        status: {
          success: '#10B981', // emerald-500
          warning: '#F59E0B', // amber-500
          error: '#EF4444',   // red-500
          info: '#3B82F6',    // blue-500
        }
      }
    },
  },
  plugins: [],
}