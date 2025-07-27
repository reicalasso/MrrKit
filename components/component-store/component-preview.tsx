'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Download, 
  Eye, 
  Copy, 
  Heart, 
  Star, 
  Code, 
  User,
  Calendar,
  Package,
  ExternalLink,
  Check,
  Clipboard
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
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(item.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleInstall = () => {
    onInstall(item);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[800px] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b bg-background/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <SheetTitle className="text-xl">{item.name}</SheetTitle>
                  <div className="flex gap-1">
                    {item.featured && <Badge variant="secondary">Featured</Badge>}
                    {item.new && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">New</Badge>}
                    {item.premium && <Badge variant="default" className="bg-yellow-100 text-yellow-800">Premium</Badge>}
                  </div>
                </div>
                <SheetDescription className="text-sm">
                  {item.description}
                </SheetDescription>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {item.downloads} downloads
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {item.likes} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {item.rating} rating
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <Button onClick={handleInstall} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Install Component
                </Button>
                <Button variant="outline" onClick={handleCopyCode} className="w-full">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b bg-background/30">
                <TabsList className="w-full justify-start rounded-none h-12 bg-transparent">
                  <TabsTrigger value="preview" className="rounded-none">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="rounded-none">
                    <Code className="h-4 w-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-none">
                    <Package className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="preview" className="h-full m-0 p-0">
                  <div className="h-full p-6 bg-white">
                    <div className="w-full h-full border rounded-lg overflow-hidden">
                      <iframe
                        srcDoc={getPreviewHTML(item)}
                        className="w-full h-full border-0"
                        title={`Preview of ${item.name}`}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="h-full m-0 p-0">
                  <ScrollArea className="h-full">
                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium">Component Code</h3>
                        <Button variant="outline" size="sm" onClick={handleCopyCode}>
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Clipboard className="h-4 w-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{item.code}</code>
                      </pre>

                      {item.dependencies && item.dependencies.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium mb-2">Dependencies</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.dependencies.map((dep) => (
                              <Badge key={dep} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="details" className="h-full m-0 p-0">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      {/* Author Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Author
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={item.authorAvatar} />
                              <AvatarFallback>
                                {item.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{item.author}</p>
                              <p className="text-sm text-muted-foreground">Component Developer</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Component Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Component Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Category</span>
                            <Badge variant="outline" className="capitalize">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Framework</span>
                            <Badge variant="outline" className="capitalize">
                              {item.framework}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Created</span>
                            <span className="text-sm flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Last Updated</span>
                            <span className="text-sm flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.updatedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tags */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Stats */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">{item.downloads}</div>
                              <div className="text-xs text-muted-foreground">Downloads</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-red-500">{item.likes}</div>
                              <div className="text-xs text-muted-foreground">Likes</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-yellow-500">{item.rating}</div>
                              <div className="text-xs text-muted-foreground">Rating</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function getPreviewHTML(item: StoreItem): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${item.name} Preview</title>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f8fafc;
        }
        .preview-container {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      </style>
    </head>
    <body>
      <div id="preview-root" class="preview-container"></div>
      <script type="text/babel">
        ${item.code.includes('export default') 
          ? item.code.replace('export default', 'const Component =') + `
            ReactDOM.render(React.createElement(Component), document.getElementById('preview-root'));
          ` 
          : `
            const Component = () => (
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">${item.name}</h3>
                <p className="text-gray-600">${item.description}</p>
                <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                  Preview not available for this component type
                </div>
              </div>
            );
            ReactDOM.render(React.createElement(Component), document.getElementById('preview-root'));
          `}
      </script>
    </body>
    </html>
  `;
}
