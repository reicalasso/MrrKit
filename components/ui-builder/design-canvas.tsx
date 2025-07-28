'use client';

import { DragEvent, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Move } from 'lucide-react';
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
  const [draggedElement, setDraggedElement] = useState<string | null>(null);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('application/component-type');
    
    if (componentType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDrop(componentType, x, y);
    }
  }, [onDrop]);

  const handleElementDragStart = useCallback((e: DragEvent<HTMLDivElement>, elementId: string) => {
    e.stopPropagation();
    setDraggedElement(elementId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleElementDragEnd = useCallback(() => {
    setDraggedElement(null);
  }, []);

  const handleElementDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedElement) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      onElementUpdate(draggedElement, { x, y });
      setDraggedElement(null);
    }
  }, [draggedElement, onElementUpdate]);

  const renderElement = useCallback((element: CanvasElement) => {
    const isSelected = selectedElement?.id === element.id;
    const isDragging = draggedElement === element.id;
    
    let content = '';
    
    switch (element.type) {
      case 'button':
        content = element.properties.children || 'Button';
        break;
      case 'input':
        content = element.properties.placeholder || 'Input field';
        break;
      case 'textarea':
        content = element.properties.placeholder || 'Textarea';
        break;
      case 'label':
        content = element.properties.children || 'Label';
        break;
      case 'heading':
        content = element.properties.children || 'Heading';
        break;
      case 'text':
        content = element.properties.children || 'Text content';
        break;
      case 'image':
        content = '🖼️ Image';
        break;
      case 'link':
        content = element.properties.children || 'Link';
        break;
      case 'div':
        content = 'Container';
        break;
      case 'card':
        content = element.properties.title || 'Card';
        break;
      case 'badge':
        content = element.properties.children || 'Badge';
        break;
      case 'avatar':
        content = element.properties.fallback || 'AV';
        break;
      case 'separator':
        content = '—';
        break;
      default:
        content = element.label;
    }

    return (
      <div
        key={element.id}
        draggable={!isPreviewMode}
        onDragStart={(e) => handleElementDragStart(e, element.id)}
        onDragEnd={handleElementDragEnd}
        onClick={(e) => {
          e.stopPropagation();
          onElementSelect(element);
        }}
        className={`
          absolute border-2 transition-all duration-200 cursor-pointer select-none
          ${isSelected 
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
            : 'border-transparent hover:border-gray-300'
          }
          ${isDragging ? 'opacity-50' : ''}
          ${isPreviewMode ? '' : 'hover:shadow-md'}
        `}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          minHeight: element.height,
          zIndex: isSelected ? 10 : 1
        }}
      >
        {/* Element Content */}
        <div className={`
          w-full h-full p-2 rounded flex items-center justify-center text-sm
          ${getElementStyles(element.type)}
        `}>
          {content}
        </div>

        {/* Selection Controls */}
        {isSelected && !isPreviewMode && (
          <>
            {/* Resize Handle */}
            <div 
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
              onMouseDown={(e) => handleResizeStart(e, element)}
            />
            
            {/* Element Label */}
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded text-nowrap">
              {element.label}
            </div>
            
            {/* Action Buttons */}
            <div className="absolute -top-6 right-0 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white border"
                onClick={(e) => {
                  e.stopPropagation();
                  // Duplicate element
                  const newElement = {
                    ...element,
                    id: `${element.type}-${Date.now()}`,
                    x: element.x + 20,
                    y: element.y + 20
                  };
                  // This would need to be handled by parent
                  console.log('Duplicate element:', newElement);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white border text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onElementDelete(element.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }, [selectedElement, draggedElement, isPreviewMode, onElementSelect, onElementDelete]);

  const handleResizeStart = useCallback((e: React.MouseEvent, element: CanvasElement) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      onElementUpdate(element.id, {
        width: Math.max(50, startWidth + deltaX),
        height: Math.max(20, startHeight + deltaY)
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onElementUpdate]);

  return (
    <div 
      className="w-full h-full relative bg-white overflow-auto"
      onDragOver={handleDragOver}
      onDrop={isPreviewMode ? undefined : handleElementDrop}
      onClick={() => onElementSelect(null as any)}
    >
      {/* Grid Background */}
      {!isPreviewMode && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* Canvas Content */}
      <div className="relative w-full min-h-full">
        {elements.map(renderElement)}
        
        {/* Empty State */}
        {elements.length === 0 && !isPreviewMode && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Move className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Design Canvas</h3>
              <p className="text-sm max-w-sm">
                Drag components from the palette to start building your interface
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getElementStyles(type: string): string {
  const styles: Record<string, string> = {
    'button': 'bg-blue-500 text-white rounded hover:bg-blue-600',
    'input': 'bg-white border border-gray-300 rounded px-3 py-2',
    'textarea': 'bg-white border border-gray-300 rounded px-3 py-2 resize-none',
    'label': 'text-gray-700 font-medium',
    'heading': 'font-bold text-gray-900',
    'text': 'text-gray-700',
    'image': 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500',
    'link': 'text-blue-600 underline',
    'div': 'border-2 border-dashed border-gray-300 bg-gray-50',
    'card': 'bg-white border border-gray-200 rounded-lg shadow-sm',
    'badge': 'bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-xs',
    'avatar': 'bg-gray-300 text-white rounded-full flex items-center justify-center font-bold',
    'separator': 'border-t border-gray-300 w-full h-px flex items-center justify-center'
  };
  
  return styles[type] || 'bg-gray-100 border border-gray-300';
}
