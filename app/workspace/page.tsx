'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Search
} from 'lucide-react'
import { MonacoEditor } from '@/components/code-editor/monaco-editor'
import { LivePreview } from '@/components/code-editor/live-preview'
import { FileExplorer, type FileNode } from '@/components/code-editor/file-explorer'
import { FileTabs } from '@/components/code-editor/file-tabs'
import { EnhancedTerminal } from '@/components/terminal/enhanced-terminal'
import { Input } from '@/components/ui/input'
import { ErrorBoundary } from '@/components/error-boundary'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { AIPanel } from '@/components/ai-assistant/ai-panel'
import { SharingPanel } from '@/components/sharing/sharing-panel'

export default function WorkspacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [showSharingPanel, setShowSharingPanel] = useState(false)

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

  // Mount state'ini kontrol et ve mobile detection
  useEffect(() => {
    setMounted(true)
    // Client-side mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Ana sayfadan gelen prompt'u yükle
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const initialPrompt = localStorage.getItem('initialPrompt')
      if (initialPrompt) {
        // Handle initial prompt if needed
        localStorage.removeItem('initialPrompt')
      }
    }
  }, [mounted])

  // Mobile'da sidebar'ı varsayılan olarak kapalı tut
  useEffect(() => {
    if (mounted) {
      if (isMobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
  }, [isMobile, mounted])

  // Mobile'da split view yerine preview göster
  useEffect(() => {
    if (mounted && isMobile && viewMode === 'split') {
      setViewMode('preview')
    }
  }, [isMobile, viewMode, mounted])

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

  const handleFileSelect = useCallback((file: any) => {
    setActiveFile(file.id)
    addOpenFile(file)
  }, [setActiveFile, addOpenFile])

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
      // Add to root level
      setFiles([...files, newFile])
      if (type === 'file') {
        setActiveFile(newFile.id)
        addOpenFile(newFile)
      }
    } else {
      // Add to parent folder
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
    // Update open files as well
    const updatedOpenFiles = openFiles.map(file =>
      file.id === fileId ? { ...file, name: newName, language: getLanguageFromExtension(newName) } : file
    )
    // This would need a store method to update multiple open files
  }, [files, openFiles, setFiles, getLanguageFromExtension])

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





  // Render loading state until mounted
  if (!mounted) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm mx-auto mb-4 animate-pulse">
            <img 
              src="/favicon.ico" 
              alt="MrrKit Logo" 
              className="w-5 h-5 object-contain"
            />
          </div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col overflow-hidden">
      {/* Header - Fixed height with enhanced styling */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm flex items-center justify-between px-6 flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <img
                src="/favicon.ico"
                alt="MrrKit Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">MrrKit Workspace</h1>
              {!isMobile && (
                <input
                  type="text"
                  value={currentProject?.name || 'Untitled Project'}
                  onChange={(e) => {
                    if (currentProject) {
                      // Update project name in store
                      // For now, just show the name without editing
                    }
                  }}
                  className="text-xs text-gray-600 bg-transparent border-none outline-none p-0"
                  placeholder="Project Name"
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search - Responsive */}
          {!isMobile ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 w-52 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl shadow-sm transition-all duration-200 focus:w-64"
              />
            </div>
          ) : (
            <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200">
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
          )}
          
          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200">
            <GitBranch className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
            onClick={() => setShowSharingPanel(true)}
            title="Share code"
          >
            <Share className="h-4 w-4 text-gray-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200">
            <Upload className="h-4 w-4 text-gray-600" />
          </Button>
          <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50 text-xs px-3 py-1 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            Çevrimiçi
          </Badge>
          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200">
            <Settings className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </header>

      {/* Main Content - Takes remaining height */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* AI Editor Sidebar */}
        <div className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-40 w-80 max-w-[85vw] transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'w-80 flex-shrink-0'
        } bg-white/95 backdrop-blur-md shadow-xl lg:shadow-lg border-r border-gray-200/50 flex flex-col`}>
          
          {/* AI Assistant Panel */}
          <div className="h-96 border-b border-gray-200/50 flex-shrink-0">
            <ErrorBoundary>
              <AIPanel />
            </ErrorBoundary>
          </div>

          {/* File Explorer */}
          <div className="flex-1 overflow-hidden">
            <FileExplorer
              files={files}
              activeFileId={activeFile?.id}
              onFileSelect={handleFileSelect}
              onFileCreate={createFile}
              onFileRename={renameFile}
              onFileDelete={deleteFile}
              onFileDownload={downloadFile}
            />
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Editor Area - Flex column with terminal handling */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* File Tabs */}
          <FileTabs
            openFiles={openFiles}
            activeFileId={activeFile?.id || null}
            onFileSelect={handleFileSelect}
            onFileClose={handleFileClose}
            onFileCreate={createFile}
            onCloseAll={handleCloseAll}
            onCloseOthers={handleCloseOthers}
            className="h-12 flex-shrink-0"
          />

          {/* Editor Controls */}
          <div className="h-12 bg-white/90 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between px-6 flex-shrink-0">
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowTerminal(!showTerminal)}
                className="h-8 px-2"
              >
                <TerminalIcon className="h-3 w-3 mr-1" />
                Terminal
              </Button>
              
              {!isMobile && (
                <Button
                  size="sm"
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('split')}
                  className="h-9 px-3 rounded-lg transition-all duration-200"
                >
                  <Split className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                onClick={() => setViewMode('code')}
                className="h-9 px-3 rounded-lg transition-all duration-200"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                onClick={() => setViewMode('preview')}
                className="h-9 px-3 rounded-lg transition-all duration-200"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Editor Content - Dynamic height based on terminal */}
          <div 
            className="flex flex-1 overflow-hidden"
            style={{ 
              height: showTerminal ? `calc(100% - ${terminalHeight}px)` : '100%' 
            }}
          >
            {(viewMode === 'code' || (viewMode === 'split' && !isMobile)) && (
              <div className={`${viewMode === 'split' && !isMobile ? 'w-1/2' : 'w-full'} border-r border-gray-200 overflow-hidden`}>
                {activeFile ? (
                  <div className="h-full">
                    <ErrorBoundary>
                      <MonacoEditor
                        key={activeFile.id} // Force remount when file changes
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
                        }}
                      />
                    </ErrorBoundary>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-white">
                    <div className="text-center p-8 max-w-md">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-700">Kod Editörü</h3>
                      <p className="text-gray-500 mb-4">Soldaki menüden bir dosya seçin veya yeni bir dosya oluşturun</p>
                      <Button
                        onClick={() => createFile('component.jsx', 'file')}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Dosya
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
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
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Eye className="h-10 w-10 text-purple-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-700">Canlı Önizleme</h3>
                      <p className="text-gray-500 mb-4">Kod yazın veya AI ile komponenet üretin</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Hazır bekleniyor
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Terminal - Fixed at bottom */}
          {showTerminal && (
            <div 
              className="border-t border-gray-200 flex-shrink-0 bg-gray-900"
              style={{ height: terminalHeight }}
            >
              <Terminal
                onClose={() => setShowTerminal(false)}
                onMinimize={() => setShowTerminal(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sharing Panel */}
      <SharingPanel
        isOpen={showSharingPanel}
        onClose={() => setShowSharingPanel(false)}
      />
    </div>
  )
}
