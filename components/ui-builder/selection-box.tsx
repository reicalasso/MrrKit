'use client';

import { useState, useCallback } from 'react';
import { CanvasElement } from './ui-builder-panel';
import { X } from 'lucide-react';

interface SelectionBoxProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onDelete: () => void;
}

export function SelectionBox({ element, onUpdate, onDelete }: SelectionBoxProps) {
  const [isResizing, setIsResizing] = useState(false);

  const handleResize = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startLeft = element.x;
    const startTop = element.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      switch (direction) {
        case 'se': // Southeast
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'sw': // Southwest
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          newX = startLeft + (startWidth - newWidth);
          break;
        case 'ne': // Northeast
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startTop + (startHeight - newHeight);
          break;
        case 'nw': // Northwest
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newX = startLeft + (startWidth - newWidth);
          newY = startTop + (startHeight - newHeight);
          break;
        case 'n': // North
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startTop + (startHeight - newHeight);
          break;
        case 's': // South
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'e': // East
          newWidth = Math.max(20, startWidth + deltaX);
          break;
        case 'w': // West
          newWidth = Math.max(20, startWidth - deltaX);
          newX = startLeft + (startWidth - newWidth);
          break;
      }

      onUpdate({
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, onUpdate]);

  const resizeHandles = [
    { position: 'nw', cursor: 'nw-resize', style: { top: -4, left: -4 } },
    { position: 'n', cursor: 'n-resize', style: { top: -4, left: '50%', transform: 'translateX(-50%)' } },
    { position: 'ne', cursor: 'ne-resize', style: { top: -4, right: -4 } },
    { position: 'e', cursor: 'e-resize', style: { top: '50%', right: -4, transform: 'translateY(-50%)' } },
    { position: 'se', cursor: 'se-resize', style: { bottom: -4, right: -4 } },
    { position: 's', cursor: 's-resize', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)' } },
    { position: 'sw', cursor: 'sw-resize', style: { bottom: -4, left: -4 } },
    { position: 'w', cursor: 'w-resize', style: { top: '50%', left: -4, transform: 'translateY(-50%)' } }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Selection Border */}
      <div className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none" />
      
      {/* Resize Handles */}
      {resizeHandles.map((handle) => (
        <div
          key={handle.position}
          className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm pointer-events-auto hover:bg-blue-600"
          style={{
            ...handle.style,
            cursor: handle.cursor
          }}
          onMouseDown={(e) => handleResize(e, handle.position)}
        />
      ))}

      {/* Action Buttons */}
      <div className="absolute -top-8 left-0 flex gap-1 pointer-events-auto">
        <button
          onClick={onDelete}
          className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600"
          title="Delete"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
