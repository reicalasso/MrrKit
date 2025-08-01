'use client';

import { CanvasElement } from './ui-builder-panel';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LayerPanelProps {
  elements: CanvasElement[];
  selectedElements: string[];
  onElementSelect: (elementIds: string[], additive?: boolean) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onElementDelete: (elementId: string) => void;
}

export function LayerPanel({
  elements,
  selectedElements,
  onElementSelect,
  onElementUpdate,
  onElementDelete
}: LayerPanelProps) {
  // Sort elements by order (reverse for layer panel display)
  const sortedElements = [...elements].sort((a, b) => b.order - a.order);

  const toggleVisibility = (element: CanvasElement) => {
    onElementUpdate(element.id, { visible: element.visible !== false ? false : true });
  };

  const toggleLock = (element: CanvasElement) => {
    onElementUpdate(element.id, { locked: !element.locked });
  };

  const moveUp = (element: CanvasElement) => {
    const maxOrder = Math.max(...elements.map(el => el.order));
    if (element.order < maxOrder) {
      onElementUpdate(element.id, { order: element.order + 1 });
    }
  };

  const moveDown = (element: CanvasElement) => {
    const minOrder = Math.min(...elements.map(el => el.order));
    if (element.order > minOrder) {
      onElementUpdate(element.id, { order: element.order - 1 });
    }
  };

  const duplicateElement = (element: CanvasElement) => {
    const newElement = {
      ...element,
      id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: element.x + 20,
      y: element.y + 20,
      order: elements.length
    };
    // This would need to be handled by the parent component
    console.log('Duplicate element:', newElement);
  };

  if (elements.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">📄</span>
        </div>
        <p className="text-sm font-medium mb-1">No Elements</p>
        <p className="text-xs">Add components to see them here</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Layers</h3>
        <Badge variant="outline" className="text-xs">
          {elements.length}
        </Badge>
      </div>
      
      <div className="space-y-1">
        {sortedElements.map((element) => (
          <div
            key={element.id}
            className={`group flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
              selectedElements.includes(element.id)
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => onElementSelect([element.id])}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {element.label}
                </div>
                {element.locked && (
                  <Lock className="w-3 h-3 text-gray-400" />
                )}
                {element.visible === false && (
                  <EyeOff className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <div className="text-xs text-gray-500">
                {element.type} • {element.width} × {element.height}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  moveUp(element);
                }}
                className="h-6 w-6 p-0"
                title="Move Up"
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  moveDown(element);
                }}
                className="h-6 w-6 p-0"
                title="Move Down"
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(element);
                }}
                className="h-6 w-6 p-0"
                title={element.visible !== false ? "Hide" : "Show"}
              >
                {element.visible !== false ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(element);
                }}
                className="h-6 w-6 p-0"
                title={element.locked ? "Unlock" : "Lock"}
              >
                {element.locked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Unlock className="w-3 h-3" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateElement(element);
                }}
                className="h-6 w-6 p-0"
                title="Duplicate"
              >
                <Copy className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onElementDelete(element.id);
                }}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}