'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Code, 
  Eye, 
  Zap, 
  Palette, 
  Users, 
  GraduationCap,
  Heart,
  Star,
  Github,
  Twitter,
  Globe,
  CheckCircle,
  Rocket,
  Terminal,
  Layers,
  Wand2,
  FileCode,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Wand2,
      title: "AI-Powered Generation",
      description: "Transform natural language into production-ready code with advanced AI",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: "Live Preview",
      description: "See your changes instantly with real-time preview and hot reload",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Code,
      title: "Modern Stack",
      description: "Built with React, TypeScript, Tailwind CSS and latest web technologies",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with instant code generation and deployment",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const useCases = [
    {
      icon: Code,
      title: "Developers",
      subtitle: "Rapid Prototyping",
      description: "Generate components in seconds, not hours",
      emoji: "👨‍💻"
    },
    {
      icon: Palette,
      title: "Designers", 
      subtitle: "Design to Code",
      description: "Turn designs into working code instantly",
      emoji: "🎨"
    },
    {
      icon: Rocket,
      title: "Startups",
      subtitle: "Fast MVP",
      description: "Build and ship products at lightning speed",
      emoji: "🚀"
    },
    {
      icon: GraduationCap,
      title: "Students",
      subtitle: "Learn by Doing",
      description: "Practice with real code examples",
      emoji: "🎓"
    }
  ]

  const stats = [
    { number: '50k+', label: 'Components Generated', icon: '🧩' },
    { number: '10k+', label: 'Happy Developers', icon: '😊' },
    { number: '99.9%', label: 'Uptime', icon: '⚡' },
    { number: '< 2s', label: 'Generation Time', icon: '🚀' }
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <img 
                  src="/favicon.ico" 
                  alt="MrrKit Logo" 
                  className="w-5 h-5 object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                MrrKit
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#examples" className="text-gray-600 hover:text-gray-900 transition-colors">Examples</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Link href="/workspace">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">AI-Powered Development Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Ship faster with
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              AI-generated code
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            MrrKit combines the power of AI with an intuitive interface to help you build, 
            iterate, and deploy web applications faster than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/workspace">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4">
                <Rocket className="mr-2 h-5 w-5" />
                Start Building
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Browser Chrome */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 mx-4">
                  <span className="text-sm text-gray-500">mrrkit.dev/workspace</span>
                </div>
              </div>
              
              {/* IDE Interface */}
              <div className="flex h-96">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <FileCode className="h-4 w-4" />
                      <span>components/</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      <div className="text-blue-400 text-sm">Button.tsx</div>
                      <div className="text-green-400 text-sm">Card.tsx</div>
                      <div className="text-yellow-400 text-sm">Modal.tsx</div>
                    </div>
                  </div>
                </div>
                
                {/* Code Editor */}
                <div className="flex-1 bg-gray-900 p-4">
                  <div className="font-mono text-sm space-y-1">
                    <div className="text-purple-400">import React from 'react'</div>
                    <div className="text-gray-500">// AI-generated component</div>
                    <div className="text-blue-400">export default function <span className="text-yellow-400">Button</span>() {`{`}</div>
                    <div className="ml-4 text-gray-300">return (</div>
                    <div className="ml-8 text-green-400">&lt;button className="..."&gt;</div>
                    <div className="ml-12 text-gray-300">Click me</div>
                    <div className="ml-8 text-green-400">&lt;/button&gt;</div>
                    <div className="ml-4 text-gray-300">)</div>
                    <div className="text-blue-400">{`}`}</div>
                  </div>
                </div>
                
                {/* Preview */}
                <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Live Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to build faster
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to accelerate your development workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Built for every developer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a seasoned developer or just starting out
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-8 text-center relative">
                  <div className="text-4xl mb-4">{useCase.emoji}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-purple-600 font-semibold mb-3">{useCase.subtitle}</p>
                  <p className="text-gray-600 text-sm">{useCase.description}</p>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-purple-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="examples" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              See it in action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how MrrKit transforms ideas into code
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="h-6 w-6" />
                  <span className="font-semibold">AI Prompt</span>
                </div>
                <div className="bg-white/10 rounded-lg p-4 font-mono text-sm">
                  "Create a modern pricing card component with hover effects"
                </div>
              </div>
              
              <div className="p-8 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Generated in 1.2s</span>
                </div>
                
                {/* Sample Generated Component */}
                <div className="max-w-sm mx-auto">
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
                      <div className="text-3xl font-bold text-purple-600 mb-4">$29/mo</div>
                      <ul className="space-y-2 text-sm text-gray-600 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Unlimited projects
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Priority support
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Advanced features
                        </li>
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Responsive Preview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Works on every device
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your generated components look perfect on desktop, tablet, and mobile
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <Monitor className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Desktop</span>
            </div>
            <div className="text-center">
              <Tablet className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Tablet</span>
            </div>
            <div className="text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to build something amazing?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of developers who are already building faster with MrrKit
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/workspace">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Building for Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free forever plan
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Open source
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <img 
                    src="/favicon.ico" 
                    alt="MrrKit Logo" 
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <span className="text-xl font-bold">MrrKit</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                The AI-powered development platform that helps you build better software faster.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2024 MrrKit. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}