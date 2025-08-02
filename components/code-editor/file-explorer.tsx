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
        <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md file-icon">
          <FolderOpen className="h-3 w-3 text-blue-600" />
        </div> :
        <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md file-icon">
          <Folder className="h-3 w-3 text-blue-600" />
        </div>
    }

    const ext = file.name.split('.').pop()
    switch (ext) {
      case 'js':
      case 'jsx':
        return <div className="flex items-center justify-center w-5 h-5 bg-yellow-100 rounded-md file-icon js">
          <FileText className="h-3 w-3 text-yellow-600" />
        </div>
      case 'ts':
      case 'tsx':
        return <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md file-icon ts">
          <FileText className="h-3 w-3 text-blue-600" />
        </div>
      case 'css':
        return <div className="flex items-center justify-center w-5 h-5 bg-indigo-100 rounded-md file-icon css">
          <FileText className="h-3 w-3 text-indigo-600" />
        </div>
      case 'html':
        return <div className="flex items-center justify-center w-5 h-5 bg-orange-100 rounded-md file-icon html">
          <FileText className="h-3 w-3 text-orange-600" />
        </div>
      case 'json':
        return <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-md file-icon json">
          <FileText className="h-3 w-3 text-gray-600" />
        </div>
      case 'md':
        return <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-md file-icon md">
          <FileText className="h-3 w-3 text-gray-600" />
        </div>
      case 'py':
        return <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md file-icon py">
          <FileText className="h-3 w-3 text-blue-600" />
        </div>
      case 'java':
        return <div className="flex items-center justify-center w-5 h-5 bg-orange-100 rounded-md file-icon java">
          <FileText className="h-3 w-3 text-orange-600" />
        </div>
      case 'cpp':
      case 'c':
        return <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md file-icon cpp">
          <FileText className="h-3 w-3 text-blue-600" />
        </div>
      case 'rs':
        return <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-md file-icon rs">
          <FileText className="h-3 w-3 text-gray-600" />
        </div>
      case 'go':
        return <div className="flex items-center justify-center w-5 h-5 bg-cyan-100 rounded-md file-icon go">
          <FileText className="h-3 w-3 text-cyan-600" />
        </div>
      case 'php':
        return <div className="flex items-center justify-center w-5 h-5 bg-purple-100 rounded-md file-icon php">
          <FileText className="h-3 w-3 text-purple-600" />
        </div>
      case 'sql':
        return <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-md file-icon sql">
          <FileText className="h-3 w-3 text-blue-600" />
        </div>
      case 'yml':
      case 'yaml':
        return <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-md file-icon yml">
          <FileText className="h-3 w-3 text-red-600" />
        </div>
      default:
        return <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-md file-icon">
          <FileText className="h-3 w-3 text-gray-600" />
        </div>
    }
  }

  const renderFileNode = (file: FileNode, depth = 0) => (
    <div key={file.id} className="select-none">
      <div
        className={cn(
          "flex items-center justify-between group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl mx-1 px-3 py-2.5 cursor-pointer transition-all duration-200 file-tree-item workspace-hover",
          activeFileId === file.id && "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 shadow-sm workspace-card active",
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
              className="h-6 text-xs px-1 workspace-input"
              autoFocus
            />
          ) : (
            <span className="text-sm font-medium truncate text-gray-800 select-none">{file.name}</span>
          )}
          {file.isDirty && (
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
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
          <DropdownMenuContent align="end" className="workspace-card context-menu">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              setEditingFile(file.id)
              setNewFileName(file.name)
            }} className="context-menu-item">
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            {file.type === 'folder' && (
              <>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onFileCreate('new-file.js', 'file', file.id)
                }} className="context-menu-item">
                  <Plus className="h-4 w-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onFileCreate('new-folder', 'folder', file.id)
                }} className="context-menu-item">
                  <Plus className="h-4 w-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onFileDownload(file)
            }} className="context-menu-item">
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <div className="context-menu-separator" />
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation()
                onFileDelete(file.id)
              }}
              className="text-red-600 context-menu-item"
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
      <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-white to-blue-50/30 workspace-header">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <Folder className="h-3 w-3 text-white" />
            </div>
            Explorer
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
        
        {/* Search in files */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search files..."
            className="pl-8 h-8 text-xs workspace-input"
          />
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-auto workspace-scroll">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm font-medium mb-2">No files yet</p>
            <p className="text-xs">Create your first file to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {files.map(file => renderFileNode(file))}
          </div>
        )}
      </div>
    </div>
  )
}
