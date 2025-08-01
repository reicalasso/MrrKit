'use client';

import { CanvasElement } from './ui-builder-panel';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';

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
    onElementUpdate(element.id, { visible: !element.visible });
  };

  const toggleLock = (element: CanvasElement) => {
    onElementUpdate(element.id, { locked: !element.locked });
  };

  // Dummy implementation for handleNameCancel to fix the error
  const handleNameCancel = () => {
    // Implement cancel logic if needed
  };

  if (elements.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No elements added yet</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="space-y-1">
        {sortedElements.map((element) => (
          <div
            key={element.id}
            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
              selectedElements.includes(element.id)
                ? 'bg-blue-50 border-blue-200'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onElementSelect([element.id])}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {element.label}
              </div>
              <div className="text-xs text-gray-500">
                {element.width} × {element.height}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(element);
                }}
                className="h-6 w-6 p-0"
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
                  onElementDelete(element.id);
                }}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
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
