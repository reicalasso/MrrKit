'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Minimize, Square, Terminal as TerminalIcon } from 'lucide-react'

interface TerminalProps {
  onClose: () => void
  onMinimize: () => void
}

export function Terminal({ onClose, onMinimize }: TerminalProps) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([
    '$ Welcome to MrrKit Terminal',
    '$ Type "help" for available commands',
    ''
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal becomes visible
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    const newHistory = [...history, `$ ${trimmedCmd}`]
    
    // Basit komutlar
    switch (trimmedCmd.toLowerCase()) {
      case 'help':
        newHistory.push('Available commands:')
        newHistory.push('  clear    - Clear terminal')
        newHistory.push('  help     - Show this help')
        newHistory.push('  ls       - List files')
        newHistory.push('  pwd      - Show current directory')
        newHistory.push('  date     - Show current date')
        newHistory.push('  echo     - Echo text')
        newHistory.push('  version  - Show MrrKit version')
        newHistory.push('  whoami   - Current user info')
        break
      
      case 'clear':
        setHistory(['$ Welcome to MrrKit Terminal', ''])
        setCommand('')
        return
      
      case 'ls':
        newHistory.push('src/')
        newHistory.push('components/')
        newHistory.push('lib/')
        newHistory.push('package.json')
        newHistory.push('README.md')
        newHistory.push('tailwind.config.js')
        newHistory.push('next.config.js')
        break
      
      case 'pwd':
        newHistory.push('/workspaces/MrrKit')
        break
      
      case 'date':
        newHistory.push(new Date().toString())
        break

      case 'version':
        newHistory.push('MrrKit v1.0.0 - AI-Powered Development Platform')
        break

      case 'whoami':
        newHistory.push('developer@mrrkit')
        break
      
      default:
        if (trimmedCmd.startsWith('echo ')) {
          newHistory.push(trimmedCmd.substring(5))
        } else if (trimmedCmd.startsWith('cd ')) {
          newHistory.push(`cd: ${trimmedCmd.substring(3)}: No such file or directory`)
        } else {
          newHistory.push(`Command not found: ${trimmedCmd}`)
          newHistory.push('Type "help" for available commands')
        }
    }
    
    newHistory.push('')
    setHistory(newHistory)
    setCommandHistory([...commandHistory, trimmedCmd])
    setCommand('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command)
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
      // Basic tab completion
      const commands = ['help', 'clear', 'ls', 'pwd', 'date', 'echo', 'version', 'whoami']
      const matches = commands.filter(cmd => cmd.startsWith(command.toLowerCase()))
      if (matches.length === 1) {
        setCommand(matches[0])
      }
    }
  }

  return (
    <div className="bg-gray-900 text-green-400 font-mono text-sm flex flex-col h-full">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-xs text-gray-300">Terminal - /workspaces/MrrKit</span>
        </div>
        <div className="flex gap-1">
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

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-auto bg-gray-900 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        
        {/* Command Input */}
        <div className="flex items-center mt-1">
          <span className="text-green-400 mr-2 select-none">$</span>
          <Input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-green-400 p-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
