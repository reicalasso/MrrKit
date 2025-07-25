'use client'

import { useState } from 'react'
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Plus, 
  MoreHorizontal,
  Trash2,
  Edit,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

// Simple cn utility if not already present
function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  parent?: string
}

interface FileExplorerProps {
  files: FileNode[]
  activeFileId?: string
  onFileSelect: (file: FileNode) => void
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void
  onFileRename: (fileId: string, newName: string) => void
  onFileDelete: (fileId: string) => void
  onFileDownload: (file: FileNode) => void
}

export function FileExplorer({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileRename,
  onFileDelete,
  onFileDownload
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState('')

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleRename = (fileId: string, newName: string) => {
    if (newName.trim()) {
      onFileRename(fileId, newName.trim())
    }
    setEditingFile(null)
    setNewFileName('')
  }

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? 
        <FolderOpen className="h-4 w-4 text-blue-500" /> : 
        <Folder className="h-4 w-4 text-blue-500" />
    }
    
    const ext = file.name.split('.').pop()
    switch (ext) {
      case 'js':
      case 'jsx':
        return <FileText className="h-4 w-4 text-yellow-500" />
      case 'ts':
      case 'tsx':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'css':
        return <FileText className="h-4 w-4 text-blue-400" />
      case 'html':
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const renderFileNode = (file: FileNode, depth = 0) => (
    <div key={file.id} className="select-none">
      <div 
        className={cn(
          "flex items-center justify-between group hover:bg-gray-50 rounded px-2 py-1 cursor-pointer",
          activeFileId === file.id && "bg-blue-50 border-l-2 border-blue-500",
          `ml-${depth * 4}`
        )}
        onClick={() => {
          if (file.type === 'folder') {
            toggleFolder(file.id)
          } else {
            onFileSelect(file)
          }
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getFileIcon(file)}
          {editingFile === file.id ? (
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => handleRename(file.id, newFileName)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename(file.id, newFileName)
                } else if (e.key === 'Escape') {
                  setEditingFile(null)
                  setNewFileName('')
                }
              }}
              className="h-6 text-xs px-1"
              autoFocus
            />
          ) : (
            <span className="text-sm truncate">{file.name}</span>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              setEditingFile(file.id)
              setNewFileName(file.name)
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            {file.type === 'folder' && (
              <>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onFileCreate('new-file.js', 'file', file.id)
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onFileCreate('new-folder', 'folder', file.id)
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onFileDownload(file)
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation()
                onFileDelete(file.id)
              }}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {file.type === 'folder' && expandedFolders.has(file.id) && file.children && (
        <div className="ml-4">
          {file.children.map(child => renderFileNode(child, depth + 1))}
        </div>
      )}
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">📁 Dosyalar</h3>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0"
              onClick={() => onFileCreate('new-file.js', 'file')}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0"
              onClick={() => onFileCreate('new-folder', 'folder')}
            >
              <Folder className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-auto">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  )
}
