'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CanvasElement } from './ui-builder-panel';

interface PropertyPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (updates: Partial<CanvasElement>) => void;
}

export function PropertyPanel({ selectedElement, onElementUpdate }: PropertyPanelProps) {
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="font-medium">No Selection</h3>
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

  const updatePosition = (key: 'x' | 'y', value: number) => {
    onElementUpdate({ [key]: value });
  };

  const updateSize = (key: 'width' | 'height', value: number) => {
    onElementUpdate({ [key]: value });
  };

  const renderGeneralProperties = () => (
    <AccordionItem value="general">
      <AccordionTrigger className="text-sm">General</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Element Type</Label>
          <div className="text-sm font-mono bg-muted p-2 rounded">
            {selectedElement.type}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Label</Label>
          <Input
            value={selectedElement.label}
            onChange={(e) => onElementUpdate({ label: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderLayoutProperties = () => (
    <AccordionItem value="layout">
      <AccordionTrigger className="text-sm">Layout & Position</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">X Position</Label>
            <Input
              type="number"
              value={selectedElement.x}
              onChange={(e) => updatePosition('x', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Y Position</Label>
            <Input
              type="number"
              value={selectedElement.y}
              onChange={(e) => updatePosition('y', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              value={selectedElement.width}
              onChange={(e) => updateSize('width', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              value={selectedElement.height}
              onChange={(e) => updateSize('height', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderElementSpecificProperties = () => {
    const { type, properties } = selectedElement;

    switch (type) {
      case 'button':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Button Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Text</Label>
                <Input
                  value={properties.children || ''}
                  onChange={(e) => updateProperty('children', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Variant</Label>
                <Select
                  value={properties.variant || 'default'}
                  onValueChange={(value) => updateProperty('variant', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
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
              
              <div className="space-y-2">
                <Label className="text-xs">Size</Label>
                <Select
                  value={properties.size || 'default'}
                  onValueChange={(value) => updateProperty('size', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case 'input':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Input Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Type</Label>
                <Select
                  value={properties.type || 'text'}
                  onValueChange={(value) => updateProperty('type', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="password">Password</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={properties.placeholder || ''}
                  onChange={(e) => updateProperty('placeholder', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Default Value</Label>
                <Input
                  value={properties.value || ''}
                  onChange={(e) => updateProperty('value', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case 'textarea':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Textarea Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={properties.placeholder || ''}
                  onChange={(e) => updateProperty('placeholder', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Rows</Label>
                <Input
                  type="number"
                  value={properties.rows || 3}
                  onChange={(e) => updateProperty('rows', parseInt(e.target.value) || 3)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Default Value</Label>
                <Textarea
                  value={properties.value || ''}
                  onChange={(e) => updateProperty('value', e.target.value)}
                  className="text-xs"
                  rows={2}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case 'heading':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Heading Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Text</Label>
                <Input
                  value={properties.children || ''}
                  onChange={(e) => updateProperty('children', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Level</Label>
                <Select
                  value={properties.level || 'h2'}
                  onValueChange={(value) => updateProperty('level', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
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
            </AccordionContent>
          </AccordionItem>
        );

      case 'text':
      case 'label':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Text Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Content</Label>
                <Textarea
                  value={properties.children || ''}
                  onChange={(e) => updateProperty('children', e.target.value)}
                  className="text-xs"
                  rows={3}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case 'image':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Image Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Source URL</Label>
                <Input
                  value={properties.src || ''}
                  onChange={(e) => updateProperty('src', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Alt Text</Label>
                <Input
                  value={properties.alt || ''}
                  onChange={(e) => updateProperty('alt', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case 'link':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Link Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Text</Label>
                <Input
                  value={properties.children || ''}
                  onChange={(e) => updateProperty('children', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">URL</Label>
                <Input
                  value={properties.href || ''}
                  onChange={(e) => updateProperty('href', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="https://example.com"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case 'card':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Card Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Title</Label>
                <Input
                  value={properties.title || ''}
                  onChange={(e) => updateProperty('title', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={properties.description || ''}
                  onChange={(e) => updateProperty('description', e.target.value)}
                  className="text-xs"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Content</Label>
                <Textarea
                  value={properties.content || ''}
                  onChange={(e) => updateProperty('content', e.target.value)}
                  className="text-xs"
                  rows={3}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      case 'badge':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Badge Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Text</Label>
                <Input
                  value={properties.children || ''}
                  onChange={(e) => updateProperty('children', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Variant</Label>
                <Select
                  value={properties.variant || 'default'}
                  onValueChange={(value) => updateProperty('variant', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
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
            </AccordionContent>
          </AccordionItem>
        );

      case 'avatar':
        return (
          <AccordionItem value="element">
            <AccordionTrigger className="text-sm">Avatar Properties</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Fallback Text</Label>
                <Input
                  value={properties.fallback || ''}
                  onChange={(e) => updateProperty('fallback', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="AB"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Accordion type="multiple" defaultValue={["general", "layout", "element"]}>
        {renderGeneralProperties()}
        {renderLayoutProperties()}
        {renderElementSpecificProperties()}
      </Accordion>
    </div>
  );
}
