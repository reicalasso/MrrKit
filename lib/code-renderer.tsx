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
        <div className="h-full w-full flex items-center justify-center text-red-500 p-4 bg-red-50">
          <div className="text-center max-w-full">
            <p className="text-lg font-bold mb-2">Çalışma Zamanı Hatası</p>
            <pre className="text-xs text-left bg-red-100 p-2 rounded overflow-auto max-h-64 w-full whitespace-pre-wrap">
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
      <div className="h-full w-full flex items-center justify-center text-red-500 p-4 bg-red-50">
        <div className="text-center max-w-full">
          <p className="text-lg font-bold mb-2">Render Hatası</p>
          <pre className="text-xs text-left bg-red-100 p-2 rounded overflow-auto max-h-64 w-full whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    )
  }

  if (RenderableComponent) {
    return (
      <div className="p-4 h-full w-full overflow-auto bg-white">
        <ErrorBoundary>
          <RenderableComponent />
        </ErrorBoundary>
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <p>Önizleme yükleniyor...</p>
    </div>
  )
}
