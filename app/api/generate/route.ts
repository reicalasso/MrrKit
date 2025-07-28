import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Sen MrrKit için kod üreten bir AI asistanısın. Kullanıcının prompt'una göre React bileşenleri oluşturuyorsun.

Kurallar:
1. Sadece React fonksiyonel bileşen kodu üret
2. Modern React hooks kullan (useState, useEffect, useCallback, useMemo)
3. Tailwind CSS sınıfları kullan - utility-first yaklaşım
4. Export default component olmalı
5. Import statement'ları ekleme, sadece bileşen kodunu ver
6. UI bileşenleri için şunları kullan: Button, Input, Card, CardHeader, CardTitle, CardContent
7. Responsive tasarım yap (sm:, md:, lg: breakpoints)
8. Accessible kod yaz (aria-label, alt text, semantic HTML)
9. TypeScript tiplemeleri kullan
10. Modern JavaScript syntax (arrow functions, destructuring, template literals)
11. Performance optimizasyon düşün (memo, callback dependencies)
12. Error handling ekle
13. Loading states ekle
14. Modern CSS Grid ve Flexbox kullan

Örnek format:
\`\`\`jsx
export default function GeneratedComponent() {
  const [state, setState] = useState(initialValue)
  
  const handleAction = useCallback(() => {
    // action logic
  }, [dependencies])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Component Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* component content */}
      </CardContent>
    </Card>
  )
}
\`\`\`

Önemli: Sadece component kodunu ver, import/export dışında hiç bir şey ekleme.`

// Mevcut modeller listesi (GPT-4 erişimi yoksa alternatifler)
const AVAILABLE_MODELS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-4o-mini',
  'gpt-4-turbo-preview',
  'gpt-4'
]

async function tryOpenAIGenerationWithKey(prompt: string, apiKey: string) {
  if (!apiKey) {
    throw new Error('OpenAI API key not found')
  }

  // Önce en ekonomik ve güvenilir modelleri dene
  const prioritizedModels = [
    'gpt-4o-mini',        // En ekonomik ve hızlı
    'gpt-3.5-turbo',      // Genel amaçlı
    'gpt-3.5-turbo-16k',  // Daha uzun context
    'gpt-4-turbo-preview', // Daha gelişmiş
    'gpt-4'               // En güçlü ama pahalı
  ]

  let lastError = null

  for (const model of prioritizedModels) {
    try {
      console.log(`Trying model: ${model}`)
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { 
              role: 'user', 
              content: `Lütfen şu prompt'a göre bir React bileşeni oluştur: ${prompt}
              
              Bileşen modern, responsive ve kullanıcı dostu olmalı. Tailwind CSS ile stillendir ve gerekli state management'ı ekle.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 2500, // Biraz azalttık quota için
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const generatedCode = data.choices[0]?.message?.content
        
        if (generatedCode) {
          console.log(`✅ Successfully used model: ${model}`)
          return generatedCode
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error?.message || 'Unknown error'
        
        console.warn(`❌ Model ${model} failed:`, response.status, errorMessage)
        lastError = new Error(`${response.status} - ${errorMessage}`)
        
        // Hızlı fallback kararları
        if (response.status === 429) {
          console.log('⚡ Rate limit/quota exceeded, skipping to mock response')
          break // Quota hatası varsa diğer modelleri deneme, direkt mock'a geç
        }
        
        if (response.status === 404) {
          continue // Model mevcut değil, diğerini dene
        }
        
        if (response.status >= 500) {
          continue // Server hatası, diğerini dene
        }
        
        // Diğer hatalar için de devam et
        continue
      }
    } catch (error) {
      console.warn(`❌ Error with model ${model}:`, error)
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // Network hatası gibi durumlarda da devam et
      continue
    }
  }
  
  // Eğer tüm modeller başarısızsa, son hatayı fırlat
  throw lastError || new Error('All models failed')
}

const ADVANCED_SYSTEM_PROMPT = `Sen MrrKit için gelişmiş uygulama üreten bir AI asistanısın. Kullanıcının prompt'una göre tam uygulamalar, sayfa layoutları ve karmaşık bileşen sistemleri oluşturuyorsun.

YETENEKLERIN:
1. Tek bileşenden tam uygulama yapısına kadar her şeyi üretebilirsin
2. Multi-component sistemler (navbar, sidebar, content, footer)
3. Routing ve navigation yapıları
4. State management sistemleri (context, zustand patterns)
5. Form validation ve data handling
6. Authentication layouts
7. Dashboard ve admin panelleri
8. E-commerce uygulamaları
9. Social media uygulamaları
10. Complex data visualization

ÇIKTI FORMATLARI:
- SINGLE_COMPONENT: Tek bileşen
- MULTI_COMPONENT: Birden fazla bileşen
- FULL_APP: Tam uygulama yapısı
- LAYOUT_SYSTEM: Layout sistemi

KURALLAR:
1. Modern React patterns (hooks, context, custom hooks)
2. TypeScript interfaces where appropriate
3. Tailwind CSS utility-first approach
4. Responsive design (mobile-first)
5. Accessibility (ARIA labels, semantic HTML)
6. Performance optimizations
7. Error boundaries ve loading states
8. Clean code practices

OUTPUT FORMAT:
\`\`\`json
{
  "type": "SINGLE_COMPONENT" | "MULTI_COMPONENT" | "FULL_APP" | "LAYOUT_SYSTEM",
  "components": [
    {
      "name": "ComponentName",
      "code": "React component code",
      "description": "What this component does",
      "dependencies": ["useState", "useEffect"]
    }
  ],
  "instructions": "How to use these components together",
  "features": ["Feature 1", "Feature 2"]
}
\`\`\`

Prompt'a göre en uygun formatı seç ve kapsamlı çözüm üret.`

// Mock response generator (gelişmiş)
function generateAdvancedMockCode(prompt: string): any {
  const lowerPrompt = prompt.toLowerCase()
  
  // E-commerce full app
  if (lowerPrompt.includes('e-ticaret') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('online mağaza')) {
    return {
      type: "FULL_APP",
      components: [
        {
          name: "ECommerceApp",
          code: `export default function ECommerceApp() {
  const [currentPage, setCurrentPage] = useState('products')
  const [cart, setCart] = useState([])
  const [products] = useState([
    { id: 1, name: 'Laptop Gaming', price: 25000, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300', category: 'electronics' },
    { id: 2, name: 'Akıllı Telefon', price: 15000, image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300', category: 'electronics' },
    { id: 3, name: 'Kablosuz Kulaklık', price: 800, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', category: 'accessories' }
  ])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-purple-600">TechStore</h1>
            <div className="hidden md:flex gap-6">
              <button 
                onClick={() => setCurrentPage('products')}
                className={\`px-3 py-2 rounded-md \${currentPage === 'products' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'}\`}
              >
                Ürünler
              </button>
              <button 
                onClick={() => setCurrentPage('categories')}
                className={\`px-3 py-2 rounded-md \${currentPage === 'categories' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'}\`}
              >
                Kategoriler
              </button>
            </div>
          </div>
          <button 
            onClick={() => setCurrentPage('cart')}
            className="relative bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            🛒 Sepet ({cart.length})
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-xl"
      />
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 capitalize">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-purple-600">₺{product.price.toLocaleString()}</span>
          <Button 
            onClick={() => addToCart(product)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Sepete Ekle
          </Button>
        </div>
      </div>
    </div>
  )

  const ProductsPage = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Tüm Ürünler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )

  const CartPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Alışveriş Sepeti</h2>
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-medium mb-2">Sepetiniz boş</h3>
          <p className="text-gray-600 mb-6">Ürün eklemek için alışverişe başlayın</p>
          <Button onClick={() => setCurrentPage('products')}>
            Alışverişe Başla
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-6">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">₺{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">Adet: {item.quantity}</span>
                  <span className="text-xl font-bold text-purple-600">
                    ₺{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Kaldır
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-medium">Toplam Tutar:</span>
              <span className="text-3xl font-bold text-purple-600">₺{getTotalPrice().toLocaleString()}</span>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3">
              Siparişi Tamamla
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'categories' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8">Kategoriler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold">Elektronik</h3>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-xl font-semibold">Aksesuarlar</h3>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold">Mobil</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`,
          description: "Tam özellikli e-ticaret uygulaması",
          dependencies: ["useState"]
        }
      ],
      instructions: "Bu tam bir e-ticaret uygulamasıdır. Ürün listeleme, sepet yönetimi ve navigasyon içerir.",
      features: [
        "Multi-page navigation",
        "Shopping cart management", 
        "Product catalog",
        "Responsive design",
        "State management"
      ]
    }
  }

  // Dashboard full app
  if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin') || lowerPrompt.includes('panel')) {
    return {
      type: "FULL_APP",
      components: [
        {
          name: "AdminDashboard",
          code: `export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const stats = [
    { title: 'Toplam Kullanıcı', value: '12,456', change: '+12%', color: 'blue' },
    { title: 'Aylık Gelir', value: '₺245,000', change: '+8%', color: 'green' },
    { title: 'Aktif Siparişler', value: '1,234', change: '-3%', color: 'orange' },
    { title: 'Dönüşüm Oranı', value: '%24.5', change: '+5%', color: 'purple' }
  ]

  const recentOrders = [
    { id: '001', customer: 'Ahmet Yılmaz', amount: '₺1,250', status: 'Tamamlandı', date: '2 saat önce' },
    { id: '002', customer: 'Ayşe Kaya', amount: '���890', status: 'Beklemede', date: '4 saat önce' },
    { id: '003', customer: 'Mehmet Özkan', amount: '₺2,100', status: 'İptal', date: '6 saat önce' }
  ]

  const Sidebar = () => (
    <div className={\`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 \${sidebarOpen ? 'w-64' : 'w-16'}\`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        </div>
      </div>
      
      <nav className="mt-8">
        {[
          { id: 'overview', label: 'Genel Bakış', icon: '📊' },
          { id: 'users', label: 'Kullanıcılar', icon: '👥' },
          { id: 'orders', label: 'Siparişler', icon: '📦' },
          { id: 'products', label: 'Ürünler', icon: '🏷️' },
          { id: 'analytics', label: 'Analitik', icon: '📈' },
          { id: 'settings', label: 'Ayarlar', icon: '⚙️' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={\`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors \${activeTab === item.id ? 'bg-purple-600 border-r-2 border-purple-400' : ''}\`}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  )

  const Header = () => (
    <header className={\`fixed top-0 right-0 bg-white border-b z-30 transition-all duration-300 \${sidebarOpen ? 'left-64' : 'left-16'}\`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            ☰
          </button>
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            🔔
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                 className="w-8 h-8 rounded-full" alt="Avatar" />
            <span className="font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  )

  const StatCard = ({ stat }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
          <div className={\`px-2 py-1 rounded-full text-xs font-medium \${
            stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }\`}>
            {stat.change}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Siparişler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-600">#{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.amount}</p>
                    <span className={\`px-2 py-1 rounded-full text-xs \${
                      order.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' :
                      order.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }\`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Satış Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 91, 76, 88].map((height, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 bg-purple-500 rounded-t"
                    style={{ height: \`\${height}%\` }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className={\`transition-all duration-300 pt-20 \${sidebarOpen ? 'ml-64' : 'ml-16'}\`}>
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && (
            <Card>
              <CardHeader><CardTitle>Kullanıcı Yönetimi</CardTitle></CardHeader>
              <CardContent><p>Kullanıcı listesi ve yönetim araçları burada...</p></CardContent>
            </Card>
          )}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader><CardTitle>Sipariş Yönetimi</CardTitle></CardHeader>
              <CardContent><p>Tüm siparişler ve detayları burada...</p></CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}`,
          description: "Tam özellikli admin dashboard uygulaması",
          dependencies: ["useState"]
        }
      ],
      instructions: "Responsive sidebar, istatistik kartları ve çoklu sayfa desteği olan tam admin paneli.",
      features: [
        "Responsive sidebar navigation",
        "Real-time statistics",
        "Multi-tab interface", 
        "Order management",
        "User management",
        "Data visualization"
      ]
    }
  }

    // Default enhanced response
    return {
      type: "SINGLE_COMPONENT",
      components: [{
        name: "EnhancedComponent",
        code: `export default function EnhancedComponent() {
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
    const handleSubmit = useCallback(async (e) => {
      e.preventDefault()
      setIsLoading(true)
      
      try {
        // Handle form submission
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }, [])
  
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enhanced Component</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }`,
        description: "Gelişmiş React bileşeni",
        dependencies: ["useState", "useCallback"]
      }],
      instructions: "Bu bileşen modern React patterns kullanarak oluşturulmuştur.",
      features: ["Responsive design", "Interactive elements", "Modern styling"]
    }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json()

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt gerekli' }, { status: 400 })
    }

    // OpenAI API ile gelişmiş kod üretimi (user provided API key or env)
    const useApiKey = apiKey || process.env.OPENAI_API_KEY

    if (useApiKey) {
      try {
        // Update the tryOpenAIGeneration to accept API key parameter
        const generatedCode = await tryOpenAIGenerationWithKey(prompt, useApiKey)

        // Try to parse as JSON first (advanced format)
        try {
          const parsedResponse = JSON.parse(generatedCode)
          return NextResponse.json({
            ...parsedResponse,
            success: true,
            source: 'openai'
          })
        } catch {
          // Fallback to simple code extraction
          const codeMatch = generatedCode.match(/```(?:jsx|javascript|js|tsx|typescript)?\s*\n([\s\S]*?)\n```/)
          const finalCode = codeMatch ? codeMatch[1] : generatedCode

          return NextResponse.json({
            type: "SINGLE_COMPONENT",
            components: [{
              name: "GeneratedComponent",
              code: finalCode.trim(),
              description: "AI generated component",
              dependencies: ["useState"]
            }],
            success: true,
            source: 'openai'
          })
        }
      } catch (openaiError) {
        console.warn('OpenAI API hatası, gelişmiş mock response kullanılıyor:', openaiError)
      }
    }

    // Gelişmiş mock response
    const mockResponse = generateAdvancedMockCode(prompt)
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      ...mockResponse,
      success: true,
      source: 'mock'
    })

  } catch (error) {
    console.error('Kod üretim hatası:', error)
    return NextResponse.json({
      error: 'Kod üretilirken hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
