'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Send,
  Bot,
  User,
  Code,
  FileText,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  Zap,
  Brain,
  MessageSquare,
  History,
  Lightbulb,
  Wand2,
  Terminal,
  Palette,
  Search,
  BookOpen,
  Brush,
  Settings2,
  Key,
  X,
  ChevronRight,
  Plus,
  FileCode
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/stores/workspace-store'
import { aiService, type AIRequest } from '@/lib/services/ai-service'

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  language?: string;
}

interface AITemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  category: 'code' | 'design' | 'analysis' | 'general';
}

interface QuickPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  icon: React.ReactNode;
  framework?: string;
  style?: string;
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
];

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIPanel({ isOpen, onClose }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI coding assistant. I can help you with code generation, debugging, optimization, and much more. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const templates: AITemplate[] = [
    {
      id: 'react-component',
      title: 'React Component',
      description: 'Generate a React component with props and TypeScript',
      prompt: 'Create a React component called',
      icon: <Code className="h-4 w-4" />,
      category: 'code'
    },
    {
      id: 'api-endpoint',
      title: 'API Endpoint',
      description: 'Generate REST API endpoint with validation',
      prompt: 'Create an API endpoint for',
      icon: <Terminal className="h-4 w-4" />,
      category: 'code'
    },
    {
      id: 'ui-design',
      title: 'UI Component',
      description: 'Design a beautiful UI component with Tailwind',
      prompt: 'Design a modern UI component for',
      icon: <Palette className="h-4 w-4" />,
      category: 'design'
    },
    {
      id: 'debug-code',
      title: 'Debug Code',
      description: 'Find and fix bugs in your code',
      prompt: 'Help me debug this code:',
      icon: <Search className="h-4 w-4" />,
      category: 'analysis'
    },
    {
      id: 'optimize',
      title: 'Optimize Performance',
      description: 'Improve code performance and efficiency',
      prompt: 'Optimize this code for better performance:',
      icon: <Zap className="h-4 w-4" />,
      category: 'analysis'
    },
    {
      id: 'documentation',
      title: 'Write Documentation',
      description: 'Generate comprehensive documentation',
      prompt: 'Write documentation for this code:',
      icon: <BookOpen className="h-4 w-4" />,
      category: 'general'
    }
  ];

  // Initialize AI service with API key
  useEffect(() => {
    if (aiAssistant.apiKey) {
      aiService.setApiKey(aiAssistant.apiKey)
    }
  }, [aiAssistant.apiKey])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus textarea when panel opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
        isCode: input.toLowerCase().includes('code') || input.toLowerCase().includes('component'),
        language: 'typescript'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string): string => {
    if (prompt.toLowerCase().includes('component')) {
      return `Here's a React component for you:

\`\`\`typescript
import React from 'react';

interface Props {
  title: string;
  description?: string;
  onClick?: () => void;
}

export const CustomComponent: React.FC<Props> = ({ 
  title, 
  description, 
  onClick 
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      <button 
        onClick={onClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Click me
      </button>
    </div>
      );
    }
  }
};
\`\`\`

This component includes:
- TypeScript interfaces for type safety
- Optional props with proper defaults
- Tailwind CSS for styling
- Accessible button with hover effects`;
    }

    return `I understand you're asking about "${prompt}". Here's how I can help:

1. **Code Generation**: I can create components, functions, and complete features
2. **Debugging**: I'll analyze your code and suggest fixes
3. **Optimization**: I can improve performance and code quality
4. **Best Practices**: I'll ensure your code follows modern standards

Would you like me to help with any specific implementation?`;
  };

  const useTemplate = (template: AITemplate) => {
    setInput(template.prompt + ' ');
    setActiveTab('chat');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessage = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        content: match[2]
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Bu metod artık kullanılmıyor - sidebar style panel
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const response = generateAIResponse(prompt);
      const message: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        isCode: true,
        language: selectedFramework === 'react' ? 'typescript' : 'javascript'
      };
      
      setMessages(prev => [...prev, message]);
      setPrompt('');
      setIsGenerating(false);
    }, 2000);
  };

  const handleQuickPrompt = (quickPrompt: QuickPrompt) => {
    setInput(quickPrompt.prompt);
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      updateAIAssistant({ apiKey: tempApiKey });
    }
    setShowApiKeyInput(false);
    setTempApiKey('');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Artık kullanılmıyor - sidebar style
    };

    const handleMouseUp = () => {
      // Artık kullanılmıyor - sidebar style
    };

    return () => {
      // Cleanup
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">AI Copilot</h2>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Active</span>
              </div>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
            title="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* API Key Section */}
      {!aiAssistant.apiKey && (
        <div className="px-4 py-3 bg-amber-50/80 border-b border-amber-200/60">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">API Key Required</span>
          </div>
          
          {showApiKeyInput ? (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your OpenAI API key..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="text-sm h-8"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveApiKey} className="text-xs h-7 px-3">
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(false)} className="text-xs h-7 px-3">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(true)} className="text-xs h-7 px-3">
              <Plus className="w-3 h-3 mr-1" />
              Add API Key
            </Button>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 m-0 rounded-none border-b h-10">
          <TabsTrigger value="chat" className="flex items-center gap-1.5 text-xs">
            <MessageSquare className="h-3 w-3" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1.5 text-xs">
            <Wand2 className="h-3 w-3" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs">
            <History className="h-3 w-3" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto" ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      message.type === 'user'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="space-y-2">
                      {formatMessage(message.content).map((part: any, index: number) => (
                        <div key={index}>
                          {part.type === 'text' ? (
                            <p className="whitespace-pre-wrap leading-relaxed">{part.content}</p>
                          ) : (
                            <div className="relative mt-2">
                              <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-1.5 rounded-t-md">
                                <span className="text-xs font-medium">{part.language}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0 text-gray-300 hover:text-white"
                                  onClick={() => copyToClipboard(part.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <pre className="bg-gray-900 text-gray-100 p-3 rounded-b-md overflow-x-auto text-xs">
                                <code>{part.content}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {message.type === 'assistant' && (
                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200">
                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-gray-400 ml-auto">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin text-indigo-500" />
                      <span className="text-gray-600 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Input Area - Always at bottom */}
          <div className="border-t bg-white p-4 flex-shrink-0">
            <div className="space-y-3">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1">
                {quickPrompts.slice(0, 4).map((quickPrompt) => (
                  <Button
                    key={quickPrompt.id}
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickPrompt(quickPrompt)}
                    className="h-6 px-2 text-xs"
                  >
                    {quickPrompt.icon}
                    <span className="ml-1">{quickPrompt.title}</span>
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything about coding..."
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 self-end"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Sparkles className="h-3 w-3" />
                <span>Press Enter to send • Shift+Enter for new line</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 p-4 m-0">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              <div className="text-center">
                <Wand2 className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-1">AI Templates</h3>
                <p className="text-gray-600 text-sm">Quick start prompts for common tasks</p>
              </div>
              {['code', 'design', 'analysis', 'general'].map((category) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 capitalize flex items-center gap-2">
                    {category === 'code' && <Code className="h-4 w-4" />}
                    {category === 'design' && <Palette className="h-4 w-4" />}
                    {category === 'analysis' && <Search className="h-4 w-4" />}
                    {category === 'general' && <Lightbulb className="h-4 w-4" />}
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {templates
                      .filter((template) => template.category === category)
                      .map((template) => (
                        <div
                          key={template.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm hover:border-indigo-200 transition-all cursor-pointer"
                          onClick={() => useTemplate(template)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                              {template.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-800 mb-1 text-sm">
                                {template.title}
                              </h5>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {template.description}
                              </p>
                            </div>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="flex-1 p-4 m-0">
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Chat History</h3>
            <p className="text-gray-500 text-sm">Your previous conversations will appear here</p>
            
            {generationHistory.length > 0 && (
              <div className="mt-6 text-left">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Generations</h4>
                <div className="space-y-2">
                  {generationHistory.slice(-5).map((generation) => (
                    <div key={generation.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FileCode className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{generation.model}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{generation.prompt}</p>
                      <span className="text-xs text-gray-400">
                        {generation.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

}