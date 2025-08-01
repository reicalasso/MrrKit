import { CanvasElement } from '@/components/ui-builder/ui-builder-panel';

export function generateComponentCode(componentName: string, elements: CanvasElement[]): string {
  const imports = generateImports(elements);
  const componentCode = generateComponentBody(componentName, elements);
  
  return `${imports}

${componentCode}`;
}

function generateImports(elements: CanvasElement[]): string {
  const usedTypes = new Set<string>();
  
  elements.forEach(element => {
    switch (element.type) {
      case 'button':
        usedTypes.add('Button');
        break;
      case 'input':
        usedTypes.add('Input');
        break;
      case 'textarea':
        usedTypes.add('Textarea');
        break;
      case 'card':
        usedTypes.add('Card');
        usedTypes.add('CardHeader');
        usedTypes.add('CardTitle');
        usedTypes.add('CardDescription');
        usedTypes.add('CardContent');
        break;
      case 'badge':
        usedTypes.add('Badge');
        break;
      case 'avatar':
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
  
  const elementCode = sortedElements.map(element => {
    return generateElementCode(element);
  }).join('\n      ');

  return `export function ${componentName}() {
  return (
    <div className="relative w-full h-full">
      ${elementCode}
    </div>
  );
}`;
}

function generateElementCode(element: CanvasElement): string {
  const style = {
    position: 'absolute' as const,
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    ...element.style
  };

  const styleString = Object.entries(style)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? `'${value}'` : value}`)
    .join(', ');

  switch (element.type) {
    case 'button':
      return `<Button
        variant="${element.properties.variant || 'default'}"
        size="${element.properties.size || 'default'}"
        style={{ ${styleString} }}
      >
        ${element.properties.children || 'Button'}
      </Button>`;

    case 'input':
      return `<Input
        type="${element.properties.type || 'text'}"
        placeholder="${element.properties.placeholder || ''}"
        style={{ ${styleString} }}
      />`;

    case 'textarea':
      return `<Textarea
        placeholder="${element.properties.placeholder || ''}"
        rows={${element.properties.rows || 3}}
        style={{ ${styleString} }}
      />`;

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
        src="${element.properties.src || '/placeholder.svg'}"
        alt="${element.properties.alt || 'Image'}"
        style={{ ${styleString} }}
      />`;

    case 'link':
      return `<a 
        href="${element.properties.href || '#'}"
        className="text-primary hover:underline"
        style={{ ${styleString} }}
      >
        ${element.properties.children || 'Link'}
      </a>`;

    case 'div':
      return `<div 
        className="${element.properties.className || 'p-4 border rounded'}"
        style={{ ${styleString} }}
      >
        ${element.properties.children || 'Container'}
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

    default:
      return `<div style={{ ${styleString} }}>
        ${element.type}
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
      return generateElementCode(element);
  }
}
