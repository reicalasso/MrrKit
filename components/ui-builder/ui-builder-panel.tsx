'use client';

import { useState, useCallback, DragEvent } from 'react';
import { Plus, Eye, Code, Save, Download, Trash2, Copy, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceStore } from '@/lib/stores/workspace-store';
import { ComponentPalette } from './component-palette';
import { DesignCanvas } from './design-canvas';
import { PropertyPanel } from './property-panel';
import { generateComponentCode } from '@/lib/services/ui-builder-service';

export interface UIElement {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
  children?: UIElement[];
  parentId?: string;
}

export interface CanvasElement extends UIElement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function UIBuilderPanel() {
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [componentName, setComponentName] = useState('MyComponent');
  
  const { addFile, currentProject } = useWorkspaceStore();

  const handleDrop = useCallback((elementType: string, x: number, y: number) => {
    const newElement: CanvasElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      label: getElementLabel(elementType),
      properties: getDefaultProperties(elementType),
      x,
      y,
      width: getDefaultWidth(elementType),
      height: getDefaultHeight(elementType),
    };

    setCanvasElements(prev => [...prev, newElement]);
  }, []);

  const handleElementSelect = useCallback((element: CanvasElement) => {
    setSelectedElement(element);
  }, []);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev => 
      prev.map(el => el.id === elementId ? { ...el, ...updates } : el)
    );
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedElement]);

  const handleElementDelete = useCallback((elementId: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

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
    setSelectedElement(null);
  }, []);

  return (
    <div className="flex h-full">
      {/* Component Palette */}
      <div className="w-64 border-r bg-background/50">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Components</h3>
          <p className="text-xs text-muted-foreground">Drag to canvas</p>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)]">
          <ComponentPalette />
        </ScrollArea>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b bg-background/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="component-name" className="text-xs">Name:</Label>
              <Input
                id="component-name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="h-8 w-32 text-xs"
                placeholder="Component name"
              />
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="outline" className="text-xs">
              {canvasElements.length} elements
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateCode}
              disabled={canvasElements.length === 0}
            >
              <Code className="h-4 w-4 mr-1" />
              Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCode}
              disabled={canvasElements.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCanvas}
              disabled={canvasElements.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-grid-pattern">
          <DesignCanvas
            elements={canvasElements}
            selectedElement={selectedElement}
            isPreviewMode={isPreviewMode}
            onDrop={handleDrop}
            onElementSelect={handleElementSelect}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
          />
        </div>
      </div>

      {/* Property Panel */}
      <div className="w-80 border-l bg-background/50">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Properties</h3>
          <p className="text-xs text-muted-foreground">
            {selectedElement ? `Edit ${selectedElement.label}` : 'Select an element'}
          </p>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)]">
          <PropertyPanel
            selectedElement={selectedElement}
            onElementUpdate={(updates) => 
              selectedElement && handleElementUpdate(selectedElement.id, updates)
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
    'separator': 'Separator'
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
    'separator': { orientation: 'horizontal' }
  };
  return defaults[type] || {};
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
    'separator': 200
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
    'separator': 2
  };
  return heights[type] || 40;
}
