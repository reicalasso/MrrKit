'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CanvasElement } from './ui-builder-panel';
import { Settings2, Palette, Layout, Type } from 'lucide-react';

interface PropertyPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (updates: Partial<CanvasElement>) => void;
}

export function PropertyPanel({ selectedElement, onElementUpdate }: PropertyPanelProps) {
  if (!selectedElement) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Settings2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <h3 className="font-medium mb-2">No Element Selected</h3>
        <p className="text-sm">Select an element from the canvas to edit its properties</p>
      </div>
    );
  }

  const handlePropertyChange = useCallback((property: string, value: any) => {
    onElementUpdate({
      properties: {
        ...selectedElement.properties,
        [property]: value
      }
    });
  }, [selectedElement, onElementUpdate]);

  const handlePositionChange = useCallback((property: 'x' | 'y' | 'width' | 'height', value: number) => {
    onElementUpdate({ [property]: value });
  }, [onElementUpdate]);

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties" className="text-xs">
            <Settings2 className="h-3 w-3 mr-1" />
            Props
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            <Layout className="h-3 w-3 mr-1" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            <Palette className="h-3 w-3 mr-1" />
            Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 p-4 space-y-4">
          <div>
            <Label className="text-xs font-medium text-gray-600">Element Type</Label>
            <div className="mt-1 text-sm font-medium">{selectedElement.label}</div>
          </div>
          
          <Separator />
          
          {renderElementProperties(selectedElement, handlePropertyChange)}
        </TabsContent>

        <TabsContent value="layout" className="flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pos-x" className="text-xs">X Position</Label>
              <Input
                id="pos-x"
                type="number"
                value={selectedElement.x}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pos-y" className="text-xs">Y Position</Label>
              <Input
                id="pos-y"
                type="number"
                value={selectedElement.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width" className="text-xs">Width</Label>
              <Input
                id="width"
                type="number"
                value={selectedElement.width}
                onChange={(e) => handlePositionChange('width', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">Height</Label>
              <Input
                id="height"
                type="number"
                value={selectedElement.height}
                onChange={(e) => handlePositionChange('height', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="style" className="flex-1 p-4 space-y-4">
          <div className="text-center text-gray-500 py-8">
            <Palette className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Style properties coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderElementProperties(element: CanvasElement, onChange: (property: string, value: any) => void) {
  const { type, properties } = element;

  const commonProps = (
    <div className="space-y-3">
      <div>
        <Label htmlFor="element-id" className="text-xs">Element ID</Label>
        <Input
          id="element-id"
          value={properties.id || ''}
          onChange={(e) => onChange('id', e.target.value)}
          placeholder="unique-id"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="css-class" className="text-xs">CSS Classes</Label>
        <Input
          id="css-class"
          value={properties.className || ''}
          onChange={(e) => onChange('className', e.target.value)}
          placeholder="class1 class2"
          className="mt-1"
        />
      </div>
    </div>
  );

  switch (type) {
    case 'button':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="button-text" className="text-xs">Button Text</Label>
            <Input
              id="button-text"
              value={properties.children || ''}
              onChange={(e) => onChange('children', e.target.value)}
              placeholder="Click me"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="button-variant" className="text-xs">Variant</Label>
            <Select value={properties.variant || 'default'} onValueChange={(value) => onChange('variant', value)}>
              <SelectTrigger className="mt-1">
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
            <Label htmlFor="button-size" className="text-xs">Size</Label>
            <Select value={properties.size || 'default'} onValueChange={(value) => onChange('size', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="icon">Icon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'input':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="input-type" className="text-xs">Input Type</Label>
            <Select value={properties.type || 'text'} onValueChange={(value) => onChange('type', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="tel">Telephone</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="search">Search</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="input-placeholder" className="text-xs">Placeholder</Label>
            <Input
              id="input-placeholder"
              value={properties.placeholder || ''}
              onChange={(e) => onChange('placeholder', e.target.value)}
              placeholder="Enter placeholder text"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="input-value" className="text-xs">Default Value</Label>
            <Input
              id="input-value"
              value={properties.value || ''}
              onChange={(e) => onChange('value', e.target.value)}
              placeholder="Default value"
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="input-required"
              checked={properties.required || false}
              onCheckedChange={(checked) => onChange('required', checked)}
            />
            <Label htmlFor="input-required" className="text-xs">Required</Label>
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="textarea-placeholder" className="text-xs">Placeholder</Label>
            <Input
              id="textarea-placeholder"
              value={properties.placeholder || ''}
              onChange={(e) => onChange('placeholder', e.target.value)}
              placeholder="Enter placeholder text"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="textarea-rows" className="text-xs">Rows</Label>
            <Input
              id="textarea-rows"
              type="number"
              value={properties.rows || 3}
              onChange={(e) => onChange('rows', parseInt(e.target.value) || 3)}
              min="1"
              max="20"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="textarea-value" className="text-xs">Default Value</Label>
            <Textarea
              id="textarea-value"
              value={properties.value || ''}
              onChange={(e) => onChange('value', e.target.value)}
              placeholder="Default content"
              className="mt-1"
            />
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'heading':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="heading-text" className="text-xs">Heading Text</Label>
            <Input
              id="heading-text"
              value={properties.children || ''}
              onChange={(e) => onChange('children', e.target.value)}
              placeholder="Your heading"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="heading-level" className="text-xs">Level</Label>
            <Select value={properties.level || 'h2'} onValueChange={(value) => onChange('level', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 - Largest</SelectItem>
                <SelectItem value="h2">H2 - Large</SelectItem>
                <SelectItem value="h3">H3 - Medium</SelectItem>
                <SelectItem value="h4">H4 - Small</SelectItem>
                <SelectItem value="h5">H5 - Smaller</SelectItem>
                <SelectItem value="h6">H6 - Smallest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="text-content" className="text-xs">Text Content</Label>
            <Textarea
              id="text-content"
              value={properties.children || ''}
              onChange={(e) => onChange('children', e.target.value)}
              placeholder="Your text content"
              className="mt-1"
              rows={3}
            />
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="image-src" className="text-xs">Image URL</Label>
            <Input
              id="image-src"
              value={properties.src || ''}
              onChange={(e) => onChange('src', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="image-alt" className="text-xs">Alt Text</Label>
            <Input
              id="image-alt"
              value={properties.alt || ''}
              onChange={(e) => onChange('alt', e.target.value)}
              placeholder="Description of image"
              className="mt-1"
            />
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'link':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="link-text" className="text-xs">Link Text</Label>
            <Input
              id="link-text"
              value={properties.children || ''}
              onChange={(e) => onChange('children', e.target.value)}
              placeholder="Click here"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="link-href" className="text-xs">URL</Label>
            <Input
              id="link-href"
              value={properties.href || ''}
              onChange={(e) => onChange('href', e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="link-external"
              checked={properties.target === '_blank'}
              onCheckedChange={(checked) => onChange('target', checked ? '_blank' : '_self')}
            />
            <Label htmlFor="link-external" className="text-xs">Open in new tab</Label>
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'card':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-title" className="text-xs">Card Title</Label>
            <Input
              id="card-title"
              value={properties.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Card title"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="card-description" className="text-xs">Description</Label>
            <Textarea
              id="card-description"
              value={properties.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Card description"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="card-content" className="text-xs">Content</Label>
            <Textarea
              id="card-content"
              value={properties.content || ''}
              onChange={(e) => onChange('content', e.target.value)}
              placeholder="Card content"
              className="mt-1"
              rows={3}
            />
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'badge':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="badge-text" className="text-xs">Badge Text</Label>
            <Input
              id="badge-text"
              value={properties.children || ''}
              onChange={(e) => onChange('children', e.target.value)}
              placeholder="Badge"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="badge-variant" className="text-xs">Variant</Label>
            <Select value={properties.variant || 'default'} onValueChange={(value) => onChange('variant', value)}>
              <SelectTrigger className="mt-1">
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
          <Separator />
          {commonProps}
        </div>
      );

    case 'avatar':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="avatar-fallback" className="text-xs">Fallback Text</Label>
            <Input
              id="avatar-fallback"
              value={properties.fallback || ''}
              onChange={(e) => onChange('fallback', e.target.value)}
              placeholder="AB"
              maxLength={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="avatar-src" className="text-xs">Image URL (optional)</Label>
            <Input
              id="avatar-src"
              value={properties.src || ''}
              onChange={(e) => onChange('src', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1"
            />
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    case 'separator':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="separator-orientation" className="text-xs">Orientation</Label>
            <Select value={properties.orientation || 'horizontal'} onValueChange={(value) => onChange('orientation', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          {commonProps}
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="element-content" className="text-xs">Content</Label>
            <Textarea
              id="element-content"
              value={properties.children || ''}
              onChange={(e) => onChange('children', e.target.value)}
              placeholder="Element content"
              className="mt-1"
              rows={3}
            />
          </div>
          <Separator />
          {commonProps}
        </div>
      );
  }
}
