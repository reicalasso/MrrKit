'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Rocket, Folder, Code, Download, Package } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

interface ProjectGeneratorProps {
  onProjectGenerated: (project: any) => void
}

const PROJECT_TEMPLATES = [
  {
    id: 'react-app',
    name: '⚛️ React App',
    description: 'Temel React uygulaması',
    includes: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite']
  },
  {
    id: 'nextjs-app',
    name: '🔄 Next.js App',
    description: 'Full-stack Next.js uygulaması',
    includes: ['Next.js 14', 'App Router', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: 'dashboard',
    name: '📊 Admin Dashboard',
    description: 'Yönetim paneli template',
    includes: ['Charts', 'Tables', 'Authentication', 'Responsive Layout']
  },
  {
    id: 'ecommerce',
    name: '🛒 E-commerce',
    description: 'Online mağaza uygulaması',
    includes: ['Product Catalog', 'Cart', 'Checkout', 'User Auth']
  },
  {
    id: 'blog',
    name: '📝 Blog Platform',
    description: 'Blog/CMS uygulaması',
    includes: ['MDX Support', 'SEO', 'Comments', 'Admin Panel']
  },
  {
    id: 'portfolio',
    name: '🎨 Portfolio',
    description: 'Kişisel portfolio sitesi',
    includes: ['Animations', 'Contact Form', 'Projects Showcase', 'Responsive']
  }
]

const FEATURES = [
  { id: 'auth', name: 'Authentication', desc: 'Kullanıcı girişi/kayıt' },
  { id: 'db', name: 'Database', desc: 'Veritabanı entegrasyonu' },
  { id: 'api', name: 'REST API', desc: 'Backend API endpoints' },
  { id: 'payments', name: 'Payments', desc: 'Ödeme sistemi' },
  { id: 'email', name: 'Email', desc: 'Email gönderimi' },
  { id: 'seo', name: 'SEO', desc: 'SEO optimizasyonu' },
  { id: 'pwa', name: 'PWA', desc: 'Progressive Web App' },
  { id: 'i18n', name: 'i18n', desc: 'Çoklu dil desteği' }
]

export function ProjectGenerator({ onProjectGenerated }: ProjectGeneratorProps) {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const generateProject = async () => {
    if (!projectName.trim() || !selectedTemplate) {
      toast({
        title: "Eksik Bilgi",
        description: "Proje adı ve template seçimi gerekli",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const template = PROJECT_TEMPLATES.find(t => t.id === selectedTemplate)
      
      // Proje yapısını oluştur
      const projectStructure = generateProjectStructure(selectedTemplate, selectedFeatures)
      
      const project = {
        name: projectName,
        description: description || `${template?.name} projesi`,
        template: selectedTemplate,
        features: selectedFeatures,
        structure: projectStructure,
        createdAt: new Date().toISOString()
      }

      await new Promise(resolve => setTimeout(resolve, 2000)) // Simüle et

      onProjectGenerated(project)

      toast({
        title: "Proje Oluşturuldu! 🎉",
        description: `${projectName} başarıyla oluşturuldu`,
      })

    } catch (error) {
      toast({
        title: "Hata!",
        description: "Proje oluşturulurken hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="h-fit bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">Yeni Proje Oluştur</CardTitle>
            <p className="text-green-200 text-sm">Tam yapılandırılmış projeler</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Proje Bilgileri */}
        <div className="space-y-4">
          <div>
            <label className="text-white font-medium mb-2 block">📝 Proje Adı</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-awesome-project"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-white font-medium mb-2 block">💭 Açıklama (Opsiyonel)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Projenizin kısa açıklaması..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[80px]"
            />
          </div>
        </div>

        {/* Template Seçimi */}
        <div className="space-y-4">
          <label className="text-white font-medium">🎯 Proje Template'i</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROJECT_TEMPLATES.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'bg-green-500/30 border-green-400 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="font-medium text-sm mb-2">{template.name}</div>
                <div className="text-xs opacity-75 mb-3">{template.description}</div>
                <div className="flex flex-wrap gap-1">
                  {template.includes.slice(0, 2).map(tech => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/30">
                      {tech}
                    </Badge>
                  ))}
                  {template.includes.length > 2 && (
                    <Badge variant="outline" className="text-xs border-white/30">
                      +{template.includes.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Özellik Seçimi */}
        <div className="space-y-4">
          <label className="text-white font-medium">⚡ Ek Özellikler</label>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(feature => (
              <div key={feature.id} className="flex items-start space-x-3">
                <Checkbox
                  id={feature.id}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                  className="border-white/30 data-[state=checked]:bg-green-500"
                />
                <div className="space-y-1">
                  <label
                    htmlFor={feature.id}
                    className="text-sm font-medium text-white cursor-pointer"
                  >
                    {feature.name}
                  </label>
                  <p className="text-xs text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateProject}
          disabled={!projectName.trim() || !selectedTemplate || isGenerating}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 animate-spin" />
              <span>Proje oluşturuluyor...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Rocket className="h-5 w-5" />
              <span>Projeyi Oluştur</span>
              <span className="text-xl">🚀</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

function generateProjectStructure(template: string, features: string[]) {
  const baseStructure = {
    'package.json': generatePackageJson(template, features),
    'README.md': generateReadme(template),
    '.gitignore': generateGitignore(),
    'tailwind.config.js': generateTailwindConfig(),
    'tsconfig.json': generateTsConfig()
  }

  // Template'e göre özel dosyalar ekle
  switch (template) {
    case 'nextjs-app':
      return {
        ...baseStructure,
        'next.config.js': generateNextConfig(),
        'app/layout.tsx': generateNextLayout(),
        'app/page.tsx': generateNextHomePage(),
        'app/globals.css': generateGlobalStyles()
      }
    case 'react-app':
      return {
        ...baseStructure,
        'vite.config.ts': generateViteConfig(),
        'index.html': generateIndexHtml(),
        'src/main.tsx': generateReactMain(),
        'src/App.tsx': generateReactApp(),
        'src/index.css': generateGlobalStyles()
      }
    default:
      return baseStructure
  }
}

function generatePackageJson(template: string, features: string[]) {
  const baseDeps = {
    'react': '^18.2.0',
    'react-dom': '^18.2.0'
  }

  const templateDeps = {
    'nextjs-app': { 'next': '^14.0.0' },
    'react-app': { 'vite': '^5.0.0', '@vitejs/plugin-react': '^4.0.0' }
  }

  return JSON.stringify({
    name: 'generated-project',
    version: '1.0.0',
    dependencies: {
      ...baseDeps,
      ...templateDeps[template as keyof typeof templateDeps],
      ...(features.includes('auth') && { 'next-auth': '^4.24.0' }),
      ...(features.includes('db') && { 'prisma': '^5.0.0' })
    },
    scripts: template === 'nextjs-app' 
      ? { dev: 'next dev', build: 'next build', start: 'next start' }
      : { dev: 'vite', build: 'vite build', preview: 'vite preview' }
  }, null, 2)
}

function generateReadme(template: string) {
  return `# Generated Project

Bu proje MrrKit ile oluşturulmuştur.

## Template: ${template}

## Kurulum

\`\`\`bash
npm install
npm run dev
\`\`\`

## Özellikler

- Modern React
- TypeScript
- Tailwind CSS
- Responsive Design
`
}

function generateGitignore() {
  return `node_modules/
.next/
.env.local
.env
dist/
build/
*.log
.DS_Store`
}

function generateTailwindConfig() {
  return `module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}`
}

function generateTsConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'es6'],
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 'node',
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx'
    },
    include: ['src', 'app'],
    exclude: ['node_modules']
  }, null, 2)
}

function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig`
}

function generateNextLayout() {
  return `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}`
}

function generateNextHomePage() {
  return `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          MrrKit ile Oluşturuldu 🚀
        </h1>
        <p className="text-center text-gray-600">
          Bu proje MrrKit ile otomatik olarak oluşturulmuştur.
        </p>
      </div>
    </main>
  )
}`
}

function generateViteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
}

function generateIndexHtml() {
  return `<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MrrKit Generated App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
}

function generateReactMain() {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
}

function generateReactApp() {
  return `function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          MrrKit ile Oluşturuldu 🚀
        </h1>
        <p className="text-center text-gray-600">
          Bu proje MrrKit ile otomatik olarak oluşturulmuştur.
        </p>
      </div>
    </div>
  )
}

export default App`
}

function generateGlobalStyles() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: system-ui, sans-serif;
  }
}`
}
