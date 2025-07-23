"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CodeRenderer } from '@/lib/code-renderer'
import { Eye, Code, Copy, Download, FileDown } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

interface PreviewProps {
  generatedCode: string
}

export function Preview({ generatedCode }: PreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [renderError, setRenderError] = useState<string | null>(null)
  const { toast } = useToast()

  // Error'ı temizle when new code arrives
  useEffect(() => {
    if (generatedCode) {
      setRenderError(null)
    }
  }, [generatedCode])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      toast({
        title: "Başarılı!",
        description: "Kod panoya kopyalandı",
      })
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Kod kopyalanamadı",
        variant: "destructive",
      })
    }
  }

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-component.jsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Başarılı!",
      description: "Kod dosyası indirildi",
    })
  }

  const exportAsReactProject = () => {
    // Basit React projesi template'i
    const projectFiles = {
      'package.json': JSON.stringify({
        name: 'mrrkit-generated-app',
        version: '1.0.0',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        },
        scripts: {
          'start': 'react-scripts start',
          'build': 'react-scripts build'
        }
      }, null, 2),
      'src/App.js': generatedCode,
      'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
      'public/index.html': `<!DOCTYPE html>
<html>
<head>
  <title>MrrKit Generated App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
    }

    // ZIP oluşturma burada olacak (şimdilik basit download)
    downloadCode()
  }

  return (
    <Card className="h-fit bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Canlı Önizleme</CardTitle>
              <CardDescription className="text-gray-300">
                Üretilen kod burada görünecek
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge 
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              className={`cursor-pointer transition-all duration-200 ${
                viewMode === 'preview' 
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30' 
                  : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
              }`}
              onClick={() => setViewMode('preview')}
            >
              👁️ Önizleme
            </Badge>
            <Badge 
              variant={viewMode === 'code' ? 'default' : 'outline'}
              className={`cursor-pointer transition-all duration-200 ${
                viewMode === 'code' 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/30 hover:bg-purple-500/30' 
                  : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
              }`}
              onClick={() => setViewMode('code')}
            >
              💻 Kod
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="min-h-[400px] overflow-hidden">
          {generatedCode ? (
            viewMode === 'preview' ? (
              <div className="h-[400px] overflow-auto bg-gradient-to-br from-gray-50 to-white">
                <CodeRenderer 
                  code={generatedCode} 
                  onError={setRenderError}
                />
              </div>
            ) : (
              <div className="relative">
                <pre className="p-6 text-sm overflow-auto h-[400px] bg-gray-900 text-green-400 font-mono leading-relaxed">
                  <code>{generatedCode}</code>
                </pre>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gray-800/50 text-green-400 border-green-400/30">
                    React JSX
                  </Badge>
                </div>
              </div>
            )
          ) : (
            <div className="p-8 text-center text-gray-300 flex items-center justify-center h-[400px] bg-gradient-to-br from-white/5 to-white/10">
              <div className="space-y-4">
                <div className="text-6xl opacity-40 animate-pulse">🎨</div>
                <div>
                  <p className="text-xl font-medium mb-2">Önizleme Hazır</p>
                  <p className="text-sm opacity-75">Bir prompt girin ve büyüyü başlatın</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {renderError && (
          <div className="mx-6 mb-6 p-4 bg-amber-500/10 border border-amber-400/20 rounded-lg text-amber-300 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <strong>Render Uyarısı</strong>
            </div>
            <p>{renderError}</p>
            <p className="text-xs mt-2 opacity-75">Kod görüntüleme moduna geçerek ham kodu inceleyebilirsiniz.</p>
          </div>
        )}
        
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              disabled={!generatedCode}
              onClick={copyToClipboard}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              Kopyala
            </Button>
            <Button 
              variant="outline" 
              disabled={!generatedCode}
              onClick={downloadCode}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              İndir
            </Button>
            <Button 
              variant="outline" 
              disabled={!generatedCode}
              onClick={exportAsReactProject}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Proje
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
