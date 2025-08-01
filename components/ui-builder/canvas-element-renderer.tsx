'use client';

import { CanvasElement } from './ui-builder-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  isPreviewMode: boolean;
}

export function CanvasElementRenderer({ 
  element, 
  isSelected, 
  isPreviewMode 
}: CanvasElementRendererProps) {
  const baseStyle = {
    ...element.style,
    width: '100%',
    height: '100%',
    fontSize: element.style.fontSize || 14,
    fontWeight: element.style.fontWeight || 400,
    color: element.style.color || '#374151',
    backgroundColor: element.style.backgroundColor || 'transparent',
    borderRadius: element.style.borderRadius || 6,
    padding: element.style.padding || 8,
    margin: 0,
    border: element.style.borderWidth ? 
      `${element.style.borderWidth}px solid ${element.style.borderColor || '#e5e7eb'}` : 
      'none',
    boxShadow: element.style.boxShadow || 'none'
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    border: isSelected && !isPreviewMode ? '2px solid #3b82f6' : 'transparent',
    borderRadius: 4
  };

  const renderElement = () => {
    switch (element.type) {
      case 'button':
        return (
          <Button
            variant={element.properties.variant || 'default'}
            size={element.properties.size || 'default'}
            style={baseStyle}
            disabled={!isPreviewMode}
          >
            {element.properties.children || 'Button'}
          </Button>
        );

      case 'input':
        return (
          <Input
            type={element.properties.type || 'text'}
            placeholder={element.properties.placeholder || 'Enter text...'}
            style={baseStyle}
            disabled={!isPreviewMode}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={element.properties.placeholder || 'Enter text...'}
            rows={element.properties.rows || 3}
            style={baseStyle}
            disabled={!isPreviewMode}
          />
        );

      case 'select':
        return (
          <select
            style={baseStyle}
            disabled={!isPreviewMode}
          >
            {(element.properties.options || ['Option 1', 'Option 2']).map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div style={{ ...baseStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              disabled={!isPreviewMode}
              style={{ margin: 0 }}
            />
            <span>{element.properties.label || 'Checkbox'}</span>
          </div>
        );

      case 'radio':
        return (
          <div style={{ ...baseStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name={element.properties.name || 'radio-group'}
              value={element.properties.value || 'option'}
              disabled={!isPreviewMode}
              style={{ margin: 0 }}
            />
            <span>{element.properties.label || 'Radio'}</span>
          </div>
        );

      case 'label':
        return (
          <Label style={baseStyle}>
            {element.properties.children || 'Label'}
          </Label>
        );

      case 'heading':
        const HeadingTag = element.properties.level || 'h2';
        return (
          <HeadingTag style={baseStyle}>
            {element.properties.children || 'Heading'}
          </HeadingTag>
        );

      case 'text':
        return (
          <span style={baseStyle}>
            {element.properties.children || 'Text content'}
          </span>
        );

      case 'link':
        return (
          <a 
            href={isPreviewMode ? element.properties.href : '#'}
            style={{ ...baseStyle, textDecoration: 'underline' }}
            onClick={!isPreviewMode ? (e) => e.preventDefault() : undefined}
          >
            {element.properties.children || 'Link'}
          </a>
        );

      case 'image':
        return (
          <img
            src={element.properties.src || '/placeholder.svg'}
            alt={element.properties.alt || 'Image'}
            style={{ ...baseStyle, objectFit: 'cover' }}
          />
        );

      case 'div':
        return (
          <div style={{ ...baseStyle, border: '1px dashed #ccc', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', color: '#999' }}>Container</span>
          </div>
        );

      case 'card':
        return (
          <Card style={baseStyle} className="p-4">
            <h3 className="font-medium mb-2">
              {element.properties.title || 'Card Title'}
            </h3>
            <p className="text-sm text-gray-600">
              {element.properties.description || 'Card description'}
            </p>
          </Card>
        );

      case 'badge':
        return (
          <Badge
            variant={element.properties.variant || 'default'}
            style={baseStyle}
          >
            {element.properties.children || 'Badge'}
          </Badge>
        );

      case 'avatar':
        return (
          <Avatar style={baseStyle}>
            <AvatarFallback>
              {element.properties.fallback || 'AB'}
            </AvatarFallback>
          </Avatar>
        );

      case 'separator':
        return (
          <Separator
            orientation={element.properties.orientation || 'horizontal'}
            style={baseStyle}
          />
        );

      // MrrKit Premium Components
      case 'gradient-button':
        return (
          <button
            style={{
              ...baseStyle,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              fontWeight: '600',
              transform: isPreviewMode ? 'none' : 'scale(1)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            }}
            className="hover:scale-105 hover:shadow-xl transition-all duration-300"
            disabled={!isPreviewMode}
          >
            {element.properties.children || 'Gradient Button'}
          </button>
        );

      case 'glass-card':
        return (
          <div
            style={{
              ...baseStyle,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <h3 className="font-semibold text-gray-800 mb-2">
              {element.properties.title || 'Glass Card'}
            </h3>
            <p className="text-sm text-gray-600">
              {element.properties.description || 'Beautiful glassmorphism effect'}
            </p>
          </div>
        );

      case 'neon-input':
        return (
          <input
            type={element.properties.type || 'text'}
            placeholder={element.properties.placeholder || 'Neon input...'}
            style={{
              ...baseStyle,
              background: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid #00ff88',
              borderRadius: '8px',
              color: '#00ff88',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1)',
              outline: 'none',
            }}
            disabled={!isPreviewMode}
          />
        );

      case 'animated-badge':
        return (
          <span
            style={{
              ...baseStyle,
              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
              color: 'white',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block',
              animation: isPreviewMode ? 'none' : 'pulse 2s infinite',
            }}
          >
            {element.properties.children || 'Animated'}
          </span>
        );

      case 'floating-label':
        return (
          <div style={{ ...baseStyle, position: 'relative' }}>
            <input
              type={element.properties.type || 'text'}
              style={{
                width: '100%',
                padding: '12px 16px 8px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                background: 'transparent',
              }}
              disabled={!isPreviewMode}
            />
            <label
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                color: '#6b7280',
                pointerEvents: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {element.properties.label || 'Floating Label'}
            </label>
          </div>
        );

      case 'pulse-avatar':
        return (
          <div
            style={{
              ...baseStyle,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                position: 'relative',
                animation: isPreviewMode ? 'none' : 'pulse 2s infinite',
              }}
            >
              {element.properties.fallback || 'AB'}
              <div
                style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  opacity: 0.3,
                  animation: isPreviewMode ? 'none' : 'ping 2s infinite',
                }}
              />
            </div>
          </div>
        );

      case 'morphing-button':
        return (
          <button
            style={{
              ...baseStyle,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              border: 'none',
              color: 'white',
              borderRadius: '25px',
              fontWeight: '600',
              transition: 'all 0.5s ease',
              transform: 'perspective(1000px) rotateX(0deg)',
            }}
            className="hover:scale-110 hover:rotate-3 transition-all duration-500"
            disabled={!isPreviewMode}
          >
            {element.properties.children || 'Morph Me'}
          </button>
        );

      case 'holographic-card':
        return (
          <div
            style={{
              ...baseStyle,
              background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
              backgroundSize: '400% 400%',
              borderRadius: '16px',
              padding: '20px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              animation: isPreviewMode ? 'none' : 'gradient 4s ease infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                transform: 'translateX(-100%)',
                animation: isPreviewMode ? 'none' : 'shimmer 2s infinite',
              }}
            />
            <h3 className="font-bold mb-2">
              {element.properties.title || 'Holographic'}
            </h3>
            <p className="text-sm opacity-90">
              {element.properties.description || 'Futuristic holographic effect'}
            </p>
          </div>
        );

      default:
        return (
          <div style={{ ...baseStyle, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', color: '#999' }}>Unknown Element: {element.type}</span>
          </div>
        );
    }
  };

  return (
    <div style={containerStyle}>
      {renderElement()}
    </div>
  );
}
