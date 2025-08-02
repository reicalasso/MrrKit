'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSwipe } from '@/hooks/use-touch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Code,
  Eye,
  Settings,
  Share,
  Terminal as TerminalIcon,
  FileText,
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Package,
  Sparkles,
  Download,
  GitBranch,
  X,
  RefreshCw,
  Maximize2,
  Minimize2,
  Play,
  Square,
  RotateCcw,
  Save,
  FolderOpen,
  Command,
  Zap,
  Globe,
  Users,
  Bell,
  Moon,
  Sun,
  Monitor,
  Layers,
  Grid3X3,
  MoreHorizontal,
  ChevronDown,
  Filter,
  SortAsc,
  Bookmark,
  History,
  GitCommit,
  Database,
  Cloud,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react'
import { MonacoEditor } from '@/components/code-editor/monaco-editor'
import { LivePreview } from '@/components/code-editor/live-preview'
import { FileExplorer, type FileNode } from '@/components/code-editor/file-explorer'
import { FileTabs } from '@/components/code-editor/file-tabs'
import { EnhancedTerminal } from '@/components/terminal/enhanced-terminal'
import { ErrorBoundary } from '@/components/error-boundary'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { LoadingOverlay } from '@/components/ui/loading'
import { AIPanel } from '@/components/ai-assistant/ai-panel'
import { SharingPanel } from '@/components/sharing/sharing-panel'
import { ThemeSettings } from '@/components/theme/theme-settings'
import { UIBuilderPanel } from '@/components/ui-builder/ui-builder-panel'
import { ComponentStorePanel } from '@/components/component-store/component-store-panel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// Constants
const SIDEBAR_MIN_WIDTH = 280
const SIDEBAR_MAX_WIDTH = 500
const SIDEBAR_DEFAULT_WIDTH = 320
const PANEL_MIN_HEIGHT = 200
const PANEL_MAX_HEIGHT = 600

export default function WorkspacePage() {
  // State
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSharingPanel, setShowSharingPanel] = useState(false)
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [terminalHeight, setTerminalHeight] = useState(250)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeType, setResizeType] = useState<'sidebar' | 'terminal' | null>(null)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'info' | 'success' | 'warning' | 'error', message: string}>>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected')
  const [activeRightPanel, setActiveRightPanel] = useState<'outline' | 'problems' | 'extensions' | 'git'>('outline')
  const [showMinimap, setShowMinimap] = useState(true)
  const [editorLayout, setEditorLayout] = useState<'horizontal' | 'vertical'>('horizontal')
  const [zenMode, setZenMode] = useState(false)

  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const commandPaletteRef = useRef<HTMLInputElement>(null)

  // Store
  const {
    files,
    openFiles,
    activeFileId,
    sidebarOpen,
    terminalOpen: showTerminal,
    previewMode: viewMode,
    currentProject,
    theme,
    setFiles,
    addOpenFile,
    removeOpenFile,
    setActiveFile,
    setSidebarOpen,
    setTerminalOpen: setShowTerminal,
    setPreviewMode: setViewMode,
    updateFile,
    updateTheme,
  } = useWorkspaceStore()

  // Find active file
  const findFileInTree = (fileList: any[], targetId: string | null): any => {
    if (!targetId) return null
    for (const file of fileList) {
      if (file.id === targetId) return file
      if (file.children) {
        const found = findFileInTree(file.children, targetId)
        if (found) return found
      }
    }
    return null
  }

  const activeFile = findFileInTree(files, activeFileId)

  // Initialize and handle device detection
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setSidebarOpen, sidebarOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      
      // Quick Open
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      
      // Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
      
      // Toggle Terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        setShowTerminal(!showTerminal)
      }
      
      // Save File
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (activeFile) {
          updateFile(activeFile.id, { isDirty: false })
          addNotification('success', `Saved ${activeFile.name}`)
        }
      }
      
      // Close File
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault()
        if (activeFileId) {
          removeOpenFile(activeFileId)
        }
      }
      
      // New File
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        createFile('untitled.js', 'file')
      }
      
      // Zen Mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && e.shiftKey) {
        e.preventDefault()
        setZenMode(!zenMode)
      }
      
      // Theme Toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !e.shiftKey) {
        e.preventDefault()
        updateTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showTerminal, activeFile, activeFileId, zenMode, theme.mode])

  // Command Palette
  useEffect(() => {
    if (showCommandPalette && commandPaletteRef.current) {
      commandPaletteRef.current.focus()
    }
  }, [showCommandPalette])

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      workspaceRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Notifications
  const addNotification = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  // Sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      if (resizeType === 'sidebar') {
        const newWidth = e.clientX
        if (newWidth >= SIDEBAR_MIN_WIDTH && newWidth <= SIDEBAR_MAX_WIDTH) {
          setSidebarWidth(newWidth)
        }
      } else if (resizeType === 'terminal') {
        const rect = workspaceRef.current?.getBoundingClientRect()
        if (rect) {
          const newHeight = rect.bottom - e.clientY
          if (newHeight >= PANEL_MIN_HEIGHT && newHeight <= PANEL_MAX_HEIGHT) {
            setTerminalHeight(newHeight)
          }
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeType(null)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    if (isResizing) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = resizeType === 'sidebar' ? 'col-resize' : 'row-resize'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeType])

  // Mobile view mode handling
  useEffect(() => {
    if (mounted && isMobile && viewMode === 'split') {
      setViewMode('preview')
    }
  }, [isMobile, viewMode, mounted, setViewMode])

  // File Operations
  const findFileById = useCallback((id: string, nodes: FileNode[] = files): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findFileById(id, node.children)
        if (found) return found
      }
    }
    return null
  }, [files])

  const updateFileContent = useCallback((fileId: string, content: string) => {
    updateFile(fileId, { content, isDirty: true })
  }, [updateFile])

  const handleFileSelect = useCallback(async (file: any) => {
    setIsLoadingFile(true)
    setLoadingMessage(`Opening ${file.name}...`)

    await new Promise(resolve => setTimeout(resolve, 200))

    setActiveFile(file.id)
    addOpenFile(file)
    if (isMobile) {
      setSidebarOpen(false)
    }

    setIsLoadingFile(false)
  }, [setActiveFile, addOpenFile, isMobile, setSidebarOpen])

  const handleFileClose = useCallback((fileId: string) => {
    removeOpenFile(fileId)
  }, [removeOpenFile])

  const handleCloseAll = useCallback(() => {
    openFiles.forEach(file => removeOpenFile(file.id))
  }, [openFiles, removeOpenFile])

  const handleCloseOthers = useCallback((keepFileId: string) => {
    openFiles.forEach(file => {
      if (file.id !== keepFileId) {
        removeOpenFile(file.id)
      }
    })
  }, [openFiles, removeOpenFile])

  const getLanguageFromExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js': case 'jsx': return 'javascript'
      case 'ts': case 'tsx': return 'typescript'
      case 'css': return 'css'
      case 'html': return 'html'
      case 'json': return 'json'
      case 'md': return 'markdown'
      case 'py': return 'python'
      case 'java': return 'java'
      case 'cpp': case 'c': return 'cpp'
      case 'rs': return 'rust'
      case 'go': return 'go'
      case 'php': return 'php'
      case 'sql': return 'sql'
      case 'yml': case 'yaml': return 'yaml'
      default: return 'javascript'
    }
  }

  // File creation
  const createFile = useCallback((name: string, type: 'file' | 'folder', parentId?: string) => {
    const newFile = {
      id: Date.now().toString(),
      name,
      type: type as 'file' | 'folder',
      content: type === 'file' ? getFileTemplate(name) : undefined,
      children: type === 'folder' ? [] : undefined,
      parent: parentId,
      language: type === 'file' ? getLanguageFromExtension(name) : undefined,
      isDirty: false
    }

    if (!parentId) {
      setFiles([...files, newFile])
      if (type === 'file') {
        setActiveFile(newFile.id)
        addOpenFile(newFile)
      }
    } else {
      const addToNode = (nodes: any[]): any[] => {
        return nodes.map(node => {
          if (node.id === parentId && node.children) {
            return { ...node, children: [...node.children, newFile] }
          }
          if (node.children) {
            return { ...node, children: addToNode(node.children) }
          }
          return node
        })
      }
      setFiles(addToNode(files))
      if (type === 'file') {
        setActiveFile(newFile.id)
        addOpenFile(newFile)
      }
    }
  }, [files, setFiles, setActiveFile, addOpenFile])

  const getFileTemplate = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const baseName = filename.split('.')[0]
    
    switch (ext) {
      case 'jsx':
        return `import React from 'react';

export default function ${baseName}() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${baseName}</h1>
      <p>Welcome to your new component!</p>
    </div>
  );
}`
      case 'tsx':
        return `import React from 'react';

interface ${baseName}Props {
  // Add your props here
}

export default function ${baseName}({}: ${baseName}Props) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${baseName}</h1>
      <p>Welcome to your new TypeScript component!</p>
    </div>
  );
}`
      case 'css':
        return `/* ${filename} */
.${baseName.toLowerCase()} {
  /* Add your styles here */
}`
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${baseName}</title>
</head>
<body>
    <h1>Hello, ${baseName}!</h1>
</body>
</html>`
      case 'json':
        return `{
  "name": "${baseName}",
  "version": "1.0.0"
}`
      case 'md':
        return `# ${baseName}

Welcome to your new markdown file!

## Getting Started

Start writing your documentation here.`
      default:
        return `// ${filename}
console.log('Hello from ${baseName}!');`
    }
  }

  const deleteFile = useCallback((fileId: string) => {
    const removeFromNodes = (nodes: any[]): any[] => {
      return nodes.filter(node => {
        if (node.id === fileId) return false
        if (node.children) {
          node.children = removeFromNodes(node.children)
        }
        return true
      })
    }

    setFiles(removeFromNodes(files))
    removeOpenFile(fileId)
  }, [files, setFiles, removeOpenFile])

  const renameFile = useCallback((fileId: string, newName: string) => {
    const updateNode = (nodes: any[]): any[] => {
      return nodes.map(node => {
        if (node.id === fileId) {
          return { ...node, name: newName, language: getLanguageFromExtension(newName) }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }

    setFiles(updateNode(files))
  }, [files, setFiles])

  const downloadFile = useCallback((file: FileNode) => {
    if (file.type === 'file' && file.content) {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [])

  // Resize handlers
  const handleStartResize = useCallback((e: React.MouseEvent, type: 'sidebar' | 'terminal') => {
    e.preventDefault()
    setIsResizing(true)
    setResizeType(type)
  }, [])

  // Sidebar toggle
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setLeftPanelCollapsed(!leftPanelCollapsed)
    }
  }, [isMobile, sidebarOpen, leftPanelCollapsed, setSidebarOpen])

  // Mobile swipe handlers
  const swipeHandlers = useSwipe(
    useCallback(
      ({ direction, distance, velocity }: { direction: string; distance: number; velocity: number }) => {
        if (!isMobile) return

        if (direction === 'right' && distance > 100 && velocity > 0.5) {
          if (!sidebarOpen) {
            setSidebarOpen(true)
          }
        } else if (direction === 'left' && distance > 100 && velocity > 0.5) {
          if (sidebarOpen) {
            setSidebarOpen(false)
          }
        } else if (direction === 'up' && distance > 80 && velocity > 0.4) {
          setShowTerminal(true)
        } else if (direction === 'down' && distance > 80 && velocity > 0.4) {
          setShowTerminal(false)
        }
      },
      [isMobile, sidebarOpen, setSidebarOpen, setShowTerminal]
    ),
    100,
    0.3
  )

  // Command Palette Commands
  const commands = [
    { id: 'new-file', label: 'New File', shortcut: 'Ctrl+N', action: () => createFile('untitled.js', 'file') },
    { id: 'save', label: 'Save File', shortcut: 'Ctrl+S', action: () => activeFile && updateFile(activeFile.id, { isDirty: false }) },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: toggleSidebar },
    { id: 'toggle-terminal', label: 'Toggle Terminal', shortcut: 'Ctrl+`', action: () => setShowTerminal(!showTerminal) },
    { id: 'zen-mode', label: 'Toggle Zen Mode', shortcut: 'Ctrl+K Shift', action: () => setZenMode(!zenMode) },
    { id: 'theme-toggle', label: 'Toggle Theme', shortcut: 'Ctrl+K', action: () => updateTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' }) },
    { id: 'fullscreen', label: 'Toggle Fullscreen', shortcut: 'F11', action: toggleFullscreen },
  ]

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Loading state until mounted
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 animate-pulse">
            <img
              src="/favicon.ico"
              alt="MrrKit Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">MrrKit Workspace</h2>
          <p className="text-gray-600 mb-4">Loading your professional workspace...</p>
          <div className="w-48 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-1/3 animate-[progress_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={workspaceRef}
      className={`h-full flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 ${zenMode ? 'zen-mode' : ''}`}
    >
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Command className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={commandPaletteRef}
                  placeholder="Type a command or search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 focus:ring-0 text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowCommandPalette(false)
                      setSearchTerm('')
                    } else if (e.key === 'Enter' && filteredCommands.length > 0) {
                      filteredCommands[0].action()
                      setShowCommandPalette(false)
                      setSearchTerm('')
                    }
                  }}
                />
              </div>
            </div>
            <div className="max-h-96 overflow-auto">
              {filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    command.action()
                    setShowCommandPalette(false)
                    setSearchTerm('')
                  }}
                >
                  <span className="font-medium">{command.label}</span>
                  <Badge variant="outline" className="text-xs">{command.shortcut}</Badge>
                </div>
              ))}
              {filteredCommands.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Command className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No commands found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg shadow-lg border backdrop-blur-sm animate-slide-in-right ${
              notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'error' ? 'bg-red-500' :
                notification.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      {!zenMode && (
        <>
          {/* Workspace Header */}
          <header className="h-14 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm flex items-center justify-between px-4 z-10 workspace-header">
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg workspace-button"
              >
                {(isMobile ? sidebarOpen : !leftPanelCollapsed) ? 
                  <PanelLeftClose className="h-4 w-4" /> : 
                  <PanelLeftOpen className="h-4 w-4" />
                }
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                  <img
                    src="/favicon.ico"
                    alt="MrrKit Logo"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-base font-semibold text-gray-800">MrrKit Workspace</h1>
                  <p className="text-xs text-gray-500">{currentProject?.name || 'Professional IDE'}</p>
                </div>
              </div>
            </div>
            
            {/* Breadcrumb & Active File */}
            {activeFile && (
              <div className="hidden lg:flex items-center gap-2 bg-gray-50/80 rounded-lg px-3 py-1.5 border border-gray-200/80 workspace-card">
                <FolderOpen className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-sm text-gray-600">src</span>
                <ChevronDown className="h-3 w-3 text-gray-400 rotate-[-90deg]" />
                <FileText className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">{activeFile.name}</span>
                {activeFile.isDirty && (
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                )}
              </div>
            )}
            
            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {!isMobile && (
                <div className="relative max-w-xs">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search files... (Ctrl+P)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowCommandPalette(true)}
                    className="pl-8 h-9 w-48 text-sm border-gray-200 rounded-lg workspace-input"
                  />
                </div>
              )}
              
              {/* Connection Status */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                      connectionStatus === 'connected' ? 'bg-green-50 text-green-700' :
                      connectionStatus === 'connecting' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {connectionStatus === 'connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                      <span className="hidden sm:inline">{connectionStatus}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Connection Status: {connectionStatus}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Git Status */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 px-2 rounded-lg workspace-button"
                    >
                      <GitBranch className="h-4 w-4 mr-1" />
                      <span className="text-xs">main</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Git Branch: main</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Notifications */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-lg workspace-button relative"
                    >
                      <Bell className="h-4 w-4" />
                      {notifications.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {notifications.length}
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-lg workspace-button"
                      onClick={() => setShowSharingPanel(true)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share Code</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-lg workspace-button"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {!isMobile && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                  Live
                </Badge>
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-lg workspace-button"
                      onClick={() => setShowThemeSettings(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </header>

          {/* Status Bar */}
          <div className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <GitCommit className="h-3 w-3" />
                main
              </span>
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Connected
              </span>
              <span className="flex items-center gap-1">
                <Cloud className="h-3 w-3" />
                Synced
              </span>
            </div>
            <div className="flex items-center gap-4">
              {activeFile && (
                <>
                  <span>Ln 1, Col 1</span>
                  <span>{activeFile.language?.toUpperCase()}</span>
                  <span>UTF-8</span>
                  <span>LF</span>
                </>
              )}
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                2.1 GHz
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                85%
              </span>
            </div>
          </div>
        </>
      )}

      {/* Main Workspace Area */}
      <div 
        className="flex-1 flex overflow-hidden"
        {...(isMobile ? {
          onTouchStart: swipeHandlers.onTouchStart,
          onTouchMove: swipeHandlers.onTouchMove,
          onTouchEnd: swipeHandlers.onTouchEnd
        } : {})}
      >
        {/* Left Sidebar */}
        {!zenMode && (
          <div 
            ref={sidebarRef}
            className={`
              ${isMobile 
                ? `fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  } w-80 max-w-[85vw]`
                : `relative transition-all duration-300 ease-out ${
                    leftPanelCollapsed ? 'w-0 opacity-0' : ''
                  }`
              }
              bg-white/95 backdrop-blur-xl border-r border-gray-200/60 flex flex-col workspace-sidebar
            `}
            style={{
              width: isMobile ? undefined : (leftPanelCollapsed ? 0 : sidebarWidth),
              visibility: leftPanelCollapsed ? 'hidden' : 'visible'
            }}
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="h-12 border-b border-gray-200/60 flex items-center bg-gray-50/50">
                <div className="flex w-full">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-12 rounded-none border-r border-gray-200/60 workspace-tab"
                    title="Explorer"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-12 rounded-none border-r border-gray-200/60 workspace-tab"
                    title="Search"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-12 rounded-none border-r border-gray-200/60 workspace-tab"
                    title="Git"
                  >
                    <GitBranch className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 h-12 rounded-none workspace-tab"
                    title="Extensions"
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* File Explorer */}
              <div className="flex-1 overflow-hidden">
                <ErrorBoundary>
                  <FileExplorer
                    files={files}
                    activeFileId={activeFile?.id}
                    onFileSelect={handleFileSelect}
                    onFileCreate={createFile}
                    onFileRename={renameFile}
                    onFileDelete={deleteFile}
                    onFileDownload={downloadFile}
                  />
                </ErrorBoundary>
              </div>
            </div>
            
            {/* Resize Handle */}
            {!isMobile && !leftPanelCollapsed && (
              <div
                className="absolute top-0 right-0 w-1 h-full bg-transparent hover:bg-indigo-400 cursor-col-resize z-10 group transition-colors"
                onMouseDown={(e) => handleStartResize(e, 'sidebar')}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-16 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Editor & Preview Area */}
        <LoadingOverlay
          isLoading={isLoadingFile}
          message={loadingMessage}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* File Tabs */}
          {!zenMode && (
            <div className="h-10 border-b border-gray-200/60 bg-gray-50/80 flex-shrink-0">
              <ErrorBoundary>
                <FileTabs
                  openFiles={openFiles}
                  activeFileId={activeFile?.id || null}
                  onFileSelect={handleFileSelect}
                  onFileClose={handleFileClose}
                  onFileCreate={createFile}
                  onCloseAll={handleCloseAll}
                  onCloseOthers={handleCloseOthers}
                  className="h-full"
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Editor Controls */}
          {!zenMode && (
            <div className="h-10 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-3 flex-shrink-0 workspace-header">
              <div className="flex items-center gap-1">
                {/* View Mode Buttons */}
                <Button
                  size="sm"
                  variant={viewMode === 'code' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('code')}
                  className="h-7 px-2.5 text-xs rounded-md workspace-button"
                >
                  <Code className="h-3 w-3 mr-1.5" />
                  Code
                </Button>
                
                <Button
                  size="sm"
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('preview')}
                  className="h-7 px-2.5 text-xs rounded-md workspace-button"
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  Preview
                </Button>
                
                {!isMobile && (
                  <Button
                    size="sm"
                    variant={viewMode === 'split' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('split')}
                    className="h-7 px-2.5 text-xs rounded-md workspace-button"
                  >
                    <Grid3X3 className="h-3 w-3 mr-1" />
                    Split
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant={viewMode === 'builder' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('builder')}
                  className="h-7 px-2.5 text-xs rounded-md workspace-button"
                >
                  <Palette className="h-3 w-3 mr-1.5" />
                  Builder
                </Button>
                
                <Button
                  size="sm"
                  variant={viewMode === 'store' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('store')}
                  className="h-7 px-2.5 text-xs rounded-md workspace-button"
                >
                  <Package className="h-3 w-3 mr-1.5" />
                  Store
                </Button>
                
                <Separator orientation="vertical" className="h-4 mx-2" />
                
                {/* Editor Options */}
                <Button
                  size="sm"
                  variant={showMinimap ? "default" : "ghost"}
                  onClick={() => setShowMinimap(!showMinimap)}
                  className="h-7 px-2.5 text-xs rounded-md workspace-button"
                >
                  <Layers className="h-3 w-3 mr-1" />
                  Minimap
                </Button>

                <Select value={editorLayout} onValueChange={(value: 'horizontal' | 'vertical') => setEditorLayout(value)}>
                  <SelectTrigger className="h-7 w-24 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                  </SelectContent>
                </Select>
                
                <Separator orientation="vertical" className="h-4 mx-2" />
                
                {/* Terminal Toggle */}
                <Button
                  size="sm"
                  variant={showTerminal ? "default" : "ghost"}
                  onClick={() => setShowTerminal(!showTerminal)}
                  className="h-7 px-2.5 text-xs rounded-md workspace-button"
                >
                  <TerminalIcon className="h-3 w-3 mr-1.5" />
                  Terminal
                </Button>

                {/* Zen Mode */}
                <Button
                  size="sm"
                  variant={zenMode ? "default" : "ghost"}
                  onClick={() => setZenMode(!zenMode)}
                  className="h-7 px-2.5 text-xs rounded-md workspace-button"
                  title="Zen Mode (Ctrl+K Shift)"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Zen
                </Button>
              </div>
              
              {/* File Actions */}
              {activeFile && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-gray-50 workspace-card">
                    {activeFile.language}
                  </Badge>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateFile(activeFile.id, { isDirty: false })}
                    disabled={!activeFile.isDirty}
                    className="h-7 px-2 text-xs workspace-button"
                    title="Save (Ctrl+S)"
                  >
                    <Save className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs workspace-button"
                    title="More Actions"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                  
                  {isMobile && activeFile.isDirty && (
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Content Area */}
          <div className={`flex-1 flex overflow-hidden ${editorLayout === 'vertical' ? 'flex-col' : 'flex-row'}`}>
            {viewMode === 'builder' ? (
              <div className="w-full h-full">
                <ErrorBoundary>
                  <UIBuilderPanel />
                </ErrorBoundary>
              </div>
            ) : viewMode === 'store' ? (
              <div className="w-full h-full">
                <ErrorBoundary>
                  <ComponentStorePanel />
                </ErrorBoundary>
              </div>
            ) : (
              <>
                {/* Code Editor */}
                {(viewMode === 'code' || (viewMode === 'split' && !isMobile)) && (
                  <div className={`${viewMode === 'split' && !isMobile ? (editorLayout === 'vertical' ? 'h-1/2' : 'w-1/2') : 'w-full'} ${editorLayout === 'vertical' ? 'border-b' : 'border-r'} border-gray-200/60 overflow-hidden bg-white workspace-panel`}>
                    {activeFile ? (
                      <div className="h-full">
                        <ErrorBoundary>
                          <MonacoEditor
                            key={activeFile.id}
                            value={activeFile.content || ''}
                            onChange={(value) => updateFileContent(activeFile.id, value)}
                            language={
                              activeFile.name.endsWith('.tsx') || activeFile.name.endsWith('.ts')
                                ? 'typescript'
                                : activeFile.name.endsWith('.css')
                                ? 'css'
                                : activeFile.name.endsWith('.html')
                                ? 'html'
                                : activeFile.name.endsWith('.json')
                                ? 'json'
                                : activeFile.name.endsWith('.md')
                                ? 'markdown'
                                : activeFile.name.endsWith('.py')
                                ? 'python'
                                : 'javascript'
                            }
                            theme={theme.mode === 'dark' ? 'vs-dark' : 'vs'}
                            onSave={() => {
                              updateFile(activeFile.id, { isDirty: false })
                              addNotification('success', `Saved ${activeFile.name}`)
                            }}
                            options={{
                              minimap: { enabled: showMinimap && !isMobile },
                              fontSize: theme.fontSize,
                              fontFamily: theme.fontFamily,
                              lineHeight: theme.lineHeight,
                              wordWrap: isMobile ? 'on' : 'off',
                              lineNumbers: 'on',
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                              tabSize: 2,
                              insertSpaces: true,
                              renderWhitespace: 'selection',
                              renderControlCharacters: true,
                              rulers: [80, 120],
                              bracketPairColorization: { enabled: true },
                              guides: {
                                bracketPairs: true,
                                indentation: true
                              },
                              suggest: {
                                showKeywords: true,
                                showSnippets: true,
                                showFunctions: true,
                                showConstructors: true,
                                showFields: true,
                                showVariables: true,
                                showClasses: true,
                                showStructs: true,
                                showInterfaces: true,
                                showModules: true,
                                showProperties: true,
                                showEvents: true,
                                showOperators: true,
                                showUnits: true,
                                showValues: true,
                                showConstants: true,
                                showEnums: true,
                                showEnumMembers: true,
                                showColors: true,
                                showFiles: true,
                                showReferences: true,
                                showFolders: true,
                                showTypeParameters: true,
                                showUsers: true,
                                showIssues: true
                              },
                              quickSuggestions: {
                                other: true,
                                comments: true,
                                strings: true
                              },
                              parameterHints: { enabled: true },
                              autoClosingBrackets: 'always',
                              autoClosingQuotes: 'always',
                              autoSurround: 'languageDefined',
                              formatOnPaste: true,
                              formatOnType: true,
                              folding: true,
                              foldingStrategy: 'indentation',
                              showFoldingControls: 'always',
                              unfoldOnClickAfterEndOfLine: true,
                              matchBrackets: 'always',
                              renderLineHighlight: 'all',
                              selectionHighlight: true,
                              occurrencesHighlight: true,
                              codeLens: true,
                              colorDecorators: true,
                              lightbulb: { enabled: true },
                              contextmenu: true,
                              mouseWheelZoom: true,
                              multiCursorModifier: 'ctrlCmd',
                              accessibilitySupport: 'auto',
                              find: {
                                seedSearchStringFromSelection: 'always',
                                autoFindInSelection: 'never',
                                globalFindClipboard: false,
                                addExtraSpaceOnTop: true
                              }
                            }}
                          />
                        </ErrorBoundary>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50/50">
                        <div className="text-center p-6 max-w-sm">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 workspace-card">
                            <Code className="h-8 w-8 text-indigo-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-2 text-gray-800">Welcome to MrrKit</h3>
                          <p className="text-gray-500 mb-4 text-sm">
                            Open a file from the explorer or create a new one to start coding
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => createFile('component.jsx', 'file')}
                              size="sm"
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 workspace-button"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1.5" />
                              New File
                            </Button>
                            <Button
                              onClick={() => setShowCommandPalette(true)}
                              size="sm"
                              variant="outline"
                              className="workspace-button"
                            >
                              <Command className="w-3.5 h-3.5 mr-1.5" />
                              Commands
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Live Preview */}
                {(viewMode === 'preview' || (viewMode === 'split' && !isMobile)) && (
                  <div className={`${viewMode === 'split' && !isMobile ? (editorLayout === 'vertical' ? 'h-1/2' : 'w-1/2') : 'w-full'} bg-white overflow-hidden workspace-panel`}>
                    {activeFile?.content ? (
                      <div className="h-full">
                        <ErrorBoundary>
                          <LivePreview
                            code={activeFile.content}
                            language={
                              activeFile.name.endsWith('.html') ? 'html' : 'javascript'
                            }
                            onError={(error) => {
                              if (error) {
                                addNotification('error', `Preview Error: ${error.message}`)
                              }
                            }}
                          />
                        </ErrorBoundary>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50/50">
                        <div className="text-center p-6 max-w-sm">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 workspace-card">
                            <Eye className="h-8 w-8 text-purple-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-2 text-gray-800">Live Preview</h3>
                          <p className="text-gray-500 mb-4 text-sm">
                            Your code will be rendered here in real-time
                          </p>
                          <div className="text-xs text-gray-400 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                            Preview engine ready
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && !zenMode && (
            <div 
              ref={terminalRef}
              className="border-t border-gray-200/60 flex-shrink-0 bg-gray-900 workspace-panel"
              style={{ height: terminalHeight }}
            >
              {/* Terminal Resize Handle */}
              <div
                className="h-1 bg-transparent hover:bg-indigo-400 cursor-row-resize transition-colors relative"
                onMouseDown={(e) => handleStartResize(e, 'terminal')}
              >
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-16 h-0.5 bg-indigo-400 scale-y-0 hover:scale-y-100 transition-transform"></div>
              </div>
              
              <div className="flex-1">
                <ErrorBoundary>
                  <EnhancedTerminal
                    onClose={() => setShowTerminal(false)}
                    onMinimize={() => setShowTerminal(false)}
                  />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </LoadingOverlay>

        {/* Right Panel */}
        {!zenMode && !isMobile && (
          <div className={`w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/60 flex flex-col workspace-sidebar transition-all duration-300 ${rightPanelCollapsed ? 'w-0 opacity-0' : ''}`}>
            {/* Right Panel Tabs */}
            <div className="h-12 border-b border-gray-200/60 flex items-center bg-gray-50/50">
              <div className="flex w-full">
                <Button
                  size="sm"
                  variant={activeRightPanel === 'outline' ? 'default' : 'ghost'}
                  onClick={() => setActiveRightPanel('outline')}
                  className="flex-1 h-12 rounded-none border-r border-gray-200/60 workspace-tab"
                  title="Outline"
                >
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeRightPanel === 'problems' ? 'default' : 'ghost'}
                  onClick={() => setActiveRightPanel('problems')}
                  className="flex-1 h-12 rounded-none border-r border-gray-200/60 workspace-tab"
                  title="Problems"
                >
                  <Zap className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeRightPanel === 'git' ? 'default' : 'ghost'}
                  onClick={() => setActiveRightPanel('git')}
                  className="flex-1 h-12 rounded-none border-r border-gray-200/60 workspace-tab"
                  title="Git"
                >
                  <GitBranch className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={activeRightPanel === 'extensions' ? 'default' : 'ghost'}
                  onClick={() => setActiveRightPanel('extensions')}
                  className="flex-1 h-12 rounded-none workspace-tab"
                  title="Extensions"
                >
                  <Package className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Panel Content */}
            <div className="flex-1 overflow-auto p-4 workspace-scroll">
              {activeRightPanel === 'outline' && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Outline</h3>
                  {activeFile ? (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        Functions, classes, and exports will appear here
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Open a file to see its outline</p>
                    </div>
                  )}
                </div>
              )}

              {activeRightPanel === 'problems' && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Problems</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      No problems detected
                    </div>
                  </div>
                </div>
              )}

              {activeRightPanel === 'git' && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Source Control</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Changes</span>
                      <Badge variant="outline" className="text-xs">0</Badge>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                      <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No changes</p>
                    </div>
                  </div>
                </div>
              )}

              {activeRightPanel === 'extensions' && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Extensions</h3>
                  <div className="space-y-2">
                    <div className="p-3 border border-gray-200 rounded-lg workspace-card">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">AI Assistant</span>
                      </div>
                      <p className="text-xs text-gray-600">Intelligent code completion and generation</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Panel */}
      <ErrorBoundary>
        <AIPanel />
      </ErrorBoundary>
      
      {/* Modals/Panels */}
      <SharingPanel
        isOpen={showSharingPanel}
        onClose={() => setShowSharingPanel(false)}
      />

      <ThemeSettings
        isOpen={showThemeSettings}
        onClose={() => setShowThemeSettings(false)}
      />
    </div>
  )
}