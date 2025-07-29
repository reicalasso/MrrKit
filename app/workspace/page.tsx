'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSwipe } from '@/hooks/use-touch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Wand2,
  Play,
  Code,
  Eye,
  Settings,
  Share,
  Menu,
  X,
  Smartphone,
  Monitor,
  Terminal as TerminalIcon,
  Sparkles,
  FileText,
  Folder,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Package,
  Zap,
  RefreshCw,
  Download,
  Upload,
  GitBranch,
  Users,
  Heart,
  Star
} from 'lucide-react'
import { MonacoEditor } from '@/components/code-editor/monaco-editor'
import { LivePreview } from '@/components/code-editor/live-preview'
import { FileExplorer, type FileNode } from '@/components/code-editor/file-explorer'
import { FileTabs } from '@/components/code-editor/file-tabs'
import { EnhancedTerminal } from '@/components/terminal/enhanced-terminal'
import { ErrorBoundary } from '@/components/error-boundary'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { LoadingOverlay, LoadingSpinner, AnimatedHeight } from '@/components/ui/loading'
import { AIPanel } from '@/components/ai-assistant/ai-panel'
import { SharingPanel } from '@/components/sharing/sharing-panel'
import { ThemeSettings } from '@/components/theme/theme-settings'
import { UIBuilderPanel } from '@/components/ui-builder/ui-builder-panel'
import { ComponentStorePanel } from '@/components/component-store/component-store-panel'

const SIDEBAR_MIN_WIDTH = 280
const SIDEBAR_MAX_WIDTH = 480
const SIDEBAR_DEFAULT_WIDTH = 350

export default function WorkspacePage() {
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

  const sidebarRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  // Zustand store
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

  // Enhanced mobile detection
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
        setLeftPanelCollapsed(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sidebar resizing logic
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

  // File operations
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

    // Simulate file loading time for better UX
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

  // File creation using store methods
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

  const handleStartResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setLeftPanelCollapsed(!leftPanelCollapsed)
    }
  }, [isMobile, sidebarOpen, leftPanelCollapsed, setSidebarOpen])

  // Swipe gestures for mobile
  const swipeHandlers = useSwipe(
    useCallback(
      ({
        direction,
        distance,
        velocity,
      }: { direction: string; distance: number; velocity: number }) => {
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

  // Render loading state until mounted
  if (!mounted) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6 animate-pulse">
            <img
              src="/favicon.ico"
              alt="MrrKit Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">MrrKit Workspace</h2>
          <p className="text-gray-600 font-medium mb-6">Loading your development environment...</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex flex-col overflow-hidden">
      {/* Modern Header */}
      <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm flex items-center justify-between px-6 flex-shrink-0 z-50 relative">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
          >
            {(isMobile ? sidebarOpen : !leftPanelCollapsed) ? 
              <PanelLeftClose className="h-5 w-5" /> : 
              <PanelLeftOpen className="h-5 w-5" />
            }
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <img
                src="/favicon.ico"
                alt="MrrKit Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                MrrKit Workspace
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                {currentProject?.name || 'AI-Powered Development'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Center - Active File Breadcrumb */}
        <div className="flex-1 flex items-center justify-center max-w-md mx-4">
          {activeFile && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-2 text-sm border border-blue-200/50">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700 font-medium truncate">
                {activeFile.name}
              </span>
              {activeFile.isDirty && (
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="relative mr-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-48 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl shadow-sm text-sm focus:w-56 transition-all duration-200"
              />
            </div>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
            onClick={() => setShowSharingPanel(true)}
            title="Share code"
          >
            <Share className="h-4 w-4 text-gray-600" />
          </Button>
          
          <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50 text-xs px-3 py-1.5 rounded-xl shadow-sm hidden sm:flex">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            Online
          </Badge>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-10 w-10 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
            onClick={() => setShowThemeSettings(true)}
            title="Settings"
          >
            <Settings className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div
        className="flex-1 flex relative overflow-hidden"
        {...(isMobile ? {
          onTouchStart: swipeHandlers.onTouchStart,
          onTouchMove: swipeHandlers.onTouchMove,
          onTouchEnd: swipeHandlers.onTouchEnd
        } : {})}
      >
        {/* Left Sidebar */}
        <div 
          ref={sidebarRef}
          className={`
            ${isMobile 
              ? `fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-out ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-80 max-w-[85vw]`
              : `relative transition-all duration-300 ease-out ${
                  leftPanelCollapsed ? 'w-0' : ''
                }`
            }
            bg-white/95 backdrop-blur-xl shadow-xl border-r border-gray-200/60 flex flex-col
          `}
          style={{
            width: isMobile ? undefined : (leftPanelCollapsed ? 0 : sidebarWidth)
          }}
        >
          {!leftPanelCollapsed && (
            <>
              {/* AI Assistant Panel */}
              <div className="h-80 border-b border-gray-200/60 flex-shrink-0">
                <ErrorBoundary>
                  <AIPanel />
                </ErrorBoundary>
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
            </>
          )}
          
          {/* Sidebar Resize Handle */}
          {!isMobile && !leftPanelCollapsed && (
            <div
              ref={resizeRef}
              className="absolute top-0 right-0 w-1 h-full bg-transparent hover:bg-blue-400 cursor-col-resize transition-colors duration-200 z-10 group"
              onMouseDown={handleStartResize}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-12 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
            </div>
          )}
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Editor Area */}
        <LoadingOverlay
          isLoading={isLoadingFile}
          message={loadingMessage}
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
        >
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* File Tabs */}
            <div className="h-12 border-b border-gray-200/60 bg-white/90 backdrop-blur-sm flex-shrink-0">
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

            {/* View Mode Controls */}
            <div className="h-12 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* Terminal Toggle */}
                <Button
                  size="sm"
                  variant={showTerminal ? "default" : "ghost"}
                  onClick={() => setShowTerminal(!showTerminal)}
                  className="h-8 px-3 text-xs rounded-lg"
                >
                  <TerminalIcon className="h-3 w-3 mr-1" />
                  Terminal
                </Button>
                
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                
                {/* View Mode Buttons */}
                {!isMobile && (
                  <Button
                    size="sm"
                    variant={viewMode === 'split' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('split')}
                    className="h-8 px-3 text-xs rounded-lg"
                    title="Split View"
                  >
                    <Code className="h-3 w-3 mr-1" />
                    Split
                  </Button>
                )}
                <Button
                  size="sm"
                  variant={viewMode === 'code' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('code')}
                  className="h-8 px-3 text-xs rounded-lg"
                  title="Code Editor"
                >
                  <Code className="h-3 w-3 mr-1" />
                  Code
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('preview')}
                  className="h-8 px-3 text-xs rounded-lg"
                  title="Live Preview"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'builder' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('builder')}
                  className="h-8 px-3 text-xs rounded-lg"
                  title="UI Builder"
                >
                  <Palette className="h-3 w-3 mr-1" />
                  Builder
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'store' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('store')}
                  className="h-8 px-3 text-xs rounded-lg"
                  title="Component Store"
                >
                  <Package className="h-3 w-3 mr-1" />
                  Store
                </Button>
              </div>
              
              {/* Right Panel Info */}
              <div className="flex items-center gap-2">
                {activeFile && (
                  <Badge variant="outline" className="text-xs bg-white/80 rounded-lg">
                    {activeFile.language}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Editor Content */}
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
                    <div className={`${viewMode === 'split' && !isMobile ? 'w-1/2' : 'w-full'} border-r border-gray-200/60 overflow-hidden bg-white`}>
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
                                fontSize: isMobile ? 12 : 14,
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
                        <div className="h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50/50 to-white">
                          <div className="text-center p-8 max-w-md">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                              <Code className="h-10 w-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-700">Welcome to MrrKit</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                              Select a file from the sidebar or create a new one to start coding with AI assistance
                            </p>
                            <Button
                              onClick={() => createFile('component.jsx', 'file')}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                            >
                              <Plus className="w-4 h-4 mr-2" />
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
                        <div className="h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-white to-purple-50/30">
                          <div className="text-center p-8 max-w-md">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                              <Eye className="h-10 w-10 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-700">Live Preview</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                              Write code or generate components with AI to see live preview
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Ready to preview
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Enhanced Terminal */}
            {showTerminal && (
              <div className="h-48 border-t border-gray-200/60 flex-shrink-0 bg-gray-900 relative">
                <ErrorBoundary>
                  <EnhancedTerminal
                    onClose={() => setShowTerminal(false)}
                    onMinimize={() => setShowTerminal(false)}
                  />
                </ErrorBoundary>
              </div>
            )}
          </div>
        </LoadingOverlay>
      </div>

      {/* Panels */}
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