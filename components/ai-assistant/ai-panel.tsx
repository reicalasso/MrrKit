'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Wand2, 
  RefreshCw, 
  Sparkles, 
  MessageSquare, 
  Code, 
  Lightbulb,
  Settings,
  History,
  Copy,
  Download,
  Heart,
  Zap,
  Brush,
  Settings2,
  Key,
  Bot
} from 'lucide-react'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { aiService, type AIRequest } from '@/lib/services/ai-service'

interface QuickPrompt {
  id: string
  title: string
  description: string
  prompt: string
  category: 'component' | 'layout' | 'animation' | 'utility'
  icon: React.ReactNode
  framework?: string
  style?: string
}

const quickPrompts: QuickPrompt[] = [
  {
    id: 'modern-button',
    title: 'Modern Button',
    description: 'Animated gradient button',
    prompt: 'Modern, animated gradient button component with hover effects',
    category: 'component',
    icon: <Brush className="w-4 h-4" />,
    framework: 'react',
    style: 'tailwind'
  },
  {
    id: 'hero-section',
    title: 'Hero Section',
    description: 'Landing page hero',
    prompt: 'Hero section with background, title, subtitle and CTA button',
    category: 'layout',
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'card-component',
    title: 'Card Component',
    description: 'Responsive card with image',
    prompt: 'Card component with image, title, description and action buttons',
    category: 'component',
    icon: <Code className="w-4 h-4" />
  },
  {
    id: 'loading-spinner',
    title: 'Loading Spinner',
    description: 'CSS loading animation',
    prompt: 'Beautiful loading spinner with CSS animations',
    category: 'animation',
    icon: <RefreshCw className="w-4 h-4" />
  },
  {
    id: 'custom-hook',
    title: 'Custom Hook',
    description: 'React useLocalStorage hook',
    prompt: 'Custom React hook for localStorage management',
    category: 'utility',
    icon: <Settings2 className="w-4 h-4" />
  },
]

export function AIPanel() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  const [selectedTask, setSelectedTask] = useState<AIRequest['task']>('generate')
  const [selectedFramework, setSelectedFramework] = useState<string>('react')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const {
    aiAssistant,
    updateAIAssistant,
    addGenerationHistory,
    generationHistory,
    clearGenerationHistory,
    activeFileId,
    files,
    updateFile
  } = useWorkspaceStore()

  // Initialize AI service with API key
  useEffect(() => {
    if (aiAssistant.apiKey) {
      aiService.setApiKey(aiAssistant.apiKey)
    }
  }, [aiAssistant.apiKey])

  const findActiveFile = () => {
    const findFile = (fileList: any[]): any => {
      for (const file of fileList) {
        if (file.id === activeFileId) return file
        if (file.children) {
          const found = findFile(file.children)
          if (found) return found
        }
      }
      return null
    }
    return findFile(files)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    if (!aiAssistant.apiKey) {
      setShowApiKeyInput(true)
      return
    }

    setIsGenerating(true)
    
    try {
      const request: AIRequest = {
        prompt: prompt.trim(),
        task: selectedTask,
        framework: selectedFramework as any,
        style: 'tailwind',
        ...(selectedTask !== 'generate' && { 
          code: findActiveFile()?.content || '',
          language: findActiveFile()?.language || 'javascript'
        })
      }

      const response = await aiService.generateCode(request)
      
      if (response.success && response.result) {
        // Add to history
        addGenerationHistory({
          prompt: prompt.trim(),
          result: response.result,
          model: aiAssistant.model
        })

        // If generating new code and we have an active file, update it
        if (selectedTask === 'generate' && activeFileId) {
          updateFile(activeFileId, { 
            content: response.result,
            isDirty: true
          })
        } else if (selectedTask === 'generate') {
          // Create new file if no active file
          const newFileName = `generated-${Date.now()}.jsx`
          const newFile = {
            id: Date.now().toString(),
            name: newFileName,
            type: 'file' as const,
            content: response.result,
            language: 'javascript',
            isDirty: false
          }
          // Note: This would need to be handled by the parent component
          console.log('New file would be created:', newFile)
        }

        setPrompt('')
      } else {
        console.error('AI Generation failed:', response.error)
        // Show error to user
      }
    } catch (error) {
      console.error('AI Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuickPrompt = (quickPrompt: QuickPrompt) => {
    setPrompt(quickPrompt.prompt)
    setSelectedTask('generate')
    if (quickPrompt.framework) {
      setSelectedFramework(quickPrompt.framework)
    }
    textareaRef.current?.focus()
  }

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      updateAIAssistant({ 
        apiKey: tempApiKey.trim(),
        isEnabled: true 
      })
      setShowApiKeyInput(false)
      setTempApiKey('')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50/70 to-pink-50/70">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
            <p className="text-sm text-gray-600">GPT-4 powered code generation</p>
          </div>
        </div>

        {/* API Key Setup */}
        {!aiAssistant.apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">API Anahtarı Gerekli</span>
            </div>
            <p className="text-xs text-yellow-700 mb-3">
              AI özelliklerini kullanmak için OpenAI API anahtarınızı girin.
            </p>
            {showApiKeyInput ? (
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="text-xs"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveApiKey} className="text-xs">
                    Kaydet
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowApiKeyInput(false)} className="text-xs">
                    İptal
                  </Button>
                </div>
              </div>
            ) : (
              <Button size="sm" onClick={() => setShowApiKeyInput(true)} className="text-xs">
                API Anahtarı Ekle
              </Button>
            )}
          </div>
        )}

        {aiAssistant.apiKey && (
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              AI Aktif
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowApiKeyInput(true)}
              className="h-6 w-6 p-0"
            >
              <Settings className="w-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="generate" className="text-xs">
              <Wand2 className="w-3 h-3 mr-1" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="assist" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Assist
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <History className="w-3 h-3 mr-1" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="flex-1 flex flex-col p-4 space-y-4">
            {/* Quick Prompts */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">🚀 Quick Start</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.slice(0, 4).map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="h-auto p-3 flex flex-col items-start text-left hover:bg-white/80"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {prompt.icon}
                      <span className="text-xs font-medium">{prompt.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{prompt.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Task</label>
                <Select value={selectedTask} onValueChange={(value: any) => setSelectedTask(value)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generate">Generate</SelectItem>
                    <SelectItem value="explain">Explain</SelectItem>
                    <SelectItem value="fix">Fix</SelectItem>
                    <SelectItem value="optimize">Optimize</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Framework</label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="svelte">Svelte</SelectItem>
                    <SelectItem value="vanilla">Vanilla JS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                💭 Prompt
              </label>
              <Textarea
                ref={textareaRef}
                placeholder="Örnek: Modern bir todo liste komponenti oluştur..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 min-h-[100px] text-sm border-gray-200/60 bg-white/70 backdrop-blur-sm resize-none focus:border-purple-300 focus:ring-2 focus:ring-purple-200/50 rounded-xl shadow-sm transition-all duration-200"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !aiAssistant.apiKey}
              className="w-full h-12 text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Code
                </>
              )}
            </Button>
          </TabsContent>

          {/* Assist Tab */}
          <TabsContent value="assist" className="flex-1 p-4 space-y-4">
            <div className="text-center text-gray-500 py-8">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Code assistance features</p>
              <p className="text-sm">Select code to get AI suggestions</p>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Generation History</h3>
              {generationHistory.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearGenerationHistory}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {generationHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No generation history yet</p>
                </div>
              ) : (
                generationHistory.slice(-10).reverse().map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs text-gray-600 flex-1">{item.prompt}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.result)}
                        className="h-6 w-6 p-0 ml-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
