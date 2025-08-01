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
  Minimize2
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

// Constants
const SIDEBAR_MIN_WIDTH = 280
const SIDEBAR_MAX_WIDTH = 400
const SIDEBAR_DEFAULT_WIDTH = 320

export default function WorkspacePage() {
  // State
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSharingPanel, setShowSharingPanel] = useState(false)
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)

  // Store
  const {
    files,
    openFiles,
    activeFileId,
    sidebarOpen,
    terminalOpen: showTerminal,
    previewMode: viewMode,
    currentProject,
    setFiles,
    addOpenFile,
    removeOpenFile,
    setActiveFile,
    setSidebarOpen,
    setTerminalOpen: setShowTerminal,
    setPreviewMode: setViewMode,
    updateFile,
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

  // Sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = e.clientX
      if (newWidth >= SIDEBAR_MIN_WIDTH && newWidth <= SIDEBAR_MAX_WIDTH) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    if (isResizing) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

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

    // Short delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

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
      default: return 'javascript'
    }
  }

  // File creation
  const createFile = useCallback((name: string, type: 'file' | 'folder', parentId?: string) => {
    const newFile = {
      id: Date.now().toString(),
      name,
      type: type as 'file' | 'folder',
      content: type === 'file' ? '' : undefined,
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

  // Sidebar resize handler
  const handleStartResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
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

  // Loading state until mounted
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <img
              src="/favicon.ico"
              alt="MrrKit Logo"
              className="w-8 h-8 object-contain animate-pulse"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">MrrKit Workspace</h2>
          <p className="text-gray-600 mb-4">Loading your workspace...</p>
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
      className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30"
    >
      {/* Workspace Header */}
      <header className="h-14 bg-white border-b border-gray-200/80 shadow-sm flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-lg"
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
              <p className="text-xs text-gray-500">{currentProject?.name || 'AI Development'}</p>
            </div>
          </div>
        </div>
        
        {/* Active File Indicator */}
        {activeFile && (
          <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200/80">
            <FileText className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-sm text-gray-700 truncate max-w-[200px]">{activeFile.name}</span>
            {activeFile.isDirty && (
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
            )}
          </div>
        )}
        
        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-44 text-sm border-gray-200 rounded-lg"
              />
            </div>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-lg"
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
                  className="h-9 w-9 p-0 rounded-lg"
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
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
              Connected
            </Badge>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-lg"
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

      {/* Main Workspace Area */}
      <div 
        className="flex-1 flex overflow-hidden"
        {...(isMobile ? {
          onTouchStart: swipeHandlers.onTouchStart,
          onTouchMove: swipeHandlers.onTouchMove,
          onTouchEnd: swipeHandlers.onTouchEnd
        } : {})}
      >
        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          className={`
            ${isMobile 
              ? `fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-out ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-72 max-w-[85vw]`
              : `relative transition-width duration-300 ease-out ${
                  leftPanelCollapsed ? 'w-0 opacity-0' : ''
                }`
            }
            bg-white border-r border-gray-200 flex flex-col
          `}
          style={{
            width: isMobile ? undefined : (leftPanelCollapsed ? 0 : sidebarWidth),
            visibility: leftPanelCollapsed ? 'hidden' : 'visible'
          }}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
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
              ref={resizeRef}
              className="absolute top-0 right-0 w-1 h-full bg-transparent hover:bg-indigo-400 cursor-col-resize z-10 group"
              onMouseDown={handleStartResize}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-16 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>
          )}
        </div>

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
          <div className="h-10 border-b border-gray-200 bg-gray-50/80 flex-shrink-0">
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

          {/* View Controls */}
          <div className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center gap-1">
              {/* View Mode Buttons */}
              <Button
                size="sm"
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                onClick={() => setViewMode('code')}
                className="h-7 px-2.5 text-xs rounded-md"
              >
                <Code className="h-3 w-3 mr-1.5" />
                Code
              </Button>
              
              <Button
                size="sm"
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                onClick={() => setViewMode('preview')}
                className="h-7 px-2.5 text-xs rounded-md"
              >
                <Eye className="h-3 w-3 mr-1.5" />
                Preview
              </Button>
              
              {!isMobile && (
                <Button
                  size="sm"
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('split')}
                  className="h-7 px-2.5 text-xs rounded-md"
                >
                  <Code className="h-3 w-3 mr-1" />
                  Split
                </Button>
              )}
              
              <Button
                size="sm"
                variant={viewMode === 'builder' ? 'default' : 'ghost'}
                onClick={() => setViewMode('builder')}
                className="h-7 px-2.5 text-xs rounded-md"
              >
                <Palette className="h-3 w-3 mr-1.5" />
                Builder
              </Button>
              
              <Button
                size="sm"
                variant={viewMode === 'store' ? 'default' : 'ghost'}
                onClick={() => setViewMode('store')}
                className="h-7 px-2.5 text-xs rounded-md"
              >
                <Package className="h-3 w-3 mr-1.5" />
                Store
              </Button>
              
              <div className="h-4 border-l border-gray-200 mx-1"></div>
              
              {/* Terminal Toggle */}
              <Button
                size="sm"
                variant={showTerminal ? "default" : "ghost"}
                onClick={() => setShowTerminal(!showTerminal)}
                className="h-7 px-2.5 text-xs rounded-md"
              >
                <TerminalIcon className="h-3 w-3 mr-1.5" />
                Terminal
              </Button>
            </div>
            
            {/* File Info */}
            {activeFile && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-gray-50">
                  {activeFile.language}
                </Badge>
                
                {isMobile && activeFile.isDirty && (
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                )}
              </div>
            )}
          </div>
          
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
                  <div className={`${viewMode === 'split' && !isMobile ? 'w-1/2' : 'w-full'} border-r border-gray-200 overflow-hidden`}>
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
                                : 'javascript'
                            }
                            onSave={() => {
                              console.log('File saved:', activeFile.name)
                            }}
                            options={{
                              minimap: { enabled: !isMobile },
                              fontSize: isMobile ? 13 : 14,
                              wordWrap: isMobile ? 'on' : 'off',
                              lineNumbers: 'on',
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                              tabSize: 2,
                              insertSpaces: true,
                            }}
                          />
                        </ErrorBoundary>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6 max-w-sm">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Code className="h-8 w-8 text-indigo-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-2 text-gray-800">No File Open</h3>
                          <p className="text-gray-500 mb-4 text-sm">
                            Select a file from the sidebar or create a new one to get started
                          </p>
                          <Button
                            onClick={() => createFile('newfile.js', 'file')}
                            size="sm"
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Create New File
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
                            language={
                              activeFile.name.endsWith('.html') ? 'html' : 'javascript'
                            }
                            onError={(error) => {
                              if (error) {
                                console.error('Preview error:', error)
                              }
                            }}
                          />
                        </ErrorBoundary>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6 max-w-sm">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Eye className="h-8 w-8 text-purple-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-2 text-gray-800">Preview Ready</h3>
                          <p className="text-gray-500 mb-4 text-sm">
                            Open a file to see the live preview of your code
                          </p>
                          <div className="text-xs text-gray-400 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                            Preview engine running
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
          {showTerminal && (
            <div className="h-64 border-t border-gray-200 flex-shrink-0 bg-gray-900">
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