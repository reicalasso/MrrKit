'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  Download, 
  Eye, 
  Layers,
  Layout,
  Globe,
  ShoppingCart,
  User,
  BarChart,
  FileText,
  Mail,
  Settings,
  Calendar
} from 'lucide-react';
import { StoreItem } from './component-store-panel';
import { useWorkspaceStore } from '@/lib/stores/workspace-store';
import { toast } from '@/lib/hooks/use-toast';

interface TemplateLibraryProps {
  onTemplateSelect: (template: StoreItem) => void;
}

const templateCategories = [
  { id: 'all', label: 'All Templates', icon: Layers },
  { id: 'landing', label: 'Landing Pages', icon: Globe },
  { id: 'dashboard', label: 'Dashboards', icon: BarChart },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'portfolio', label: 'Portfolio', icon: User },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'admin', label: 'Admin Panels', icon: Settings },
  { id: 'calendar', label: 'Calendar', icon: Calendar }
];

const templates: StoreItem[] = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    description: 'Modern landing page template for SaaS products with hero section, features, pricing, and testimonials',
    category: 'templates',
    tags: ['landing', 'saas', 'hero', 'pricing', 'testimonials'],
    author: 'Template Studio',
    downloads: 12456,
    likes: 2341,
    rating: 4.9,
    framework: 'react',
    featured: true,
    new: false,
    thumbnail: '/templates/saas-landing.jpg',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-10'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function SaaSLandingPage() {
  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed and performance' },
    { icon: Shield, title: 'Secure by Default', description: 'Enterprise-grade security built-in' },
    { icon: Globe, title: 'Global Scale', description: 'Deploy worldwide with our CDN' }
  ];

  const pricing = [
    { name: 'Starter', price: 29, features: ['5 Projects', '1GB Storage', 'Basic Support'] },
    { name: 'Pro', price: 79, features: ['Unlimited Projects', '10GB Storage', 'Priority Support'], popular: true },
    { name: 'Enterprise', price: 199, features: ['Everything', 'Unlimited Storage', '24/7 Support'] }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold">ProductName</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            <Button variant="outline">Sign In</Button>
            <Button>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <Badge className="mb-4">🎉 New Feature Released</Badge>
          <h1 className="text-5xl font-bold mb-6">
            Build Amazing Products
            <span className="block text-blue-600">10x Faster</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The all-in-one platform that helps teams ship better products faster. 
            From idea to launch in record time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
          <div className="mt-12 bg-gray-100 rounded-lg p-8">
            <div className="text-sm text-gray-600 mb-4">Trusted by 10,000+ companies</div>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {/* Company logos would go here */}
              <div className="w-24 h-8 bg-gray-300 rounded"></div>
              <div className="w-24 h-8 bg-gray-300 rounded"></div>
              <div className="w-24 h-8 bg-gray-300 rounded"></div>
              <div className="w-24 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you build, deploy, and scale your applications.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600">Choose the plan that works for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={\`relative \${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}\`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">\${plan.price}<span className="text-sm font-normal">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                <span className="text-xl font-bold">ProductName</span>
              </div>
              <p className="text-gray-400">
                Building the future of web development, one component at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProductName. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}`,
    dependencies: ['@/components/ui/button', '@/components/ui/card', '@/components/ui/badge', 'lucide-react']
  },
  {
    id: 'dashboard-template',
    name: 'Admin Dashboard',
    description: 'Complete admin dashboard with sidebar navigation, charts, tables, and user management',
    category: 'templates',
    tags: ['dashboard', 'admin', 'charts', 'tables', 'sidebar'],
    author: 'Dashboard Pro',
    downloads: 8932,
    likes: 1654,
    rating: 4.8,
    framework: 'react',
    featured: true,
    thumbnail: '/templates/admin-dashboard.jpg',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-05'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Menu,
  Home,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { title: 'Total Users', value: '12,456', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Revenue', value: '$45,231', change: '+8%', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Orders', value: '1,234', change: '+23%', icon: ShoppingCart, color: 'text-purple-600' },
    { title: 'Growth', value: '+12.5%', change: '+3%', icon: BarChart3, color: 'text-orange-600' }
  ];

  const recentOrders = [
    { id: '#3024', customer: 'John Doe', amount: '$125.00', status: 'Completed' },
    { id: '#3023', customer: 'Jane Smith', amount: '$89.00', status: 'Pending' },
    { id: '#3022', customer: 'Bob Johnson', amount: '$156.00', status: 'Completed' },
    { id: '#3021', customer: 'Alice Brown', amount: '$67.00', status: 'Cancelled' }
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Users' },
    { icon: ShoppingCart, label: 'Orders' },
    { icon: FileText, label: 'Reports' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={\`bg-white shadow-lg transition-all duration-300 \${sidebarOpen ? 'w-64' : 'w-16'}\`}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          </div>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={\`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 \${
                item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }\`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
          <div className="mt-auto p-4">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span>Logout</span>}
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={\`p-3 rounded-full bg-gray-100 \${stat.color}\`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {stat.change} from last month
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chart would be rendered here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <Badge 
                          variant={
                            order.status === 'Completed' ? 'default' :
                            order.status === 'Pending' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}`,
    dependencies: ['@/components/ui/button', '@/components/ui/card', '@/components/ui/badge', '@/components/ui/avatar', 'lucide-react']
  },
  {
    id: 'ecommerce-product-card',
    name: 'E-commerce Product Card',
    description: 'Product card template perfect for online stores with image, pricing, and add to cart functionality',
    category: 'templates',
    tags: ['ecommerce', 'product', 'card', 'shopping'],
    author: 'E-commerce Team',
    downloads: 6543,
    likes: 987,
    rating: 4.7,
    framework: 'react',
    new: true,
    thumbnail: '/templates/ecommerce-card.jpg',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-15'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

export default function EcommerceProductCard() {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const product = {
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1250,
    image: '/placeholder-product.jpg',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    features: ['Noise Cancellation', 'Wireless', '30hr Battery', 'Premium Sound'],
    inStock: true
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-sm mx-auto bg-white">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover bg-gray-100"
          />
          <Button
            variant="ghost"
            size="sm"
            className={\`absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white \${isLiked ? 'text-red-500' : 'text-gray-400'}\`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={\`h-4 w-4 \${isLiked ? 'fill-current' : ''}\`} />
          </Button>
          {product.originalPrice > product.price && (
            <Badge className="absolute top-3 left-3 bg-red-500">
              Save \${(product.originalPrice - product.price).toFixed(0)}
            </Badge>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={\`h-3 w-3 \${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}\`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <CardDescription className="text-sm">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                \${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  \${product.originalPrice}
                </span>
              )}
            </div>
            <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddedToCart}
          >
            {isAddedToCart ? (
              'Added to Cart!'
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`,
    dependencies: ['@/components/ui/button', '@/components/ui/card', '@/components/ui/badge', 'lucide-react']
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Complete contact form with validation and modern design',
    category: 'templates',
    tags: ['contact', 'form', 'validation', 'ui'],
    author: 'Form Team',
    downloads: 4321,
    likes: 654,
    rating: 4.6,
    framework: 'react',
    thumbnail: '/templates/contact-form.jpg',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@company.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: MapPin, label: 'Address', value: '123 Business St, City, State 12345' }
  ];

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your message has been sent successfully. We'll get back to you soon.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Get In Touch</h1>
        <p className="text-gray-600">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <info.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">{info.label}</div>
                <div className="text-sm text-gray-600">{info.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'border-red-500' : ''}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,
    dependencies: ['@/components/ui/button', '@/components/ui/card', '@/components/ui/input', '@/components/ui/label', '@/components/ui/textarea', '@/components/ui/alert', 'lucide-react']
  }
];

export function TemplateLibrary({ onTemplateSelect }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [installingTemplate, setInstallingTemplate] = useState<string | null>(null);

  const {
    files,
    setFiles,
    addOpenFile,
    setActiveFile
  } = useWorkspaceStore();

  const handleTemplateInstall = async (template: StoreItem) => {
    try {
      setInstallingTemplate(template.id);

      const fileName = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.tsx`;
      const fileId = `template-${Date.now()}`;

      // Create template file with proper structure
      const templateCode = template.code.includes('export default')
        ? template.code
        : `${template.code}\n\nexport default ${template.name.replace(/\s+/g, '')};`;

      const newFile = {
        id: fileId,
        name: fileName,
        type: "file" as const,
        content: templateCode,
        language: 'typescript',
        isDirty: false,
        parent: undefined,
        lastModified: Date.now(),
      };

      // Add to root level for templates
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);

      // Auto-open the template file
      addOpenFile(newFile);
      setActiveFile(fileId);

      toast({
        title: "Template installed",
        description: `${template.name} template has been added to your project`,
        variant: "default"
      });

    } catch (error) {
      console.error('Failed to install template:', error);
      toast({
        title: "Installation failed",
        description: "Failed to install template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setInstallingTemplate(null);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.tags.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {templateCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="p-0">
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layout className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => onTemplateSelect(template)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.featured && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                      Featured
                    </Badge>
                  )}
                  {template.new && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="mb-3">
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{template.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
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
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {template.downloads}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                </span>
                <span className="text-xs">{template.author}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onTemplateSelect(template)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateInstall(template);
                  }}
                  disabled={installingTemplate === template.id}
                >
                  {installingTemplate === template.id ? (
                    <>
                      <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      Use Template
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
