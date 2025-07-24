'use client'

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import CodeMirror, { ReactCodeMirrorRef, ViewUpdate } from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { rust } from '@codemirror/lang-rust'
import { php } from '@codemirror/lang-php'
import { sql } from '@codemirror/lang-sql'
import { markdown } from '@codemirror/lang-markdown'
import { yaml } from '@codemirror/lang-yaml'
import { go } from '@codemirror/lang-go'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { githubLight } from '@uiw/codemirror-theme-github'
import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap } from '@codemirror/search'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { linter, lintGutter } from '@codemirror/lint'
import type { Extension } from '@codemirror/state'
import { transform } from '@babel/standalone'

export interface CodeMirrorEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  className?: string
  onSave?: () => void
  options?: {
    lineNumbers?: boolean
    wordWrap?: boolean
    fontSize?: number
    tabSize?: number
    autoComplete?: boolean
  }
  onCursorChange?: (state: ViewUpdate) => void
}

export const CodeMirrorEditor = forwardRef<ReactCodeMirrorRef, CodeMirrorEditorProps>(
  (
    {
      value,
      onChange,
      language = 'javascript',
      theme = 'light',
      readOnly = false,
      className,
      onSave,
      options = {},
      onCursorChange,
    },
    ref
  ) => {
    const langExtensions = {
      javascript: [javascript({ jsx: true, typescript: false })],
      typescript: [javascript({ jsx: true, typescript: true })],
      jsx: [javascript({ jsx: true, typescript: false })],
      tsx: [javascript({ jsx: true, typescript: true })],
      css: [css()],
      html: [html()],
      json: [json()],
      python: [python()],
      java: [java()],
      cpp: [cpp()],
      rust: [rust()],
      php: [php()],
      sql: [sql()],
      markdown: [markdown()],
      yaml: [yaml()],
      go: [go()],
    }
    const extensions: Extension[] = [
      history(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
      ]),
      ...(langExtensions[language as keyof typeof langExtensions] || [javascript({ jsx: true })]),
    ]

    if (onSave) {
      extensions.push(
        keymap.of([
          {
            key: 'Mod-s',
            run: () => {
              onSave()
              return true
            },
          },
        ])
      )
    }

    if (options.autoComplete !== false) {
      extensions.push(autocompletion())
    }
    
    if (options.wordWrap) {
      extensions.push(EditorView.lineWrapping)
    }

    const editorRef = useRef<EditorView | null>(null)

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 's') {
          event.preventDefault()
          onSave?.()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onSave])

    const babelLinter = linter((view) => {
      if (!language.includes('js') && !language.includes('ts')) {
        return []
      }
      const diagnostics: import('@codemirror/lint').Diagnostic[] = []
      try {
        // Use Babel to transform the code and catch syntax errors
        transform(view.state.doc.toString(), {
          presets: ['react', 'typescript'],
          filename: 'component.tsx',
        })
      } catch (error: any) {
        const loc = error.loc
        let from = 0
        // Babel can sometimes not provide a location.
        if (loc) {
          // CodeMirror lines are 1-based, Babel's are too.
          // CodeMirror columns are 1-based, Babel's are 0-based.
          const line = view.state.doc.line(loc.line)
          from = line.from + loc.column
        }
        
        diagnostics.push({
          from: from,
          to: from + 1, // Highlight at least one character
          severity: "error",
          message: error.message.replace(/\(\d+:\d+\)/, '').trim(),
        })
      }
      return diagnostics
    })

    return (
      <CodeMirror
        ref={ref}
        value={value}
        height="100%"
        className={`h-full text-base ${className ?? ''}`}
        extensions={[
          ...extensions,
          lintGutter(),
          babelLinter,
        ]}
        onChange={onChange}
        theme={theme === 'dark' ? vscodeDark : githubLight}
        onUpdate={onCursorChange}
        basicSetup={{
          lineNumbers: options.lineNumbers !== false,
          foldGutter: true,
          autocompletion: options.autoComplete !== false,
          tabSize: options.tabSize || 2,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
        }}
        style={{
          fontSize: options.fontSize ? `${options.fontSize}px` : '14px',
        }}
      />
    )
  }
)

CodeMirrorEditor.displayName = 'CodeMirrorEditor'
