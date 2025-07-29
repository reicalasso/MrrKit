'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react'

interface ConsoleLog {
  id: string
  type: 'log' | 'error' | 'warn' | 'info'
  message: string
  timestamp: number
}

interface LivePreviewProps {
  code: string
  language?: string
  onError?: (error: Error | null) => void
  className?: string
}

export const LivePreview: React.FC<LivePreviewProps> = ({ 
  code, 
  language = 'javascript',
  onError,
  className = '' 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [showConsole, setShowConsole] = useState(false)

  const addConsoleLog = useCallback((type: ConsoleLog['type'], message: string) => {
    const log: ConsoleLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now()
    }
    setConsoleLogs(prev => [...prev.slice(-99), log]) // Keep last 100 logs
  }, [])

  const clearConsole = useCallback(() => {
    setConsoleLogs([])
  }, [])

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' }
      case 'tablet':
        return { width: '768px', height: '1024px' }
      default:
        return { width: '100%', height: '100%' }
    }
  }

  const createPreviewHTML = useCallback((code: string) => {
    if (language === 'html') {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Live Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${code}
          <script>
            // Capture console logs and send to parent
            const originalConsole = {
              log: console.log,
              error: console.error,
              warn: console.warn,
              info: console.info
            };

            ['log', 'error', 'warn', 'info'].forEach(method => {
              console[method] = (...args) => {
                originalConsole[method](...args);
                window.parent.postMessage({
                  type: 'console',
                  method,
                  args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))
                }, '*');
              };
            });

            // Capture errors
            window.addEventListener('error', (event) => {
              window.parent.postMessage({
                type: 'error',
                message: event.error?.message || event.message,
                stack: event.error?.stack
              }, '*');
            });

            window.addEventListener('unhandledrejection', (event) => {
              window.parent.postMessage({
                type: 'error',
                message: 'Unhandled Promise Rejection: ' + event.reason
              }, '*');
            });
          </script>
        </body>
        </html>
      `
    }

    // For React/JavaScript code
    // --- BAŞLANGIÇ: Kodun sonuna window.Component ataması ekle ---
    let transformedCode = code;
    // export default function ... => window.Component = function ...
    transformedCode = transformedCode.replace(
      /export\s+default\s+function\s+([A-Za-z0-9_]+)/,
      'function $1'
    );
    // export default ... => window.Component = ...
    transformedCode = transformedCode.replace(
      /export\s+default\s+([A-Za-z0-9_]+)/,
      'window.Component = $1'
    );
    // Eğer hala window.Component yoksa ve bir fonksiyon tanımı varsa, onu ata
    if (!/window\.Component\s*=/.test(transformedCode)) {
      const match = transformedCode.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
      if (match) {
        transformedCode += `\nwindow.Component = ${match[1]};`;
      }
    }
    // --- SON: Kodun sonuna window.Component ataması ekle ---

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { 
            margin: 0; 
            padding: 16px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #ffffff;
          }
          * { box-sizing: border-box; }
          #root { min-height: calc(100vh - 32px); }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          // Capture console logs and send to parent
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };

          ['log', 'error', 'warn', 'info'].forEach(method => {
            console[method] = (...args) => {
              originalConsole[method](...args);
              window.parent.postMessage({
                type: 'console',
                method,
                args: args.map(arg => {
                  if (typeof arg === 'object' && arg !== null) {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return '[Object]';
                    }
                  }
                  return String(arg);
                })
              }, '*');
            };
          });

          // Capture errors
          window.addEventListener('error', (event) => {
            window.parent.postMessage({
              type: 'error',
              message: event.error?.message || event.message,
              stack: event.error?.stack
            }, '*');
          });

          window.addEventListener('unhandledrejection', (event) => {
            window.parent.postMessage({
              type: 'error',
              message: 'Unhandled Promise Rejection: ' + event.reason
            }, '*');
          });

          try {
            // User code
            ${transformedCode}
            
            // If there's a default export, render it
            if (typeof Component !== 'undefined') {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(Component));
            } else if (typeof App !== 'undefined') {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(App));
            }
          } catch (error) {
            console.error('Preview Error:', error);
            document.getElementById('root').innerHTML = \`
              <div style="padding: 20px; border: 1px solid #ef4444; border-radius: 8px; background: #fef2f2; color: #dc2626;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px;">Preview Error</h3>
                <pre style="margin: 0; font-size: 12px; white-space: pre-wrap;">\${error.message}</pre>
              </div>
            \`;
          }
        </script>
      </body>
      </html>
    `
  }, [language])

  const updatePreview = useCallback(() => {
    if (!iframeRef.current || !code.trim()) return

    setIsLoading(true)
    onError?.(null)

    const html = createPreviewHTML(code)
    
    try {
      const iframe = iframeRef.current
      iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html)
      
      // Set up message listener for console logs and errors
      const handleMessage = (event: MessageEvent) => {
        if (event.source !== iframe.contentWindow) return

        const { type, method, args, message, stack } = event.data

        if (type === 'console') {
          addConsoleLog(method, args.join(' '))
        } else if (type === 'error') {
          addConsoleLog('error', message + (stack ? '\n' + stack : ''))
          onError?.(new Error(message))
        }
      }

      window.addEventListener('message', handleMessage)
      
      iframe.onload = () => {
        setIsLoading(false)
      }

      return () => {
        window.removeEventListener('message', handleMessage)
      }
    } catch (error) {
      setIsLoading(false)
      onError?.(error as Error)
      addConsoleLog('error', (error as Error).message)
    }
  }, [code, createPreviewHTML, onError, addConsoleLog])

  useEffect(() => {
    const timeoutId = setTimeout(updatePreview, 500)
    return () => clearTimeout(timeoutId)
  }, [updatePreview])

  const dimensions = getViewportDimensions()

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Viewport Controls */}
          <Button
            size="sm"
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            onClick={() => setViewMode('desktop')}
            className="h-8 px-2"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'tablet' ? 'default' : 'ghost'}
            onClick={() => setViewMode('tablet')}
            className="h-8 px-2"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            onClick={() => setViewMode('mobile')}
            className="h-8 px-2"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowConsole(!showConsole)}
            className="h-8 px-2"
          >
            Console {consoleLogs.length > 0 && `(${consoleLogs.length})`}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={updatePreview}
            className="h-8 px-2"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`flex-1 flex justify-center items-start overflow-auto bg-gray-100 p-4`}>
          {code.trim() ? (
            <div 
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                minHeight: viewMode === 'desktop' ? '100%' : dimensions.height,
                resize: viewMode === 'desktop' ? 'both' : 'none',
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                title="Live Preview"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">Live Preview</p>
                <p className="text-sm">Write some code to see the preview</p>
              </div>
            </div>
          )}
        </div>

        {/* Console Panel */}
        {showConsole && (
          <div className="h-48 border-t border-gray-200 bg-gray-900 text-green-400 font-mono text-xs flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-gray-700">
              <span className="text-gray-300">Console Output</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearConsole}
                className="h-6 px-2 text-gray-400 hover:text-white"
              >
                Clear
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-1">
              {consoleLogs.length === 0 ? (
                <div className="text-gray-500">Console output will appear here...</div>
              ) : (
                consoleLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`${
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'warn' ? 'text-yellow-400' : 
                      log.type === 'info' ? 'text-blue-400' : 
                      'text-green-400'
                    }`}
                  >
                    <span className="text-gray-500 mr-2">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-gray-400 mr-2">[{log.type.toUpperCase()}]</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
