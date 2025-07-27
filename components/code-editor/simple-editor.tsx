'use client'

import React, { forwardRef, useImperativeHandle, useRef } from 'react'

interface SimpleEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  className?: string
  onSave?: () => void
  options?: any
}

interface SimpleEditorRef {
  getEditor: () => null
  focus: () => void
  getSelection: () => string
  insertAtCursor: (text: string) => void
}

export const SimpleEditor = forwardRef<SimpleEditorRef, SimpleEditorProps>(
  ({ value, onChange, onSave, className = '' }, ref) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      getEditor: () => null,
      focus: () => textAreaRef.current?.focus(),
      getSelection: () => {
        const textarea = textAreaRef.current
        if (textarea) {
          return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
        }
        return ''
      },
      insertAtCursor: (text: string) => {
        const textarea = textAreaRef.current
        if (textarea) {
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const newValue = value.substring(0, start) + text + value.substring(end)
          onChange(newValue)
          
          // Set cursor position after inserted text
          setTimeout(() => {
            textarea.setSelectionRange(start + text.length, start + text.length)
          }, 0)
        }
      }
    }))

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        onSave?.()
      }
      
      // Handle tab key
      if (e.key === 'Tab') {
        e.preventDefault()
        const textarea = e.target as HTMLTextAreaElement
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue = value.substring(0, start) + '  ' + value.substring(end)
        onChange(newValue)
        
        // Set cursor position after tab
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2)
        }, 0)
      }
    }

    return (
      <div className={`h-full w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
        <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3">
          <span className="text-xs text-gray-600">Text Editor (Fallback)</span>
        </div>
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 text-sm font-mono resize-none border-0 outline-none bg-white"
          style={{ height: 'calc(100% - 32px)' }}
          placeholder="Start typing your code..."
          spellCheck={false}
        />
      </div>
    )
  }
)

SimpleEditor.displayName = 'SimpleEditor'
