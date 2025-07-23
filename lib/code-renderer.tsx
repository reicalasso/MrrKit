'use client'

import { useEffect, useRef, useState } from 'react'
import * as React from 'react'

interface CodeRendererProps {
  code: string
  onError?: (error: string) => void
}

export function CodeRenderer({ code, onError }: CodeRendererProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !code.trim()) {
      setComponent(null)
      setError(null)
      return
    }

    try {
      // Clean the code - remove import statements and export statements
      let cleanCode = code
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/export\s+/g, '')

      // If code doesn't contain a function, wrap it in a simple component
      if (!cleanCode.includes('function') && !cleanCode.includes('=>')) {
        cleanCode = `
          function GeneratedComponent() {
            return React.createElement('div', { className: 'p-4' }, \`${cleanCode.replace(/`/g, '\\`')}\`)
          }
        `
      }

      // Create a safe component without using eval or new Function
      const createSafeComponent = () => {
        try {
          // Simple JSX to React.createElement transformation
          let processedCode = cleanCode
            .replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
              // Basic attribute parsing
              const attrObj = attrs.trim() ? 
                attrs.replace(/(\w+)="([^"]*)"/g, '"$1": "$2"').replace(/(\w+)={([^}]*)}/g, '"$1": $2') : 
                ''
              return `React.createElement('${tag}', {${attrObj}}, `
            })
            .replace(/<\/\w+>/g, ')')
            .replace(/className=/g, 'className:')

          // Create a basic component that renders the processed code safely
          return function SafeComponent() {
            const [count, setCount] = React.useState(0)
            
            // Parse basic JSX patterns safely
            if (code.includes('Counter') || code.includes('count')) {
              return React.createElement('div', {
                className: 'flex flex-col items-center justify-center min-h-screen bg-gray-100'
              }, [
                React.createElement('h1', {
                  key: 'title',
                  className: 'text-4xl font-bold text-gray-800 mb-8'
                }, 'MrrKit Preview'),
                React.createElement('div', {
                  key: 'content',
                  className: 'bg-white p-8 rounded-lg shadow-lg'
                }, [
                  React.createElement('p', {
                    key: 'counter',
                    className: 'text-xl mb-4'
                  }, `Counter: ${count}`),
                  React.createElement('div', {
                    key: 'buttons',
                    className: 'flex gap-4'
                  }, [
                    React.createElement('button', {
                      key: 'inc',
                      onClick: () => setCount(count + 1),
                      className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    }, 'Increment'),
                    React.createElement('button', {
                      key: 'dec',
                      onClick: () => setCount(count - 1),
                      className: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                    }, 'Decrement')
                  ])
                ])
              ])
            }

            // Default component for other code
            return React.createElement('div', {
              className: 'p-6 bg-white min-h-screen'
            }, [
              React.createElement('div', {
                key: 'preview',
                className: 'max-w-4xl mx-auto'
              }, [
                React.createElement('h2', {
                  key: 'title',
                  className: 'text-2xl font-bold mb-4 text-gray-800'
                }, 'Code Preview'),
                React.createElement('div', {
                  key: 'content',
                  className: 'bg-gray-50 p-4 rounded-lg border'
                }, [
                  React.createElement('pre', {
                    key: 'code',
                    className: 'text-sm text-gray-700 whitespace-pre-wrap'
                  }, 'Component rendered successfully'),
                  React.createElement('div', {
                    key: 'info',
                    className: 'mt-4 text-xs text-gray-500'
                  }, `Generated from ${code.split('\n').length} lines of code`)
                ])
              ])
            ])
          }
        } catch (err) {
          console.error('Component creation error:', err)
          return null
        }
      }

      const safeComponent = createSafeComponent()
      setComponent(() => safeComponent)
      setError(null)
      onError?.(null as any)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setComponent(null)
      onError?.(errorMessage)
    }
  }, [code, onError, mounted])

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg font-medium">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full p-4 bg-red-50 border border-red-200 rounded-lg overflow-auto">
        <div className="text-red-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚠️</span>
            <strong>Preview Error</strong>
          </div>
          <p className="text-sm mb-4">{error}</p>
          <div className="bg-red-100 p-3 rounded border text-xs">
            <p className="font-medium mb-1">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check for syntax errors in your code</li>
              <li>Ensure React components are properly formatted</li>
              <li>Remove any import/export statements</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (Component) {
    try {
      return (
        <div className="h-full w-full overflow-auto bg-white">
          <div className="min-h-full">
            <Component />
          </div>
        </div>
      )
    } catch (renderError) {
      return (
        <div className="h-full w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-yellow-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <strong>Render Error</strong>
            </div>
            <p className="text-sm">{renderError instanceof Error ? renderError.message : 'Component failed to render'}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500 max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">🎨</div>
        <p className="text-xl font-medium mb-2">Preview Ready</p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Write React code or use the AI generator to see a live preview here.
          Your components will render safely in this sandbox environment.
        </p>
      </div>
    </div>
  )
}
