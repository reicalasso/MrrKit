'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'

export type Theme = 'light' | 'dark' | 'auto'
export type EditorTheme = 'vs' | 'vs-dark' | 'hc-black' | 'github-light' | 'github-dark'

interface ThemeContextType {
  theme: Theme
  editorTheme: EditorTheme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  setEditorTheme: (theme: EditorTheme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme: storeTheme, updateTheme } = useWorkspaceStore()
  const [mounted, setMounted] = useState(false)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  // Handle system theme detection
  useEffect(() => {
    setMounted(true)
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const resolvedTheme = storeTheme.mode === 'auto' ? systemTheme : storeTheme.mode
    
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolvedTheme)
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#1f2937' : '#ffffff')
    }
  }, [storeTheme.mode, systemTheme, mounted])

  const resolvedTheme = storeTheme.mode === 'auto' ? systemTheme : storeTheme.mode
  
  const setTheme = (theme: Theme) => {
    updateTheme({ mode: theme })
  }

  const setEditorTheme = (editorTheme: EditorTheme) => {
    updateTheme({ editorTheme })
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  if (!mounted) {
    return <div className="h-screen bg-gray-50" />
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: storeTheme.mode,
        editorTheme: storeTheme.editorTheme,
        resolvedTheme,
        setTheme,
        setEditorTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
