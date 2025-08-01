'use client';

import { useRef, useState, useCallback } from 'react';
import { CanvasElement } from './ui-builder-panel';
import { CanvasRenderer } from './canvas-renderer';

export interface DesignCanvasProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  isPreviewMode: boolean;
  onDrop: (elementType: string, x: number, y: number) => void;
  onElementSelect: (element: CanvasElement) => void;
  onElementUpdate: (elementId: string, updates: Partial<CanvasElement>) => void;
  onElementDelete?: (elementId?: string) => void;
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX;
    const y = e.clientY;
    
    // Check if we're still inside the canvas area
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
      setDragPosition(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragPosition(null);

    const componentType = e.dataTransfer.getData('component-type');
    console.log('Dropped component:', componentType); // Debug log
    
    if (!componentType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - 60); // Offset to center component
    const y = Math.max(0, e.clientY - rect.top - 20);

    onDrop(componentType, x, y);
  }, [onDrop]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current && !isPreviewMode) {
      // Clear selection when clicking empty canvas
      console.log('Canvas clicked, clearing selection');
      onElementSelect(null as any);
    }
  }, [isPreviewMode, onElementSelect]);

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-auto">
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className={`min-h-full w-full relative transition-all duration-200 ${
          isDragOver ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-400' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
        style={{ minHeight: '800px' }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Canvas Content */}
        <div className="relative min-h-full">
          <CanvasRenderer
            elements={elements}
            selectedElement={selectedElement}
            isPreviewMode={isPreviewMode}
            onElementSelect={onElementSelect}
            onElementUpdate={onElementUpdate}
            onElementDelete={onElementDelete}
          />
        </div>

        {/* Drop Indicator */}
        {isDragOver && dragPosition && (
          <div
            className="absolute pointer-events-none z-50 transition-all duration-200"
            style={{
              left: dragPosition.x - 12,
              top: dragPosition.y - 12,
            }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {elements.length === 0 && !isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 border-2 border-dashed border-indigo-300 rounded-xl flex items-center justify-center">
                <span className="text-3xl text-indigo-400">✨</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Start Building</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Drag components from the palette to create your interface
            </p>
          </div>
        </div>
      )}
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
