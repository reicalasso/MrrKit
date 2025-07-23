'use client'

import React, { useMemo } from 'react'
import * as Babel from '@babel/standalone'

interface CodeRendererProps {
  code: string
  onError?: (error: string) => void
}

export function CodeRenderer({ code, onError }: CodeRendererProps) {
  const RenderedComponent = useMemo(() => {
    if (!code.trim()) return null

    try {
      // Export statement'ını temizle ve component adını extract et
      let cleanCode = code.trim()
      let componentName = 'GeneratedComponent'
      
      // Export default ifadesini temizle ve component adını yakala
      const exportMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/)
      if (exportMatch) {
        componentName = exportMatch[1]
        cleanCode = cleanCode.replace(/export\s+default\s+/, '')
      } else {
        // Eğer export default yoksa, function declaration'ı ara
        const funcMatch = cleanCode.match(/function\s+(\w+)/)
        if (funcMatch) {
          componentName = funcMatch[1]
        }
      }

      // Arrow function export'unu handle et
      const arrowExportMatch = cleanCode.match(/export\s+default\s+(\w+)/)
      if (arrowExportMatch) {
        componentName = arrowExportMatch[1]
        cleanCode = cleanCode.replace(/export\s+default\s+\w+/, '')
      }

      // Babel ile transform et
      const transformedCode = Babel.transform(cleanCode, {
        filename: 'generated-component.jsx',
        presets: [
          ['react', { runtime: 'classic' }],
          ['env', { modules: false, targets: { node: 'current' } }]
        ],
        plugins: []
      }).code

      // Mock UI bileşenleri
      const mockComponents = {
        Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => React.createElement('button', { 
          className: `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 ${props.className || ''}`,
          style: { cursor: props.disabled ? 'not-allowed' : 'pointer' },
          ...props 
        }),
        
        Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.createElement('input', { 
          className: `flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`,
          ...props 
        }),
        
        Card: (props: React.HTMLAttributes<HTMLDivElement>) => React.createElement('div', { 
          className: `rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${props.className || ''}`,
          ...props 
        }),
        
        CardContent: (props: React.HTMLAttributes<HTMLDivElement>) => React.createElement('div', { 
          className: `p-6 pt-0 ${props.className || ''}`,
          ...props 
        }),
        
        CardHeader: (props: React.HTMLAttributes<HTMLDivElement>) => React.createElement('div', { 
          className: `flex flex-col space-y-1.5 p-6 ${props.className || ''}`,
          ...props 
        }),
        
        CardTitle: (props: React.HTMLAttributes<HTMLHeadingElement>) => React.createElement('h3', { 
          className: `text-2xl font-semibold leading-none tracking-tight ${props.className || ''}`,
          ...props 
        })
      }

      // Güvenli kod çalıştırma - export olmadan
      const createComponent = new Function(
        'React',
        'useState', 
        'useEffect',
        'useCallback',
        'useMemo',
        'Button',
        'Input', 
        'Card',
        'CardContent',
        'CardHeader',
        'CardTitle',
        `
        try {
          ${transformedCode}
          
          // Component'i farklı isimlerle dene
          const possibleComponents = [
            typeof ${componentName} !== 'undefined' ? ${componentName} : null,
            typeof GeneratedComponent !== 'undefined' ? GeneratedComponent : null,
            typeof TodoApp !== 'undefined' ? TodoApp : null,
            typeof Calculator !== 'undefined' ? Calculator : null,
            typeof ProfileCard !== 'undefined' ? ProfileCard : null,
            typeof Counter !== 'undefined' ? Counter : null
          ].filter(Boolean);
          
          if (possibleComponents.length > 0) {
            return possibleComponents[0];
          }
          
          // Eğer hiçbiri bulunamazsa, global scope'da tanımlı function'ları ara
          const globalKeys = Object.keys(this || {});
          for (let key of globalKeys) {
            if (typeof this[key] === 'function' && key !== 'Function' && key !== 'eval') {
              return this[key];
            }
          }
          
          return function DefaultComponent() {
            return React.createElement('div', { 
              className: 'text-amber-600 p-4 border border-amber-300 rounded bg-amber-50' 
            }, 'Bileşen tanımlandı ama bulunamadı: ${componentName}');
          };
        } catch (error) {
          console.error('Component execution error:', error);
          return function ErrorComponent() {
            return React.createElement('div', { 
              className: 'text-red-500 p-4 border border-red-300 rounded bg-red-50' 
            }, 'Kod çalıştırılamadı: ' + error.message);
          };
        }
        `
      )

      return createComponent.call({}, 
        React,
        React.useState,
        React.useEffect,
        React.useCallback,
        React.useMemo,
        mockComponents.Button,
        mockComponents.Input,
        mockComponents.Card,
        mockComponents.CardContent,
        mockComponents.CardHeader,
        mockComponents.CardTitle
      )

    } catch (error) {
      console.error('Kod render hatası:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      onError?.(errorMessage)
      
      return () => React.createElement('div', { 
        className: 'text-red-500 p-3 sm:p-4 border border-red-300 rounded-lg bg-red-50 max-w-full mx-2 sm:mx-0' 
      }, [
        React.createElement('h4', { key: 'title', className: 'font-bold mb-2 text-sm sm:text-base' }, 'Render Hatası'),
        React.createElement('p', { key: 'message', className: 'text-xs sm:text-sm mb-2' }, errorMessage),
        React.createElement('details', { key: 'details', className: 'mt-2' }, [
          React.createElement('summary', { key: 'summary', className: 'cursor-pointer text-xs font-medium' }, 'Hata Detayları'),
          React.createElement('pre', { 
            key: 'stack', 
            className: 'text-xs mt-1 whitespace-pre-wrap bg-red-100 p-2 rounded max-h-32 overflow-auto break-all' 
          }, error instanceof Error ? error.stack : 'Stack trace mevcut değil')
        ])
      ])
    }
  }, [code, onError])

  if (!RenderedComponent) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mx-2 sm:mx-0">
        <div className="text-center px-4">
          <div className="text-3xl sm:text-4xl mb-2">📝</div>
          <p className="text-base sm:text-lg font-medium">Kod bekleniyor</p>
          <p className="text-xs sm:text-sm">Bir prompt girin ve kod üretin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border min-h-[150px] sm:min-h-[200px] mx-2 sm:mx-0">
      <RenderedComponent />
    </div>
  )
}
