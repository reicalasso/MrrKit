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
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
      setMounted(true)
    }, [])

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
      focus: () => editor?.focus(),
      getSelection: () => {
        if (editor) {
          const selection = editor.getSelection()
          if (selection) {
            return editor.getModel()?.getValueInRange(selection) || ''
          }
        }
        return ''
      },
      insertAtCursor: (text: string) => {
        if (editor) {
          const selection = editor.getSelection()
          if (selection) {
            editor.executeEdits('insert-text', [{
              range: selection,
              text: text
            }])
          }
        }
      }
    }))
    // Sadece client'ta render et
    if (!mounted) {
      return (
        <div
          className={`h-full w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-gray-50 ${className}`}
          style={{ minHeight: '200px' }}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-gray-500 font-medium">Loading Monaco Editor...</div>
            <div className="text-xs text-gray-400 mt-1">Professional code editor</div>
          </div>
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
          fontSize: options.fontSize || 14,
          fontFamily: options.fontFamily || 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
          lineHeight: options.lineHeight || 1.5,
          minimap: { 
            enabled: options.minimap?.enabled !== false, 
            scale: 0.8,
            maxColumn: 120,
            renderCharacters: true,
            showSlider: 'always'
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: options.wordWrap || 'off',
          lineNumbers: options.lineNumbers || 'on',
          renderWhitespace: 'selection',
          renderControlCharacters: true,
          rulers: [80, 120],
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          parameterHints: { enabled: true },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoSurround: 'languageDefined',
          formatOnPaste: true,
          formatOnType: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          unfoldOnClickAfterEndOfLine: true,
          matchBrackets: 'always',
          renderLineHighlight: 'all',
          selectionHighlight: true,
          occurrencesHighlight: true,
          codeLens: true,
          colorDecorators: true,
          lightbulb: { enabled: true },
          contextmenu: true,
          mouseWheelZoom: true,
          multiCursorModifier: 'ctrlCmd',
          accessibilitySupport: 'auto',
          find: {
            seedSearchStringFromSelection: 'always',
            autoFindInSelection: 'never',
            addExtraSpaceOnTop: true
          },
          gotoLocation: {
            multipleReferences: 'peek',
            multipleDefinitions: 'peek',
            multipleDeclarations: 'peek',
            multipleImplementations: 'peek'
          },
          hover: {
            enabled: true,
            delay: 300,
            sticky: true
          },
          links: true,
          colorDecoratorsLimit: 500,
          definitionLinkOpensInPeek: false,
          showUnused: true,
          showDeprecated: true,
          ...options,
        }}
        onChange={(val) => onChange(val ?? '')}
        onMount={(editorInstance, monaco) => {
          setEditor(editorInstance)
          
          // Enhanced theme configuration
          monaco.editor.defineTheme('mrrkit-light', {
            base: 'vs',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: '8b5cf6', fontStyle: 'bold' },
              { token: 'string', foreground: '059669' },
              { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
              { token: 'number', foreground: 'dc2626' },
              { token: 'function', foreground: '2563eb', fontStyle: 'bold' },
              { token: 'type', foreground: '7c3aed' },
              { token: 'class', foreground: '0891b2' },
              { token: 'variable', foreground: '374151' },
              { token: 'constant', foreground: 'b91c1c' },
              { token: 'operator', foreground: '4b5563' },
              { token: 'delimiter', foreground: '6b7280' },
              { token: 'tag', foreground: '059669' },
              { token: 'attribute.name', foreground: '2563eb' },
              { token: 'attribute.value', foreground: '059669' }
            ],
            colors: {
              'editor.background': '#ffffff',
              'editor.foreground': '#374151',
              'editor.lineHighlightBackground': '#f8fafc',
              'editor.selectionBackground': '#dbeafe',
              'editor.selectionHighlightBackground': '#e0e7ff',
              'editor.findMatchBackground': '#fef3c7',
              'editor.findMatchHighlightBackground': '#fde68a',
              'editor.wordHighlightBackground': '#fef3c7',
              'editor.wordHighlightStrongBackground': '#fde68a',
              'editorLineNumber.foreground': '#9ca3af',
              'editorLineNumber.activeForeground': '#374151',
              'editorGutter.background': '#f9fafb',
              'editorWhitespace.foreground': '#e5e7eb',
              'editorIndentGuide.background': '#e5e7eb',
              'editorIndentGuide.activeBackground': '#3b82f6',
              'editorRuler.foreground': '#e5e7eb',
              'editorBracketMatch.background': '#dcfce7',
              'editorBracketMatch.border': '#10b981',
              'editorError.foreground': '#ef4444',
              'editorWarning.foreground': '#f59e0b',
              'editorInfo.foreground': '#3b82f6',
              'editorHint.foreground': '#8b5cf6'
            }
          })
          
          monaco.editor.defineTheme('mrrkit-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: 'a78bfa', fontStyle: 'bold' },
              { token: 'string', foreground: '34d399' },
              { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
              { token: 'number', foreground: 'f87171' },
              { token: 'function', foreground: '60a5fa', fontStyle: 'bold' },
              { token: 'type', foreground: 'c084fc' },
              { token: 'class', foreground: '22d3ee' },
              { token: 'variable', foreground: 'e5e7eb' },
              { token: 'constant', foreground: 'fca5a5' },
              { token: 'operator', foreground: 'd1d5db' },
              { token: 'delimiter', foreground: '9ca3af' },
              { token: 'tag', foreground: '34d399' },
              { token: 'attribute.name', foreground: '60a5fa' },
              { token: 'attribute.value', foreground: '34d399' }
            ],
            colors: {
              'editor.background': '#1f2937',
              'editor.foreground': '#e5e7eb',
              'editor.lineHighlightBackground': '#374151',
              'editor.selectionBackground': '#3b82f6',
              'editor.selectionHighlightBackground': '#1e40af',
              'editor.findMatchBackground': '#f59e0b',
              'editor.findMatchHighlightBackground': '#d97706',
              'editor.wordHighlightBackground': '#f59e0b',
              'editor.wordHighlightStrongBackground': '#d97706',
              'editorLineNumber.foreground': '#6b7280',
              'editorLineNumber.activeForeground': '#e5e7eb',
              'editorGutter.background': '#111827',
              'editorWhitespace.foreground': '#4b5563',
              'editorIndentGuide.background': '#4b5563',
              'editorIndentGuide.activeBackground': '#3b82f6',
              'editorRuler.foreground': '#4b5563',
              'editorBracketMatch.background': '#065f46',
              'editorBracketMatch.border': '#10b981',
              'editorError.foreground': '#ef4444',
              'editorWarning.foreground': '#f59e0b',
              'editorInfo.foreground': '#3b82f6',
              'editorHint.foreground': '#8b5cf6'
            }
          })
          
          // Set custom theme
          monaco.editor.setTheme(theme === 'dark' ? 'mrrkit-dark' : 'mrrkit-light')
          
          // Enhanced keyboard shortcuts
          if (onSave) {
            editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
              onSave()
            })
          }
          
          // Add professional commands
          editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => {
            editorInstance.getAction('editor.action.quickCommand')?.run()
          })
          
          editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
            editorInstance.getAction('editor.action.quickOpen')?.run()
          })
          
          editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
            editorInstance.getAction('actions.find')?.run()
          })
          
          editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
            editorInstance.getAction('editor.action.startFindReplaceAction')?.run()
          })
          
          editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
            editorInstance.getAction('editor.action.gotoLine')?.run()
          })
          
          editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
            editorInstance.getAction('editor.action.formatDocument')?.run()
          })
          
          // Enhanced IntelliSense
          monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.CommonJS,
            noEmit: true,
            esModuleInterop: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            reactNamespace: 'React',
            allowJs: true,
            typeRoots: ['node_modules/@types']
          })
          
          // Add React types
          monaco.languages.typescript.javascriptDefaults.addExtraLib(`
            declare module 'react' {
              export interface FC<P = {}> {
                (props: P): ReactElement | null;
              }
              export function useState<T>(initialState: T): [T, (value: T) => void];
              export function useEffect(effect: () => void, deps?: any[]): void;
              export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
              export function useMemo<T>(factory: () => T, deps: any[]): T;
              export function useRef<T>(initialValue: T): { current: T };
              export const Fragment: FC;
              export interface ReactElement {}
            }
          `, 'file:///node_modules/@types/react/index.d.ts')
          
          if (onMount) onMount(editorInstance)
        }}
        className={className}
      />
    )
  }
)

MonacoEditor.displayName = 'MonacoEditor'
