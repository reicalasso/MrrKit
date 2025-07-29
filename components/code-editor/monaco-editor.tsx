'use client'

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import dynamic from "next/dynamic";
import type * as monaco from 'monaco-editor';

// Dynamically import MonacoEditor to avoid SSR issues
const MonacoEditorDynamic = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

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
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    // Sadece client'ta render et
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

    // Sadece NPM ve @monaco-editor/react ile kullan
    return (
      <MonacoEditorDynamic
        value={value}
        language={language}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          readOnly,
          fontSize: 14,
          minimap: { enabled: true, scale: 0.5 },
          automaticLayout: true,
          ...options,
        }}
        onChange={(val) => onChange(val ?? '')}
        onMount={(editor, monaco) => {
          // Kendi theme veya ek ayarlarını burada yapabilirsin
          if (onMount) onMount(editor)
          if (onSave) {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
              onSave()
            })
          }
        }}
        className={className}
      />
    )
  }
)

MonacoEditor.displayName = 'MonacoEditor'
