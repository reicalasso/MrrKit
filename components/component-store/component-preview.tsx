'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Download, 
  Copy, 
  Eye, 
  Code, 
  Star, 
  Heart, 
  ExternalLink,
  User,
  Calendar,
  Package
} from 'lucide-react';
import { StoreItem } from './component-store-panel';

interface ComponentPreviewProps {
  item: StoreItem | null;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (item: StoreItem) => void;
}

export function ComponentPreview({ item, isOpen, onClose, onInstall }: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const codeRef = useRef<HTMLPreElement>(null);

  if (!isOpen || !item) return null;

  const copyCode = async () => {
    if (codeRef.current) {
      await navigator.clipboard.writeText(item.code);
      // You could add a toast notification here
      console.log('Code copied to clipboard');
    }
  };

  const openExternalPreview = () => {
    // Create a new window with the component preview
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${item.name} Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${item.code}
            
            // Try to render the component
            const root = ReactDOM.createRoot(document.getElementById('root'));
            
            // Extract component name from code
            const componentMatch = item.code.match(/export\\s+(?:default\\s+)?function\\s+(\\w+)/);
            const componentName = componentMatch ? componentMatch[1] : 'Component';
            
            if (window[componentName]) {
              root.render(React.createElement(window[componentName]));
            } else {
              root.render(React.createElement('div', {}, 'Component preview not available'));
            }
          </script>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyCode}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button size="sm" onClick={() => onInstall(item)}>
              <Download className="h-4 w-4 mr-1" />
              Install
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Info */}
          <div className="w-80 border-r bg-gray-50/50 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <Download className="h-3 w-3" />
                    {item.downloads}
                  </div>
                  <div className="text-xs text-gray-500">Downloads</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <Heart className="h-3 w-3" />
                    {item.likes}
                  </div>
                  <div className="text-xs text-gray-500">Likes</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {item.rating}
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div>
                <h3 className="text-sm font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Framework */}
              <div>
                <h3 className="text-sm font-medium mb-2">Framework</h3>
                <Badge variant="secondary" className="capitalize">
                  {item.framework}
                </Badge>
              </div>

              {/* Dependencies */}
              {item.dependencies && item.dependencies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Dependencies</h3>
                  <div className="space-y-2">
                    {item.dependencies.map((dep) => (
                      <div key={dep} className="text-xs font-mono bg-gray-100 rounded px-2 py-1">
                        {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Author */}
              <div>
                <h3 className="text-sm font-medium mb-3">Author</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.author}</div>
                    <div className="text-xs text-gray-500">Component Author</div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Created: {item.createdAt.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Updated: {item.updatedAt.toLocaleDateString()}
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <Badge variant="outline" className="capitalize">
                  {item.category}
                </Badge>
              </div>

              {/* Special Badges */}
              <div className="flex flex-wrap gap-2">
                {item.featured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Featured
                  </Badge>
                )}
                {item.new && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    New
                  </Badge>
                )}
                {item.premium && (
                  <Badge variant="default" className="bg-purple-100 text-purple-800">
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview/Code */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-6 py-3">
                <TabsList>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code className="h-4 w-4 mr-1" />
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="flex-1 m-0 p-6">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Live Preview</h3>
                    <Button variant="outline" size="sm" onClick={openExternalPreview}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open in New Window
                    </Button>
                  </div>
                  
                  <div className="flex-1 border rounded-lg bg-gray-50 p-8 overflow-auto">
                    <div className="bg-white rounded shadow-sm p-6 min-h-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="font-medium mb-2">Live Preview</p>
                        <p className="text-sm">Component preview would render here</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={openExternalPreview}
                        >
                          Open External Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="flex-1 m-0">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-6 pb-3">
                    <h3 className="font-medium">Source Code</h3>
                    <Button variant="outline" size="sm" onClick={copyCode}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1 px-6 pb-6">
                    <pre 
                      ref={codeRef}
                      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono"
                    >
                      <code>{item.code}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
