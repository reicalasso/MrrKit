'use client'

import { useState } from 'react'
import { PromptInput } from '@/components/prompt-input'
import { Preview } from '@/components/preview'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Rocket, 
  Wand2, 
  Code, 
  Eye, 
  Zap, 
  Palette, 
  Users, 
  GraduationCap,
  ArrowRight,
  Play,
  Sparkles,
  Heart
} from 'lucide-react'

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState('')
  const [previewError, setPreviewError] = useState<Error | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-cream-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-cream-300/10 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-16 text-center">
        {/* Cat Logo */}
        <div className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-gradient-to-br from-purple-400 to-purple-300 rounded-3xl shadow-2xl">
          <img 
            src="/favicon.ico" 
            alt="MrrKit Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cream-100 via-purple-200 to-cream-100 bg-clip-text text-transparent leading-tight">
          Code Softly,<br />
          <span className="text-purple-300">Build Boldly.</span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto mb-12 leading-relaxed">
          MrrKit is your AI companion for creating software from natural language.
          <br />
          <span className="text-cream-200">Purr-fectly simple, incredibly powerful.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link href="/workspace">
            <Button className="bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 text-white px-10 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Sparkles className="mr-3 h-6 w-6" />
              Start Building
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="bg-cream-50/10 border-cream-200/30 text-cream-100 hover:bg-cream-50/20 backdrop-blur-sm px-10 py-4 text-lg font-semibold rounded-2xl"
            onClick={() => document.querySelector('.how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="mr-3 h-5 w-5" />
            Learn How It Works
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: '🤖', text: 'AI-Powered' },
            { icon: '⚡', text: 'Lightning Fast' },
            { icon: '🎨', text: 'Beautiful UI' },
            { icon: '😸', text: 'Kitty Smooth' }
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 bg-cream-50/10 backdrop-blur-sm border border-cream-200/20 rounded-full px-6 py-3 text-cream-100 hover:bg-cream-50/15 transition-all duration-300 hover:scale-105"
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works relative z-10 py-24 bg-gradient-to-r from-slate-800/50 to-purple-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-cream-100">
              How It <span className="text-purple-300">Purrs</span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Three simple steps to transform your ideas into reality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                icon: <Wand2 className="h-8 w-8" />,
                title: "Write a Prompt",
                description: "Simply describe what you want: 'Create a login form with social auth'",
                example: "Create a login form"
              },
              {
                step: "02", 
                icon: <Code className="h-8 w-8" />,
                title: "See Code Appear",
                description: "Watch as MrrKit generates clean, modern code in real-time",
                example: "Generating..."
              },
              {
                step: "03",
                icon: <Rocket className="h-8 w-8" />,
                title: "Preview & Deploy",
                description: "Instantly preview your creation and deploy with one click",
                example: "Ready to ship!"
              }
            ].map((step, index) => (
              <Card key={index} className="bg-cream-50/5 border-cream-200/20 backdrop-blur-sm hover:bg-cream-50/10 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-300 rounded-2xl mb-6 shadow-lg">
                    <span className="text-slate-900">{step.icon}</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-300 mb-2">{step.step}</div>
                  <h3 className="text-2xl font-bold text-cream-100 mb-4">{step.title}</h3>
                  <p className="text-purple-100 mb-4 leading-relaxed">{step.description}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-300/20">
                    <code className="text-purple-200 text-sm">{step.example}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-cream-100">
              Features That <span className="text-purple-300">Meow</span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Everything you need to build amazing software, powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: <Wand2 className="h-8 w-8" />,
                title: "Natural Language to Code",
                description: "Write in plain English, get production-ready code"
              },
              {
                icon: <Eye className="h-8 w-8" />,
                title: "Live Preview Engine", 
                description: "See your creations come to life in real-time"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Deployment-Ready Output",
                description: "Code that's ready to ship, no cleanup needed"
              },
              {
                icon: <Palette className="h-8 w-8" />,
                title: "Kitty-smooth UI Components",
                description: "Beautiful, responsive components that just work"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-cream-50/5 border-cream-200/20 backdrop-blur-sm hover:bg-cream-50/10 transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-300 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-slate-900">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-cream-100 mb-4">{feature.title}</h3>
                  <p className="text-purple-100 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Highlights */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-purple-900/30 to-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-cream-100">
              Perfect for <span className="text-purple-300">Every Cat</span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Whether you're a developer, designer, or dreamer - MrrKit has you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: <Code className="h-8 w-8" />,
                title: "Developers",
                subtitle: "Rapid Prototyping",
                description: "Skip the boilerplate, focus on what matters",
                emoji: "👨‍💻"
              },
              {
                icon: <Palette className="h-8 w-8" />,
                title: "Designers", 
                subtitle: "No-code UI Generation",
                description: "Turn your designs into code instantly",
                emoji: "🎨"
              },
              {
                icon: <Rocket className="h-8 w-8" />,
                title: "Startups",
                subtitle: "Fast MVP Creation", 
                description: "Go from idea to product in hours, not weeks",
                emoji: "🚀"
              },
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: "Students",
                subtitle: "Learn by Building",
                description: "See code patterns and learn best practices",
                emoji: "🎓"
              }
            ].map((useCase, index) => (
              <Card key={index} className="bg-cream-50/5 border-cream-200/20 backdrop-blur-sm hover:bg-cream-50/10 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <CardContent className="p-8 text-center relative z-10">
                  <div className="text-4xl mb-4">{useCase.emoji}</div>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-300 rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-slate-900">{useCase.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-cream-100 mb-2">{useCase.title}</h3>
                  <p className="text-purple-300 font-semibold mb-3">{useCase.subtitle}</p>
                  <p className="text-purple-100 text-sm leading-relaxed">{useCase.description}</p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-cream-100">
              Try It <span className="text-purple-300">Right Meow</span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              See MrrKit in action - write a prompt and watch the magic happen
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <PromptInput onCodeGenerated={(code) => {
                setGeneratedCode(code)
                setPreviewError(null)
              }} />
            </div>
            <div className="order-1 lg:order-2">
              <Preview generatedCode={generatedCode} onError={setPreviewError} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-slate-800/50 to-purple-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { number: '10k+', label: 'Components Created', icon: '🧩' },
              { number: '500+', label: 'Happy Developers', icon: '😸' },
              { number: '99.9%', label: 'Uptime', icon: '⚡' },
              { number: '< 3s', label: 'Generation Time', icon: '🚀' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold text-purple-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-cream-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-300 rounded-3xl mb-8 shadow-2xl">
              <Heart className="h-8 w-8 text-slate-900" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-cream-100">
              Ready to Start <span className="text-purple-300">Purring</span>?
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
              Join thousands of developers who are building faster, coding smarter, and shipping sooner with MrrKit.
            </p>
            <Link href="/workspace">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Sparkles className="mr-3 h-6 w-6" />
                Start Building for Free
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cream-200/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-300 rounded-xl flex items-center justify-center">
                <img 
                  src="/favicon.ico" 
                  alt="MrrKit Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-cream-100">MrrKit</span>
            </div>
            <p className="text-purple-200 mb-6">
              Made with <Heart className="inline h-4 w-4 text-purple-300 mx-1" /> for developers who dream in code
            </p>
            <div className="flex justify-center gap-8 text-sm text-purple-200">
              <a href="#" className="hover:text-cream-100 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cream-100 transition-colors">Terms</a>
              <a href="#" className="hover:text-cream-100 transition-colors">Support</a>
              <a href="#" className="hover:text-cream-100 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
