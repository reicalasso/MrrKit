import { CanvasElement } from '@/components/ui-builder/ui-builder-panel';

export function generateComponentCode(componentName: string, elements: CanvasElement[]): string {
  // Sort elements by z-index (render order)
  const sortedElements = [...elements].sort((a, b) => a.y - b.y || a.x - b.x);
  
  const imports = generateImports(elements);
  const componentCode = generateComponentJSX(componentName, sortedElements);
  
  return `${imports}

${componentCode}`;
}

function generateImports(elements: CanvasElement[]): string {
  const componentTypes = new Set(elements.map(el => el.type));
  const imports: string[] = ["import React from 'react';"];
  
  const uiComponents: string[] = [];
  
  componentTypes.forEach(type => {
    switch (type) {
      case 'button':
        uiComponents.push('Button');
        break;
      case 'input':
        uiComponents.push('Input');
        break;
      case 'textarea':
        uiComponents.push('Textarea');
        break;
      case 'label':
        uiComponents.push('Label');
        break;
      case 'card':
        uiComponents.push('Card', 'CardContent', 'CardDescription', 'CardHeader', 'CardTitle');
        break;
      case 'badge':
        uiComponents.push('Badge');
        break;
      case 'avatar':
        uiComponents.push('Avatar', 'AvatarFallback');
        break;
      case 'separator':
        uiComponents.push('Separator');
        break;
    }
  });
  
  if (uiComponents.length > 0) {
    const uniqueComponents = [...new Set(uiComponents)].sort();
    // Import UI components individually
    const uiImports = uniqueComponents.map(component => {
      const componentName = component.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
      return `import { ${component} } from '@/components/ui/${componentName}';`;
    });
    imports.push(...uiImports);
  }
  
  return imports.join('\n');
}

function generateComponentJSX(componentName: string, elements: CanvasElement[]): string {
  const jsxElements = elements.map(generateElementJSX).join('\n      ');
  
  return `export default function ${componentName}() {
  return (
    <div className="relative w-full h-full">
      ${jsxElements}
    </div>
  );
}`;
}

function generateElementJSX(element: CanvasElement): string {
  const style = `{
    position: 'absolute',
    left: ${element.x},
    top: ${element.y},
    width: ${element.width},
    minHeight: ${element.height}
  }`;
  
  let jsx = '';
  
  switch (element.type) {
    case 'button':
      jsx = `<Button 
        variant="${element.properties.variant || 'default'}"
        size="${element.properties.size || 'default'}"
        style=${style}
      >
        ${element.properties.children || 'Button'}
      </Button>`;
      break;
      
    case 'input':
      jsx = `<Input
        type="${element.properties.type || 'text'}"
        placeholder="${element.properties.placeholder || ''}"
        defaultValue="${element.properties.value || ''}"
        style=${style}
      />`;
      break;
      
    case 'textarea':
      jsx = `<Textarea
        placeholder="${element.properties.placeholder || ''}"
        rows={${element.properties.rows || 3}}
        defaultValue="${element.properties.value || ''}"
        style=${style}
      />`;
      break;
      
    case 'label':
      jsx = `<Label style=${style}>
        ${element.properties.children || 'Label'}
      </Label>`;
      break;
      
    case 'heading':
      const headingTag = element.properties.level || 'h2';
      jsx = `<${headingTag} className="font-semibold" style=${style}>
        ${element.properties.children || 'Heading'}
      </${headingTag}>`;
      break;
      
    case 'text':
      jsx = `<p style=${style}>
        ${element.properties.children || 'Text content'}
      </p>`;
      break;
      
    case 'image':
      jsx = `<img
        src="${element.properties.src || '/placeholder.svg'}"
        alt="${element.properties.alt || 'Image'}"
        className="max-w-full h-auto"
        style=${style}
      />`;
      break;
      
    case 'link':
      jsx = `<a 
        href="${element.properties.href || '#'}"
        className="text-primary hover:underline"
        style=${style}
      >
        ${element.properties.children || 'Link'}
      </a>`;
      break;
      
    case 'div':
      jsx = `<div 
        className="${element.properties.className || 'p-4 border rounded'}"
        style=${style}
      >
        ${element.properties.children || 'Container'}
      </div>`;
      break;
      
    case 'card':
      jsx = `<Card style=${style}>
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
      break;
      
    case 'badge':
      jsx = `<Badge 
        variant="${element.properties.variant || 'default'}"
        style=${style}
      >
        ${element.properties.children || 'Badge'}
      </Badge>`;
      break;
      
    case 'avatar':
      jsx = `<Avatar style=${style}>
        <AvatarFallback>
          ${element.properties.fallback || 'AB'}
        </AvatarFallback>
      </Avatar>`;
      break;
      
    case 'separator':
      jsx = `<Separator 
        orientation="${element.properties.orientation || 'horizontal'}"
        style={${style.replace('minHeight', 'height')}}
      />`;
      break;
      
    default:
      jsx = `<div style=${style}>Unknown component</div>`;
  }
  
  return jsx;
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
  let jsx = '';
  
  switch (element.type) {
    case 'button':
      jsx = `<Button 
        variant="${element.properties.variant || 'default'}"
        size="${element.properties.size || 'default'}"
        className="w-auto"
      >
        ${element.properties.children || 'Button'}
      </Button>`;
      break;
      
    case 'input':
      jsx = `<Input
        type="${element.properties.type || 'text'}"
        placeholder="${element.properties.placeholder || ''}"
        defaultValue="${element.properties.value || ''}"
        className="flex-1 min-w-[200px]"
      />`;
      break;
      
    case 'textarea':
      jsx = `<Textarea
        placeholder="${element.properties.placeholder || ''}"
        rows={${element.properties.rows || 3}}
        defaultValue="${element.properties.value || ''}"
        className="flex-1 min-w-[300px]"
      />`;
      break;
      
    case 'card':
      jsx = `<Card className="flex-1 min-w-[300px]">
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
      break;
      
    default:
      jsx = generateElementJSX(element);
  }
  
  return jsx;
}
