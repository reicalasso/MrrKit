'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Square, 
  Type, 
  Image, 
  MousePointer, 
  ToggleLeft,
  Circle,
  Minus,
  Grid3X3,
  FileText,
  Link,
  Hash,
  User,
  Sparkles,
  Palette,
  Zap,
  Heart,
  Star,
  Shield,
  Target,
  Layers
} from 'lucide-react';
import { useState } from 'react';

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  isPremium?: boolean;
}

const components: ComponentItem[] = [
  // Basic Form Components
  {
    id: 'button',
    name: 'Button',
    category: 'Form',
    icon: <MousePointer className="w-4 h-4" />,
    description: 'Interactive button element'
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Form',
    icon: <Minus className="w-4 h-4" />,
    description: 'Text input field'
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Form',
    icon: <FileText className="w-4 h-4" />,
    description: 'Multi-line text input'
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Form',
    icon: <ToggleLeft className="w-4 h-4" />,
    description: 'Dropdown selection'
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Form',
    icon: <Square className="w-4 h-4" />,
    description: 'Checkbox input'
  },
  {
    id: 'radio',
    name: 'Radio',
    category: 'Form',
    icon: <Circle className="w-4 h-4" />,
    description: 'Radio button'
  },

  // Typography
  {
    id: 'heading',
    name: 'Heading',
    category: 'Typography',
    icon: <Hash className="w-4 h-4" />,
    description: 'Heading text'
  },
  {
    id: 'text',
    name: 'Text',
    category: 'Typography',
    icon: <Type className="w-4 h-4" />,
    description: 'Plain text'
  },
  {
    id: 'label',
    name: 'Label',
    category: 'Typography',
    icon: <Type className="w-4 h-4" />,
    description: 'Form label'
  },
  {
    id: 'link',
    name: 'Link',
    category: 'Typography',
    icon: <Link className="w-4 h-4" />,
    description: 'Hyperlink'
  },

  // Media
  {
    id: 'image',
    name: 'Image',
    category: 'Media',
    icon: <Image className="w-4 h-4" />,
    description: 'Image element'
  },

  // Layout
  {
    id: 'div',
    name: 'Container',
    category: 'Layout',
    icon: <Square className="w-4 h-4" />,
    description: 'Generic container'
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout',
    icon: <Grid3X3 className="w-4 h-4" />,
    description: 'Card component'
  },
  {
    id: 'separator',
    name: 'Separator',
    category: 'Layout',
    icon: <Minus className="w-4 h-4" />,
    description: 'Visual separator'
  },

  // Display
  {
    id: 'badge',
    name: 'Badge',
    category: 'Display',
    icon: <Badge className="w-4 h-4" />,
    description: 'Status badge'
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'Display',
    icon: <User className="w-4 h-4" />,
    description: 'User avatar'
  },

  // MrrKit Premium Components
  {
    id: 'gradient-button',
    name: 'Gradient Button',
    category: 'MrrKit Pro',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Animated gradient button with effects',
    isPremium: true
  },
  {
    id: 'glass-card',
    name: 'Glass Card',
    category: 'MrrKit Pro',
    icon: <Layers className="w-4 h-4" />,
    description: 'Glassmorphism card with blur effect',
    isPremium: true
  },
  {
    id: 'neon-input',
    name: 'Neon Input',
    category: 'MrrKit Pro',
    icon: <Zap className="w-4 h-4" />,
    description: 'Glowing input with neon effects',
    isPremium: true
  },
  {
    id: 'animated-badge',
    name: 'Animated Badge',
    category: 'MrrKit Pro',
    icon: <Star className="w-4 h-4" />,
    description: 'Badge with hover animations',
    isPremium: true
  },
  {
    id: 'floating-label',
    name: 'Floating Label',
    category: 'MrrKit Pro',
    icon: <Target className="w-4 h-4" />,
    description: 'Input with floating label animation',
    isPremium: true
  },
  {
    id: 'pulse-avatar',
    name: 'Pulse Avatar',
    category: 'MrrKit Pro',
    icon: <Heart className="w-4 h-4" />,
    description: 'Avatar with pulse animation',
    isPremium: true
  },
  {
    id: 'morphing-button',
    name: 'Morphing Button',
    category: 'MrrKit Pro',
    icon: <Shield className="w-4 h-4" />,
    description: 'Button that morphs on interaction',
    isPremium: true
  },
  {
    id: 'holographic-card',
    name: 'Holographic Card',
    category: 'MrrKit Pro',
    icon: <Palette className="w-4 h-4" />,
    description: 'Card with holographic effects',
    isPremium: true
  }
];

const categories = ['All', 'Form', 'Typography', 'Layout', 'Media', 'Display', 'MrrKit Pro'];

export function ComponentPalette() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = components.filter(component => {
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    console.log('Drag started for:', componentId); // Debug log
    e.dataTransfer.setData('component-type', componentId);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    e.dataTransfer.setDragImage(dragImage, 50, 20);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <Input
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-xs bg-white/80 backdrop-blur-sm border-gray-200/60"
        />
      </div>

      {/* Category Filter */}
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory(category)}
              className={`h-6 px-2 text-xs ${
                category === 'MrrKit Pro' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                  : ''
              }`}
            >
              {category === 'MrrKit Pro' && <Sparkles className="w-3 h-3 mr-1" />}
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                component.isPremium
                  ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 hover:shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                component.isPremium
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {component.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{component.name}</span>
                  {component.isPremium ? (
                    <Badge className="text-xs px-2 py-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {component.category}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{component.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">No components found</p>
          </div>
        )}
      </div>
    </div>
  );
}
