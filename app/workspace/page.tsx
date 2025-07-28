'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSwipe } from '@/hooks/use-touch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Split,
  Play,
  Code,
  Eye,
  Download,
  Share,
  Settings,
  Wand2,
  FileText,
  Folder,
  Plus,
  Save,
  RefreshCw,
  Sparkles,
  Menu,
  X,
  Smartphone,
  Monitor,
  Terminal as TerminalIcon,
  Upload,
  GitBranch,
  Search,
  Palette,
  Package,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  GripVertical
} from 'lucide-react'
import { MonacoEditor } from '@/components/code-editor/monaco-editor'
import { LivePreview } from '@/components/code-editor/live-preview'
import { FileExplorer, type FileNode } from '@/components/code-editor/file-explorer'
import { FileTabs } from '@/components/code-editor/file-tabs'
import { EnhancedTerminal } from '@/components/terminal/enhanced-terminal'
import { Input } from '@/components/ui/input'
import { ErrorBoundary } from '@/components/error-boundary'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { LoadingOverlay, LoadingSpinner, AnimatedHeight } from '@/components/ui/loading'
import { AIPanel } from '@/components/ai-assistant/ai-panel'
import { SharingPanel } from '@/components/sharing/sharing-panel'
import { ThemeSettings } from '@/components/theme/theme-settings'
import { UIBuilderPanel } from '@/components/ui-builder/ui-builder-panel'
import { ComponentStorePanel } from '@/components/component-store/component-store-panel'

const SIDEBAR_MIN_WIDTH = 240
const SIDEBAR_MAX_WIDTH = 480
const SIDEBAR_DEFAULT_WIDTH = 320

export default function WorkspacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [showSharingPanel, setShowSharingPanel] = useState(false)
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [aiPanelHeight, setAiPanelHeight] = useState(300)
  const [rightPanelVisible, setRightPanelVisible] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

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
        setRightPanelVisible(false)
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

  // Handle initial prompt
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const initialPrompt = localStorage.getItem('initialPrompt')
      if (initialPrompt) {
        localStorage.removeItem('initialPrompt')
      }
    }
  }, [mounted])

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
    useCallback(({ direction, distance, velocity }) => {
      if (!isMobile) return

      if (direction === 'right' && distance > 100 && velocity > 0.5) {
        // Swipe right to open sidebar
        if (!sidebarOpen) {
          setSidebarOpen(true)
        }
      } else if (direction === 'left' && distance > 100 && velocity > 0.5) {
        // Swipe left to close sidebar
        if (sidebarOpen) {
          setSidebarOpen(false)
        }
      } else if (direction === 'up' && distance > 80 && velocity > 0.4) {
        // Swipe up to show terminal
        setShowTerminal(true)
      } else if (direction === 'down' && distance > 80 && velocity > 0.4) {
        // Swipe down to hide terminal
        setShowTerminal(false)
      }
    }, [isMobile, sidebarOpen, setSidebarOpen, setShowTerminal]),
    100, // threshold
    0.3  // velocity threshold
  )

  // Render loading state until mounted
  if (!mounted) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-pulse">
            <img 
              src="/favicon.ico" 
              alt="MrrKit Logo" 
              className="w-7 h-7 object-contain"
            />
          </div>
          <p className="text-gray-600 font-medium">Loading workspace...</p>
          <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex flex-col overflow-hidden">
      {/* Enhanced Header */}
      <header className="h-14 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm flex items-center justify-between px-4 flex-shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
          >
            {(isMobile ? sidebarOpen : !leftPanelCollapsed) ? 
              <PanelLeftClose className="h-4 w-4" /> : 
              <PanelLeftOpen className="h-4 w-4" />
            }
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <img
                src="/favicon.ico"
                alt="MrrKit Logo"
                className="w-5 h-5 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                MrrKit
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                {currentProject?.name || 'Workspace'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Center - Active File Breadcrumb */}
        <div className="flex-1 flex items-center justify-center max-w-md mx-4">
          {activeFile && (
            <div className="flex items-center gap-2 bg-gray-100/60 rounded-lg px-3 py-1.5 text-sm">
              <FileText className="h-3 w-3 text-gray-500" />
              <span className="text-gray-700 font-medium truncate">
                {activeFile.name}
              </span>
              {activeFile.isDirty && (
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Side Controls */}
        <div className="flex items-center gap-1">
          {!isMobile && (
            <div className="relative mr-2">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 w-40 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-lg shadow-sm text-sm focus:w-48 transition-all duration-200"
              />
            </div>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
            onClick={() => setShowSharingPanel(true)}
            title="Share code"
          >
            <Share className="h-3.5 w-3.5 text-gray-600" />
          </Button>
          
          <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50 text-xs px-2 py-1 rounded-md shadow-sm hidden sm:flex">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
            Online
          </Badge>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
            onClick={() => setShowThemeSettings(true)}
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5 text-gray-600" />
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div
        className="flex-1 flex relative overflow-hidden"
        {...(isMobile ? swipeHandlers : {})}
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
              {/* AI Assistant Panel - Resizable */}
              <div 
                className="border-b border-gray-200/60 flex-shrink-0 relative"
                style={{ height: aiPanelHeight }}
              >
                <ErrorBoundary>
                  <AIPanel />
                </ErrorBoundary>
                
                {/* AI Panel Resize Handle */}
                {!isMobile && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/60 hover:bg-blue-400 cursor-row-resize transition-colors duration-200 group"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      const startY = e.clientY
                      const startHeight = aiPanelHeight
                      
                      const handleMouseMove = (e: MouseEvent) => {
                        const newHeight = startHeight + (e.clientY - startY)
                        if (newHeight >= 200 && newHeight <= 500) {
                          setAiPanelHeight(newHeight)
                        }
                      }
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove)
                        document.removeEventListener('mouseup', handleMouseUp)
                      }
                      
                      document.addEventListener('mousemove', handleMouseMove)
                      document.addEventListener('mouseup', handleMouseUp)
                    }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                  </div>
                )}
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
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
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
          <div className="h-11 border-b border-gray-200/60 bg-white/90 backdrop-blur-sm flex-shrink-0">
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

          {/* Enhanced View Mode Controls */}
          <div className="h-10 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              {/* Terminal Toggle */}
              <Button
                size="sm"
                variant={showTerminal ? "default" : "ghost"}
                onClick={() => setShowTerminal(!showTerminal)}
                className="h-7 px-2 text-xs"
              >
                <TerminalIcon className="h-3 w-3 mr-1" />
                Terminal
              </Button>
              
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              
              {/* View Mode Buttons */}
              {!isMobile && (
                <Button
                  size="sm"
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('split')}
                  className="h-7 px-2 text-xs"
                  title="Split View"
                >
                  <Split className="h-3 w-3 mr-1" />
                  Split
                </Button>
              )}
              <Button
                size="sm"
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                onClick={() => setViewMode('code')}
                className="h-7 px-2 text-xs"
                title="Code Editor"
              >
                <Code className="h-3 w-3 mr-1" />
                Code
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                onClick={() => setViewMode('preview')}
                className="h-7 px-2 text-xs"
                title="Live Preview"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'builder' ? 'default' : 'ghost'}
                onClick={() => setViewMode('builder')}
                className="h-7 px-2 text-xs"
                title="UI Builder"
              >
                <Palette className="h-3 w-3 mr-1" />
                Builder
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'store' ? 'default' : 'ghost'}
                onClick={() => setViewMode('store')}
                className="h-7 px-2 text-xs"
                title="Component Store"
              >
                <Package className="h-3 w-3 mr-1" />
                Store
              </Button>
            </div>
            
            {/* Right Panel Toggle */}
            <div className="flex items-center gap-1">
              {activeFile && (
                <Badge variant="outline" className="text-xs bg-white/80">
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
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-700">Code Editor</h3>
                          <p className="text-gray-500 mb-4 text-sm">Select a file from the sidebar or create a new one to start coding</p>
                          <Button
                            onClick={() => createFile('component.jsx', 'file')}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
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
                      <div className="h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-white to-gray-50/30">
                        <div className="text-center p-8 max-w-md">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Eye className="h-8 w-8 text-purple-500" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-700">Live Preview</h3>
                          <p className="text-gray-500 mb-4 text-sm">Write code or generate components with AI to see live preview</p>
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
            <div 
              className="border-t border-gray-200/60 flex-shrink-0 bg-gray-900 relative"
              style={{ height: terminalHeight }}
            >
              <ErrorBoundary>
                <EnhancedTerminal
                  onClose={() => setShowTerminal(false)}
                  onMinimize={() => setShowTerminal(false)}
                />
              </ErrorBoundary>
              
              {/* Terminal Resize Handle */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 bg-gray-700 hover:bg-blue-400 cursor-row-resize transition-colors duration-200 group"
                onMouseDown={(e) => {
                  e.preventDefault()
                  const startY = e.clientY
                  const startHeight = terminalHeight
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const newHeight = startHeight - (e.clientY - startY)
                    if (newHeight >= 150 && newHeight <= 400) {
                      setTerminalHeight(newHeight)
                    }
                  }
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </div>
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
