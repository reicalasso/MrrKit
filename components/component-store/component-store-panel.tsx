'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Star, 
  Download, 
  Eye, 
  Copy, 
  Heart, 
  Filter,
  Grid3X3,
  List,
  Sparkles,
  Package,
  Layers,
  Palette,
  Code,
  Component,
  Zap
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/stores/workspace-store';
import { ComponentPreview } from './component-preview';
import { TemplateLibrary } from './template-library';
import { componentStoreData } from '@/lib/data/component-store-data';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: 'components' | 'templates' | 'layouts' | 'pages' | 'blocks';
  tags: string[];
  author: string;
  authorAvatar?: string;
  downloads: number;
  likes: number;
  rating: number;
  preview: string;
  code: string;
  dependencies?: string[];
  framework: 'react' | 'vue' | 'svelte' | 'vanilla';
  featured?: boolean;
  new?: boolean;
  premium?: boolean;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function ComponentStorePanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'rating' | 'name'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    files,
    addFile,
    currentProject,
    setFiles,
    addOpenFile,
    setActiveFile
  } = useWorkspaceStore();

  const categories = [
    { id: 'all', label: 'All', icon: Grid3X3 },
    { id: 'components', label: 'Components', icon: Component },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'layouts', label: 'Layouts', icon: Package },
    { id: 'pages', label: 'Pages', icon: Palette },
    { id: 'blocks', label: 'Blocks', icon: Zap }
  ];

  const filteredItems = componentStoreData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleItemSelect = useCallback((item: StoreItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  }, []);

  const handleInstallComponent = useCallback((item: StoreItem) => {
    try {
      const fileName = `${item.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
      const fileId = `component-${Date.now()}`;

      // Create the component file with proper imports and structure
      const componentCode = item.code.includes('import')
        ? item.code
        : `import React from 'react';\n${item.dependencies?.map(dep => `import { } from '${dep}';`).join('\n') || ''}\n\n${item.code}`;

      const newFile = {
        id: fileId,
        name: fileName,
        type: "file" as const,
        content: componentCode,
        language: 'typescript',
        isDirty: false,
        parent: 'components',
        lastModified: Date.now(),
      };

      // Add to components folder or root if components doesn't exist
      let targetFiles = [...files];
      const componentsFolder = targetFiles.find(f => f.name === 'components' && f.type === 'folder');

      if (componentsFolder && componentsFolder.children) {
        // Add to components folder
        componentsFolder.children.push(newFile);
        newFile.parent = componentsFolder.id;
      } else {
        // Create components folder if it doesn't exist
        const componentsFolderId = 'components-folder';
        const newComponentsFolder = {
          id: componentsFolderId,
          name: 'components',
          type: 'folder' as const,
          children: [newFile],
          parent: undefined
        };
        newFile.parent = componentsFolderId;
        targetFiles.push(newComponentsFolder);
      }

      setFiles(targetFiles);

      // Auto-open the file
      addOpenFile(newFile);
      setActiveFile(fileId);

      // Success notification will be handled by ComponentPreview
      console.log(`Installed: ${item.name} as ${fileName}`);

    } catch (error) {
      console.error('Failed to install component:', error);
      throw error; // Re-throw for ComponentPreview error handling
    }
  }, [files, setFiles, addOpenFile, setActiveFile]);

  const handlePreviewClose = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedItem(null);
  }, []);

  const featuredItems = componentStoreData.filter(item => item.featured).slice(0, 6);
  const newItems = componentStoreData.filter(item => item.new).slice(0, 6);

  return (
    <div className="flex h-full">
      {/* Main Store Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-background/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Component Store</h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              {componentStoreData.length} items
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="h-12 border-b bg-background/30 flex items-center px-6 gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <Tabs defaultValue="explore" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="explore">Explore</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="explore" className="mt-6">
                {searchQuery && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Found {filteredItems.length} results for "{searchQuery}"
                    </p>
                  </div>
                )}

                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                    : 'space-y-4'
                }>
                  {filteredItems.map((item) => (
                    <ComponentCard
                      key={item.id}
                      item={item}
                      viewMode={viewMode}
                      onSelect={handleItemSelect}
                      onInstall={handleInstallComponent}
                    />
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No components found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Featured Components
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Handpicked components and templates by our community
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredItems.map((item) => (
                    <ComponentCard
                      key={item.id}
                      item={item}
                      viewMode="grid"
                      onSelect={handleItemSelect}
                      onInstall={handleInstallComponent}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    New Arrivals
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Latest components and templates added to the store
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {newItems.map((item) => (
                    <ComponentCard
                      key={item.id}
                      item={item}
                      viewMode="grid"
                      onSelect={handleItemSelect}
                      onInstall={handleInstallComponent}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="templates" className="mt-6">
                <TemplateLibrary onTemplateSelect={handleItemSelect} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Component Preview */}
      <ComponentPreview
        item={selectedItem}
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        onInstall={handleInstallComponent}
      />
    </div>
  );
}

interface ComponentCardProps {
  item: StoreItem;
  viewMode: 'grid' | 'list';
  onSelect: (item: StoreItem) => void;
  onInstall: (item: StoreItem) => void;
}

function ComponentCard({ item, viewMode, onSelect, onInstall }: ComponentCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <Component className="h-6 w-6 text-gray-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{item.name}</h3>
                {item.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                {item.new && <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">New</Badge>}
                {item.premium && <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">Premium</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {item.downloads}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {item.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {item.rating}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelect(item)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => onInstall(item)}
              >
                <Download className="h-4 w-4 mr-1" />
                Install
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onSelect(item)}>
      <CardHeader className="p-0">
        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Component className="h-8 w-8 text-gray-400" />
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button size="sm" variant="secondary">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>
          
          <div className="absolute top-2 left-2 flex gap-1">
            {item.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
            {item.new && <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">New</Badge>}
            {item.premium && <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">Premium</Badge>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-sm mb-1">{item.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {item.downloads}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </span>
        </div>
        
        <Button 
          size="sm" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onInstall(item);
          }}
        >
          <Download className="h-4 w-4 mr-1" />
          Install
        </Button>
      </CardContent>
    </Card>
  );
}
