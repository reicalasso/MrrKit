'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Wand2, 
  RefreshCw, 
  Sparkles, 
  Code, 
  Key,
  Bot,
  X,
  Minimize2,
  Maximize2,
  Copy,
  Settings2,
  Brush,
  Zap
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
  const [selectedTask, setSelectedTask] = useState<AIRequest['task']>('generate')
  const [selectedFramework, setSelectedFramework] = useState<string>('react')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  
  const {
    aiAssistant,
    updateAIAssistant,
    addGenerationHistory,
    generationHistory,
    clearGenerationHistory,
    activeFileId,
    files,
    updateFile,
    addFile,
    setActiveFile,
    addOpenFile
  } = useWorkspaceStore()

  // Initialize AI service with API key
  useEffect(() => {
    if (aiAssistant.apiKey) {
      aiService.setApiKey(aiAssistant.apiKey)
    }
  }, [aiAssistant.apiKey])

  // Auto-focus textarea when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen, isMinimized])

  // Save panel position in localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('aiPanelPosition')
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
      } catch (e) {
        console.error('Failed to parse saved position')
      }
    }
  }, [])

  useEffect(() => {
    if (position) {
      localStorage.setItem('aiPanelPosition', JSON.stringify(position))
    }
  }, [position])

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
          const newFileName = `generated-${Date.now()}.${selectedFramework === 'react' ? 'jsx' : 'js'}`
          const newFile = {
            id: Date.now().toString(),
            name: newFileName,
            type: 'file' as const,
            content: response.result,
            language: selectedFramework === 'react' ? 'javascript' : 'javascript',
            isDirty: false
          }

          // Add the file to the workspace
          addFile(newFile)
          setActiveFile(newFile.id)
          addOpenFile(newFile)
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

  // Handle dragging the panel
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const panelRect = panelRef.current.getBoundingClientRect();
    const offsetX = startX - panelRect.left;
    const offsetY = startY - panelRect.top;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      
      // Ensure panel stays within viewport
      const maxX = window.innerWidth - panelRect.width;
      const maxY = window.innerHeight - panelRect.height;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Floating action button when panel is closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
        >
          <Bot className="w-5 h-5 text-white" />
        </Button>
      </div>
    )
  }

  // Panel styles based on state
  const panelStyles = isMinimized
    ? "w-64 h-10"
    : "w-80 h-[450px]";

  const positionStyles = position
    ? { top: `${position.y}px`, left: `${position.x}px` }
    : { bottom: '6rem', right: '1.5rem' };

  return (
    <div 
      ref={panelRef}
      className={`fixed z-50 transition-all duration-200 ${panelStyles}`}
      style={positionStyles}
    >
      <div className="h-full flex flex-col bg-white rounded-lg shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Draggable Header */}
        <div 
          className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-3 py-2 flex items-center justify-between cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xs font-medium text-gray-700">AI Copilot</h2>
          </div>
          
          <div className="flex items-center gap-1">
            {isMinimized ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(false)}
                className="h-6 w-6 p-0 rounded-md"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 rounded-md"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 rounded-md"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Content area - show only when not minimized */}
        {!isMinimized && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* API Key notice if needed */}
            {!aiAssistant.apiKey && (
              <div className="px-3 py-2 bg-amber-50 border-b border-amber-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Key className="w-3 h-3 text-amber-500" />
                  <span className="text-xs font-medium text-amber-700">API Key Required</span>
                </div>
                
                {showApiKeyInput ? (
                  <div className="mt-2 space-y-1.5">
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      className="text-xs h-7 bg-white"
                    />
                    <div className="flex gap-1.5">
                      <Button size="sm" onClick={handleSaveApiKey} className="text-xs h-6 px-2 bg-indigo-500 hover:bg-indigo-600">
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(false)} className="text-xs h-6 px-2">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(true)} className="text-xs h-6 px-2 mt-1">
                    Add API Key
                  </Button>
                )}
              </div>
            )}
            
            {/* Main panel content */}
            <div className="p-3 flex-1 flex flex-col space-y-2.5 overflow-y-auto">
              {/* Task & Framework Selector */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Select value={selectedTask} onValueChange={(value: any) => setSelectedTask(value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generate">Generate</SelectItem>
                      <SelectItem value="explain">Explain</SelectItem>
                      <SelectItem value="fix">Fix</SelectItem>
                      <SelectItem value="optimize">Optimize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                      <SelectItem value="vanilla">Vanilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Quick prompts */}
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.slice(0, 2).map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="h-auto py-1.5 px-2 flex items-center gap-1 text-left justify-start bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-md"
                  >
                    <div className="flex-shrink-0">{prompt.icon}</div>
                    <span className="text-xs truncate">{prompt.title}</span>
                  </Button>
                ))}
              </div>
              
              {/* Prompt textarea */}
              <div className="flex-1 min-h-0">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask AI to generate, explain, or fix code..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-full min-h-[120px] text-xs resize-none border-gray-200 rounded-md focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
                />
              </div>
              
              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating || !aiAssistant.apiKey}
                className="w-full h-8 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-md"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            
            {/* History panel */}
            {generationHistory.length > 0 && (
              <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 max-h-32 overflow-y-auto">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-medium text-gray-700">Recent</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearGenerationHistory}
                    className="h-5 text-[10px] text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                </div>
                
                <div className="space-y-1.5">
                  {generationHistory.slice(-3).reverse().map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-1.5 bg-white rounded-md border border-gray-200">
                      <p className="text-xs text-gray-600 truncate flex-1">{item.prompt}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.result)}
                        className="h-5 w-5 p-0 ml-1"
                        title="Copy code"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}