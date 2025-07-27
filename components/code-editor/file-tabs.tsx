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
    <div className={`flex items-center bg-white border-b border-gray-200 ${className}`}>
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => scrollTabs('left')}
          className="h-8 w-8 p-0 flex-shrink-0 border-r border-gray-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Tabs Container */}
      <div 
        ref={tabsContainerRef}
        className="flex-1 flex overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex">
          {openFiles.map((file) => (
            <div
              key={file.id}
              draggable
              onDragStart={(e) => handleTabDragStart(e, file.id)}
              onDragOver={handleTabDragOver}
              onDrop={(e) => handleTabDrop(e, file.id)}
              onMouseDown={(e) => handleMiddleClick(e, file.id)}
              className={`
                group flex items-center gap-2 px-3 py-2 border-r border-gray-200 cursor-pointer
                min-w-0 max-w-48 flex-shrink-0 transition-all duration-200
                ${activeFileId === file.id 
                  ? 'bg-white border-b-2 border-blue-500 text-blue-700' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }
                ${draggedTabId === file.id ? 'opacity-50' : ''}
              `}
              onClick={() => onFileSelect(file)}
            >
              {/* File Icon */}
              <div className="flex-shrink-0">
                {getFileIcon(file)}
              </div>
              
              {/* File Name */}
              <span className="text-sm font-medium truncate min-w-0">
                {getTruncatedFileName(file.name)}
              </span>
              
              {/* Dirty Indicator */}
              {file.isDirty && (
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
              )}
              
              {/* Close Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileClose(file.id)
                }}
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded flex-shrink-0 transition-opacity duration-200"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => scrollTabs('right')}
          className="h-8 w-8 p-0 flex-shrink-0 border-l border-gray-200"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {/* Tab Actions */}
      <div className="flex items-center border-l border-gray-200">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onFileCreate('untitled.js', 'file')}
          className="h-8 w-8 p-0"
          title="New file"
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => activeFileId && onFileSave?.(activeFileId)}
              disabled={!activeFileId}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Active File
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => activeFileId && onCloseOthers(activeFileId)}
              disabled={!activeFileId || openFiles.length <= 1}
            >
              Close Others
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onCloseAll}
              disabled={openFiles.length === 0}
            >
              Close All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
