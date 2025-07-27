'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MonacoEditor } from '@/components/code-editor/monaco-editor'
import { LivePreview } from '@/components/code-editor/live-preview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Copy, 
  GitFork, 
  Heart, 
  Eye, 
  Share2, 
  Download,
  Code,
  Play,
  User,
  Calendar,
  Tag,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import { sharingService, type SharedSnippet } from '@/lib/services/sharing-service'
import { ErrorBoundary } from '@/components/error-boundary'
import Link from 'next/link'

interface SnippetPageProps {
  params: {
    id: string
  }
}

export default function SnippetPage({ params }: SnippetPageProps) {
  const [snippet, setSnippet] = useState<SharedSnippet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<string>('')
  const [viewMode, setViewMode] = useState<'code' | 'preview' | 'split'>('split')
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    loadSnippet()
  }, [params.id])

  useEffect(() => {
    if (snippet && snippet.files.length > 0 && !activeFile) {
      setActiveFile(snippet.files[0].name)
    }
  }, [snippet, activeFile])

  const loadSnippet = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await sharingService.getSnippet(params.id)
      
      if (result.success && result.snippet) {
        setSnippet(result.snippet)
      } else {
        setError(result.error || 'Snippet not found')
      }
    } catch (err) {
      setError('Failed to load snippet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.warn('Could not copy to clipboard')
    }
  }

  const handleLike = async () => {
    if (!snippet || liked) return

    try {
      const result = await sharingService.likeSnippet(snippet.id)
      if (result.success) {
        setSnippet(prev => prev ? { ...prev, likes: result.likes || prev.likes } : null)
        setLiked(true)
      }
    } catch (error) {
      console.error('Failed to like snippet:', error)
    }
  }

  const handleFork = async () => {
    if (!snippet) return

    try {
      const result = await sharingService.forkSnippet(snippet.id)
      if (result.success && result.files) {
        // Redirect to workspace with forked files
        // For now, we'll just show a success message
        alert('Snippet forked! You can now edit it in the workspace.')
      }
    } catch (error) {
      console.error('Failed to fork snippet:', error)
    }
  }

  const handleDownload = () => {
    if (!snippet) return

    snippet.files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const getCurrentFile = () => {
    if (!snippet || !activeFile) return null
    return snippet.files.find(f => f.name === activeFile) || snippet.files[0]
  }

  const currentFile = getCurrentFile()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading snippet...</p>
        </div>
      </div>
    )
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😿</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Snippet Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This snippet might have been deleted or the URL is incorrect.'}
          </p>
          <Link href="/workspace">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Workspace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/workspace">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Workspace
                </Button>
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{snippet.title}</h1>
                {snippet.description && (
                  <p className="text-sm text-gray-600">{snippet.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4 text-sm text-gray-500 mr-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {snippet.views}
                </span>
                <button 
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center gap-1 transition-colors ${
                    liked ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {snippet.likes}
                </button>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {snippet.forks}
                </span>
              </div>

              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                {copied ? (
                  <>
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button size="sm" onClick={handleFork} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <GitFork className="w-4 h-4 mr-2" />
                Fork to Workspace
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{snippet.author?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
            </div>
            <Badge variant="secondary" className="gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {snippet.framework}
            </Badge>
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* File Tabs */}
          {snippet.files.length > 1 && (
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-1 p-2">
                {snippet.files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeFile === file.name
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* View Mode Controls */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'code' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('code')}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Code
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('preview')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('split')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Split
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {currentFile?.name} • {currentFile?.language}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="h-[70vh] flex">
            {/* Code Editor */}
            {(viewMode === 'code' || viewMode === 'split') && currentFile && (
              <div className={`${viewMode === 'split' ? 'w-1/2 border-r border-gray-200' : 'w-full'}`}>
                <ErrorBoundary>
                  <MonacoEditor
                    value={currentFile.content}
                    onChange={() => {}} // Read-only
                    language={currentFile.language}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      lineNumbers: 'on',
                      wordWrap: 'on'
                    }}
                  />
                </ErrorBoundary>
              </div>
            )}

            {/* Live Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && currentFile && (
              <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <ErrorBoundary>
                  <LivePreview
                    code={currentFile.content}
                    language={currentFile.language}
                  />
                </ErrorBoundary>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
