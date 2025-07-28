'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { StoreItem } from './component-store-panel';
import { toast } from '@/lib/hooks/use-toast';

interface ComponentPreviewProps {
  item: StoreItem | null;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (item: StoreItem) => void;
}

export function ComponentPreview({ item, isOpen, onClose, onInstall }: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (installSuccess) {
      const timer = setTimeout(() => setInstallSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [installSuccess]);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  if (!isOpen || !item) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(item.code);
      setCopySuccess(true);
      toast({
        title: "Code copied",
        description: "Component code has been copied to clipboard",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleInstall = () => {
    try {
      onInstall(item);
      setInstallSuccess(true);
      toast({
        title: "Component installed",
        description: `${item.name} has been added to your project`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Installation failed",
        description: "Failed to install component",
        variant: "destructive"
      });
    }
  };

  const renderPreview = () => {
    if (!item) return null;

    // Create a sandboxed preview environment
    const previewHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${item.name} Preview</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: system-ui, -apple-system, sans-serif; 
            background: #f8fafc;
          }
          .preview-container {
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .error-container {
            color: #dc2626;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 16px;
            margin: 20px;
            font-family: monospace;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div id="root">
          <div class="preview-container">
            <div style="color: #6b7280; text-align: center;">
              <div style="margin-bottom: 8px;">⚡ Loading preview...</div>
              <div style="font-size: 14px;">Rendering ${item.name}</div>
            </div>
          </div>
        </div>
        
        <script type="text/babel">
          const { useState, useEffect, useCallback, useRef } = React;
          const { createRoot } = ReactDOM;
          
          // Mock UI components that might be used
          const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, ...props }) => {
            const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';
            const variants = {
              default: 'bg-blue-600 text-white hover:bg-blue-700',
              outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
              ghost: 'hover:bg-gray-100',
              destructive: 'bg-red-600 text-white hover:bg-red-700'
            };
            const sizes = {
              default: 'h-10 px-4 py-2',
              sm: 'h-9 rounded-md px-3',
              lg: 'h-11 rounded-md px-8'
            };
            
            return React.createElement('button', {
              className: \`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`,
              onClick,
              ...props
            }, children);
          };

          const Card = ({ children, className = '', ...props }) => (
            React.createElement('div', {
              className: \`rounded-lg border bg-white shadow-sm \${className}\`,
              ...props
            }, children)
          );

          const CardHeader = ({ children, className = '', ...props }) => (
            React.createElement('div', {
              className: \`flex flex-col space-y-1.5 p-6 \${className}\`,
              ...props
            }, children)
          );

          const CardTitle = ({ children, className = '', ...props }) => (
            React.createElement('h3', {
              className: \`text-lg font-semibold leading-none tracking-tight \${className}\`,
              ...props
            }, children)
          );

          const CardDescription = ({ children, className = '', ...props }) => (
            React.createElement('p', {
              className: \`text-sm text-gray-600 \${className}\`,
              ...props
            }, children)
          );

          const CardContent = ({ children, className = '', ...props }) => (
            React.createElement('div', {
              className: \`p-6 pt-0 \${className}\`,
              ...props
            }, children)
          );

          const Badge = ({ children, variant = 'default', className = '', ...props }) => {
            const variants = {
              default: 'bg-blue-100 text-blue-800',
              secondary: 'bg-gray-100 text-gray-800',
              outline: 'border border-gray-300 bg-transparent',
              destructive: 'bg-red-100 text-red-800'
            };
            
            return React.createElement('div', {
              className: \`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium \${variants[variant]} \${className}\`,
              ...props
            }, children);
          };

          const Input = ({ className = '', ...props }) => (
            React.createElement('input', {
              className: \`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 \${className}\`,
              ...props
            })
          );

          const Label = ({ children, className = '', ...props }) => (
            React.createElement('label', {
              className: \`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 \${className}\`,
              ...props
            }, children)
          );

          const Textarea = ({ className = '', ...props }) => (
            React.createElement('textarea', {
              className: \`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 \${className}\`,
              ...props
            })
          );

          // Mock Lucide icons
          const mockIcon = (name) => ({ className = 'h-4 w-4', ...props }) => (
            React.createElement('svg', {
              className,
              fill: 'currentColor',
              viewBox: '0 0 24 24',
              ...props
            }, React.createElement('circle', { cx: 12, cy: 12, r: 3 }))
          );

          // Common icons
          const CheckCircle = mockIcon('CheckCircle');
          const AlertCircle = mockIcon('AlertCircle');
          const Star = mockIcon('Star');
          const Heart = mockIcon('Heart');
          const Download = mockIcon('Download');
          const ArrowRight = mockIcon('ArrowRight');
          const Play = mockIcon('Play');
          const Zap = mockIcon('Zap');
          const Shield = mockIcon('Shield');
          const Globe = mockIcon('Globe');
          const Users = mockIcon('Users');
          const Smartphone = mockIcon('Smartphone');
          const BarChart = mockIcon('BarChart');
          const Check = mockIcon('Check');
          const X = mockIcon('X');
          const Mail = mockIcon('Mail');
          const Calendar = mockIcon('Calendar');
          const Settings = mockIcon('Settings');
          const LogOut = mockIcon('LogOut');
          const Home = mockIcon('Home');
          const FileText = mockIcon('FileText');
          const ShoppingCart = mockIcon('ShoppingCart');
          const TrendingUp = mockIcon('TrendingUp');
          const BarChart3 = mockIcon('BarChart3');
          const Menu = mockIcon('Menu');
          const Package = mockIcon('Package');
          const Layers = mockIcon('Layers');
          const Layout = mockIcon('Layout');
          const Palette = mockIcon('Palette');
          const Component = mockIcon('Component');
          const User = mockIcon('User');

          // Utility functions
          const cn = (...classes) => classes.filter(Boolean).join(' ');

          try {
            ${item.code}
            
            const root = createRoot(document.getElementById('root'));
            
            // Try to find and render the component
            const componentMatch = \`${item.code}\`.match(/export\\s+(?:default\\s+)?function\\s+(\\w+)/);
            const componentName = componentMatch ? componentMatch[1] : null;
            
            if (componentName && window[componentName]) {
              root.render(React.createElement('div', { className: 'preview-container' }, 
                React.createElement(window[componentName])));
            } else if (componentName) {
              // Try to evaluate the component directly
              const ComponentToRender = eval(componentName);
              if (ComponentToRender) {
                root.render(React.createElement('div', { className: 'preview-container' }, 
                  React.createElement(ComponentToRender)));
              } else {
                throw new Error(\`Component \${componentName} not found\`);
              }
            } else {
              throw new Error('No valid component export found');
            }
          } catch (error) {
            console.error('Preview error:', error);
            const root = createRoot(document.getElementById('root'));
            root.render(React.createElement('div', { className: 'error-container' }, 
              React.createElement('div', { style: { fontWeight: 'bold', marginBottom: '8px' } }, '⚠️ Preview Error'),
              React.createElement('div', null, error.message || 'Failed to render component'),
              React.createElement('div', { style: { marginTop: '12px', fontSize: '12px', opacity: 0.7 } }, 
                'This component may require additional dependencies or configuration.')
            ));
          }
        </script>
      </body>
      </html>
    `;

    return (
      <iframe
        ref={previewIframeRef}
        srcDoc={previewHTML}
        className="w-full h-full border-0 rounded-lg"
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setPreviewError(null)}
        onError={() => setPreviewError('Failed to load preview')}
      />
    );
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyCode}
              disabled={copySuccess}
            >
              {copySuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={handleInstall}
              disabled={installSuccess}
            >
              {installSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  Installed
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  Install
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Success/Error Notifications */}
        {installSuccess && (
          <Alert className="mx-6 mt-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Component successfully installed! Check your file explorer for the new component file.
            </AlertDescription>
          </Alert>
        )}

        {previewError && (
          <Alert className="mx-6 mt-4 border-red-200 bg-red-50" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {previewError}
            </AlertDescription>
          </Alert>
        )}

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
                    {item.downloads.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Downloads</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <Heart className="h-3 w-3" />
                    {item.likes.toLocaleString()}
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
                    <Badge variant="outline" className="text-xs">
                      Interactive Preview
                    </Badge>
                  </div>
                  
                  <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
                    {renderPreview()}
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
                      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed"
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
