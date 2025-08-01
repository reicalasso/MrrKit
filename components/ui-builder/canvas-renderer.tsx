'use client';

import { useState, useCallback } from 'react';
import { CanvasElement } from './ui-builder-panel';
import { CanvasElementRenderer } from './canvas-element-renderer';
import { SelectionBox } from './selection-box';

interface CanvasRendererProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  isPreviewMode: boolean;
  onElementSelect: (element: CanvasElement) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onElementDelete?: (elementId?: string) => void;
}

export function CanvasRenderer({
  elements,
  selectedElement,
  isPreviewMode,
  onElementSelect,
  onElementUpdate,
  onElementDelete
}: CanvasRendererProps) {
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    element: CanvasElement | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    element: null,
    offset: { x: 0, y: 0 }
  });

  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: CanvasElement) => {
    if (isPreviewMode || element.locked) return;

    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setDragState({
      isDragging: true,
      element,
      offset
    });

    onElementSelect(element);

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      const canvas = document.querySelector('[data-canvas="true"]');
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - offset.x;
      const newY = e.clientY - canvasRect.top - offset.y;

      onElementUpdate(element.id, {
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        element: null,
        offset: { x: 0, y: 0 }
      });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isPreviewMode, onElementSelect, onElementUpdate]);

  // Sort elements by order for proper rendering
  const sortedElements = [...elements].sort((a, b) => a.order - b.order);

  return (
    <div data-canvas="true" className="relative w-full h-full min-h-[600px]">
      {sortedElements.map((element) => (
        <div
          key={element.id}
          className={`absolute ${isPreviewMode ? '' : 'cursor-move'} ${
            element.visible === false ? 'opacity-30' : ''
          }`}
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
            opacity: element.opacity || 1,
            zIndex: element.order
          }}
          onMouseDown={(e) => handleElementMouseDown(e, element)}
          onClick={(e) => {
            if (!isPreviewMode) {
              e.stopPropagation();
              onElementSelect(element);
            }
          }}
        >
          <CanvasElementRenderer
            element={element}
            isSelected={selectedElement?.id === element.id}
            isPreviewMode={isPreviewMode}
          />
          
          {/* Selection Box */}
          {selectedElement?.id === element.id && !isPreviewMode && (
            <SelectionBox
              element={element}
              onUpdate={(updates) => onElementUpdate(element.id, updates)}
              onDelete={() => onElementDelete?.(element.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
