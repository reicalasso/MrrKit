'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { 
  Search, 
  Replace, 
  Code, 
  Play, 
  Bug, 
  Palette, 
  Settings, 
  MoreVertical,
  Copy,
  Clipboard,
  Undo2,
  Redo2,
  Save,
  Download,
  Upload,
  Zap,
  BookOpen,
  HelpCircle,
  Maximize,
  Minimize,
  RotateCcw,
  GitBranch,
  FileText
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CodeMirrorEditor } from './code-mirror-editor'
import { useToast } from '@/lib/hooks/use-toast'
import { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { undo, redo } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'

interface AdvancedEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'light' | 'dark'
  className?: string
  onSave?: () => void
}

interface Problem {
  severity: 'error' | 'warning' | 'info'
  message: string
  line: number
  column: number
}

interface Bookmark {
  id: string
  line: number
  label: string
}

export function AdvancedEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'light',
  className,
  onSave
}: AdvancedEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [problems, setProblems] = useState<Problem[]>([])
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [currentLine, setCurrentLine] = useState(1)
  const [currentColumn, setCurrentColumn] = useState(1)
  const [wordCount, setWordCount] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  const [showMinimap, setShowMinimap] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [wordWrap, setWordWrap] = useState(false)
  const [autoComplete, setAutoComplete] = useState(true)
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update word count when value changes
  useEffect(() => {
    setWordCount(value.split(/\s+/).filter(word => word.length > 0).length)
  }, [value])

  // Validate code and find problems
  useEffect(() => {
    validateCode(value)
  }, [value, selectedLanguage])

  const validateCode = (code: string) => {
    const newProblems: Problem[] = []
    
    // Basic validation
    const lines = code.split('\n')
    lines.forEach((line, index) => {
      // Check for missing semicolons (JavaScript)
      if (selectedLanguage === 'javascript' && line.trim().endsWith('}') === false && 
          line.includes('=') && !line.trim().endsWith(';') && line.trim() !== '') {
        newProblems.push({
          severity: 'warning',
          message: 'Missing semicolon',
          line: index + 1,
          column: line.length
        })
      }
      
      // Check for console.log
      if (line.includes('console.log')) {
        newProblems.push({
          severity: 'info',
          message: 'Console statement found',
          line: index + 1,
          column: line.indexOf('console.log')
        })
      }
    })
    
    setProblems(newProblems)
  }

  const handleSearch = useCallback(() => {
    if (!editorRef.current?.view) return
    // findNext(editorRef.current.view)
  }, [])

  const handleReplace = useCallback(() => {
    if (!editorRef.current?.view) return
    const view = editorRef.current.view
    if (view) {
      const { state } = view
      const selection = state.selection.main
      if (!selection.empty) {
        view.dispatch({
          changes: { from: selection.from, to: selection.to, insert: replaceTerm }
        })
      }
    }
  }, [replaceTerm])

  useEffect(() => {
    if (editorRef.current?.view) {
      // const query = getSearchQuery(editorRef.current.view.state)
      // if (query.search !== searchTerm) {
      //   const newQuery = new SearchQuery({ search: searchTerm, caseSensitive: true })
      //   editorRef.current.view.dispatch({
      //     effects: setSearchQuery.of(newQuery)
      //   })
      // }
    }
  }, [searchTerm])

  const formatCode = useCallback(() => {
    // Basic code formatting
    try {
      let formatted = value
      
      if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
        // Basic JavaScript formatting
        formatted = value
          .replace(/\{\s*\n/g, '{\n  ')
          .replace(/\n\s*\}/g, '\n}')
          .replace(/;\s*\n/g, ';\n')
      }
      
      onChange(formatted)
      toast({
        title: "Kod Formatlandı",
        description: "Kod başarıyla formatlandı",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kod formatlanırken hata oluştu",
        variant: "destructive",
      })
    }
  }, [value, selectedLanguage, onChange, toast])

  const addBookmark = useCallback(() => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      line: currentLine,
      label: `Bookmark ${bookmarks.length + 1}`
    }
    setBookmarks([...bookmarks, newBookmark])
    
    toast({
      title: "Bookmark Eklendi",
      description: `Satır ${currentLine} bookmark'landı`,
    })
  }, [currentLine, bookmarks, toast])

  const goToLine = useCallback((line: number) => {
    if (!editorRef.current?.view) return
    const pos = editorRef.current.view.state.doc.line(line).from
    editorRef.current.view.dispatch({
      selection: { anchor: pos },
      scrollIntoView: true,
    })
    editorRef.current.view.focus()
  }, [])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast({
        title: "Kopyalandı",
        description: "Kod panoya kopyalandı",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kod kopyalanamadı",
        variant: "destructive",
      })
    }
  }, [value, toast])

  const downloadCode = useCallback(() => {
    const blob = new Blob([value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${selectedLanguage === 'typescript' ? 'ts' : 'js'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "İndirildi",
      description: "Kod dosyası indirildi",
    })
  }, [value, selectedLanguage, toast])

  const handleUndo = () => editorRef.current?.view && undo(editorRef.current.view)
  const handleRedo = () => editorRef.current?.view && redo(editorRef.current.view)

  const handleCursorChange = useCallback((update: any) => {
    if (update.selectionSet) {
      const pos = update.state.selection.main.head
      const line = update.state.doc.lineAt(pos)
      setCurrentLine(line.number)
      setCurrentColumn(pos - line.from)
    }
  }, [])

  const handleShare = useCallback(() => {
    try {
      const shareData = {
        title: 'Kod Paylaşımı',
        text: 'Bu kodu paylaşmak istiyorum:',
        url: window.location.href,
      }
      if (navigator.share) {
        navigator.share(shareData)
          .then(() => toast({ title: "Paylaşıldı", description: "Kod başarıyla paylaşıldı" }))
          .catch((error) => toast({ title: "Hata", description: "Paylaşım başarısız oldu", variant: "destructive" }))
      } else {
        toast({ title: "Desteklenmiyor", description: "Tarayıcınız paylaşımı desteklemiyor", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Hata", description: "Paylaşım sırasında bir hata oluştu", variant: "destructive" })
    }
  }, [toast])

  const handleUpload = useCallback(async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.js,.ts,.jsx,.tsx,.css,.html,.json';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          onChange(text);
          toast({
            title: "Yüklendi",
            description: `${file.name} başarıyla yüklendi`,
          });
        }
      };
      input.click();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Dosya yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [onChange, toast]);

  const handleRunCode = useCallback(() => {
    try {
      // Basic JavaScript code execution
      if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
        // eslint-disable-next-line no-eval
        eval(value);
        toast({
          title: "Çalıştırıldı",
          description: "Kod başarıyla çalıştırıldı",
        });
      } else {
        toast({
          title: "Desteklenmiyor",
          description: "Bu dil için çalıştırma desteklenmiyor",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kod çalıştırılırken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [value, selectedLanguage, toast])

  if (!mounted) {
    return (
      <div className={`flex flex-col h-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg overflow-hidden items-center justify-center ${className}`}>
        <p>Loading Editor...</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={`flex flex-col h-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
        {/* Advanced Toolbar */}
        <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-1">
            {/* File Operations */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700" onClick={onSave}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700" onClick={downloadCode}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-600 mx-1" />

            {/* Edit Operations */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700" onClick={handleUndo}>
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700" onClick={handleRedo}>
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy All</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-600 mx-1" />

            {/* Search & Replace */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant={showSearch ? "secondary" : "ghost"}
                  className="text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search (Ctrl+F)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant={showReplace ? "secondary" : "ghost"}
                  className="text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowReplace(!showReplace)}
                >
                  <Replace className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Replace (Ctrl+H)</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-600 mx-1" />

            {/* Code Operations */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700" onClick={formatCode}>
                  <Palette className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Format Code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700" onClick={addBookmark}>
                  <BookOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Bookmark</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32 h-8 bg-gray-800 border-gray-600 text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-gray-300">
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="jsx">JSX</SelectItem>
                <SelectItem value="tsx">TSX</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>

            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-700">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-600 text-gray-300">
                <DropdownMenuItem onClick={() => setShowLineNumbers(!showLineNumbers)}>
                  {showLineNumbers ? '✓' : ''} Line Numbers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowMinimap(!showMinimap)}>
                  {showMinimap ? '✓' : ''} Minimap
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWordWrap(!wordWrap)}>
                  {wordWrap ? '✓' : ''} Word Wrap
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAutoComplete(!autoComplete)}>
                  {autoComplete ? '✓' : ''} Auto Complete
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem>
                  Font Size: {fontSize}px
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Tab Size: {tabSize}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-gray-300 hover:bg-gray-700"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Fullscreen</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Search & Replace Panel */}
        {(showSearch || showReplace) && (
          <div className="p-3 bg-gray-700 border-b border-gray-600">
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-8 bg-gray-800 border-gray-600 text-gray-300"
                />
              </div>
              {showReplace && (
                <div className="flex-1">
                  <Input
                    placeholder="Replace with..."
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                    className="h-8 bg-gray-800 border-gray-600 text-gray-300"
                  />
                </div>
              )}
              <Button size="sm" onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
              {showReplace && (
                <Button size="sm" onClick={handleReplace} className="bg-blue-600 hover:bg-blue-700">
                  <Replace className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <CodeMirrorEditor
              ref={editorRef}
              value={value}
              onChange={onChange}
              language={selectedLanguage}
              theme="dark"
              className="flex-1"
              onSave={onSave}
              onCursorChange={handleCursorChange}
              options={{
                lineNumbers: showLineNumbers,
                wordWrap: wordWrap,
                fontSize: fontSize,
                tabSize: tabSize,
                autoComplete: autoComplete,
              }}
            />
          </div>

          {/* Side Panels */}
          <div className="w-80 border-l border-gray-700 bg-gray-800">
            <Tabs defaultValue="problems" className="h-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900">
                <TabsTrigger value="problems" className="text-xs text-gray-300 data-[state=active]:bg-gray-700">
                  Problems
                  {problems.length > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      {problems.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="text-xs text-gray-300 data-[state=active]:bg-gray-700">
                  Bookmarks
                </TabsTrigger>
                <TabsTrigger value="outline" className="text-xs text-gray-300 data-[state=active]:bg-gray-700">
                  Outline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="problems" className="p-3 h-full overflow-auto">
                <div className="space-y-2">
                  {problems.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No problems found
                    </p>
                  ) : (
                    problems.map((problem, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-md border cursor-pointer hover:bg-gray-700 ${
                          problem.severity === 'error' ? 'bg-red-900/50 border-red-500/30' :
                          problem.severity === 'warning' ? 'bg-yellow-900/50 border-yellow-500/30' :
                          'bg-blue-900/50 border-blue-500/30'
                        }`}
                        onClick={() => goToLine(problem.line)}
                      >
                        <div className="flex items-center gap-2">
                          <Bug className={`h-4 w-4 ${
                            problem.severity === 'error' ? 'text-red-400' :
                            problem.severity === 'warning' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                          <span className="text-sm font-medium text-gray-300">{problem.message}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Line {problem.line}, Column {problem.column}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bookmarks" className="p-3 h-full overflow-auto">
                <div className="space-y-2">
                  {bookmarks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No bookmarks
                    </p>
                  ) : (
                    bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="p-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700"
                        onClick={() => goToLine(bookmark.line)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">{bookmark.label}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              setBookmarks(bookmarks.filter(b => b.id !== bookmark.id))
                            }}
                          >
                            ×
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Line {bookmark.line}</p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="outline" className="p-3 h-full overflow-auto">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 text-center py-8">
                    Code outline will appear here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-blue-800 text-white text-xs flex items-center justify-between px-3">
          <div className="flex items-center gap-4">
            <span>Ln {currentLine}, Col {currentColumn}</span>
            <span>{selectedLanguage.toUpperCase()}</span>
            <span>UTF-8</span>
            <span>{value.split('\n').length} lines</span>
            <span>{wordCount} words</span>
            <span>{value.length} chars</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Spaces: {tabSize}</span>
            <span>Auto Save: On</span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              main
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

