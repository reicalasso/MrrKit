import { CanvasElement } from '@/components/ui-builder/ui-builder-panel';

export function generateComponentCode(componentName: string, elements: CanvasElement[]): string {
  const imports = generateImports(elements);
  const componentCode = generateComponentBody(componentName, elements);
  
  return `${imports}

${componentCode}`;
}

function generateImports(elements: CanvasElement[]): string {
  const usedTypes = new Set<string>();
  const hasState = elements.some(el => 
    el.type === 'input' || el.type === 'textarea' || el.type === 'checkbox' || el.type === 'radio'
  );
  
  elements.forEach(element => {
    switch (element.type) {
      case 'button':
      case 'gradient-button':
      case 'morphing-button':
        usedTypes.add('Button');
        break;
      case 'input':
      case 'neon-input':
      case 'floating-label':
        usedTypes.add('Input');
        break;
      case 'textarea':
        usedTypes.add('Textarea');
        break;
      case 'card':
      case 'glass-card':
      case 'holographic-card':
        usedTypes.add('Card');
        usedTypes.add('CardHeader');
        usedTypes.add('CardTitle');
        usedTypes.add('CardDescription');
        usedTypes.add('CardContent');
        break;
      case 'badge':
      case 'animated-badge':
        usedTypes.add('Badge');
        break;
      case 'avatar':
      case 'pulse-avatar':
        usedTypes.add('Avatar');
        usedTypes.add('AvatarFallback');
        break;
      case 'separator':
        usedTypes.add('Separator');
        break;
      case 'label':
        usedTypes.add('Label');
        break;
    }
  });

  const imports = [];
  
  if (hasState) {
    imports.push(`import React, { useState } from 'react';`);
  } else {
    imports.push(`import React from 'react';`);
  }
  
  if (usedTypes.has('Button')) {
    imports.push(`import { Button } from '@/components/ui/button';`);
  }
  if (usedTypes.has('Input')) {
    imports.push(`import { Input } from '@/components/ui/input';`);
  }
  if (usedTypes.has('Textarea')) {
    imports.push(`import { Textarea } from '@/components/ui/textarea';`);
  }
  if (usedTypes.has('Label')) {
    imports.push(`import { Label } from '@/components/ui/label';`);
  }
  if (usedTypes.has('Badge')) {
    imports.push(`import { Badge } from '@/components/ui/badge';`);
  }
  if (usedTypes.has('Separator')) {
    imports.push(`import { Separator } from '@/components/ui/separator';`);
  }
  if (usedTypes.has('Avatar') || usedTypes.has('AvatarFallback')) {
    imports.push(`import { Avatar, AvatarFallback } from '@/components/ui/avatar';`);
  }
  if (usedTypes.has('Card') || usedTypes.has('CardHeader') || usedTypes.has('CardTitle') || usedTypes.has('CardDescription') || usedTypes.has('CardContent')) {
    imports.push(`import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';`);
  }

  return imports.join('\n');
}

function generateComponentBody(componentName: string, elements: CanvasElement[]): string {
  const sortedElements = [...elements].sort((a, b) => a.order - b.order);
  const hasInteractiveElements = elements.some(el => 
    el.type === 'input' || el.type === 'textarea' || el.type === 'checkbox' || el.type === 'radio'
  );
  
  let stateDeclarations = '';
  if (hasInteractiveElements) {
    const inputElements = elements.filter(el => el.type === 'input' || el.type === 'textarea');
    const checkboxElements = elements.filter(el => el.type === 'checkbox');
    
    if (inputElements.length > 0) {
      stateDeclarations += `  const [formData, setFormData] = useState({
${inputElements.map(el => `    ${el.id.replace(/[^a-zA-Z0-9]/g, '')}: '${el.properties.value || ''}'`).join(',\n')}
  });\n\n`;
    }
    
    if (checkboxElements.length > 0) {
      stateDeclarations += `  const [checkboxes, setCheckboxes] = useState({
${checkboxElements.map(el => `    ${el.id.replace(/[^a-zA-Z0-9]/g, '')}: false`).join(',\n')}
  });\n\n`;
    }
  }
  
  const elementCode = sortedElements.map(element => {
    return generateElementCode(element, hasInteractiveElements);
  }).join('\n      ');

  return `export default function ${componentName}() {
${stateDeclarations}  return (
    <div className="relative w-full min-h-screen bg-gray-50 p-4">
      {/* Generated with MrrKit UI Builder */}
      ${elementCode}
    </div>
  );
}`;
}

function generateElementCode(element: CanvasElement, hasInteractiveElements: boolean): string {
  const style = {
    position: 'absolute' as const,
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    opacity: element.opacity !== 1 ? element.opacity : undefined,
    zIndex: element.order,
    ...element.style
  };

  // Remove undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(style).filter(([_, value]) => value !== undefined)
  );

  const styleString = Object.entries(cleanStyle)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? `'${value}'` : value}`)
    .join(', ');

  const fieldId = element.id.replace(/[^a-zA-Z0-9]/g, '');

  switch (element.type) {
    case 'button':
      return `<Button
        variant="${element.properties.variant || 'default'}"
        size="${element.properties.size || 'default'}"
        style={{ ${styleString} }}
        onClick={() => console.log('Button clicked')}
      >
        ${element.properties.children || 'Button'}
      </Button>`;

    case 'input':
      if (hasInteractiveElements) {
        return `<Input
        type="${element.properties.type || 'text'}"
        placeholder="${element.properties.placeholder || ''}"
        value={formData.${fieldId}}
        onChange={(e) => setFormData(prev => ({ ...prev, ${fieldId}: e.target.value }))}
        style={{ ${styleString} }}
      />`;
      } else {
        return `<Input
        type="${element.properties.type || 'text'}"
        placeholder="${element.properties.placeholder || ''}"
        defaultValue="${element.properties.value || ''}"
        style={{ ${styleString} }}
      />`;
      }

    case 'textarea':
      if (hasInteractiveElements) {
        return `<Textarea
        placeholder="${element.properties.placeholder || ''}"
        rows={${element.properties.rows || 3}}
        value={formData.${fieldId}}
        onChange={(e) => setFormData(prev => ({ ...prev, ${fieldId}: e.target.value }))}
        style={{ ${styleString} }}
      />`;
      } else {
        return `<Textarea
        placeholder="${element.properties.placeholder || ''}"
        rows={${element.properties.rows || 3}}
        defaultValue="${element.properties.value || ''}"
        style={{ ${styleString} }}
      />`;
      }

    case 'checkbox':
      if (hasInteractiveElements) {
        return `<div style={{ ${styleString}, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={checkboxes.${fieldId}}
          onChange={(e) => setCheckboxes(prev => ({ ...prev, ${fieldId}: e.target.checked }))}
        />
        <Label>{element.properties.label || 'Checkbox'}</Label>
      </div>`;
      } else {
        return `<div style={{ ${styleString}, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" />
        <Label>${element.properties.label || 'Checkbox'}</Label>
      </div>`;
      }

    case 'heading':
      const tag = element.properties.level || 'h2';
      return `<${tag} style={{ ${styleString} }}>
        ${element.properties.children || 'Heading'}
      </${tag}>`;

    case 'text':
      return `<span style={{ ${styleString} }}>
        ${element.properties.children || 'Text'}
      </span>`;

    case 'image':
      return `<img
        src="${element.properties.src || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'}"
        alt="${element.properties.alt || 'Image'}"
        style={{ ${styleString}, objectFit: 'cover' }}
      />`;

    case 'link':
      return `<a 
        href="${element.properties.href || '#'}"
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        style={{ ${styleString} }}
      >
        ${element.properties.children || 'Link'}
      </a>`;

    case 'div':
      return `<div 
        className="border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-center"
        style={{ ${styleString} }}
      >
        <span className="text-gray-500 text-sm">Container</span>
      </div>`;

    case 'card':
      return `<Card style={{ ${styleString} }}>
        <CardHeader>
          <CardTitle>${element.properties.title || 'Card Title'}</CardTitle>
          <CardDescription>
            ${element.properties.description || 'Card description'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          ${element.properties.content || 'Card content goes here.'}
        </CardContent>
      </Card>`;

    case 'badge':
      return `<Badge 
        variant="${element.properties.variant || 'default'}"
        style={{ ${styleString} }}
      >
        ${element.properties.children || 'Badge'}
      </Badge>`;

    case 'avatar':
      return `<Avatar style={{ ${styleString} }}>
        <AvatarFallback>
          ${element.properties.fallback || 'AB'}
        </AvatarFallback>
      </Avatar>`;

    case 'separator':
      return `<Separator 
        orientation="${element.properties.orientation || 'horizontal'}"
        style={{ ${styleString} }}
      />`;

    case 'label':
      return `<Label style={{ ${styleString} }}>
        ${element.properties.children || 'Label'}
      </Label>`;

    // Premium Components
    case 'gradient-button':
      return `<button
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        style={{ ${styleString} }}
        onClick={() => console.log('Gradient button clicked')}
      >
        ${element.properties.children || 'Gradient Button'}
      </button>`;

    case 'glass-card':
      return `<div
        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl"
        style={{ ${styleString} }}
      >
        <div className="p-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            ${element.properties.title || 'Glass Card'}
          </h3>
          <p className="text-sm text-gray-600">
            ${element.properties.description || 'Beautiful glassmorphism effect'}
          </p>
        </div>
      </div>`;

    case 'neon-input':
      return `<input
        type="${element.properties.type || 'text'}"
        placeholder="${element.properties.placeholder || 'Neon input...'}"
        className="bg-black/90 border-2 border-green-400 rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:shadow-lg focus:shadow-green-400/25"
        style={{ ${styleString} }}
      />`;

    case 'animated-badge':
      return `<span
        className="inline-block bg-gradient-to-r from-red-400 to-yellow-400 text-white font-semibold rounded-full px-3 py-1 text-sm animate-pulse"
        style={{ ${styleString} }}
      >
        ${element.properties.children || 'Animated'}
      </span>`;

    case 'floating-label':
      return `<div className="relative" style={{ ${styleString} }}>
        <input
          type="${element.properties.type || 'text'}"
          className="w-full px-4 pt-6 pb-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors peer"
          placeholder=" "
        />
        <label className="absolute left-4 top-2 text-xs text-blue-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500">
          ${element.properties.label || 'Floating Label'}
        </label>
      </div>`;

    case 'pulse-avatar':
      return `<div className="relative" style={{ ${styleString} }}>
        <Avatar className="animate-pulse">
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            ${element.properties.fallback || 'AB'}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 animate-ping"></div>
      </div>`;

    case 'morphing-button':
      return `<button
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full px-6 py-3 transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-xl"
        style={{ ${styleString} }}
        onClick={() => console.log('Morphing button clicked')}
      >
        ${element.properties.children || 'Morph Me'}
      </button>`;

    case 'holographic-card':
      return `<div
        className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ 
          ${styleString},
          background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
          backgroundSize: '400% 400%',
          animation: 'gradient 4s ease infinite'
        }}
      >
        <div className="relative z-10">
          <h3 className="font-bold mb-2">
            ${element.properties.title || 'Holographic'}
          </h3>
          <p className="text-sm opacity-90">
            ${element.properties.description || 'Futuristic holographic effect'}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full animate-shimmer"></div>
      </div>`;

    default:
      return `<div 
        className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
        style={{ ${styleString} }}
      >
        <span className="text-gray-500 text-sm">{element.type}</span>
      </div>`;
  }
}

export function generateResponsiveCode(componentName: string, elements: CanvasElement[]): string {
  // Sort elements by position for better responsive layout
  const sortedElements = [...elements].sort((a, b) => a.y - b.y || a.x - b.x);
  
  const imports = generateImports(elements);
  const responsiveJSX = generateResponsiveJSX(componentName, sortedElements);
  
  return `${imports}

${responsiveJSX}`;
}

function generateResponsiveJSX(componentName: string, elements: CanvasElement[]): string {
  // Group elements by approximate rows for responsive layout
  const rows = groupElementsByRows(elements);
  
  const jsxRows = rows.map(row => {
    const rowElements = row.map(el => generateResponsiveElementJSX(el)).join('\n        ');
    return `      <div className="flex flex-wrap gap-4 items-start">
        ${rowElements}
      </div>`;
  }).join('\n      ');
  
  return `export default function ${componentName}() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      ${jsxRows}
    </div>
  );
}`;
}

function groupElementsByRows(elements: CanvasElement[]): CanvasElement[][] {
  if (elements.length === 0) return [];
  
  const sorted = [...elements].sort((a, b) => a.y - b.y || a.x - b.x);
  const rows: CanvasElement[][] = [];
  let currentRow: CanvasElement[] = [];
  let currentRowY = sorted[0].y;
  const rowThreshold = 50; // pixels
  
  for (const element of sorted) {
    if (Math.abs(element.y - currentRowY) > rowThreshold) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [element];
      currentRowY = element.y;
    } else {
      currentRow.push(element);
    }
  }
  
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  
  return rows;
}

function generateResponsiveElementJSX(element: CanvasElement): string {
  switch (element.type) {
    case 'button':
      return `<Button 
        variant="${element.properties.variant || 'default'}"
        size="${element.properties.size || 'default'}"
        className="w-auto"
      >
        ${element.properties.children || 'Button'}
      </Button>`;
      
    case 'input':
      return `<Input
        type="${element.properties.type || 'text'}"
        placeholder="${element.properties.placeholder || ''}"
        defaultValue="${element.properties.value || ''}"
        className="flex-1 min-w-[200px]"
      />`;
      
    case 'textarea':
      return `<Textarea
        placeholder="${element.properties.placeholder || ''}"
        rows={${element.properties.rows || 3}}
        defaultValue="${element.properties.value || ''}"
        className="flex-1 min-w-[300px]"
      />`;
      
    case 'card':
      return `<Card className="flex-1 min-w-[300px]">
        <CardHeader>
          <CardTitle>${element.properties.title || 'Card Title'}</CardTitle>
          <CardDescription>
            ${element.properties.description || 'Card description'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          ${element.properties.content || 'Card content goes here.'}
        </CardContent>
      </Card>`;
      
    default:
      return generateElementCode(element, false);
  }
}