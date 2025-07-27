'use client'

import type * as monaco from 'monaco-editor'
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import dynamic from "next/dynamic";

// Dynamically import MonacoEditor to avoid SSR issues
const MonacoEditorDynamic = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

// Dynamic import for Monaco to avoid SSR issues
let monacoInstance: typeof import('monaco-editor') | null = null

export interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  className?: string
  onSave?: () => void
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void
}

export interface MonacoEditorRef {
  getEditor: () => monaco.editor.IStandaloneCodeEditor | null
  focus: () => void
  getSelection: () => string
  insertAtCursor: (text: string) => void
}

// Monaco worker ayarları - dosyanın en başında, global olarak tanımlanmalı
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'json') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/language/json/json.worker.js'
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/language/css/css.worker.js'
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/language/html/html.worker.js'
      }
      if (label === 'typescript' || label === 'javascript') {
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/language/typescript/ts.worker.js'
      }
      return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/editor/editor.worker.js'
    }
  }
}

export const MonacoEditor = forwardRef<MonacoEditorRef, MonacoEditorProps>(
  (
    {
      value,
      onChange,
      language = 'javascript',
      theme = 'light',
      readOnly = false,
      className = '',
      onSave,
      options = {},
      onMount,
    },
    ref
  ) => {
    // MonacoEditorDynamic is available if you want to use the dynamic import elsewhere
    const containerRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<any>(null)
    const isInitialized = useRef(false)
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    // Only run on client side
    useEffect(() => {
      setMounted(true)
    }, [])

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
      focus: () => editorRef.current?.focus(),
      getSelection: () => {
        try {
          const selection = editorRef.current?.getSelection()
          if (selection && monacoInstance) {
            return editorRef.current?.getModel()?.getValueInRange(selection) || ''
          }
        } catch (error) {
          console.warn('Failed to get selection:', error)
        }
        return ''
      },
      insertAtCursor: (text: string) => {
        try {
          const editor = editorRef.current
          if (editor && monacoInstance) {
            const position = editor.getPosition()
            if (position) {
              editor.executeEdits('insert-text', [{
                range: new monacoInstance.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                text
              }])
            }
          }
        } catch (error) {
          console.warn('Failed to insert text:', error)
        }
      }
    }))

    useEffect(() => {
      if (!mounted || !containerRef.current || isInitialized.current) return

      const initEditor = async () => {
        try {
          setIsLoading(true)

          // Dynamically import Monaco Editor
          if (!monacoInstance) {
            monacoInstance = await import('monaco-editor')

            // Configure Monaco loader
            const { loader } = await import('@monaco-editor/react')
            loader.config({
              paths: {
                vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs'
              }
            })
          }

          // Define custom themes
          monacoInstance!.editor.defineTheme('mrrkit-light', {
            base: 'vs',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
              { token: 'keyword', foreground: '0066cc', fontStyle: 'bold' },
              { token: 'string', foreground: 'a31515' },
              { token: 'number', foreground: '098658' },
              { token: 'type', foreground: '267f99' },
              { token: 'function', foreground: '795e26' },
            ],
            colors: {
              'editor.background': '#ffffff',
              'editor.foreground': '#333333',
              'editorLineNumber.foreground': '#999999',
              'editorLineNumber.activeForeground': '#666666',
              'editor.selectionBackground': '#add6ff4d',
              'editor.lineHighlightBackground': '#f5f5f5',
              'editorGutter.background': '#f8f9fa',
              'editorWidget.background': '#f8f9fa',
            }
          })

          monacoInstance!.editor.defineTheme('mrrkit-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
              { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
              { token: 'string', foreground: 'ce9178' },
              { token: 'number', foreground: 'b5cea8' },
              { token: 'type', foreground: '4ec9b0' },
              { token: 'function', foreground: 'dcdcaa' },
            ],
            colors: {
              'editor.background': '#1e1e1e',
              'editor.foreground': '#d4d4d4',
              'editorLineNumber.foreground': '#858585',
              'editorLineNumber.activeForeground': '#c6c6c6',
              'editor.selectionBackground': '#264f78',
              'editor.lineHighlightBackground': '#2a2d2e',
              'editorGutter.background': '#1e1e1e',
              'editorWidget.background': '#252526',
            }
          })

          // Configure TypeScript/JavaScript language features
          const jsDefaults = monacoInstance!.languages.typescript.javascriptDefaults
          const tsDefaults = monacoInstance!.languages.typescript.typescriptDefaults

          // Set compiler options
          const compilerOptions = {
            target: monacoInstance!.languages.typescript.ScriptTarget.ES2020,
            allowNonTsExtensions: true,
            moduleResolution: monacoInstance!.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monacoInstance!.languages.typescript.ModuleKind.CommonJS,
            noEmit: true,
            esModuleInterop: true,
            jsx: monacoInstance!.languages.typescript.JsxEmit.React,
            reactNamespace: 'React',
            allowJs: true,
            typeRoots: ['node_modules/@types']
          }

          jsDefaults.setCompilerOptions(compilerOptions)
          tsDefaults.setCompilerOptions(compilerOptions)

          // Add React types
          const reactTypes = `
            declare module 'react' {
              export interface FC<P = {}> {
                (props: P): JSX.Element;
              }
              export function useState<T>(initial: T): [T, (value: T) => void];
              export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
              export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
              export function useMemo<T>(factory: () => T, deps: any[]): T;
              export const createElement: any;
              export default React;
            }
            declare global {
              namespace JSX {
                interface Element {}
                interface IntrinsicElements {
                  [elemName: string]: any;
                }
              }
            }
          `

          monacoInstance!.languages.typescript.javascriptDefaults.addExtraLib(reactTypes, 'file:///react.d.ts')
          monacoInstance!.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, 'file:///react.d.ts')

          const editor = monacoInstance!.editor.create(containerRef.current!, {
            value,
            language,
            theme: theme === 'dark' ? 'mrrkit-dark' : 'mrrkit-light',
            readOnly,
            automaticLayout: true,
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: true, scale: 0.5 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            folding: true,
            foldingHighlight: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            acceptSuggestionOnCommitCharacter: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            contextmenu: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            ...options,
          })

          editorRef.current = editor

          // Handle content changes
          editor.onDidChangeModelContent(() => {
            const newValue = editor.getValue()
            onChange(newValue)
          })

          // Handle save command
          if (onSave) {
            editor.addCommand(monacoInstance!.KeyMod.CtrlCmd | monacoInstance!.KeyCode.KeyS, () => {
              onSave()
            })
          }

          // Call onMount callback
          if (onMount) {
            onMount(editor)
          }

          isInitialized.current = true
          setIsLoading(false)
        } catch (error) {
          console.error('Failed to initialize Monaco Editor:', error)
          setIsLoading(false)
        }
      }

      initEditor()

      return () => {
        if (editorRef.current) {
          editorRef.current.dispose()
          editorRef.current = null
          isInitialized.current = false
        }
      }
    }, [mounted])

    // Update value when prop changes
    useEffect(() => {
      if (editorRef.current && value !== editorRef.current.getValue()) {
        const editor = editorRef.current
        const position = editor.getPosition()
        editor.setValue(value)
        if (position) {
          editor.setPosition(position)
        }
      }
    }, [value])

    // Update theme when prop changes
    useEffect(() => {
      if (editorRef.current && monacoInstance) {
        monacoInstance.editor.setTheme(theme === 'dark' ? 'mrrkit-dark' : 'mrrkit-light')
      }
    }, [theme, mounted])

    // Update language when prop changes
    useEffect(() => {
      if (editorRef.current && monacoInstance) {
        const model = editorRef.current.getModel()
        if (model) {
          monacoInstance.editor.setModelLanguage(model, language)
        }
      }
    }, [language, mounted])

    // Don't render anything on server side
    if (!mounted) {
      return (
        <div
          className={`h-full w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-gray-50 ${className}`}
          style={{ minHeight: '200px' }}
        >
          <div className="text-gray-500">Loading editor...</div>
        </div>
      )
    }

    return (
      <div className="h-full w-full relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">Loading Monaco Editor...</div>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className={`h-full w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}
          style={{ minHeight: '200px' }}
        />
      </div>
    )
  }
)

MonacoEditor.displayName = 'MonacoEditor'
