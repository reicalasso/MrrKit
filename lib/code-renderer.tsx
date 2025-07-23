'use client'

import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import * as Babel from '@babel/standalone'

interface CodeRendererProps {
  code: string
  onError?: (error: string) => void
}

export function CodeRenderer({ code, onError }: CodeRendererProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!code.trim()) {
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
            return (
              <div className="p-4">
                ${cleanCode}
              </div>
            )
          }
        `
      }

      // Transform JSX to regular JavaScript
      const transformedCode = Babel.transform(cleanCode, {
        presets: ['react'],
        filename: 'generated.jsx'
      }).code

      // Create the component function
      const componentFunction = new Function(
        'React',
        'useState',
        'useEffect',
        'useRef',
        'useCallback',
        `
        const { createElement, Fragment } = React;
        ${transformedCode}
        
        // Find the component function
        const componentMatch = \`${cleanCode}\`.match(/function\\s+(\\w+)/);
        const componentName = componentMatch ? componentMatch[1] : null;
        
        if (componentName && typeof eval(componentName) === 'function') {
          return eval(componentName);
        }
        
        // If no named function found, look for arrow function or default export
        if (typeof GeneratedComponent === 'function') {
          return GeneratedComponent;
        }
        
        // Fallback: return a simple component
        return function() {
          return createElement('div', { className: 'p-4 text-center' }, 'Component rendered successfully');
        };
        `
      )(React, React.useState, React.useEffect, React.useRef, React.useCallback)

      setComponent(() => componentFunction)
      setError(null)
      onError?.(null as any)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setComponent(null)
      onError?.(errorMessage)
      
      // Fallback: render in iframe
      renderInIframe()
    }
  }, [code, onError])

  const renderInIframe = () => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useRef, useCallback } = React;
            
            ${code.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')}
            
            // Try to find and render the component
            const componentMatch = \`${code}\`.match(/function\\s+(\\w+)/);
            const componentName = componentMatch ? componentMatch[1] : 'App';
            
            try {
              const ComponentToRender = eval(componentName) || (() => React.createElement('div', null, 'Component rendered'));
              ReactDOM.render(React.createElement(ComponentToRender), document.getElementById('root'));
            } catch (e) {
              ReactDOM.render(
                React.createElement('div', { 
                  style: { padding: '20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626' } 
                }, 'Render Error: ' + e.message), 
                document.getElementById('root')
              );
            }
          </script>
        </body>
      </html>
    `

    iframeDoc.open()
    iframeDoc.write(htmlContent)
    iframeDoc.close()
  }

  if (error) {
    return (
      <div className="h-full w-full">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Code Preview"
          sandbox="allow-scripts"
        />
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
        <div className="h-full w-full p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700">
            <strong>Render Error:</strong> {renderError instanceof Error ? renderError.message : 'Unknown error'}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500">
        <div className="text-4xl mb-4">🎨</div>
        <p className="text-lg font-medium mb-2">Önizleme Hazır</p>
        <p className="text-sm">Kod yazın veya AI ile üretin</p>
      </div>
    </div>
  )
}
