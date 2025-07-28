'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileNode } from './file-explorer'
import { 
  X, 
  FileText, 
  Plus, 
  MoreHorizontal,
  Save,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface OpenFile extends FileNode {
  isDirty?: boolean
  lastModified?: number
}

interface FileTabsProps {
  openFiles: OpenFile[]
  activeFileId: string | null
  onFileSelect: (file: FileNode) => void
  onFileClose: (fileId: string) => void
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void
  onFileSave?: (fileId: string) => void
  onCloseAll: () => void
  onCloseOthers: (keepFileId: string) => void
  className?: string
}

export const FileTabs: React.FC<FileTabsProps> = ({
  openFiles,
  activeFileId,
  onFileSelect,
  onFileClose,
  onFileCreate,
  onFileSave,
  onCloseAll,
  onCloseOthers,
  className = ''
}) => {
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const getFileIcon = (file: FileNode) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    
    const iconClass = "w-4 h-4"
    
    switch (ext) {
      case 'js':
      case 'jsx':
        return <FileText className={`${iconClass} text-yellow-600`} />
      case 'ts':
      case 'tsx':
        return <FileText className={`${iconClass} text-blue-600`} />
      case 'css':
        return <FileText className={`${iconClass} text-blue-500`} />
      case 'html':
        return <FileText className={`${iconClass} text-orange-600`} />
      case 'json':
        return <FileText className={`${iconClass} text-green-600`} />
      case 'md':
        return <FileText className={`${iconClass} text-gray-600`} />
      default:
        return <FileText className={`${iconClass} text-gray-500`} />
    }
  }

  const updateScrollButtons = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      setScrollPosition(scrollLeft)
    }
  }

  useEffect(() => {
    updateScrollButtons()
    const container = tabsContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      const observer = new ResizeObserver(updateScrollButtons)
      observer.observe(container)
      
      return () => {
        container.removeEventListener('scroll', updateScrollButtons)
        observer.disconnect()
      }
    }
  }, [openFiles])

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount
      
      tabsContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const handleTabDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggedTabId(fileId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleTabDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleTabDrop = (e: React.DragEvent, targetFileId: string) => {
    e.preventDefault()
    // Tab reordering logic would go here
    setDraggedTabId(null)
  }

  const handleMiddleClick = (e: React.MouseEvent, fileId: string) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault()
      onFileClose(fileId)
    }
  }

  const getTruncatedFileName = (name: string, maxLength = 20) => {
    if (name.length <= maxLength) return name
    const ext = name.split('.').pop()
    const baseName = name.slice(0, name.lastIndexOf('.'))
    const truncatedBase = baseName.slice(0, maxLength - ext!.length - 4) + '...'
    return `${truncatedBase}.${ext}`
  }

  return (
    <div className={`flex items-center bg-white/95 backdrop-blur-sm border-b border-gray-200/60 ${className}`}>
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => scrollTabs('left')}
          className="h-full w-8 p-0 flex-shrink-0 border-r border-gray-200/60 rounded-none hover:bg-gray-100/80"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>
      )}

      {/* Tabs Container */}
      <div
        ref={tabsContainerRef}
        className="flex-1 flex overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex h-full">
          {openFiles.length === 0 ? (
            <div className="flex items-center justify-center px-6 py-2 text-gray-500 text-sm">
              No files open
            </div>
          ) : (
            openFiles.map((file, index) => (
              <div
                key={file.id}
                draggable
                onDragStart={(e) => handleTabDragStart(e, file.id)}
                onDragOver={handleTabDragOver}
                onDrop={(e) => handleTabDrop(e, file.id)}
                onMouseDown={(e) => handleMiddleClick(e, file.id)}
                className={`
                  group relative flex items-center gap-2 px-3 py-2.5 cursor-pointer
                  min-w-0 max-w-44 flex-shrink-0 transition-all duration-200 h-full
                  ${activeFileId === file.id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'bg-transparent hover:bg-gray-100/60 text-gray-700'
                  }
                  ${draggedTabId === file.id ? 'opacity-50' : ''}
                  ${index > 0 ? 'border-l border-gray-200/60' : ''}
                `}
                onClick={() => onFileSelect(file)}
              >
                {/* Active Tab Indicator */}
                {activeFileId === file.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}

                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>

                {/* File Name */}
                <span className="text-xs font-medium truncate min-w-0 select-none">
                  {getTruncatedFileName(file.name, 16)}
                </span>

                {/* Dirty Indicator & Close Button Container */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {file.isDirty && (
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  )}

                  {/* Close Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileClose(file.id)
                    }}
                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 rounded transition-all duration-200"
                  >
                    <X className="w-2.5 h-2.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => scrollTabs('right')}
          className="h-full w-8 p-0 flex-shrink-0 border-l border-gray-200/60 rounded-none hover:bg-gray-100/80"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      )}

      {/* Tab Actions */}
      <div className="flex items-center border-l border-gray-200/60 h-full">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onFileCreate('untitled.js', 'file')}
          className="h-full w-9 p-0 rounded-none hover:bg-gray-100/80"
          title="New file (Ctrl+N)"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>

        {openFiles.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-full w-8 p-0 rounded-none hover:bg-gray-100/80"
                title="More options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => activeFileId && onFileSave?.(activeFileId)}
                disabled={!activeFileId}
                className="text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Active File
                <span className="ml-auto text-xs text-gray-400">Ctrl+S</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => activeFileId && onCloseOthers(activeFileId)}
                disabled={!activeFileId || openFiles.length <= 1}
                className="text-sm"
              >
                Close Others
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onCloseAll}
                disabled={openFiles.length === 0}
                className="text-sm"
              >
                Close All
                <span className="ml-auto text-xs text-gray-400">Ctrl+Shift+W</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
