'use client';

import { Badge } from '@/components/ui/badge';
import { CanvasElement } from './ui-builder-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Palette, RotateCcw } from 'lucide-react';

export interface PropertyPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (updates: Partial<CanvasElement>) => void;
}

export function PropertyPanel({ selectedElement, onElementUpdate }: PropertyPanelProps) {
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎨</span>
        </div>
        <h3 className="font-medium mb-2">No Element Selected</h3>
        <p className="text-sm">Select an element to edit its properties</p>
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

  const resetStyles = () => {
    onElementUpdate({
      style: {
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
                placeholder="Button text"
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
            <div>
              <Label className="text-xs">Size</Label>
              <Select
                value={selectedElement.properties.size || 'default'}
                onValueChange={(value) => updateProperty('size', value)}
              >
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
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
                placeholder="Placeholder text"
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
                  <SelectItem value="tel">Phone</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Default Value</Label>
              <Input
                value={selectedElement.properties.value || ''}
                onChange={(e) => updateProperty('value', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="Default value"
              />
            </div>
          </>
        );

      case 'textarea':
        return (
          <>
            <div>
              <Label className="text-xs">Placeholder</Label>
              <Input
                value={selectedElement.properties.placeholder || ''}
                onChange={(e) => updateProperty('placeholder', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="Placeholder text"
              />
            </div>
            <div>
              <Label className="text-xs">Rows</Label>
              <Input
                type="number"
                value={selectedElement.properties.rows || 3}
                onChange={(e) => updateProperty('rows', parseInt(e.target.value) || 3)}
                className="h-8 text-xs mt-1"
                min="1"
                max="20"
              />
            </div>
            <div>
              <Label className="text-xs">Default Value</Label>
              <Textarea
                value={selectedElement.properties.value || ''}
                onChange={(e) => updateProperty('value', e.target.value)}
                className="text-xs mt-1"
                rows={2}
                placeholder="Default content"
              />
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
                placeholder="Heading text"
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
                  <SelectItem value="h1">H1 - Main Title</SelectItem>
                  <SelectItem value="h2">H2 - Section Title</SelectItem>
                  <SelectItem value="h3">H3 - Subsection</SelectItem>
                  <SelectItem value="h4">H4 - Minor Heading</SelectItem>
                  <SelectItem value="h5">H5 - Small Heading</SelectItem>
                  <SelectItem value="h6">H6 - Tiny Heading</SelectItem>
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
              placeholder="Text content"
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
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label className="text-xs">Alt Text</Label>
              <Input
                value={selectedElement.properties.alt || ''}
                onChange={(e) => updateProperty('alt', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="Image description"
              />
            </div>
          </>
        );

      case 'link':
        return (
          <>
            <div>
              <Label className="text-xs">Text</Label>
              <Input
                value={selectedElement.properties.children || ''}
                onChange={(e) => updateProperty('children', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="Link text"
              />
            </div>
            <div>
              <Label className="text-xs">URL</Label>
              <Input
                value={selectedElement.properties.href || ''}
                onChange={(e) => updateProperty('href', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="https://example.com"
              />
            </div>
          </>
        );

      case 'card':
        return (
          <>
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={selectedElement.properties.title || ''}
                onChange={(e) => updateProperty('title', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="Card title"
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={selectedElement.properties.description || ''}
                onChange={(e) => updateProperty('description', e.target.value)}
                className="text-xs mt-1"
                rows={2}
                placeholder="Card description"
              />
            </div>
            <div>
              <Label className="text-xs">Content</Label>
              <Textarea
                value={selectedElement.properties.content || ''}
                onChange={(e) => updateProperty('content', e.target.value)}
                className="text-xs mt-1"
                rows={3}
                placeholder="Card content"
              />
            </div>
          </>
        );

      case 'badge':
        return (
          <>
            <div>
              <Label className="text-xs">Text</Label>
              <Input
                value={selectedElement.properties.children || ''}
                onChange={(e) => updateProperty('children', e.target.value)}
                className="h-8 text-xs mt-1"
                placeholder="Badge text"
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
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'avatar':
        return (
          <div>
            <Label className="text-xs">Fallback Text</Label>
            <Input
              value={selectedElement.properties.fallback || ''}
              onChange={(e) => updateProperty('fallback', e.target.value)}
              className="h-8 text-xs mt-1"
              placeholder="AB"
              maxLength={2}
            />
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">No specific properties for {selectedElement.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Element Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Element Info
            <Badge variant="outline" className="text-xs">
              {selectedElement.type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Label</Label>
            <Input
              value={selectedElement.label}
              onChange={(e) => onElementUpdate({ label: e.target.value })}
              className="h-8 text-xs mt-1"
              placeholder="Element label"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Visible</Label>
            <Switch
              checked={selectedElement.visible !== false}
              onCheckedChange={(checked) => onElementUpdate({ visible: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Locked</Label>
            <Switch
              checked={selectedElement.locked || false}
              onCheckedChange={(checked) => onElementUpdate({ locked: checked })}
            />
          </div>
        </CardContent>
      </Card>

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
              <Label className="text-xs">X Position</Label>
              <Input
                type="number"
                value={selectedElement.x}
                onChange={(e) => onElementUpdate({ x: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Y Position</Label>
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
                min="10"
              />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={selectedElement.height}
                onChange={(e) => onElementUpdate({ height: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs mt-1"
                min="10"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Rotation: {selectedElement.rotation || 0}°</Label>
            <Slider
              value={[selectedElement.rotation || 0]}
              onValueChange={([value]) => onElementUpdate({ rotation: value })}
              max={360}
              min={0}
              step={1}
              className="mt-2"
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

      {/* Styling */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Styling
            <Button
              size="sm"
              variant="ghost"
              onClick={resetStyles}
              className="h-6 w-6 p-0"
              title="Reset Styles"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedElement.style.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="h-8 w-16"
              />
              <Input
                value={selectedElement.style.backgroundColor || 'transparent'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="h-8 text-xs flex-1"
                placeholder="transparent"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedElement.style.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="h-8 w-16"
              />
              <Input
                value={selectedElement.style.color || '#374151'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="h-8 text-xs flex-1"
                placeholder="#374151"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Font Size</Label>
            <Input
              type="number"
              value={selectedElement.style.fontSize || 14}
              onChange={(e) => updateStyle('fontSize', parseInt(e.target.value) || 14)}
              className="h-8 text-xs mt-1"
              min="8"
              max="72"
            />
          </div>
          <div>
            <Label className="text-xs">Font Weight</Label>
            <Select
              value={String(selectedElement.style.fontWeight || 400)}
              onValueChange={(value) => updateStyle('fontWeight', parseInt(value))}
            >
              <SelectTrigger className="h-8 text-xs mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">Thin (100)</SelectItem>
                <SelectItem value="200">Extra Light (200)</SelectItem>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Normal (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semi Bold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
                <SelectItem value="800">Extra Bold (800)</SelectItem>
                <SelectItem value="900">Black (900)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Border Radius</Label>
            <Input
              type="number"
              value={selectedElement.style.borderRadius || 0}
              onChange={(e) => updateStyle('borderRadius', parseInt(e.target.value) || 0)}
              className="h-8 text-xs mt-1"
              min="0"
              max="50"
            />
          </div>
          <div>
            <Label className="text-xs">Border Width</Label>
            <Input
              type="number"
              value={selectedElement.style.borderWidth || 0}
              onChange={(e) => updateStyle('borderWidth', parseInt(e.target.value) || 0)}
              className="h-8 text-xs mt-1"
              min="0"
              max="10"
            />
          </div>
          {selectedElement.style.borderWidth > 0 && (
            <div>
              <Label className="text-xs">Border Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedElement.style.borderColor || '#e5e7eb'}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="h-8 w-16"
                />
                <Input
                  value={selectedElement.style.borderColor || '#e5e7eb'}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="h-8 text-xs flex-1"
                  placeholder="#e5e7eb"
                />
              </div>
            </div>
          )}
          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              type="number"
              value={selectedElement.style.padding || 8}
              onChange={(e) => updateStyle('padding', parseInt(e.target.value) || 0)}
              className="h-8 text-xs mt-1"
              min="0"
              max="50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Styling */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Advanced</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Box Shadow</Label>
            <Select
              value={selectedElement.style.boxShadow || 'none'}
              onValueChange={(value) => updateStyle('boxShadow', value)}
            >
              <SelectTrigger className="h-8 text-xs mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="0 1px 3px rgba(0,0,0,0.1)">Small</SelectItem>
                <SelectItem value="0 4px 6px rgba(0,0,0,0.1)">Medium</SelectItem>
                <SelectItem value="0 10px 15px rgba(0,0,0,0.1)">Large</SelectItem>
                <SelectItem value="0 20px 25px rgba(0,0,0,0.1)">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Z-Index (Layer Order)</Label>
            <Input
              type="number"
              value={selectedElement.order}
              onChange={(e) => onElementUpdate({ order: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs mt-1"
              min="0"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}