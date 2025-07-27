'use client';

import { useState, useRef, DragEvent, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Trash2, Move } from 'lucide-react';
import { CanvasElement } from './ui-builder-panel';

interface DesignCanvasProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  isPreviewMode: boolean;
  onDrop: (elementType: string, x: number, y: number) => void;
  onElementSelect: (element: CanvasElement) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onElementDelete: (elementId: string) => void;
}

export function DesignCanvas({
  elements,
  selectedElement,
  isPreviewMode,
  onDrop,
  onElementSelect,
  onElementUpdate,
  onElementDelete
}: DesignCanvasProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX >= rect.right ||
      e.clientY < rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const componentType = e.dataTransfer.getData('application/component-type');
    if (!componentType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onDrop(componentType, x, y);
  };

  const handleElementMouseDown = (e: MouseEvent<HTMLDivElement>, element: CanvasElement) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    onElementSelect(element);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      onElementUpdate(element.id, {
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement?.id === element.id;
    
    let Component;
    switch (element.type) {
      case 'button':
        Component = (
          <Button 
            variant={element.properties.variant || 'default'}
            size={element.properties.size || 'default'}
          >
            {element.properties.children || 'Button'}
          </Button>
        );
        break;
      case 'input':
        Component = (
          <Input
            type={element.properties.type || 'text'}
            placeholder={element.properties.placeholder || ''}
            value={element.properties.value || ''}
            readOnly={isPreviewMode}
          />
        );
        break;
      case 'textarea':
        Component = (
          <Textarea
            placeholder={element.properties.placeholder || ''}
            rows={element.properties.rows || 3}
            value={element.properties.value || ''}
            readOnly={isPreviewMode}
          />
        );
        break;
      case 'label':
        Component = (
          <Label>{element.properties.children || 'Label'}</Label>
        );
        break;
      case 'heading':
        const HeadingTag = element.properties.level || 'h2';
        Component = (
          <HeadingTag className="font-semibold">
            {element.properties.children || 'Heading'}
          </HeadingTag>
        );
        break;
      case 'text':
        Component = (
          <p>{element.properties.children || 'Text content'}</p>
        );
        break;
      case 'image':
        Component = (
          <img
            src={element.properties.src || '/placeholder.svg'}
            alt={element.properties.alt || 'Image'}
            className="max-w-full h-auto"
          />
        );
        break;
      case 'link':
        Component = (
          <a 
            href={element.properties.href || '#'}
            className="text-primary hover:underline"
            onClick={(e) => isPreviewMode ? undefined : e.preventDefault()}
          >
            {element.properties.children || 'Link'}
          </a>
        );
        break;
      case 'div':
        Component = (
          <div className={element.properties.className || 'p-4 border rounded'}>
            {element.properties.children || 'Container'}
          </div>
        );
        break;
      case 'card':
        Component = (
          <Card>
            <CardHeader>
              <CardTitle>{element.properties.title || 'Card Title'}</CardTitle>
              <CardDescription>
                {element.properties.description || 'Card description'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {element.properties.content || 'Card content goes here.'}
            </CardContent>
          </Card>
        );
        break;
      case 'badge':
        Component = (
          <Badge variant={element.properties.variant || 'default'}>
            {element.properties.children || 'Badge'}
          </Badge>
        );
        break;
      case 'avatar':
        Component = (
          <Avatar>
            <AvatarFallback>
              {element.properties.fallback || 'AB'}
            </AvatarFallback>
          </Avatar>
        );
        break;
      case 'separator':
        Component = (
          <Separator orientation={element.properties.orientation || 'horizontal'} />
        );
        break;
      default:
        Component = <div>Unknown component</div>;
    }

    return (
      <div
        key={element.id}
        className={`absolute cursor-pointer transition-all duration-200 ${
          isSelected && !isPreviewMode 
            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
            : ''
        } ${!isPreviewMode ? 'hover:ring-1 hover:ring-muted-foreground' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          minHeight: element.height
        }}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
      >
        {!isPreviewMode && isSelected && (
          <div className="absolute -top-8 -right-8 flex gap-1 z-10">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onElementDelete(element.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {!isPreviewMode && isSelected && (
          <div className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
            {element.label}
          </div>
        )}
        
        <div className="w-full h-full">
          {Component}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full relative overflow-hidden transition-all duration-200 ${
        isDragOver ? 'bg-accent/20 border-2 border-dashed border-primary' : ''
      } ${isPreviewMode ? 'bg-background' : 'bg-muted/20'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isPreviewMode && onElementSelect(null as any)}
    >
      {/* Grid background for design mode */}
      {!isPreviewMode && (
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* Drop zone hint */}
      {elements.length === 0 && !isPreviewMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-medium">Start Building</h3>
            <p className="text-sm">Drag components from the palette to begin</p>
          </div>
        </div>
      )}

      {/* Render all elements */}
      {elements.map(renderElement)}

      {/* Preview mode indicator */}
      {isPreviewMode && elements.length > 0 && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          Preview Mode
        </div>
      )}
    </div>
  );
}
