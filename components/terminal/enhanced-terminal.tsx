'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, 
  Minimize, 
  Square, 
  Terminal as TerminalIcon, 
  Package,
  Play,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
  Search,
  Trash2,
  Settings
} from 'lucide-react'

interface ConsoleMessage {
  id: string
  type: 'log' | 'error' | 'warn' | 'info' | 'success' | 'system'
  content: string
  timestamp: Date
  source?: string
}

interface PackageInfo {
  name: string
  version: string
  description?: string
  size?: string
  installed: boolean
  loading?: boolean
}

interface EnhancedTerminalProps {
  onClose: () => void
  onMinimize: () => void
  className?: string
}

export function EnhancedTerminal({ onClose, onMinimize, className = '' }: EnhancedTerminalProps) {
  const [activeTab, setActiveTab] = useState('terminal')
  const [command, setCommand] = useState('')
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'MrrKit Enhanced Terminal v1.0.0',
      timestamp: new Date(),
      source: 'system'
    },
    {
      id: '2', 
      type: 'info',
      content: 'Type "help" for available commands or use the Package Manager tab for dependencies',
      timestamp: new Date(),
      source: 'system'
    }
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [packages, setPackages] = useState<PackageInfo[]>([
    { name: 'react', version: '18.2.0', description: 'A JavaScript library for building user interfaces', size: '42.2kB', installed: true },
    { name: 'react-dom', version: '18.2.0', description: 'React package for working with the DOM', size: '130.2kB', installed: true },
    { name: 'tailwindcss', version: '3.3.0', description: 'A utility-first CSS framework', size: '15.1kB', installed: true }
  ])
  const [packageSearch, setPackageSearch] = useState('')
  const [searchResults, setSearchResults] = useState<PackageInfo[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (inputRef.current && activeTab === 'terminal') {
      inputRef.current.focus()
    }
  }, [activeTab])

  const addMessage = useCallback((type: ConsoleMessage['type'], content: string, source = 'terminal') => {
    const message: ConsoleMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      source
    }
    setMessages(prev => [...prev, message])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const executeCommand = useCallback(async (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    addMessage('system', `$ ${trimmedCmd}`)
    setCommandHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    const args = trimmedCmd.split(' ')
    const baseCmd = args[0].toLowerCase()

    switch (baseCmd) {
      case 'help':
        addMessage('info', 'Available commands:')
        addMessage('info', '  help          - Show this help message')
        addMessage('info', '  clear         - Clear terminal output')
        addMessage('info', '  ls            - List current files')
        addMessage('info', '  pwd           - Show current directory')
        addMessage('info', '  cat <file>    - Display file contents')
        addMessage('info', '  npm install   - Install packages (use Package Manager)')
        addMessage('info', '  npm run <script> - Run package scripts')
        addMessage('info', '  test          - Run tests')
        addMessage('info', '  build         - Build project')
        addMessage('info', '  dev           - Start development server')
        addMessage('info', '  version       - Show version info')
        break

      case 'clear':
        clearMessages()
        return

      case 'ls':
        addMessage('info', 'src/')
        addMessage('info', 'components/')
        addMessage('info', 'lib/')
        addMessage('info', 'package.json')
        addMessage('info', 'tailwind.config.js')
        addMessage('info', 'next.config.js')
        addMessage('info', 'tsconfig.json')
        break

      case 'pwd':
        addMessage('info', '/workspace/mrrkit-project')
        break

      case 'cat':
        if (args[1]) {
          addMessage('info', `Contents of ${args[1]}:`)
          if (args[1] === 'package.json') {
            addMessage('log', JSON.stringify({
              name: 'mrrkit-project',
              version: '1.0.0',
              dependencies: packages.filter(p => p.installed).reduce((acc, p) => {
                acc[p.name] = p.version
                return acc
              }, {} as Record<string, string>)
            }, null, 2))
          } else {
            addMessage('error', `File not found: ${args[1]}`)
          }
        } else {
          addMessage('error', 'Usage: cat <filename>')
        }
        break

      case 'npm':
        if (args[1] === 'install') {
          if (args[2]) {
            await handlePackageInstall(args[2])
          } else {
            addMessage('info', 'Installing all dependencies...')
            setTimeout(() => {
              addMessage('success', 'All dependencies installed successfully')
            }, 1000)
          }
        } else if (args[1] === 'run') {
          if (args[2]) {
            await handleNpmScript(args[2])
          } else {
            addMessage('error', 'Usage: npm run <script>')
          }
        } else {
          addMessage('error', 'Available npm commands: install, run')
        }
        break

      case 'test':
        addMessage('info', 'Running tests...')
        setTimeout(() => {
          addMessage('success', '✓ All tests passed (12/12)')
          addMessage('info', 'Test coverage: 94.2%')
        }, 2000)
        break

      case 'build':
        addMessage('info', 'Building project...')
        setTimeout(() => {
          addMessage('success', '✓ Build completed successfully')
          addMessage('info', 'Output: .next/ directory')
          addMessage('info', 'Bundle size: 245.3kB gzipped')
        }, 3000)
        break

      case 'dev':
        addMessage('info', 'Starting development server...')
        setTimeout(() => {
          addMessage('success', '✓ Development server started')
          addMessage('info', '🌐 Local: http://localhost:3000')
          addMessage('info', '⚡ Hot reload enabled')
        }, 1500)
        break

      case 'version':
        addMessage('info', 'MrrKit Terminal v1.0.0')
        addMessage('info', 'Node.js v18.17.0')
        addMessage('info', 'npm v9.6.7')
        break

      default:
        if (trimmedCmd.startsWith('echo ')) {
          addMessage('log', trimmedCmd.substring(5))
        } else if (trimmedCmd.startsWith('cd ')) {
          addMessage('info', `Changed directory to: ${trimmedCmd.substring(3)}`)
        } else {
          addMessage('error', `Command not found: ${baseCmd}`)
          addMessage('info', 'Type "help" for available commands')
        }
    }
  }, [addMessage, clearMessages, packages])

  const handlePackageInstall = async (packageName: string) => {
    addMessage('info', `Installing ${packageName}...`)
    
    // Simulate package installation
    setPackages(prev => prev.map(p => 
      p.name === packageName ? { ...p, loading: true } : p
    ))

    setTimeout(() => {
      setPackages(prev => prev.map(p => 
        p.name === packageName 
          ? { ...p, installed: true, loading: false }
          : p
      ))
      addMessage('success', `✓ ${packageName} installed successfully`)
    }, 2000)
  }

  const handleNpmScript = async (script: string) => {
    addMessage('info', `Running script: ${script}`)
    
    switch (script) {
      case 'dev':
        setTimeout(() => {
          addMessage('success', '✓ Development server started on http://localhost:3000')
        }, 1000)
        break
      case 'build':
        setTimeout(() => {
          addMessage('success', '✓ Build completed')
        }, 2000)
        break
      case 'test':
        setTimeout(() => {
          addMessage('success', '✓ Tests passed')
        }, 1500)
        break
      default:
        addMessage('error', `Script not found: ${script}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command)
      setCommand('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCommand('')
        } else {
          setHistoryIndex(newIndex)
          setCommand(commandHistory[newIndex])
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Basic auto-completion
      const commands = ['help', 'clear', 'ls', 'pwd', 'cat', 'npm', 'test', 'build', 'dev', 'version']
      const matches = commands.filter(cmd => cmd.startsWith(command.toLowerCase()))
      if (matches.length === 1) {
        setCommand(matches[0])
      }
    }
  }

  const searchPackages = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate package search
    const mockResults: PackageInfo[] = [
      { name: 'lodash', version: '4.17.21', description: 'A modern JavaScript utility library', size: '71kB', installed: false },
      { name: 'axios', version: '1.4.0', description: 'Promise based HTTP client', size: '15kB', installed: false },
      { name: 'moment', version: '2.29.4', description: 'Parse, validate, manipulate, and display dates', size: '67kB', installed: false },
      { name: 'uuid', version: '9.0.0', description: 'RFC4122 UUIDs', size: '5kB', installed: false }
    ].filter(pkg => pkg.name.toLowerCase().includes(query.toLowerCase()))

    setTimeout(() => {
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 500)
  }

  const installPackage = async (pkg: PackageInfo) => {
    setPackages(prev => [...prev, { ...pkg, installed: true, loading: false }])
    setSearchResults(prev => prev.map(p => p.name === pkg.name ? { ...p, installed: true } : p))
    addMessage('success', `✓ ${pkg.name}@${pkg.version} installed`)
  }

  const uninstallPackage = (packageName: string) => {
    setPackages(prev => prev.filter(p => p.name !== packageName))
    addMessage('info', `Uninstalled ${packageName}`)
  }

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warn': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      case 'system': return <TerminalIcon className="w-4 h-4 text-purple-500" />
      default: return <div className="w-4 h-4" />
    }
  }

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400'
      case 'warn': return 'text-yellow-400'
      case 'success': return 'text-green-400'
      case 'info': return 'text-blue-400'
      case 'system': return 'text-purple-400'
      default: return 'text-gray-300'
    }
  }

  return (
    <div className={`bg-gray-900 text-gray-100 font-mono text-sm flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">Enhanced Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={onMinimize}
          >
            <Minimize className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-red-600"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-b border-gray-700">
          <TabsTrigger value="terminal" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <TerminalIcon className="w-4 h-4 mr-2" />
            Terminal
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="console" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <Play className="w-4 h-4 mr-2" />
            Console
          </TabsTrigger>
        </TabsList>

        {/* Terminal Tab */}
        <TabsContent value="terminal" className="flex-1 flex flex-col p-0 m-0">
          <div 
            ref={terminalRef}
            className="flex-1 p-4 overflow-auto bg-gray-900 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-2 mb-2">
                {getMessageIcon(message.type)}
                <div className="flex-1">
                  <div className={`${getMessageColor(message.type)} leading-relaxed whitespace-pre-wrap`}>
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Command Input */}
          <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700">
            <span className="text-green-400 mr-2 select-none">$</span>
            <Input
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none text-green-400 p-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              placeholder="Type a command..."
            />
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="flex-1 flex flex-col p-4 m-0">
          <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search packages (e.g., lodash, axios)"
                  value={packageSearch}
                  onChange={(e) => {
                    setPackageSearch(e.target.value)
                    searchPackages(e.target.value)
                  }}
                  className="bg-gray-800 border-gray-600 text-gray-100"
                />
              </div>
              
              {isSearching && (
                <div className="flex items-center gap-2 text-gray-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching packages...</span>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Search Results</h3>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {searchResults.map((pkg) => (
                    <div key={pkg.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-200">{pkg.name}</span>
                          <Badge variant="secondary" className="text-xs">{pkg.version}</Badge>
                          <span className="text-xs text-gray-400">{pkg.size}</span>
                        </div>
                        {pkg.description && (
                          <p className="text-xs text-gray-400 mt-1">{pkg.description}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => installPackage(pkg)}
                        disabled={pkg.installed}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {pkg.installed ? 'Installed' : 'Install'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Installed Packages */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">Installed Packages</h3>
                <Badge variant="outline" className="text-xs">
                  {packages.filter(p => p.installed).length} packages
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-auto">
                {packages.filter(p => p.installed).map((pkg) => (
                  <div key={pkg.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-200">{pkg.name}</span>
                        <Badge variant="secondary" className="text-xs">{pkg.version}</Badge>
                        <span className="text-xs text-gray-400">{pkg.size}</span>
                      </div>
                      {pkg.description && (
                        <p className="text-xs text-gray-400 mt-1">{pkg.description}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => uninstallPackage(pkg.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Console Tab */}
        <TabsContent value="console" className="flex-1 flex flex-col p-4 m-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">Live Console Output</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearMessages}
              className="text-gray-400 hover:text-white"
            >
              Clear
            </Button>
          </div>
          
          <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-auto">
            <div className="text-center text-gray-500 py-8">
              <Play className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Live console output from your preview will appear here</p>
              <p className="text-xs mt-2">console.log, errors, and warnings will be captured</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
