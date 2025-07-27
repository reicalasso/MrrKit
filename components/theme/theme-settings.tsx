'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Type, 
  Eye,
  Settings,
  X,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react'
import { useTheme } from './theme-provider'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'

interface ThemeSettingsProps {
  isOpen?: boolean
  onClose?: () => void
}

export function ThemeSettings({ isOpen = false, onClose }: ThemeSettingsProps) {
  const { theme, editorTheme, resolvedTheme, setTheme, setEditorTheme } = useTheme()
  const { theme: storeTheme, updateTheme } = useWorkspaceStore()
  const [activeTab, setActiveTab] = useState('appearance')

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'auto', label: 'System', icon: Monitor, description: 'Follows system preference' },
  ]

  const editorThemes = [
    { value: 'vs', label: 'Visual Studio Light', description: 'Classic light theme' },
    { value: 'vs-dark', label: 'Visual Studio Dark', description: 'Classic dark theme' },
    { value: 'github-light', label: 'GitHub Light', description: 'GitHub inspired light theme' },
    { value: 'github-dark', label: 'GitHub Dark', description: 'GitHub inspired dark theme' },
    { value: 'hc-black', label: 'High Contrast', description: 'High contrast for accessibility' },
  ]

  const fontFamilies = [
    { value: 'JetBrains Mono', label: 'JetBrains Mono' },
    { value: 'Fira Code', label: 'Fira Code' },
    { value: 'Monaco', label: 'Monaco' },
    { value: 'Consolas', label: 'Consolas' },
    { value: 'Courier New', label: 'Courier New' },
  ]

  const exportTheme = () => {
    const themeConfig = {
      mode: theme,
      editorTheme,
      fontSize: storeTheme.fontSize,
      fontFamily: storeTheme.fontFamily,
      lineHeight: storeTheme.lineHeight,
    }
    
    const dataStr = JSON.stringify(themeConfig, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'mrrkit-theme.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importTheme = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const themeConfig = JSON.parse(e.target?.result as string)
            updateTheme(themeConfig)
            setTheme(themeConfig.mode)
            setEditorTheme(themeConfig.editorTheme)
          } catch (error) {
            console.error('Failed to import theme:', error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const resetToDefaults = () => {
    updateTheme({
      mode: 'light',
      editorTheme: 'vs',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
      lineHeight: 1.5,
    })
    setTheme('light')
    setEditorTheme('vs')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize your workspace appearance</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="flex-1 p-6 space-y-6 overflow-auto">
              <div>
                <Label className="text-base font-medium mb-4 block">Interface Theme</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value as any)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          theme === themeOption.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{themeOption.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{themeOption.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Current Preview</Label>
                <div className={`p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 ${
                  resolvedTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Sample Interface</h3>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm opacity-70">This is how your interface will look with the selected theme.</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Primary</Button>
                      <Button size="sm" variant="outline">Secondary</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor" className="flex-1 p-6 space-y-6 overflow-auto">
              <div>
                <Label className="text-base font-medium mb-4 block">Editor Theme</Label>
                <Select value={editorTheme} onValueChange={setEditorTheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {editorThemes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        <div>
                          <div className="font-medium">{theme.label}</div>
                          <div className="text-xs text-gray-500">{theme.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Font Family</Label>
                <Select 
                  value={storeTheme.fontFamily.split(',')[0]} 
                  onValueChange={(value) => updateTheme({ fontFamily: `${value}, monospace` })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  Font Size: {storeTheme.fontSize}px
                </Label>
                <Slider
                  value={[storeTheme.fontSize]}
                  onValueChange={([value]) => updateTheme({ fontSize: value })}
                  max={24}
                  min={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  Line Height: {storeTheme.lineHeight}
                </Label>
                <Slider
                  value={[storeTheme.lineHeight]}
                  onValueChange={([value]) => updateTheme({ lineHeight: value })}
                  max={2.5}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Editor Preview */}
              <div>
                <Label className="text-base font-medium mb-4 block">Editor Preview</Label>
                <div 
                  className="border rounded-lg p-4 font-mono bg-gray-50 dark:bg-gray-800"
                  style={{ 
                    fontSize: `${storeTheme.fontSize}px`,
                    lineHeight: storeTheme.lineHeight,
                    fontFamily: storeTheme.fontFamily
                  }}
                >
                  <div className="text-blue-600 dark:text-blue-400">function</div>
                  <div className="text-purple-600 dark:text-purple-400 ml-2">example</div>
                  <div className="text-gray-600 dark:text-gray-400 ml-2">() {`{`}</div>
                  <div className="text-green-600 dark:text-green-400 ml-4">// This is a preview</div>
                  <div className="text-red-600 dark:text-red-400 ml-4">return 'Hello World'</div>
                  <div className="text-gray-600 dark:text-gray-400 ml-2">{`}`}</div>
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="flex-1 p-6 space-y-6 overflow-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={exportTheme} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Theme
                  </Button>
                  <Button onClick={importTheme} variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import Theme
                  </Button>
                  <Button onClick={resetToDefaults} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Accessibility</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">High Contrast Mode</Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Enhances contrast for better visibility</p>
                    </div>
                    <Switch 
                      checked={editorTheme === 'hc-black'}
                      onCheckedChange={(checked) => setEditorTheme(checked ? 'hc-black' : 'vs')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Reduce Motion</Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Minimizes animations and transitions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme Information</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Theme:</span>
                    <span className="font-medium">{theme}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resolved Theme:</span>
                    <span className="font-medium">{resolvedTheme}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Editor Theme:</span>
                    <span className="font-medium">{editorTheme}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Font Size:</span>
                    <span className="font-medium">{storeTheme.fontSize}px</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
