export interface AIRequest {
  prompt: string
  code?: string
  language?: string
  task: 'generate' | 'explain' | 'fix' | 'optimize' | 'complete' | 'translate' | 'comment'
  framework?: 'react' | 'vue' | 'svelte' | 'vanilla'
  style?: 'tailwind' | 'css' | 'styled-components'
}

export interface AIResponse {
  success: boolean
  result?: string
  explanation?: string
  suggestions?: string[]
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

class AIService {
  private apiKey: string | null = null
  private baseUrl = 'https://api.openai.com/v1'

  setApiKey(key: string) {
    this.apiKey = key
  }

  async generateCode(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'API anahtarı ayarlanmamış' }
    }

    try {
      // Use the local API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: this.getUserPrompt(request),
          framework: request.framework,
          style: request.style,
          task: request.task,
          apiKey: this.apiKey // Send API key to local endpoint
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'API isteği başarısız oldu'
        }
      }

      if (!data.success) {
        return { success: false, error: data.error || 'Kod üretimi başarısız oldu' }
      }

      // Handle different response formats
      if (data.type && data.components) {
        // Advanced response format
        const mainComponent = data.components[0]
        return {
          success: true,
          result: mainComponent?.code || '',
          explanation: data.instructions,
          suggestions: data.features,
        }
      } else {
        // Simple response format
        return {
          success: true,
          result: data.result || data.code || '',
        }
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Beklenmeyen hata oluştu'
      }
    }
  }

  async explainCode(code: string, language: string): Promise<AIResponse> {
    return this.generateCode({
      prompt: 'Bu kodu açıkla',
      code,
      language,
      task: 'explain'
    })
  }

  async fixCode(code: string, error: string, language: string): Promise<AIResponse> {
    return this.generateCode({
      prompt: `Bu kodda şu hata var: "${error}". Düzelt ve açıkla.`,
      code,
      language,
      task: 'fix'
    })
  }

  async optimizeCode(code: string, language: string): Promise<AIResponse> {
    return this.generateCode({
      prompt: 'Bu kodu optimize et ve performansını artır',
      code,
      language,
      task: 'optimize'
    })
  }

  async completeCode(code: string, language: string): Promise<AIResponse> {
    return this.generateCode({
      prompt: 'Bu kodu tamamla',
      code,
      language,
      task: 'complete'
    })
  }

  private getSystemPrompt(request: AIRequest): string {
    const basePrompt = `Sen profesyonel bir yazılım geliştirici ve kod asistanısın. MrrKit adlı bir online kod editöründe çalışıyorsun.

Görevin:
- Temiz, okunabilir ve modern kod yazmak
- Best practice'leri takip etmek
- Açıklayıcı ve yardımcı olmak
- Türkçe açıklamalar yapmak ama kod İngilizce
- Güvenlik ve performans odaklı çözümler sunmak

Kod yazarken:
- Modern JavaScript/TypeScript özellikleri kullan
- Functional component'ları tercih et (React için)
- TailwindCSS kullan (stil için)
- Responsive design düşün
- Accessibility (a11y) kurallarına uy
- Clean code prensiplerini uygula`

    switch (request.task) {
      case 'generate':
        return `${basePrompt}

Kod üretimi yapacaksın. Kullanıcının istediği komponenti veya işlevi tam olarak çalışır şekilde kodla.`

      case 'explain':
        return `${basePrompt}

Kod açıklama yapacaksın. Verilen kodu satır satır analiz et ve ne yaptığını açıkla.`

      case 'fix':
        return `${basePrompt}

Kod düzeltmesi yapacaksın. Hatayı tespit et, düzelt ve neyin yanlış olduğunu açıkla.`

      case 'optimize':
        return `${basePrompt}

Kod optimizasyonu yapacaksın. Performansı artır, gereksiz kısımları temizle ve daha iyi çözümler öner.`

      case 'complete':
        return `${basePrompt}

Kod tamamlama yapacaksın. Yarım kalan kodu mantıklı şekilde tamamla.`

      default:
        return basePrompt
    }
  }

  private getUserPrompt(request: AIRequest): string {
    let prompt = ''

    if (request.code) {
      prompt += `Mevcut kod:\n\`\`\`${request.language || 'javascript'}\n${request.code}\n\`\`\`\n\n`
    }

    if (request.framework) {
      prompt += `Framework: ${request.framework}\n`
    }

    if (request.style) {
      prompt += `Stil: ${request.style}\n`
    }

    prompt += `İstek: ${request.prompt}`

    if (request.task === 'generate') {
      prompt += `\n\nLütfen şunları içeren bir ${request.framework || 'React'} komponenti oluştur:
- Modern ve responsive tasarım
- TailwindCSS ile stil
- Proper TypeScript tiplemesi (eğer uygunsa)
- Accessibility özellikleri
- Clean ve maintainable kod

Sadece kod döndür, ekstra açıklama yapma.`
    }

    return prompt
  }

  private cleanCodeResult(result: string): string {
    // Remove markdown code blocks
    let cleaned = result.replace(/```[\w]*\n?/g, '').replace(/```/g, '')
    
    // Remove common AI explanations
    cleaned = cleaned.replace(/^(Here's|Here is|İşte|Bu kod)/i, '')
    
    // Trim whitespace
    cleaned = cleaned.trim()
    
    return cleaned
  }

  // Predefined prompts for common tasks
  static readonly PROMPTS = {
    COMPONENT: {
      BUTTON: 'Modern ve accessible bir button komponenti oluştur',
      CARD: 'Responsive card komponenti oluştur',
      MODAL: 'Modal dialog komponenti oluştur',
      FORM: 'Form komponenti oluştur',
      NAVBAR: 'Navigation bar komponenti oluştur',
      SIDEBAR: 'Sidebar komponenti oluştur',
      HERO: 'Hero section komponenti oluştur',
      FOOTER: 'Footer komponenti oluştur',
    },
    LAYOUT: {
      GRID: 'CSS Grid layout oluştur',
      FLEXBOX: 'Flexbox layout oluştur',
      RESPONSIVE: 'Responsive layout oluştur',
    },
    ANIMATION: {
      FADE: 'Fade in/out animasyonu ekle',
      SLIDE: 'Slide animasyonu ekle',
      BOUNCE: 'Bounce animasyonu ekle',
      LOADING: 'Loading spinner ekle',
    },
    UTILITY: {
      HOOK: 'Custom React hook oluştur',
      HELPER: 'Utility fonksiyon oluştur',
      VALIDATION: 'Form validation ekle',
      API: 'API call fonksiyon oluştur',
    }
  }
}

export const aiService = new AIService()
