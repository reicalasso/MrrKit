"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wand2, Loader2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

interface PromptInputProps {
  onCodeGenerated: (code: string) => void
}

const EXAMPLE_PROMPTS = [
  "Kullanıcıların todo ekleyip silebileceği, tamamlananları işaretleyebileceği modern bir görev listesi",
  "Dört işlem yapabilen, geçmiş hesapları gösteren hesap makinesi uygulaması", 
  "Kullanıcı fotoğrafı, bio ve sosyal medya linklerini gösteren interaktif profil kartı",
  "Filtreleme ve arama özellikli ürün katalogu grid komponenti",
  "Dark/light mode toggle'ı olan modern ayarlar paneli",
  "Hava durumu bilgilerini gösteren, şehir seçilebilen widget",
  "Alışveriş sepeti - ürün ekleme/çıkarma, miktar değiştirme",
  "Real-time chat bubble'ları ile mesajlaşma arayüzü"
]

const ADVANCED_EXAMPLE_PROMPTS = [
  "Tam özellikli e-ticaret uygulaması: ürün listeleme, sepet yönetimi, ödeme, kullanıcı girişi",
  "Admin dashboard: kullanıcı yönetimi, satış istatistikleri, grafik görselleştirme, sipariş takibi",
  "Social media uygulaması: post paylaşma, beğeni/yorum, takip sistemi, profil yönetimi",
  "Chat uygulaması: gerçek zamanlı mesajlaşma, grup sohbetleri, dosya paylaşımı",
  "Task management: proje yönetimi, kanban board, takım işbirliği, zaman takibi",
  "Blog CMS: makale yazma/düzenleme, kategori yönetimi, yorum sistemi, SEO araçları",
  "Online learning platform: kurs yönetimi, video oynatıcı, quiz sistemi, ilerleme takibi",
  "Restaurant menu app: menü kategorileri, sipariş yönetimi, masa rezervasyonu"
]

const COMPLEXITY_LEVELS = [
  { id: 'component', label: '🧩 Bileşen', desc: 'Tek bileşen', shortDesc: 'Basit' },
  { id: 'feature', label: '⚡ Özellik', desc: 'Birkaç bileşen', shortDesc: 'Orta' },
  { id: 'page', label: '📄 Sayfa', desc: 'Tam sayfa yapısı', shortDesc: 'Büyük' },
  { id: 'app', label: '🚀 Uygulama', desc: 'Multi-page app', shortDesc: 'Devasa' }
]

export function PromptInput({ onCodeGenerated }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiStatus, setApiStatus] = useState<'openai' | 'mock' | 'unknown'>('unknown')
  const [complexity, setComplexity] = useState('component')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Uyarı!",
        description: "Lütfen detaylı bir prompt girin",
        variant: "destructive",
      })
      return
    }
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (data.success) {
        onCodeGenerated(data.code)
        setApiStatus(data.source)
        
        let sourceText = 'Mock data ile'
        if (data.source === 'openai') {
          sourceText = 'AI ile'
        }
        
        toast({
          title: "Başarılı!",
          description: `Kod başarıyla üretildi (${sourceText})`,
        })
      } else {
        throw new Error(data.error || 'Kod üretilirken hata oluştu')
      }
    } catch (error) {
      console.error('API hatası:', error)
      toast({
        title: "Hata!",
        description: error instanceof Error ? error.message : 'Beklenmeyen hata oluştu',
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const useExamplePrompt = (example: string) => {
    setPrompt(example)
    setShowExamples(false)
  }

  return (
    <Card className="w-full max-w-none bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl text-gray-900">AI Kod Üretici</CardTitle>
              <p className="text-sm text-gray-600">Açıklayın, biz kodlayalım</p>
            </div>
          </div>
          {apiStatus !== 'unknown' && (
            <Badge 
              variant={apiStatus === 'openai' ? 'default' : 'secondary'} 
              className={`text-xs self-start sm:self-center ${
                apiStatus === 'openai' 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-amber-100 text-amber-700 border-amber-200'
              }`}
            >
              {apiStatus === 'openai' ? '🤖 AI' : '📝 Demo'}
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600 leading-relaxed">
          Ne yapmak istediğinizi detaylı açıklayın. <span className="font-medium text-purple-600">Daha detaylı = daha iyi sonuç.</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Complexity Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">🎯 Proje Boyutu</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMPLEXITY_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setComplexity(level.id)}
                className={`p-3 rounded-lg border text-left transition-all text-sm ${
                  complexity === level.id 
                    ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{level.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  {isMobile ? level.shortDesc : level.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">💭 Ne yapmak istiyorsunuz?</label>
          <Textarea
            placeholder={
              complexity === 'app' 
                ? "Örnek: Netflix benzeri video streaming uygulaması. Ana sayfa, kategori filtreleme, arama, kullanıcı profilleri, video oynatıcı ve admin paneli..."
                : complexity === 'page'
                ? "Örnek: Modern e-ticaret ürün sayfası. Büyük görseller, fiyat bilgisi, sepete ekle, yorumlar, benzer ürünler..."
                : "Örnek: Modern ve responsive bir e-ticaret ürün kartı. Hover efektleri, sepete ekle butonu, fiyat gösterimi..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] sm:min-h-[150px] resize-none text-sm border-gray-200 focus:border-purple-300 focus:ring-purple-200"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{prompt.length} karakter</span>
            <span>Min. 50 karakter öneriyoruz</span>
          </div>
        </div>
        
        {/* Advanced Options */}
        <div className="space-y-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Gelişmiş Seçenekler
          </button>
          
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">🎨 Stil Tercihi</label>
                  <select className="w-full text-sm p-2 bg-white border border-gray-200 rounded-md focus:border-purple-300 focus:ring-1 focus:ring-purple-200">
                    <option value="modern">Modern & Minimal</option>
                    <option value="corporate">Kurumsal</option>
                    <option value="colorful">Renkli & Eğlenceli</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">📱 Hedef Platform</label>
                  <select className="w-full text-sm p-2 bg-white border border-gray-200 rounded-md focus:border-purple-300 focus:ring-1 focus:ring-purple-200">
                    <option value="web">Web (Desktop + Mobile)</option>
                    <option value="mobile">Mobile First</option>
                    <option value="desktop">Desktop First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Examples */}
        <div className="space-y-3">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>Örnek Projeler</span>
            {showExamples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showExamples && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {ADVANCED_EXAMPLE_PROMPTS.slice(0, 6).map((example, index) => (
                  <button
                    key={index}
                    className="text-left p-3 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                    onClick={() => useExamplePrompt(example)}
                  >
                    <span className="text-gray-700 line-clamp-2">{example}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Kod üretiliyor...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              <span>Kodu Üret</span>
              <span className="hidden sm:inline">✨</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
