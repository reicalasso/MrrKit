import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  parent?: string
  language?: string
  isDirty?: boolean
  lastModified?: number
}

export interface AIAssistant {
  isEnabled: boolean
  model: 'gpt-4' | 'gpt-3.5-turbo'
  temperature: number
  maxTokens: number
  apiKey?: string
}

export interface Theme {
  mode: 'light' | 'dark' | 'auto'
  editorTheme: 'vs' | 'vs-dark' | 'hc-black' | 'github-light' | 'github-dark'
  fontSize: number
  fontFamily: string
  lineHeight: number
}

export interface PreviewSettings {
  autoRefresh: boolean
  refreshDelay: number
  showConsole: boolean
  showDevTools: boolean
  viewport: 'desktop' | 'tablet' | 'mobile'
}

export interface Project {
  id: string
  name: string
  description?: string
  isPublic: boolean
  shareUrl?: string
  collaborators: string[]
  createdAt: Date
  updatedAt: Date
  tags: string[]
  framework: 'react' | 'vue' | 'svelte' | 'vanilla' | 'html'
}

interface WorkspaceState {
  // Project Management
  currentProject: Project | null
  projects: Project[]
  
  // File System
  files: FileNode[]
  openFiles: FileNode[]
  activeFileId: string | null
  
  // UI State
  sidebarOpen: boolean
  terminalOpen: boolean
  previewMode: 'split' | 'code' | 'preview' | 'builder' | 'store'
  
  // Settings
  theme: Theme
  previewSettings: PreviewSettings
  aiAssistant: AIAssistant
  
  // Collaboration
  isCollaborating: boolean
  collaborators: Array<{
    id: string
    name: string
    avatar?: string
    cursor?: { line: number; column: number }
    selection?: { start: { line: number; column: number }; end: { line: number; column: number } }
  }>
  
  // AI & Generation
  generationHistory: Array<{
    id: string
    prompt: string
    result: string
    timestamp: Date
    model: string
  }>
  
  // Actions
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  setFiles: (files: FileNode[]) => void
  addFile: (file: FileNode) => void
  updateFile: (id: string, updates: Partial<FileNode>) => void
  deleteFile: (id: string) => void
  
  setOpenFiles: (files: FileNode[]) => void
  addOpenFile: (file: FileNode) => void
  removeOpenFile: (id: string) => void
  setActiveFile: (id: string | null) => void
  
  setSidebarOpen: (open: boolean) => void
  setTerminalOpen: (open: boolean) => void
  setPreviewMode: (mode: 'split' | 'code' | 'preview' | 'builder' | 'store') => void
  
  updateTheme: (theme: Partial<Theme>) => void
  updatePreviewSettings: (settings: Partial<PreviewSettings>) => void
  updateAIAssistant: (ai: Partial<AIAssistant>) => void
  
  addGenerationHistory: (generation: Omit<WorkspaceState['generationHistory'][0], 'id' | 'timestamp'>) => void
  clearGenerationHistory: () => void
  
  setCollaborating: (collaborating: boolean) => void
  updateCollaborator: (id: string, updates: Partial<WorkspaceState['collaborators'][0]>) => void
  addCollaborator: (collaborator: WorkspaceState['collaborators'][0]) => void
  removeCollaborator: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        currentProject: null,
        projects: [],
        files: [
          {
            id: 'src',
            name: 'src',
            type: 'folder',
            children: [
              {
                id: 'app',
                name: 'App.jsx',
                type: 'file',
                language: 'javascript',
                content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🚀 MrrKit Demo
        </h1>
        <div className="text-center">
          <p className="text-xl mb-6 text-gray-600">Count: {count}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setCount(count + 1)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md"
            >
              ➕ Increment
            </button>
            <button 
              onClick={() => setCount(count - 1)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md"
            >
              ➖ Decrement
            </button>
            <button 
              onClick={() => setCount(0)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold shadow-md"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;`
              }
            ]
          },
          {
            id: 'components',
            name: 'components',
            type: 'folder',
            children: []
          },
          {
            id: 'styles',
            name: 'styles.css',
            type: 'file',
            language: 'css',
            content: `/* Global styles for MrrKit projects */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

/* Animation utilities */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}`
          },
          {
            id: 'package',
            name: 'package.json',
            type: 'file',
            language: 'json',
            content: `{
  "name": "mrrkit-project",
  "version": "1.0.0",
  "description": "A project created with MrrKit",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0"
  }
}`
          }
        ],
        openFiles: [],
        activeFileId: null,
        
        sidebarOpen: true,
        terminalOpen: false,
        previewMode: 'split',
        
        theme: {
          mode: 'light',
          editorTheme: 'vs',
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
          lineHeight: 1.5,
        },
        
        previewSettings: {
          autoRefresh: true,
          refreshDelay: 500,
          showConsole: false,
          showDevTools: false,
          viewport: 'desktop',
        },
        
        aiAssistant: {
          isEnabled: false,
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 2000,
        },
        
        isCollaborating: false,
        collaborators: [],
        generationHistory: [],
        
        // Actions
        setCurrentProject: (project) => set({ currentProject: project }),
        addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
        updateProject: (id, updates) => set((state) => ({
          projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
          currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...updates } : state.currentProject
        })),
        deleteProject: (id) => set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject
        })),
        
        setFiles: (files) => set({ files }),
        addFile: (file) => set((state) => ({ files: [...state.files, file] })),
        updateFile: (id, updates) => {
          const updateInFiles = (files: FileNode[]): FileNode[] => {
            return files.map(file => {
              if (file.id === id) {
                return { ...file, ...updates, lastModified: Date.now() }
              }
              if (file.children) {
                return { ...file, children: updateInFiles(file.children) }
              }
              return file
            })
          }
          
          set((state) => ({
            files: updateInFiles(state.files),
            openFiles: state.openFiles.map(f => f.id === id ? { ...f, ...updates, lastModified: Date.now() } : f)
          }))
        },
        deleteFile: (id) => {
          const removeFromFiles = (files: FileNode[]): FileNode[] => {
            return files.filter(file => {
              if (file.id === id) return false
              if (file.children) {
                file.children = removeFromFiles(file.children)
              }
              return true
            })
          }
          
          set((state) => ({
            files: removeFromFiles(state.files),
            openFiles: state.openFiles.filter(f => f.id !== id),
            activeFileId: state.activeFileId === id ? null : state.activeFileId
          }))
        },
        
        setOpenFiles: (files) => set({ openFiles: files }),
        addOpenFile: (file) => set((state) => {
          if (state.openFiles.some(f => f.id === file.id)) return state
          return { openFiles: [...state.openFiles, file] }
        }),
        removeOpenFile: (id) => set((state) => ({
          openFiles: state.openFiles.filter(f => f.id !== id),
          activeFileId: state.activeFileId === id ? 
            (state.openFiles.filter(f => f.id !== id)[0]?.id || null) : 
            state.activeFileId
        })),
        setActiveFile: (id) => set({ activeFileId: id }),
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setTerminalOpen: (open) => set({ terminalOpen: open }),
        setPreviewMode: (mode) => set({ previewMode: mode }),
        
        updateTheme: (theme) => set((state) => ({ theme: { ...state.theme, ...theme } })),
        updatePreviewSettings: (settings) => set((state) => ({ 
          previewSettings: { ...state.previewSettings, ...settings } 
        })),
        updateAIAssistant: (ai) => set((state) => ({ aiAssistant: { ...state.aiAssistant, ...ai } })),
        
        addGenerationHistory: (generation) => set((state) => ({
          generationHistory: [...state.generationHistory, {
            ...generation,
            id: Date.now().toString(),
            timestamp: new Date()
          }]
        })),
        clearGenerationHistory: () => set({ generationHistory: [] }),
        
        setCollaborating: (collaborating) => set({ isCollaborating: collaborating }),
        updateCollaborator: (id, updates) => set((state) => ({
          collaborators: state.collaborators.map(c => c.id === id ? { ...c, ...updates } : c)
        })),
        addCollaborator: (collaborator) => set((state) => ({
          collaborators: [...state.collaborators, collaborator]
        })),
        removeCollaborator: (id) => set((state) => ({
          collaborators: state.collaborators.filter(c => c.id !== id)
        })),
      }),
      {
        name: 'mrrkit-workspace',
        partialize: (state) => ({
          theme: state.theme,
          previewSettings: state.previewSettings,
          aiAssistant: { ...state.aiAssistant, apiKey: undefined }, // Don't persist API key
          projects: state.projects,
          generationHistory: state.generationHistory.slice(-50), // Keep only last 50
        }),
      }
    ),
    { name: 'WorkspaceStore' }
  )
)
