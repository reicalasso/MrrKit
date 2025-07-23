'use client'

import { useState } from 'react'
import { PromptInput } from '@/components/prompt-input'
import { Preview } from '@/components/preview'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket, Wand2 } from 'lucide-react'

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState('')

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Mrr<span className="text-pink-300">Kit</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AI ile saniyeler içinde{' '}
            <span className="text-purple-300 font-semibold">modern React bileşenleri</span>{' '}
            oluşturun. Sadece yazmak istediğinizi açıklayın,{' '}
            <span className="text-pink-300 font-semibold">gerisi bize kalsın!</span>
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 mb-8">
            <Link href="/workspace" className="inline-block">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                <Rocket className="mr-2 h-5 w-5" />
                Workspace'e Git
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold"
              onClick={() => document.querySelector('.prompt-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Hızlı Başlat
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: '🤖', text: 'AI Destekli' },
              { icon: '⚡', text: 'Hızlı Üretim' },
              { icon: '📱', text: 'Responsive' },
              { icon: '🎨', text: 'Modern Tasarım' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white hover:bg-white/15 transition-all duration-300"
              >
                <span>{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </header>
        
        <div className="prompt-section grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <PromptInput onCodeGenerated={setGeneratedCode} />
          </div>
          <div className="order-1 lg:order-2">
            <Preview generatedCode={generatedCode} />
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: '1000+', label: 'Bileşen Oluşturuldu' },
              { number: '50+', label: 'Mutlu Geliştirici' },
              { number: '⚡', label: 'Saniyeler İçinde' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
