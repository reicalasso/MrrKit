'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Eye, Code, Save, Download, Trash2, Copy, Move, Layers, Grid, Ruler, ZoomIn, ZoomOut, RotateCcw, Undo, Redo, Lock, Unlock, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useWorkspaceStore } from '@/lib/stores/workspace-store';
import { ComponentPalette } from './component-palette';
import { DesignCanvas } from './design-canvas';
import { PropertyPanel } from './property-panel';
import { LayerPanel } from './layer-panel';
import { generateComponentCode } from '@/lib/services/ui-builder-service';

export interface UIElement {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
  style: Record<string, any>;
  children?: UIElement[];
  parentId?: string;
  locked?: boolean;
  visible?: boolean;
  order: number;
}

export interface CanvasElement extends UIElement {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

export function UIBuilderPanel() {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [componentName, setComponentName] = useState('MyComponent');
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 100,
    panX: 0,
    panY: 0,
    showGrid: true,
    showRulers: true,
    snapToGrid: true,
    gridSize: 10
  });
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePanel, setActivePanel] = useState<'layers' | 'components' | 'properties'>('components');
  
  const { addFile, currentProject } = useWorkspaceStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  // History management
  const saveToHistory = useCallback((elements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasElements([...history[historyIndex - 1]]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasElements([...history[historyIndex + 1]]);
    }
  }, [history, historyIndex]);

  // Canvas operations
  const handleDrop = useCallback((elementType: string, x: number, y: number) => {
    const newElement: CanvasElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      label: getElementLabel(elementType),
      properties: getDefaultProperties(elementType),
      style: getDefaultStyle(elementType),
      x: canvasState.snapToGrid ? Math.round(x / canvasState.gridSize) * canvasState.gridSize : x,
      y: canvasState.snapToGrid ? Math.round(y / canvasState.gridSize) * canvasState.gridSize : y,
      width: getDefaultWidth(elementType),
      height: getDefaultHeight(elementType),
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      order: canvasElements.length,
    };

    const newElements = [...canvasElements, newElement];
    setCanvasElements(newElements);
    saveToHistory(newElements);
    setSelectedElements([newElement.id]);
  }, [canvasElements, canvasState.snapToGrid, canvasState.gridSize, saveToHistory]);

  const handleElementSelect = useCallback((elementIds: string[], additive = false) => {
    if (additive) {
      setSelectedElements(prev => [...prev, ...elementIds.filter(id => !prev.includes(id))]);
    } else {
      setSelectedElements(elementIds);
    }
    setActivePanel('properties');
  }, []);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    const newElements = canvasElements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    setCanvasElements(newElements);
    saveToHistory(newElements);
  }, [canvasElements, saveToHistory]);

  const handleElementsUpdate = useCallback((updates: Record<string, Partial<CanvasElement>>) => {
    const newElements = canvasElements.map(el => 
      updates[el.id] ? { ...el, ...updates[el.id] } : el
    );
    setCanvasElements(newElements);
    saveToHistory(newElements);
  }, [canvasElements, saveToHistory]);

  const handleElementDelete = useCallback((elementId?: string) => {
    const idsToDelete = elementId ? [elementId] : selectedElements;
    const newElements = canvasElements.filter(el => !idsToDelete.includes(el.id));
    setCanvasElements(newElements);
    saveToHistory(newElements);
    setSelectedElements([]);
  }, [selectedElements, canvasElements, saveToHistory]);

  const handleDuplicate = useCallback(() => {
    const elementsToDuplicate = canvasElements.filter(el => selectedElements.includes(el.id));
    const duplicatedElements = elementsToDuplicate.map(el => ({
      ...el,
      id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: el.x + 20,
      y: el.y + 20,
      order: canvasElements.length + elementsToDuplicate.indexOf(el)
    }));
    
    const newElements = [...canvasElements, ...duplicatedElements];
    setCanvasElements(newElements);
    saveToHistory(newElements);
    setSelectedElements(duplicatedElements.map(el => el.id));
  }, [selectedElements, canvasElements, saveToHistory]);

  const handleBringToFront = useCallback(() => {
    const maxOrder = Math.max(...canvasElements.map(el => el.order));
    const updates: Record<string, Partial<CanvasElement>> = {};
    selectedElements.forEach((id, index) => {
      updates[id] = { order: maxOrder + index + 1 };
    });
    handleElementsUpdate(updates);
  }, [selectedElements, canvasElements, handleElementsUpdate]);

  const handleSendToBack = useCallback(() => {
    const minOrder = Math.min(...canvasElements.map(el => el.order));
    const updates: Record<string, Partial<CanvasElement>> = {};
    selectedElements.forEach((id, index) => {
      updates[id] = { order: minOrder - selectedElements.length + index };
    });
    handleElementsUpdate(updates);
  }, [selectedElements, canvasElements, handleElementsUpdate]);

  // Canvas zoom and pan
  const handleZoom = useCallback((delta: number) => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(10, Math.min(500, prev.zoom + delta))
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setCanvasState(prev => ({ ...prev, zoom: 100, panX: 0, panY: 0 }));
  }, []);

  // Generate code
  const handleGenerateCode = useCallback(() => {
    const code = generateComponentCode(componentName, canvasElements);

    if (currentProject) {
      const fileName = `${componentName}.tsx`;
      const newFile = {
        id: Date.now().toString(),
        name: fileName,
        type: "file" as const,
        content: code,
        language: 'typescript',
        isDirty: false,
        parent: undefined,
      };
      addFile(newFile);
    }
  }, [componentName, canvasElements, currentProject, addFile]);

  const handleExportCode = useCallback(() => {
    const code = generateComponentCode(componentName, canvasElements);
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  }, [componentName, canvasElements]);

  const handleClearCanvas = useCallback(() => {
    setCanvasElements([]);
    setSelectedElements([]);
    saveToHistory([]);
  }, [saveToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleElementDelete();
      } else if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'd':
            e.preventDefault();
            handleDuplicate();
            break;
          case 'a':
            e.preventDefault();
            setSelectedElements(canvasElements.map(el => el.id));
            break;
          case ']':
            e.preventDefault();
            handleBringToFront();
            break;
          case '[':
            e.preventDefault();
            handleSendToBack();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleElementDelete, undo, redo, handleDuplicate, canvasElements, handleBringToFront, handleSendToBack]);

  const selectedElement = canvasElements.find(el => selectedElements.includes(el.id));

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex rounded-lg overflow-hidden">
              <Button
                size="sm"
                variant={activePanel === 'components' ? 'default' : 'ghost'}
                onClick={() => setActivePanel('components')}
                className="h-7 px-2 text-xs rounded-none"
              >
                <Grid className="h-3 w-3 mr-1" />
                Components
              </Button>
              <Button
                size="sm"
                variant={activePanel === 'layers' ? 'default' : 'ghost'}
                onClick={() => setActivePanel('layers')}
                className="h-7 px-2 text-xs rounded-none"
              >
                <Layers className="h-3 w-3 mr-1" />
                Layers
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1">
          {activePanel === 'components' && <ComponentPalette />}
          {activePanel === 'layers' && (
            <LayerPanel
              elements={canvasElements}
              selectedElements={selectedElements}
              onElementSelect={handleElementSelect}
              onElementUpdate={handleElementUpdate}
              onElementDelete={handleElementDelete}
            />
          )}
        </ScrollArea>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="component-name" className="text-xs">Name:</Label>
              <Input
                id="component-name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="h-7 w-28 text-xs"
                placeholder="Component name"
              />
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* History Controls */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="h-7 w-7 p-0"
              >
                <Undo className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="h-7 w-7 p-0"
              >
                <Redo className="h-3 w-3" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleZoom(-10)}
                className="h-7 w-7 p-0"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs min-w-[3rem] text-center">{canvasState.zoom}%</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleZoom(10)}
                className="h-7 w-7 p-0"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetZoom}
                className="h-7 w-7 p-0"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Canvas Controls */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={canvasState.showGrid ? "default" : "ghost"}
                onClick={() => setCanvasState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
                className="h-7 px-2 text-xs"
              >
                <Grid className="h-3 w-3 mr-1" />
                Grid
              </Button>
              <Button
                size="sm"
                variant={canvasState.showRulers ? "default" : "ghost"}
                onClick={() => setCanvasState(prev => ({ ...prev, showRulers: !prev.showRulers }))}
                className="h-7 px-2 text-xs"
              >
                <Ruler className="h-3 w-3 mr-1" />
                Rulers
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {canvasElements.length} elements
            </Badge>
            {selectedElements.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedElements.length} selected
              </Badge>
            )}
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="h-7"
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateCode}
              disabled={canvasElements.length === 0}
              className="h-7"
            >
              <Code className="h-3 w-3 mr-1" />
              Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCode}
              disabled={canvasElements.length === 0}
              className="h-7"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Selection Toolbar */}
        {selectedElements.length > 0 && !isPreviewMode && (
          <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDuplicate}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Duplicate
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleElementDelete()}
                className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleBringToFront}
                className="h-7 px-2 text-xs"
              >
                Bring Forward
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSendToBack}
                className="h-7 px-2 text-xs"
              >
                Send Backward
              </Button>
            </div>
            
            {selectedElements.length === 1 && selectedElement && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-1">
                  <Label className="text-xs">X:</Label>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => handleElementUpdate(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                    className="h-6 w-16 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Y:</Label>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => handleElementUpdate(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                    className="h-6 w-16 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">W:</Label>
                  <Input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => handleElementUpdate(selectedElement.id, { width: parseInt(e.target.value) || 0 })}
                    className="h-6 w-16 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">H:</Label>
                  <Input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => handleElementUpdate(selectedElement.id, { height: parseInt(e.target.value) || 0 })}
                    className="h-6 w-16 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 relative">
          <DesignCanvas
            elements={canvasElements}
            selectedElement={selectedElements.length === 1 ? canvasElements.find(el => el.id === selectedElements[0]) ?? null : null}
            isPreviewMode={isPreviewMode}
            onDrop={handleDrop}
            onElementSelect={(element) => {
              if (element) {
                handleElementSelect([element.id]);
              } else {
                setSelectedElements([]);
                setActivePanel('components');
              }
            }}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
          />
        </div>
      </div>

      {/* Right Property Panel */}
      <div className="w-80 bg-white border-l border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-medium text-sm">Properties</h3>
          <p className="text-xs text-gray-500">
            {selectedElements.length > 1 
              ? `${selectedElements.length} elements selected`
              : selectedElement 
                ? `Edit ${selectedElement.label}`
                : 'Select an element'
            }
          </p>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)]">
          <PropertyPanel
            selectedElement={selectedElements.length === 1 ? (canvasElements.find(el => el.id === selectedElements[0]) || null) : null}
            onElementUpdate={
              selectedElements.length === 1
                ? (updates) => handleElementUpdate(selectedElements[0], updates)
                : () => {}
            }
          />
        </ScrollArea>
      </div>
    </div>
  );
}

function getElementLabel(type: string): string {
  const labels: Record<string, string> = {
    'button': 'Button',
    'input': 'Input',
    'textarea': 'Textarea', 
    'select': 'Select',
    'checkbox': 'Checkbox',
    'radio': 'Radio',
    'label': 'Label',
    'heading': 'Heading',
    'text': 'Text',
    'image': 'Image',
    'link': 'Link',
    'div': 'Container',
    'card': 'Card',
    'badge': 'Badge',
    'avatar': 'Avatar',
    'separator': 'Separator',
    'gradient-button': 'Gradient Button',
    'glass-card': 'Glass Card',
    'neon-input': 'Neon Input',
    'animated-badge': 'Animated Badge',
    'floating-label': 'Floating Label',
    'pulse-avatar': 'Pulse Avatar',
    'morphing-button': 'Morphing Button',
    'holographic-card': 'Holographic Card'
  };
  return labels[type] || type;
}

function getDefaultProperties(type: string): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
    'button': { variant: 'default', size: 'default', children: 'Button' },
    'input': { type: 'text', placeholder: 'Enter text...' },
    'textarea': { placeholder: 'Enter text...', rows: 3 },
    'select': { options: ['Option 1', 'Option 2', 'Option 3'] },
    'checkbox': { label: 'Checkbox label' },
    'radio': { name: 'radio-group', value: 'option1', label: 'Radio option' },
    'label': { children: 'Label text' },
    'heading': { level: 'h2', children: 'Heading' },
    'text': { children: 'Text content' },
    'image': { src: '/placeholder.svg', alt: 'Image' },
    'link': { href: '#', children: 'Link text' },
    'div': { className: 'p-4 border rounded' },
    'card': { title: 'Card Title', description: 'Card description' },
    'badge': { variant: 'default', children: 'Badge' },
    'avatar': { fallback: 'AB' },
    'separator': { orientation: 'horizontal' },
    'gradient-button': { children: 'Gradient Button', variant: 'gradient' },
    'glass-card': { title: 'Glass Card', description: 'Beautiful glassmorphism effect' },
    'neon-input': { type: 'text', placeholder: 'Enter neon text...' },
    'animated-badge': { children: 'Animated', variant: 'animated' },
    'floating-label': { type: 'text', label: 'Floating Label' },
    'pulse-avatar': { fallback: 'AB' },
    'morphing-button': { children: 'Morph Me' },
    'holographic-card': { title: 'Holographic', description: 'Futuristic design' }
  };
  return defaults[type] || {};
}

function getDefaultStyle(type: string): Record<string, any> {
  return {
    backgroundColor: 'transparent',
    borderColor: '#e5e7eb',
    borderWidth: 0,
    borderRadius: 6,
    color: '#374151',
    fontSize: 14,
    fontWeight: 400,
    padding: 8,
    margin: 0,
    opacity: 1,
    boxShadow: 'none'
  };
}

function getDefaultWidth(type: string): number {
  const widths: Record<string, number> = {
    'button': 120,
    'input': 200,
    'textarea': 300,
    'select': 150,
    'checkbox': 150,
    'radio': 150,
    'label': 100,
    'heading': 200,
    'text': 200,
    'image': 200,
    'link': 100,
    'div': 300,
    'card': 350,
    'badge': 80,
    'avatar': 50,
    'separator': 200,
    'gradient-button': 150,
    'glass-card': 300,
    'neon-input': 250,
    'animated-badge': 100,
    'floating-label': 200,
    'pulse-avatar': 60,
    'morphing-button': 140,
    'holographic-card': 280
  };
  return widths[type] || 200;
}

function getDefaultHeight(type: string): number {
  const heights: Record<string, number> = {
    'button': 40,
    'input': 40,
    'textarea': 80,
    'select': 40,
    'checkbox': 24,
    'radio': 24,
    'label': 24,
    'heading': 40,
    'text': 24,
    'image': 150,
    'link': 24,
    'div': 200,
    'card': 200,
    'badge': 24,
    'avatar': 50,
    'separator': 2,
    'gradient-button': 45,
    'glass-card': 150,
    'neon-input': 45,
    'animated-badge': 30,
    'floating-label': 60,
    'pulse-avatar': 60,
    'morphing-button': 45,
    'holographic-card': 120
  };
  return heights[type] || 40;
}
