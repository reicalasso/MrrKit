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
        <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md">
          <FolderOpen className="h-3 w-3 text-blue-600" />
        </div> :
        <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md">
          <Folder className="h-3 w-3 text-blue-600" />
        </div>
    }

    const ext = file.name.split('.').pop()
    switch (ext) {
      case 'js':
      case 'jsx':
        return <div className="flex items-center justify-center w-5 h-5 bg-yellow-100 rounded-md">
          <FileText className="h-3 w-3 text-yellow-600" />
        </div>
      case 'ts':
      case 'tsx':
        return <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md">
          <FileText className="h-3 w-3 text-blue-600" />
        </div>
      case 'css':
        return <div className="flex items-center justify-center w-5 h-5 bg-indigo-100 rounded-md">
          <FileText className="h-3 w-3 text-indigo-600" />
        </div>
      case 'html':
        return <div className="flex items-center justify-center w-5 h-5 bg-orange-100 rounded-md">
          <FileText className="h-3 w-3 text-orange-600" />
        </div>
      default:
        return <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-md">
          <FileText className="h-3 w-3 text-gray-600" />
        </div>
    }
  }

  const renderFileNode = (file: FileNode, depth = 0) => (
    <div key={file.id} className="select-none">
      <div
        className={cn(
          "flex items-center justify-between group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl mx-1 px-3 py-2.5 cursor-pointer transition-all duration-200",
          activeFileId === file.id && "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 shadow-sm workspace-card",
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
            <span className="text-sm font-medium truncate text-gray-800">{file.name}</span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/80 rounded-xl transition-all duration-200 workspace-button"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="workspace-card">
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
        <div className="ml-4 animate-fade-in-up">
          {file.children.map(child => renderFileNode(child, depth + 1))}
        </div>
      )}
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-white to-blue-50/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <Folder className="h-3 w-3 text-white" />
            </div>
            Project Files
          </h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-blue-100 rounded-xl transition-all duration-200 workspace-button"
              onClick={() => onFileCreate('new-file.js', 'file')}
              title="Yeni dosya"
            >
              <Plus className="h-3 w-3 text-blue-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-blue-100 rounded-xl transition-all duration-200 workspace-button"
              onClick={() => onFileCreate('new-folder', 'folder')}
              title="Yeni klasör"
            >
              <Folder className="h-3 w-3 text-blue-600" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-auto workspace-scroll">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  )
}
