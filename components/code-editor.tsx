'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  Play, 
  Save, 
  FileText, 
  Plus, 
  X, 
  FolderOpen,
  Search,
  Settings,
  Download
} from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

interface CodeEditorProps {
  project?: any
  onCodeChange?: (files: any) => void
}

interface FileTab {
  id: string
  name: string
  content: string
  language: string
  unsaved: boolean
}

export function CodeEditor({ project, onCodeChange }: CodeEditorProps) {
  const [files, setFiles] = useState<FileTab[]>([])
  const [activeFileId, setActiveFileId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  // Proje yüklendiğinde dosyaları tab'lere çevir
  useEffect(() => {
    if (project?.structure) {
      const projectFiles = Object.entries(project.structure).map(([path, content]) => ({
        id: path,
        name: path,
        content: String(content),
        language: getLanguageFromFile(path),
        unsaved: false
      }))
      setFiles(projectFiles)
      if (projectFiles.length > 0) {
        setActiveFileId(projectFiles[0].id)
      }
    }
  }, [project])

  const getLanguageFromFile = (filename: string) => {
    const ext = filename.split('.').pop()
    const langMap: { [key: string]: string } = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'css': 'css',
      'html': 'html',
      'md': 'markdown'
    }
    return langMap[ext || ''] || 'text'
  }

  const createNewFile = () => {
    const fileName = prompt('Dosya adı (örn: components/NewComponent.tsx):')
    if (!fileName) return

    const newFile: FileTab = {
      id: fileName,
      name: fileName,
      content: getFileTemplate(fileName),
      language: getLanguageFromFile(fileName),
      unsaved: true
    }

    setFiles(prev => [...prev, newFile])
    setActiveFileId(newFile.id)

    toast({
      title: "Yeni Dosya",
      description: `${fileName} oluşturuldu`,
    })
  }

  const getFileTemplate = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
      const componentName = filename.split('/').pop()?.replace(/\.(tsx|jsx)$/, '') || 'Component'
      return `export default function ${componentName}() {
  return (
    <div className="p-4">
      <h1>${componentName}</h1>
    </div>
  )
}`
    }
    
    if (filename.endsWith('.ts') || filename.endsWith('.js')) {
      return `// ${filename}
export const example = () => {
  console.log('Hello from ${filename}')
}`
    }

    if (filename.endsWith('.css')) {
      return `/* ${filename} */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}`
    }

    return `// ${filename}`
  }

  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, content, unsaved: true }
        : file
    ))
    
    // Değişiklikleri parent'a bildir
    const updatedFiles = files.reduce((acc, file) => {
      acc[file.id] = file.id === fileId ? content : file.content
      return acc
    }, {} as any)
    
    onCodeChange?.(updatedFiles)
  }

  const closeFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (file?.unsaved) {
      const shouldClose = confirm(`${file.name} dosyasında kaydedilmemiş değişiklikler var. Kapatmak istediğinizden emin misiniz?`)
      if (!shouldClose) return
    }

    setFiles(prev => prev.filter(f => f.id !== fileId))
    
    if (activeFileId === fileId) {
      const remainingFiles = files.filter(f => f.id !== fileId)
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : '')
    }
  }

  const saveFile = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, unsaved: false }
        : file
    ))

    toast({
      title: "Dosya Kaydedildi",
      description: files.find(f => f.id === fileId)?.name,
    })
  }

  const runCode = async () => {
    setIsRunning(true)
    
    try {
      // Simüle edilmiş kod çalıştırma
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Kod Çalıştırıldı ✅",
        description: "Önizleme güncellendi",
      })
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Kod çalıştırılırken hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const downloadProject = () => {
    const projectData = files.reduce((acc, file) => {
      acc[file.name] = file.content
      return acc
    }, {} as any)

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project?.name || 'project'}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Proje İndirildi",
      description: "Proje dosyaları JSON formatında indirildi",
    })
  }

  const activeFile = files.find(f => f.id === activeFileId)
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="h-fit bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Manuel Editör</CardTitle>
              <p className="text-indigo-200 text-sm">Kodları direkt düzenleyin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
            >
              <Play className="h-4 w-4 mr-1" />
              {isRunning ? 'Çalışıyor...' : 'Çalıştır'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadProject}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-12 h-[600px]">
          {/* File Explorer */}
          <div className="col-span-3 border-r border-white/10 bg-white/5">
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="h-4 w-4 text-white" />
                <span className="text-white font-medium text-sm">Dosyalar</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={createNewFile}
                  className="ml-auto w-6 h-6 p-0 text-white hover:bg-white/20"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Dosya ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-7 bg-white/10 border-white/20 text-white text-xs placeholder:text-gray-400"
                />
              </div>
            </div>
            
            <div className="overflow-auto h-[calc(100%-80px)]">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`p-2 cursor-pointer text-sm border-b border-white/5 transition-colors ${
                    activeFileId === file.id
                      ? 'bg-indigo-500/30 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      <span className="truncate">{file.name}</span>
                      {file.unsaved && (
                        <div className="w-1 h-1 bg-orange-400 rounded-full" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs border-white/30">
                      {file.language}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor Area */}
          <div className="col-span-9 flex flex-col">
            {/* File Tabs */}
            {files.length > 0 && (
              <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto">
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 px-3 py-2 border-r border-white/10 cursor-pointer transition-colors min-w-0 ${
                      activeFileId === file.id
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                    {file.unsaved && (
                      <div className="w-1 h-1 bg-orange-400 rounded-full flex-shrink-0" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closeFile(file.id)
                      }}
                      className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/20 flex-shrink-0"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Code Editor */}
            {activeFile ? (
              <div className="flex-1 relative">
                <textarea
                  value={activeFile.content}
                  onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
                  className="w-full h-full p-4 bg-gray-900 text-green-400 font-mono text-sm resize-none border-0 outline-none"
                  style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
                  placeholder="Kodunuzu buraya yazın..."
                />
                
                {/* Editor Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveFile(activeFile.id)}
                    disabled={!activeFile.unsaved}
                    className="w-6 h-6 p-0 bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-3 text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>{activeFile.language}</span>
                    <span>UTF-8</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Satır: {activeFile.content.split('\n').length}</span>
                    <span>Karakter: {activeFile.content.length}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-900">
                <div className="text-center text-gray-500">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Dosya Seçin</p>
                  <p className="text-sm">Sol panelden bir dosya seçin veya yeni dosya oluşturun</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
