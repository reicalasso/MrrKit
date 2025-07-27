'use client';

import { DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Square, 
  Type, 
  Image, 
  Link, 
  MousePointer2, 
  ToggleLeft,
  RadioItem,
  Hash,
  AlignLeft,
  CreditCard,
  User,
  Minus,
  Layers
} from 'lucide-react';

const componentCategories = [
  {
    name: 'Layout',
    components: [
      { type: 'div', label: 'Container', icon: Square, description: 'Flexible container' },
      { type: 'card', label: 'Card', icon: CreditCard, description: 'Content card' },
      { type: 'separator', label: 'Separator', icon: Minus, description: 'Visual separator' }
    ]
  },
  {
    name: 'Typography',
    components: [
      { type: 'heading', label: 'Heading', icon: Hash, description: 'H1-H6 headings' },
      { type: 'text', label: 'Text', icon: Type, description: 'Paragraph text' },
      { type: 'label', label: 'Label', icon: AlignLeft, description: 'Form label' }
    ]
  },
  {
    name: 'Form Controls',
    components: [
      { type: 'button', label: 'Button', icon: MousePointer2, description: 'Action button' },
      { type: 'input', label: 'Input', icon: Type, description: 'Text input field' },
      { type: 'textarea', label: 'Textarea', icon: AlignLeft, description: 'Multi-line input' },
      { type: 'select', label: 'Select', icon: Layers, description: 'Dropdown select' },
      { type: 'checkbox', label: 'Checkbox', icon: ToggleLeft, description: 'Checkbox input' },
      { type: 'radio', label: 'Radio', icon: RadioItem, description: 'Radio button' }
    ]
  },
  {
    name: 'Media & Links',
    components: [
      { type: 'image', label: 'Image', icon: Image, description: 'Image element' },
      { type: 'link', label: 'Link', icon: Link, description: 'Hyperlink' },
      { type: 'avatar', label: 'Avatar', icon: User, description: 'User avatar' }
    ]
  },
  {
    name: 'Display',
    components: [
      { type: 'badge', label: 'Badge', icon: Badge, description: 'Status badge' }
    ]
  }
];

export function ComponentPalette() {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, componentType: string) => {
    e.dataTransfer.setData('application/component-type', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="p-4 space-y-6">
      {componentCategories.map((category) => (
        <div key={category.name} className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category.name}
          </h4>
          <div className="space-y-2">
            {category.components.map((component) => (
              <div
                key={component.type}
                draggable
                onDragStart={(e) => handleDragStart(e, component.type)}
                className="group cursor-grab active:cursor-grabbing hover:bg-accent/50 p-3 rounded-md border border-dashed border-border/50 hover:border-border transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-muted group-hover:bg-accent">
                    <component.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{component.label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {component.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p className="font-medium mb-1">💡 How to use:</p>
          <ul className="space-y-1">
            <li>• Drag components to canvas</li>
            <li>• Click to select & edit</li>
            <li>• Use properties panel</li>
            <li>• Generate React code</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
