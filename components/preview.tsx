"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CodeRenderer } from '@/lib/code-renderer'
import { Eye, Code, Copy, Download, FileDown, Smartphone, Monitor } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

interface PreviewProps {
  generatedCode: string
  onError?: (error: Error | null) => void
}

export function Preview({ generatedCode, onError }: PreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [renderError, setRenderError] = useState<string | null>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

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
    <Card className="w-full max-w-none bg-white border-gray-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl text-gray-900">Canlı Önizleme</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Üretilen kod burada görünecek
              </CardDescription>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                viewMode === 'preview' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isMobile ? <Eye className="h-4 w-4" /> : <><Eye className="h-4 w-4" />Önizleme</>}
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                viewMode === 'code' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isMobile ? <Code className="h-4 w-4" /> : <><Code className="h-4 w-4" />Kod</>}
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="min-h-[300px] sm:min-h-[400px] overflow-hidden rounded-lg border border-gray-200 mx-4 sm:mx-6 mb-4 sm:mb-6">
          {generatedCode ? (
            viewMode === 'preview' ? (
              <div className="h-[300px] sm:h-[400px] overflow-auto bg-gradient-to-br from-gray-50 to-white">
                <CodeRenderer 
                  code={generatedCode}
                  onError={(e) => {
                    setRenderError(e ? e.message : null)
                    if (onError) onError(e)
                  }}
                />
              </div>
            ) : (
              <div className="relative h-[300px] sm:h-[400px]">
                <pre className="p-4 text-xs sm:text-sm overflow-auto h-full bg-gray-900 text-green-400 font-mono leading-relaxed">
                  <code>{generatedCode}</code>
                </pre>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gray-800/80 text-green-400 border-green-400/30 text-xs">
                    React JSX
                  </Badge>
                </div>
              </div>
            )
          ) : (
            <div className="p-6 sm:p-8 text-center text-gray-400 flex items-center justify-center h-[300px] sm:h-[400px] bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="space-y-4 max-w-sm">
                <div className="text-4xl sm:text-6xl opacity-40 animate-pulse">🎨</div>
                <div>
                  <p className="text-lg sm:text-xl font-medium text-gray-600 mb-2">Önizleme Hazır</p>
                  <p className="text-sm text-gray-500">Bir prompt girin ve büyüyü başlatın</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {renderError && (
          <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <strong className="font-medium">Render Uyarısı</strong>
            </div>
            <p className="text-sm mb-2">{renderError}</p>
            <p className="text-xs opacity-75">Kod görüntüleme moduna geçerek ham kodu inceleyebilirsiniz.</p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              disabled={!generatedCode}
              onClick={copyToClipboard}
              className="text-sm border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Copy className="mr-2 h-4 w-4" />
              {isMobile ? 'Kopyala' : 'Kopyala'}
            </Button>
            <Button 
              variant="outline" 
              disabled={!generatedCode}
              onClick={downloadCode}
              className="text-sm border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              {isMobile ? 'İndir' : 'İndir'}
            </Button>
            <Button 
              variant="outline" 
              disabled={!generatedCode}
              onClick={exportAsReactProject}
              className="text-sm border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FileDown className="mr-2 h-4 w-4" />
              {isMobile ? 'Proje' : 'Proje Olarak'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
