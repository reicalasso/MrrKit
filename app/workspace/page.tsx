'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
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
  Sparkles
} from 'lucide-react'
import { CodeRenderer } from '@/lib/code-renderer'

export default function WorkspacePage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split')
  const [projectName, setProjectName] = useState('Yeni Proje')
  const [files, setFiles] = useState([
    { id: 'main', name: 'App.jsx', content: '', active: true },
  ])
  const [activeFile, setActiveFile] = useState('main')

  // Ana sayfadan gelen prompt'u yükle
  useEffect(() => {
    const initialPrompt = localStorage.getItem('initialPrompt')
    if (initialPrompt) {
      setPrompt(initialPrompt)
      localStorage.removeItem('initialPrompt') // Kullanıldıktan sonra temizle
    }
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      
      const data = await response.json()
      if (data.success) {
        const code = data.components?.[0]?.code || data.code || ''
        setGeneratedCode(code)
        
        // Update active file
        setFiles(prev => prev.map(file => 
          file.id === activeFile 
            ? { ...file, content: code }
            : file
        ))
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const AIEditor = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Kod Editörü</h2>
            <p className="text-xs text-purple-200">Prompt yazın, kod alın</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              💭 Ne yapmak istiyorsunuz?
            </label>
            <Textarea
              placeholder="Örnek: Modern bir e-ticaret ürün kartı oluştur..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-gray-400">🎨 Stil</label>
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                  <SelectValue placeholder="Modern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="colorful">Renkli</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400">📱 Platform</label>
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                  <SelectValue placeholder="Web" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400">⚡ Özellikler</label>
            <div className="space-y-2">
              {[
                'Responsive tasarım',
                'Dark mode desteği',
                'Animasyonlar',
                'Form validasyonu'
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox id={feature} className="border-white/30" />
                  <label htmlFor={feature} className="text-xs text-gray-300">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Üretiliyor...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Kod Üret
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-300">🚀 Hızlı Aksiyonlar</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
            <Plus className="mr-1 h-3 w-3" />
            Dosya
          </Button>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
            <Save className="mr-1 h-3 w-3" />
            Kaydet
          </Button>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
            <Download className="mr-1 h-3 w-3" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
            <Share className="mr-1 h-3 w-3" />
            Paylaş
          </Button>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="p-4 space-y-3 border-t border-white/10">
        <h3 className="text-sm font-medium text-gray-300">💡 AI Önerileri</h3>
        <div className="space-y-2">
          {[
            'Loading state ekle',
            'Error handling iyileştir',
            'Responsive yap',
            'Accessibility ekle'
          ].map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left p-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const FileExplorer = () => (
    <div className="h-full bg-gray-900 border-r border-gray-700">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">📁 Dosyalar</h3>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="p-2">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={`w-full text-left p-2 text-sm rounded mb-1 transition-colors ${
              file.id === activeFile 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <FileText className="inline mr-2 h-3 w-3" />
            {file.name}
          </button>
        ))}
      </div>
    </div>
  )

  const CodeEditor = () => {
    const activeFileContent = files.find(f => f.id === activeFile)?.content || generatedCode
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-white">
              {files.find(f => f.id === activeFile)?.name || 'App.jsx'}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={viewMode === 'code' ? 'default' : 'ghost'}
              onClick={() => setViewMode('code')}
            >
              <Code className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              onClick={() => setViewMode('preview')}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'split' ? 'default' : 'ghost'}
              onClick={() => setViewMode('split')}
            >
              <Split className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex">
          {(viewMode === 'code' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-700`}>
              <pre className="h-full p-4 bg-gray-900 text-green-400 text-sm overflow-auto font-mono">
                <code>{activeFileContent || '// Kod üretmek için AI editörünü kullanın...'}</code>
              </pre>
            </div>
          )}
          
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} bg-white`}>
              {activeFileContent ? (
                <CodeRenderer code={activeFileContent} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Eye className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>Önizleme bekleniyor</p>
                    <p className="text-sm">AI editörü ile kod üretin</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <h1 className="text-lg font-bold text-white">MrrKit Workspace</h1>
          </div>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-white text-sm border-none outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            Çevrimiçi
          </Badge>
          <Button size="sm" variant="ghost">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* AI Editor Sidebar */}
        <div className="w-80 border-r border-gray-700">
          <AIEditor />
        </div>

        {/* Code Area */}
        <div className="flex-1 flex">
          {/* File Explorer */}
          <div className="w-64">
            <FileExplorer />
          </div>
          
          {/* Editor + Preview */}
          <div className="flex-1">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  )
}
