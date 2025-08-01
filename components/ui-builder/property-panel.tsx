'use client';

import { CanvasElement } from './ui-builder-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface PropertyPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (updates: Partial<CanvasElement>) => void;
}

export function PropertyPanel({ selectedElement, onElementUpdate }: PropertyPanelProps) {
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Select an element to edit its properties</p>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onElementUpdate({
      properties: {
        ...selectedElement.properties,
        [key]: value
      }
    });
  };

  const updateStyle = (key: string, value: any) => {
    onElementUpdate({
      style: {
        ...selectedElement.style,
        [key]: value
      }
    });
  };

  const renderPropertyInputs = () => {
    switch (selectedElement.type) {
      case 'button':
        return (
          <>
            <div>
              <Label className="text-xs">Text</Label>
              <Input
                value={selectedElement.properties.children || ''}
                onChange={(e) => updateProperty('children', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Variant</Label>
              <Select
                value={selectedElement.properties.variant || 'default'}
                onValueChange={(value) => updateProperty('variant', value)}
              >
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'input':
        return (
          <>
            <div>
              <Label className="text-xs">Placeholder</Label>
              <Input
                value={selectedElement.properties.placeholder || ''}
                onChange={(e) => updateProperty('placeholder', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select
                value={selectedElement.properties.type || 'text'}
                onValueChange={(value) => updateProperty('type', value)}
              >
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'heading':
        return (
          <>
            <div>
              <Label className="text-xs">Text</Label>
              <Input
                value={selectedElement.properties.children || ''}
                onChange={(e) => updateProperty('children', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Level</Label>
              <Select
                value={selectedElement.properties.level || 'h2'}
                onValueChange={(value) => updateProperty('level', value)}
              >
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'text':
      case 'label':
        return (
          <div>
            <Label className="text-xs">Text</Label>
            <Textarea
              value={selectedElement.properties.children || ''}
              onChange={(e) => updateProperty('children', e.target.value)}
              className="text-xs mt-1"
              rows={3}
            />
          </div>
        );

      case 'image':
        return (
          <>
            <div>
              <Label className="text-xs">Source URL</Label>
              <Input
                value={selectedElement.properties.src || ''}
                onChange={(e) => updateProperty('src', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-xs">Alt Text</Label>
              <Input
                value={selectedElement.properties.alt || ''}
                onChange={(e) => updateProperty('alt', e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Basic Properties */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderPropertyInputs()}
        </CardContent>
      </Card>

      {/* Position & Size */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Position & Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                value={selectedElement.x}
                onChange={(e) => onElementUpdate({ x: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                value={selectedElement.y}
                onChange={(e) => onElementUpdate({ y: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={selectedElement.width}
                onChange={(e) => onElementUpdate({ width: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={selectedElement.height}
                onChange={(e) => onElementUpdate({ height: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Styling */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Background Color</Label>
            <Input
              type="color"
              value={selectedElement.style.backgroundColor || '#ffffff'}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="h-8 mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Text Color</Label>
            <Input
              type="color"
              value={selectedElement.style.color || '#000000'}
              onChange={(e) => updateStyle('color', e.target.value)}
              className="h-8 mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Font Size</Label>
            <Input
              type="number"
              value={selectedElement.style.fontSize || 14}
              onChange={(e) => updateStyle('fontSize', parseInt(e.target.value) || 14)}
              className="h-8 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Border Radius</Label>
            <Input
              type="number"
              value={selectedElement.style.borderRadius || 0}
              onChange={(e) => updateStyle('borderRadius', parseInt(e.target.value) || 0)}
              className="h-8 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%</Label>
            <Slider
              value={[(selectedElement.opacity || 1) * 100]}
              onValueChange={([value]) => onElementUpdate({ opacity: value / 100 })}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
