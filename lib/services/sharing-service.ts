export interface SharedSnippet {
  id: string
  title: string
  description?: string
  files: Array<{
    name: string
    content: string
    language: string
  }>
  framework: 'react' | 'vue' | 'svelte' | 'vanilla' | 'html'
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  author?: {
    name: string
    avatar?: string
  }
  views: number
  likes: number
  forks: number
}

export interface ShareOptions {
  title: string
  description?: string
  isPublic: boolean
  tags?: string[]
}

class SharingService {
  private baseUrl = '/api/snippets'

  async shareSnippet(files: any[], options: ShareOptions): Promise<{ success: boolean; id?: string; url?: string; error?: string }> {
    try {
      // Generate a unique ID for the snippet
      const snippetId = this.generateSnippetId()
      
      const snippet: Omit<SharedSnippet, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'forks'> = {
        title: options.title,
        description: options.description,
        files: files.map(file => ({
          name: file.name,
          content: file.content || '',
          language: file.language || 'javascript'
        })),
        framework: this.detectFramework(files),
        tags: options.tags || [],
        isPublic: options.isPublic,
        author: {
          name: 'Anonymous Developer', // TODO: Get from auth
        }
      }

      // For now, store in localStorage (in production, this would be a real API)
      const sharedSnippets = this.getStoredSnippets()
      const newSnippet: SharedSnippet = {
        ...snippet,
        id: snippetId,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0,
        forks: 0
      }
      
      sharedSnippets[snippetId] = newSnippet
      localStorage.setItem('mrrkit-shared-snippets', JSON.stringify(sharedSnippets))

      const shareUrl = `${window.location.origin}/snippet/${snippetId}`
      
      return {
        success: true,
        id: snippetId,
        url: shareUrl
      }
    } catch (error) {
      console.error('Failed to share snippet:', error)
      return {
        success: false,
        error: 'Failed to share snippet'
      }
    }
  }

  async getSnippet(id: string): Promise<{ success: boolean; snippet?: SharedSnippet; error?: string }> {
    try {
      const sharedSnippets = this.getStoredSnippets()
      const snippet = sharedSnippets[id]
      
      if (!snippet) {
        return {
          success: false,
          error: 'Snippet not found'
        }
      }

      // Increment view count
      snippet.views += 1
      sharedSnippets[id] = snippet
      localStorage.setItem('mrrkit-shared-snippets', JSON.stringify(sharedSnippets))

      return {
        success: true,
        snippet
      }
    } catch (error) {
      console.error('Failed to get snippet:', error)
      return {
        success: false,
        error: 'Failed to load snippet'
      }
    }
  }

  async getPublicSnippets(limit = 20): Promise<SharedSnippet[]> {
    try {
      const sharedSnippets = this.getStoredSnippets()
      const publicSnippets = Object.values(sharedSnippets)
        .filter(snippet => snippet.isPublic)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
      
      return publicSnippets
    } catch (error) {
      console.error('Failed to get public snippets:', error)
      return []
    }
  }

  async forkSnippet(id: string): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      const result = await this.getSnippet(id)
      if (!result.success || !result.snippet) {
        return { success: false, error: 'Snippet not found' }
      }

      // Increment fork count
      const sharedSnippets = this.getStoredSnippets()
      if (sharedSnippets[id]) {
        sharedSnippets[id].forks += 1
        localStorage.setItem('mrrkit-shared-snippets', JSON.stringify(sharedSnippets))
      }

      // Return files for loading into workspace
      const files = result.snippet.files.map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'file' as const,
        content: file.content,
        language: file.language
      }))

      return {
        success: true,
        files
      }
    } catch (error) {
      console.error('Failed to fork snippet:', error)
      return {
        success: false,
        error: 'Failed to fork snippet'
      }
    }
  }

  async likeSnippet(id: string): Promise<{ success: boolean; likes?: number; error?: string }> {
    try {
      const sharedSnippets = this.getStoredSnippets()
      const snippet = sharedSnippets[id]
      
      if (!snippet) {
        return { success: false, error: 'Snippet not found' }
      }

      snippet.likes += 1
      snippet.updatedAt = new Date()
      sharedSnippets[id] = snippet
      localStorage.setItem('mrrkit-shared-snippets', JSON.stringify(sharedSnippets))

      return {
        success: true,
        likes: snippet.likes
      }
    } catch (error) {
      console.error('Failed to like snippet:', error)
      return {
        success: false,
        error: 'Failed to like snippet'
      }
    }
  }

  private generateSnippetId(): string {
    return [
      Date.now().toString(36),
      Math.random().toString(36).substr(2, 9)
    ].join('')
  }

  private detectFramework(files: any[]): SharedSnippet['framework'] {
    const hasReact = files.some(file => 
      file.content?.includes('import React') || 
      file.content?.includes('from \'react\'') ||
      file.name?.endsWith('.jsx') ||
      file.name?.endsWith('.tsx')
    )

    const hasVue = files.some(file => 
      file.content?.includes('<template>') || 
      file.name?.endsWith('.vue')
    )

    const hasSvelte = files.some(file => 
      file.name?.endsWith('.svelte')
    )

    const hasHtml = files.some(file => 
      file.name?.endsWith('.html') ||
      file.content?.includes('<!DOCTYPE html>')
    )

    if (hasReact) return 'react'
    if (hasVue) return 'vue' 
    if (hasSvelte) return 'svelte'
    if (hasHtml) return 'html'
    return 'vanilla'
  }

  private getStoredSnippets(): Record<string, SharedSnippet> {
    try {
      const stored = localStorage.getItem('mrrkit-shared-snippets')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  // Generate share URL for copying
  generateShareUrl(id: string): string {
    return `${window.location.origin}/snippet/${id}`
  }

  // Copy to clipboard helper
  async copyShareUrl(id: string): Promise<boolean> {
    try {
      const url = this.generateShareUrl(id)
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }
}

export const sharingService = new SharingService()
