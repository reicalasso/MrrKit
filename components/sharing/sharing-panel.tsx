'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Share2, 
  Copy, 
  Link, 
  Globe, 
  Lock, 
  Heart, 
  Eye, 
  GitFork,
  Download,
  Check,
  X,
  Upload,
  Users,
  Tag
} from 'lucide-react'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { sharingService, type ShareOptions, type SharedSnippet } from '@/lib/services/sharing-service'

interface SharingPanelProps {
  isOpen?: boolean
  onClose?: () => void
}

export function SharingPanel({ isOpen = false, onClose }: SharingPanelProps) {
  const [activeTab, setActiveTab] = useState('share')
  const [shareTitle, setShareTitle] = useState('')
  const [shareDescription, setShareDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [tags, setTags] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [shareResult, setShareResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null)
  const [publicSnippets, setPublicSnippets] = useState<SharedSnippet[]>([])
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false)

  const { files, openFiles, currentProject } = useWorkspaceStore()

  const handleShare = async () => {
    if (!shareTitle.trim()) return

    setIsSharing(true)
    setShareResult(null)

    try {
      const filesToShare = openFiles.length > 0 ? openFiles : files.filter(f => f.type === 'file')
      
      const shareOptions: ShareOptions = {
        title: shareTitle.trim(),
        description: shareDescription.trim() || undefined,
        isPublic,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      }

      const result = await sharingService.shareSnippet(filesToShare, shareOptions)
      setShareResult(result)

      if (result.success) {
        // Copy URL to clipboard automatically
        if (result.url) {
          try {
            await navigator.clipboard.writeText(result.url)
          } catch (e) {
            console.warn('Could not copy to clipboard')
          }
        }
      }
    } catch (error) {
      setShareResult({
        success: false,
        error: 'Failed to share snippet'
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // Show success feedback
    } catch (e) {
      console.warn('Could not copy to clipboard')
    }
  }

  const loadPublicSnippets = async () => {
    setIsLoadingSnippets(true)
    try {
      const snippets = await sharingService.getPublicSnippets(12)
      setPublicSnippets(snippets)
    } catch (error) {
      console.error('Failed to load snippets:', error)
    } finally {
      setIsLoadingSnippets(false)
    }
  }

  const handleForkSnippet = async (snippet: SharedSnippet) => {
    try {
      const result = await sharingService.forkSnippet(snippet.id)
      if (result.success && result.files) {
        // Load files into workspace - this would need integration with workspace store
        console.log('Fork successful, files:', result.files)
        onClose?.()
      }
    } catch (error) {
      console.error('Failed to fork snippet:', error)
    }
  }

  const handleLikeSnippet = async (snippetId: string) => {
    try {
      const result = await sharingService.likeSnippet(snippetId)
      if (result.success) {
        // Update local state
        setPublicSnippets(prev => 
          prev.map(s => s.id === snippetId ? { ...s, likes: result.likes || s.likes } : s)
        )
      }
    } catch (error) {
      console.error('Failed to like snippet:', error)
    }
  }

  React.useEffect(() => {
    if (activeTab === 'discover') {
      loadPublicSnippets()
    }
  }, [activeTab])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Share & Discover</h2>
              <p className="text-sm text-gray-600">Share your code or discover community snippets</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
              <TabsTrigger value="share" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Share Code
              </TabsTrigger>
              <TabsTrigger value="discover" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="my-shares" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                My Shares
              </TabsTrigger>
            </TabsList>

            {/* Share Tab */}
            <TabsContent value="share" className="flex-1 p-6 space-y-6 overflow-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="share-title" className="text-sm font-medium text-gray-700">
                    Title *
                  </Label>
                  <Input
                    id="share-title"
                    placeholder="My awesome component"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="share-description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="share-description"
                    placeholder="Describe what this code does..."
                    value={shareDescription}
                    onChange={(e) => setShareDescription(e.target.value)}
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="share-tags" className="text-sm font-medium text-gray-700">
                    Tags
                  </Label>
                  <Input
                    id="share-tags"
                    placeholder="react, component, ui (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isPublic ? <Globe className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-gray-600" />}
                    <div>
                      <Label htmlFor="public-toggle" className="text-sm font-medium text-gray-900">
                        {isPublic ? 'Public' : 'Private'}
                      </Label>
                      <p className="text-xs text-gray-600">
                        {isPublic ? 'Anyone can discover and view this snippet' : 'Only you can access this snippet'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="public-toggle"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-900 mb-1">Files to share</h3>
                      <div className="space-y-1">
                        {(openFiles.length > 0 ? openFiles : files.filter(f => f.type === 'file')).map(file => (
                          <div key={file.id} className="flex items-center gap-2 text-xs text-blue-700">
                            <div className="w-4 h-4 bg-blue-200 rounded flex items-center justify-center">
                              <span className="text-blue-800 text-xs">📄</span>
                            </div>
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {shareResult && (
                <div className={`p-4 rounded-lg ${shareResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  {shareResult.success ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Snippet shared successfully!</span>
                      </div>
                      {shareResult.url && (
                        <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-green-200">
                          <Link className="w-4 h-4 text-green-600" />
                          <code className="flex-1 text-sm text-green-800 font-mono">{shareResult.url}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyUrl(shareResult.url!)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-800">
                      <X className="w-5 h-5" />
                      <span>{shareResult.error}</span>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleShare}
                disabled={!shareTitle.trim() || isSharing}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isSharing ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Snippet
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover" className="flex-1 p-6 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Community Snippets</h3>
                  <Button variant="outline" size="sm" onClick={loadPublicSnippets}>
                    <Download className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {isLoadingSnippets ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading snippets...</p>
                  </div>
                ) : publicSnippets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No public snippets yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publicSnippets.map((snippet) => (
                      <div key={snippet.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{snippet.title}</h4>
                            {snippet.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{snippet.description}</p>
                            )}
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {snippet.framework}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {snippet.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {snippet.views}
                            </span>
                            <button 
                              onClick={() => handleLikeSnippet(snippet.id)}
                              className="flex items-center gap-1 hover:text-red-500 transition-colors"
                            >
                              <Heart className="w-4 h-4" />
                              {snippet.likes}
                            </button>
                            <span className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" />
                              {snippet.forks}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleForkSnippet(snippet)}
                            className="h-8"
                          >
                            <GitFork className="w-3 h-3 mr-1" />
                            Fork
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* My Shares Tab */}
            <TabsContent value="my-shares" className="flex-1 p-6 overflow-auto">
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Your shared snippets will appear here</p>
                <p className="text-sm">Sign in to save and manage your shares</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
