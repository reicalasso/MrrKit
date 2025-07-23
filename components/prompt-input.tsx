"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wand2, Loader2, Lightbulb } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

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
  { id: 'component', label: '🧩 Tek Bileşen', desc: 'Basit, tek amaçlı bileşen' },
  { id: 'feature', label: '⚡ Özellik Grubu', desc: 'Birkaç bileşen içeren özellik' },
  { id: 'page', label: '📄 Tam Sayfa', desc: 'Layout ile tam sayfa yapısı' },
  { id: 'app', label: '🚀 Tam Uygulama', desc: 'Multi-page, routing, state management' }
]

export function PromptInput({ onCodeGenerated }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiStatus, setApiStatus] = useState<'openai' | 'mock' | 'unknown'>('unknown')
  const [complexity, setComplexity] = useState('component')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { toast } = useToast()

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
  }

  return (
    <Card className="h-fit bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <div>
              <CardTitle className="text-white text-xl">Devasa Uygulama Yaratın</CardTitle>
              <p className="text-purple-200 text-sm">Tek prompt'tan tam uygulamalara</p>
            </div>
          </div>
          {apiStatus !== 'unknown' && (
            <Badge 
              variant={apiStatus === 'openai' ? 'default' : 'secondary'} 
              className={`text-xs ${
                apiStatus === 'openai' 
                  ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
              }`}
            >
              {apiStatus === 'openai' ? '🤖 AI' : '📝 Demo'}
            </Badge>
          )}
        </div>
        <CardDescription className="text-gray-300 text-base leading-relaxed">
          <strong>Artık sadece bileşen değil!</strong> Tam uygulamalar, dashboard'lar, e-ticaret siteleri yaratın.
          <span className="text-purple-300 font-medium"> Ne kadar detaylı yazarsanız o kadar güçlü sonuç alırsınız.</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Complexity Selector */}
        <div className="space-y-3">
          <label className="text-white font-medium">🎯 Ne tür bir proje istiyorsunuz?</label>
          <div className="grid grid-cols-2 gap-2">
            {COMPLEXITY_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setComplexity(level.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  complexity === level.id 
                    ? 'bg-purple-500/30 border-purple-400 text-white' 
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="font-medium text-sm">{level.label}</div>
                <div className="text-xs opacity-75">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <Textarea
          placeholder={
            complexity === 'app' 
              ? "Örnek: Netflix benzeri video streaming uygulaması oluştur. Ana sayfa video kategorileri, arama özelliği, kullanıcı profilleri, watchlist, video oynatıcı, yorum sistemi ve admin paneli olsun..."
              : complexity === 'page'
              ? "Örnek: E-ticaret ürün detay sayfası: büyük ürün görselleri, fiyat bilgisi, sepete ekle, yorumlar, benzer ürünler, stok durumu..."
              : "Örnek: Modern ve responsive bir e-ticaret ürün kartı oluştur..."
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[200px] resize-none bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 text-base"
        />
        
        {/* Advanced Options */}
        <div className="space-y-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200"
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            Gelişmiş Seçenekler
          </button>
          
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium">🎨 Stil Tercihi</label>
                  <select className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white text-sm">
                    <option value="modern">Modern & Minimal</option>
                    <option value="corporate">Kurumsal</option>
                    <option value="colorful">Renkli & Eğlenceli</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
                <div>
                  <label className="text-white text-sm font-medium">📱 Hedef Platform</label>
                  <select className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white text-sm">
                    <option value="web">Web (Desktop + Mobile)</option>
                    <option value="mobile">Mobile First</option>
                    <option value="desktop">Desktop First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <span className="font-medium">🔥 Devasa Uygulama Örnekleri:</span>
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
            {ADVANCED_EXAMPLE_PROMPTS.map((example, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-white/10 p-4 rounded-lg border border-white/10 transition-all duration-200 hover:border-white/20 hover:scale-[1.01]"
                onClick={() => useExamplePrompt(example)}
              >
                <p className="text-xs text-gray-300 leading-relaxed">{example}</p>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          size="lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Devasa uygulama üretiliyor...</span>
              <span className="text-2xl">🚀</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <span>Devasa Uygulamayı Üret</span>
              <span className="text-2xl">✨</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
