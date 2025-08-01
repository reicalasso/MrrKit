'use client'

import React, { useEffect, useState } from 'react'
import { transform } from '@babel/standalone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Rendered component error:", error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center text-red-600 p-6 bg-gradient-to-br from-red-50 to-rose-50">
          <div className="text-center max-w-full bg-white rounded-xl p-6 shadow-lg border border-red-200/50">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💥</span>
            </div>
            <p className="text-lg font-bold mb-3 text-red-700">Çalışma Zamanı Hatası</p>
            <pre className="text-xs text-left bg-red-50 p-4 rounded-lg overflow-auto max-h-64 w-full whitespace-pre-wrap border border-red-200 text-red-600">
              {this.state.error?.message}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

interface CodeRendererProps {
  code: string
  onError?: (error: Error | null) => void
}

export const CodeRenderer: React.FC<CodeRendererProps> = ({ code, onError }) => {
  const [RenderableComponent, setRenderableComponent] = useState<React.FC | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setRenderableComponent(null)
      setError(null)
      onError?.(null)
      return
    }

    const transpileAndRender = async () => {
      try {
        const trimmedCode = code.trim()
        const match = trimmedCode.match(/function\s+([A-Z]\w*)/)
        const componentName = match ? match[1] : 'Component'
        const codeToTransform = trimmedCode.replace(/export default\s*/, '')

        const transformed = transform(codeToTransform, {
          presets: ['react', 'typescript'],
          filename: 'component.tsx'
        }).code

        if (!transformed) {
          throw new Error('Babel transformation failed.')
        }

        const factory = new Function(
          'React', 'useState', 'useEffect', 'useCallback', 'useMemo',
          'Button', 'Input', 'Card', 'CardHeader', 'CardTitle', 'CardContent',
          `
          ${transformed}
          return ${componentName};
          `
        )

        const Component = factory(
          React, React.useState, React.useEffect, React.useCallback, React.useMemo,
          Button, Input, Card, CardHeader, CardTitle, CardContent
        )

        if (typeof Component !== 'function') {
          throw new Error('Generated code did not produce a renderable React component.')
        }

        setRenderableComponent(() => Component)
        setError(null)
        onError?.(null)
      } catch (e: any) {
        console.error("Render Error:", e)
        setError(e.message)
        onError?.(e)
        setRenderableComponent(null)
      }
    }

    transpileAndRender()
  }, [code, onError])

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center text-red-600 p-6 bg-gradient-to-br from-red-50 to-rose-50">
        <div className="text-center max-w-full bg-white rounded-xl p-6 shadow-lg border border-red-200/50">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg font-bold mb-3 text-red-700">Render Hatası</p>
          <pre className="text-xs text-left bg-red-50 p-4 rounded-lg overflow-auto max-h-64 w-full whitespace-pre-wrap border border-red-200 text-red-600">{error}</pre>
        </div>
      </div>
    )
  }

  if (RenderableComponent) {
    return (
      <div className="p-6 h-full w-full overflow-auto bg-gradient-to-br from-white to-gray-50/30">
        <ErrorBoundary>
          <RenderableComponent />
        </ErrorBoundary>
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-2xl">⚡</span>
        </div>
        <p className="text-lg font-medium text-gray-600">Önizleme yükleniyor...</p>
        <p className="text-sm text-gray-400 mt-2">Kod analiz ediliyor</p>
      </div>
    </div>
  )
}
