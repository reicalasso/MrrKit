'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Eye, 
  Star, 
  Layout, 
  Smartphone, 
  Monitor, 
  Globe,
  ShoppingBag,
  Briefcase,
  Users,
  BookOpen,
  Camera,
  Music,
  Gamepad2
} from 'lucide-react';
import { StoreItem } from './component-store-panel';

interface TemplateLibraryProps {
  onTemplateSelect: (template: StoreItem) => void;
}

const templateCategories = [
  { id: 'all', label: 'All Templates', icon: Layout },
  { id: 'landing', label: 'Landing Pages', icon: Globe },
  { id: 'dashboard', label: 'Dashboards', icon: Monitor },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'mobile', label: 'Mobile', icon: Smartphone }
];

const templates: StoreItem[] = [
  {
    id: 'landing-saas',
    name: 'SaaS Landing Page',
    description: 'Modern landing page template for SaaS products with hero section, features, pricing, and testimonials',
    category: 'templates',
    tags: ['landing', 'saas', 'business', 'hero', 'pricing'],
    author: 'Design Team',
    downloads: 2847,
    likes: 312,
    rating: 4.8,
    framework: 'react',
    featured: true,
    thumbnail: '/templates/saas-landing.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Check, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function SaaSLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            ✨ Now with AI-powered features
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Amazing Products 10x Faster
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The all-in-one platform that helps teams ship better products faster with AI-powered tools and seamless collaboration.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help your team collaborate better and ship faster.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Built for speed with modern architecture and optimized performance.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-level security with SOC 2 compliance and end-to-end encryption.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Global Scale</CardTitle>
                <CardDescription>
                  Deploy worldwide with our global CDN and 99.9% uptime guarantee.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600">Choose the plan that's right for your team</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-gray-500">/month</span></div>
                <CardDescription>Perfect for small teams getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Up to 5 team members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    100GB storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Basic analytics
                  </li>
                </ul>
                <Button className="w-full mt-6">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <div className="text-3xl font-bold">$99<span className="text-sm font-normal text-gray-500">/month</span></div>
                <CardDescription>For growing teams that need more power</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Up to 25 team members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    1TB storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">Custom</div>
                <CardDescription>For large organizations with specific needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Unlimited team members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Unlimited storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Dedicated support
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}`,
    dependencies: ['lucide-react']
  },
  {
    id: 'ecommerce-product',
    name: 'E-commerce Product Page',
    description: 'Complete product page with image gallery, reviews, related products and shopping cart integration',
    category: 'templates',
    tags: ['ecommerce', 'product', 'shopping', 'cart', 'reviews'],
    author: 'Commerce Team',
    downloads: 1926,
    likes: 245,
    rating: 4.7,
    framework: 'react',
    new: true,
    thumbnail: '/templates/ecommerce-product.jpg',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
    preview: '',
    code: `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Share, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';

export default function EcommerceProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const images = [
    '/products/product-1.jpg',
    '/products/product-2.jpg',
    '/products/product-3.jpg',
    '/products/product-4.jpg'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <img 
                src={images[selectedImage]} 
                alt="Product" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={\`aspect-square bg-white rounded-lg overflow-hidden border-2 \${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }\`}
                >
                  <img src={image} alt={\`Product \${index + 1}\`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">New Arrival</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Premium Cotton T-Shirt
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(128 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">$49.99</span>
                <span className="text-lg text-gray-500 line-through">$69.99</span>
                <Badge variant="destructive">30% OFF</Badge>
              </div>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">
                Made from 100% organic cotton, this premium t-shirt offers unmatched comfort and style. 
                Perfect for everyday wear with a relaxed fit and breathable fabric that gets softer with every wash.
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={\`px-4 py-2 border rounded-md \${
                      selectedSize === size
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }\`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">Only 8 left in stock</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button size="lg" className="w-full">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs font-medium">Secure Payment</p>
                <p className="text-xs text-gray-500">SSL encrypted</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    dependencies: ['lucide-react']
  },
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Modern dashboard with charts, metrics, and data visualization for business analytics',
    category: 'templates',
    tags: ['dashboard', 'analytics', 'charts', 'metrics', 'admin'],
    author: 'Dashboard Team',
    downloads: 3421,
    likes: 567,
    rating: 4.9,
    framework: 'react',
    featured: true,
    thumbnail: '/templates/analytics-dashboard.jpg',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-02-12'),
    preview: '',
    code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Eye,
  MoreHorizontal,
  Calendar
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+180.1%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Orders',
      value: '12,234',
      change: '+19%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      title: 'Page Views',
      value: '573,204',
      change: '-4.3%',
      trend: 'down',
      icon: Eye,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </Button>
            <Button>Download Report</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={\`h-4 w-4 \${stat.color}\`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={\`\${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}\`}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[40, 60, 45, 80, 65, 90].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: \`\${height}%\` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling products this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Wireless Headphones', sales: 1234, growth: 12 },
                { name: 'Smart Watch', sales: 982, growth: 8 },
                { name: 'Laptop Stand', sales: 756, growth: 15 },
                { name: 'USB-C Hub', sales: 643, growth: -3 },
                { name: 'Mechanical Keyboard', sales: 521, growth: 22 }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.sales} sales</p>
                  </div>
                  <Badge 
                    variant={product.growth > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user activities and orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { user: 'John Doe', action: 'made a purchase', time: '2 minutes ago', amount: '$129.99' },
                { user: 'Sarah Wilson', action: 'signed up', time: '5 minutes ago', amount: null },
                { user: 'Mike Johnson', action: 'left a review', time: '10 minutes ago', amount: null },
                { user: 'Emily Brown', action: 'made a purchase', time: '15 minutes ago', amount: '$89.99' },
                { user: 'David Lee', action: 'updated profile', time: '20 minutes ago', amount: null }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <Badge variant="outline" className="text-green-600">
                      {activity.amount}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Conversion Rate', value: 3.2, target: 4.0, unit: '%' },
                { label: 'Average Order Value', value: 84, target: 100, unit: '$' },
                { label: 'Customer Satisfaction', value: 4.6, target: 5.0, unit: '/5' },
                { label: 'Response Time', value: 1.2, target: 1.0, unit: 's' }
              ].map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-sm text-gray-600">
                      {metric.value}{metric.unit} / {metric.target}{metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}`,
    dependencies: ['lucide-react']
  }
];

export function TemplateLibrary({ onTemplateSelect }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           template.tags.some(tag => tag === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Template Library</h3>
          <p className="text-sm text-muted-foreground">
            Complete page templates ready to use
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {templateCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="p-0">
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Layout className="h-12 w-12 text-gray-400" />
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
                
                <div className="absolute top-2 left-2 flex gap-1">
                  {template.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                  {template.new && <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">New</Badge>}
                </div>
                
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {template.framework}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {template.downloads}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
