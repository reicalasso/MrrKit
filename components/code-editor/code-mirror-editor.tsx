'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CodeMirrorEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  className?: string
  onSave?: () => void
}

import dynamic from 'next/dynamic'

export function CodeMirrorEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'light',
  readOnly = false,
  className,
  onSave
}: CodeMirrorEditorProps) {
  const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => mod.default), { ssr: false })

  function handleEditorChange(value: string | undefined) {
    onChange(value ?? '')
  }

  function handleEditorMount(editor: any, monaco: any) {
    if (onSave) {
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          onSave()
        }
      )
    }
  }

  return (
    <MonacoEditor
      value={value}
      language={language}
      theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
      options={{
        readOnly,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        folding: true,
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
        bracketPairColorization: { enabled: true },
        suggest: {
          showKeywords: true,
          showSnippets: true
        }
      }}
      onChange={handleEditorChange}
      onMount={handleEditorMount}
      className={cn("w-full h-full min-h-[400px]", className)}
    />
  )
}
