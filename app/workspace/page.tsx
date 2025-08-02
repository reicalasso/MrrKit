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
  Download,
  X,
  Maximize2,
  Minimize2,
  Save,
  FolderOpen,
  Command,
  Zap,
  Bell,
  Moon,
  Sun,
  Monitor,
  Layers,
  Grid3X3,
  MoreHorizontal,
  ChevronDown,
  GitBranch,
  Cpu,
  HardDrive,
  Wifi,
  Menu,
  Bot
} from 'lucide-react'
import { MonacoEditor } from '@/components/code-editor/monaco-editor'
import { LivePreview } from '@/components/code-editor/live-preview'
import { FileExplorer, type FileNode } from '@/components/code-editor/file-explorer'
import { FileTabs } from '@/components/code-editor/file-tabs'
import { EnhancedTerminal } from '@/components/terminal/enhanced-terminal'
import { ErrorBoundary } from '@/components/error-boundary'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { LoadingOverlay } from '@/components/ui/loading'
import { AITrigger } from '@/components/ai-assistant/ai-trigger'
import { SharingPanel } from '@/components/sharing/sharing-panel'
import { ThemeSettings } from '@/components/theme/theme-settings'
import { UIBuilderPanel } from '@/components/ui-builder/ui-builder-panel'
import { ComponentStorePanel } from '@/components/component-store/component-store-panel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'info' | 'success' | 'warning' | 'error', message: string}>>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected')
  const [showMinimap, setShowMinimap] = useState(true)
  const [zenMode, setZenMode] = useState(false)
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [showViewMenu, setShowViewMenu] = useState(false)

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
      className={`h-full flex flex-col overflow-hidden bg-white ${zenMode ? 'zen-mode' : ''}`}
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
                    }
                  }}
                />
              </div>
            </div>
            <div className="max-h-96 overflow-auto p-4">
              <p className="text-center text-gray-500 text-sm">Commands will appear here</p>
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
          {/* Simplified Header */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
              >
                {(isMobile ? sidebarOpen : !leftPanelCollapsed) ? 
                  <PanelLeftClose className="h-4 w-4" /> : 
                  <PanelLeftOpen className="h-4 w-4" />
                }
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <img src="/favicon.ico" alt="MrrKit" className="w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-base font-semibold text-gray-800">MrrKit</h1>
                  <p className="text-xs text-gray-500">{currentProject?.name || 'Workspace'}</p>
                </div>
              </div>
            </div>

            {/* Quick Search */}
            {!isMobile && (
              <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search files... (Ctrl+P)"
                    className="pl-10 h-9"
                    onFocus={() => setShowCommandPalette(true)}
                  />
                </div>
              </div>
            )}
            
            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                connectionStatus === 'connected' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <Wifi className="h-3 w-3" />
                <span className="hidden sm:inline">{connectionStatus}</span>
              </div>

              {/* AI Assistant */}
              <AITrigger />

              {/* Tools Menu */}
              <Dialog open={showToolsMenu} onOpenChange={setShowToolsMenu}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Package className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Developer Tools</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setViewMode('builder')
                        setShowToolsMenu(false)
                      }}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      UI Builder
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setViewMode('store')
                        setShowToolsMenu(false)
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Component Store
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowTerminal(!showTerminal)}
                    >
                      <TerminalIcon className="h-4 w-4 mr-2" />
                      Terminal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* View Menu */}
              <Dialog open={showViewMenu} onOpenChange={setShowViewMenu}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>View Options</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={viewMode === 'code' ? 'default' : 'outline'}
                        onClick={() => {
                          setViewMode('code')
                          setShowViewMenu(false)
                        }}
                      >
                        <Code className="h-4 w-4 mr-1" />
                        Code
                      </Button>
                      <Button
                        variant={viewMode === 'preview' ? 'default' : 'outline'}
                        onClick={() => {
                          setViewMode('preview')
                          setShowViewMenu(false)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                    {!isMobile && (
                      <Button
                        variant={viewMode === 'split' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => {
                          setViewMode('split')
                          setShowViewMenu(false)
                        }}
                      >
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        Split View
                      </Button>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Minimap</span>
                      <Button
                        variant={showMinimap ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowMinimap(!showMinimap)}
                      >
                        {showMinimap ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zen Mode</span>
                      <Button
                        variant={zenMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setZenMode(!zenMode)}
                      >
                        {zenMode ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setShowSharingPanel(true)}
              >
                <Share className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setShowThemeSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Status Bar */}
          <div className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <span>Ready</span>
              {activeFile && <span>{activeFile.language?.toUpperCase()}</span>}
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                85%
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                2.1GB
              </span>
            </div>
          </div>
        </>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!zenMode && (
          <div 
            className={`
              ${isMobile 
                ? `fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  } w-80`
                : `relative transition-all duration-300 ${
                    leftPanelCollapsed ? 'w-0' : `w-[${sidebarWidth}px]`
                  }`
              }
              bg-white border-r border-gray-200 flex flex-col
            `}
          >
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
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <LoadingOverlay
          isLoading={isLoadingFile}
          message={loadingMessage}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* File Tabs */}
          {!zenMode && openFiles.length > 0 && (
            <div className="h-10 border-b border-gray-200 bg-gray-50">
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

          {/* Editor Quick Actions (only when file is open) */}
          {!zenMode && activeFile && (
            <div className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {activeFile.language}
                </Badge>
                {activeFile.isDirty && (
                  <Badge variant="secondary" className="text-xs">
                    Unsaved
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateFile(activeFile.id, { isDirty: false })}
                  disabled={!activeFile.isDirty}
                  className="h-7 px-2 text-xs"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          )}
          
          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
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
                  <div className={`${viewMode === 'split' && !isMobile ? 'w-1/2 border-r border-gray-200' : 'w-full'} overflow-hidden bg-white`}>
                    {activeFile ? (
                      <div className="h-full">
                        <ErrorBoundary>
                          <MonacoEditor
                            key={activeFile.id}
                            value={activeFile.content || ''}
                            onChange={(value) => updateFileContent(activeFile.id, value)}
                            language={getLanguageFromExtension(activeFile.name)}
                            theme={theme.mode === 'dark' ? 'dark' : 'light'}
                            options={{
                              minimap: { enabled: showMinimap && !isMobile },
                              fontSize: theme.fontSize,
                              wordWrap: isMobile ? 'on' : 'off',
                              automaticLayout: true
                            }}
                            onSave={() => {
                              updateFile(activeFile.id, { isDirty: false })
                              addNotification('success', `Saved ${activeFile.name}`)
                            }}
                          />
                        </ErrorBoundary>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6">
                          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Welcome to MrrKit</h3>
                          <p className="text-gray-500 mb-4">Open a file to start coding</p>
                          <Button
                            onClick={() => createFile('index.jsx', 'file')}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            New File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Live Preview */}
                {(viewMode === 'preview' || (viewMode === 'split' && !isMobile)) && (
                  <div className={`${viewMode === 'split' && !isMobile ? 'w-1/2' : 'w-full'} bg-white overflow-hidden`}>
                    {activeFile?.content ? (
                      <div className="h-full">
                        <ErrorBoundary>
                          <LivePreview
                            code={activeFile.content}
                            language={activeFile.name.endsWith('.html') ? 'html' : 'javascript'}
                            onError={(error) => {
                              if (error) {
                                addNotification('error', `Preview Error: ${error.message}`)
                              }
                            }}
                          />
                        </ErrorBoundary>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6">
                          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Live Preview</h3>
                          <p className="text-gray-500">Your code will be rendered here</p>
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
              className="border-t border-gray-200 bg-gray-900"
              style={{ height: terminalHeight }}
            >
              <ErrorBoundary>
                <EnhancedTerminal
                  onClose={() => setShowTerminal(false)}
                  onMinimize={() => setShowTerminal(false)}
                />
              </ErrorBoundary>
            </div>
          )}
        </LoadingOverlay>
      </div>

      {/* Modals */}
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