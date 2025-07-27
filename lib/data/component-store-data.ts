import { StoreItem } from '@/components/component-store/component-store-panel';

export const componentStoreData: StoreItem[] = [
  // UI Components
  {
    id: 'modern-button',
    name: 'Modern Button',
    description: 'Sleek button component with hover effects and multiple variants',
    category: 'components',
    tags: ['button', 'ui', 'interactive', 'modern'],
    author: 'UI Team',
    authorAvatar: '/avatars/ui-team.jpg',
    downloads: 5432,
    likes: 892,
    rating: 4.8,
    framework: 'react',
    featured: true,
    thumbnail: '/components/modern-button.jpg',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ModernButton({ 
  children, 
  variant = 'default', 
  size = 'default',
  className,
  ...props 
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:scale-105 hover:shadow-lg',
        'active:scale-95',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:translate-x-[-100%] hover:before:translate-x-[100%]',
        'before:transition-transform before:duration-700',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}`,
    dependencies: ['@/components/ui/button', '@/lib/utils']
  },
  {
    id: 'glass-card',
    name: 'Glass Card',
    description: 'Beautiful glassmorphism card component with backdrop blur effects',
    category: 'components',
    tags: ['card', 'glassmorphism', 'backdrop', 'modern'],
    author: 'Design Studio',
    downloads: 3241,
    likes: 567,
    rating: 4.7,
    framework: 'react',
    new: true,
    thumbnail: '/components/glass-card.jpg',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-10'),
    preview: '',
    code: `import { cn } from '@/lib/utils';

export function GlassCard({ 
  children, 
  className,
  ...props 
}) {
  return (
    <div
      className={cn(
        'backdrop-blur-lg bg-white/10 border border-white/20',
        'rounded-xl shadow-xl',
        'hover:bg-white/20 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}`,
    dependencies: ['@/lib/utils']
  },
  {
    id: 'animated-counter',
    name: 'Animated Counter',
    description: 'Smooth counting animation component for displaying numbers',
    category: 'components',
    tags: ['animation', 'counter', 'numbers', 'statistics'],
    author: 'Animation Team',
    downloads: 2156,
    likes: 324,
    rating: 4.6,
    framework: 'react',
    thumbnail: '/components/animated-counter.jpg',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-08'),
    preview: '',
    code: `import { useEffect, useState } from 'react';

export function AnimatedCounter({ 
  end, 
  duration = 2000,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}`,
    dependencies: []
  },
  {
    id: 'progress-ring',
    name: 'Progress Ring',
    description: 'Circular progress indicator with customizable colors and animations',
    category: 'components',
    tags: ['progress', 'circular', 'indicator', 'animation'],
    author: 'Component Lab',
    downloads: 1879,
    likes: 298,
    rating: 4.5,
    framework: 'react',
    thumbnail: '/components/progress-ring.jpg',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-12'),
    preview: '',
    code: `export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB'
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute text-xl font-bold">
        {Math.round(progress)}%
      </div>
    </div>
  );
}`,
    dependencies: []
  },
  {
    id: 'floating-label-input',
    name: 'Floating Label Input',
    description: 'Modern input field with animated floating label effect',
    category: 'components',
    tags: ['input', 'form', 'floating', 'label', 'animation'],
    author: 'Form Team',
    downloads: 4321,
    likes: 678,
    rating: 4.9,
    framework: 'react',
    featured: true,
    thumbnail: '/components/floating-input.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-05'),
    preview: '',
    code: `import { useState } from 'react';
import { cn } from '@/lib/utils';

export function FloatingLabelInput({ 
  label, 
  type = 'text',
  className,
  ...props 
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          'w-full px-3 pt-6 pb-2 border border-gray-300 rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200',
          className
        )}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(e.target.value !== '');
        }}
        onChange={(e) => setHasValue(e.target.value !== '')}
        {...props}
      />
      <label
        className={cn(
          'absolute left-3 transition-all duration-200 pointer-events-none',
          focused || hasValue
            ? 'top-1 text-xs text-blue-500'
            : 'top-4 text-gray-500'
        )}
      >
        {label}
      </label>
    </div>
  );
}`,
    dependencies: ['@/lib/utils']
  },
  {
    id: 'toast-notification',
    name: 'Toast Notification',
    description: 'Customizable toast notification system with multiple variants',
    category: 'components',
    tags: ['toast', 'notification', 'alert', 'message'],
    author: 'Notification Team',
    downloads: 6789,
    likes: 1023,
    rating: 4.8,
    framework: 'react',
    featured: true,
    thumbnail: '/components/toast.jpg',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-03'),
    preview: '',
    code: `import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

export function Toast({ 
  variant = 'info',
  title,
  message,
  duration = 5000,
  onClose
}) {
  const [visible, setVisible] = useState(true);
  const Icon = icons[variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed top-4 right-4 max-w-sm w-full',
        'transform transition-all duration-300 ease-in-out',
        visible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      )}
    >
      <div
        className={cn(
          'rounded-lg shadow-lg p-4 border-l-4',
          {
            'bg-green-50 border-green-500': variant === 'success',
            'bg-red-50 border-red-500': variant === 'error',
            'bg-yellow-50 border-yellow-500': variant === 'warning',
            'bg-blue-50 border-blue-500': variant === 'info'
          }
        )}
      >
        <div className="flex items-start">
          <Icon 
            className={cn(
              'h-5 w-5 mt-0.5 mr-3',
              {
                'text-green-500': variant === 'success',
                'text-red-500': variant === 'error',
                'text-yellow-500': variant === 'warning',
                'text-blue-500': variant === 'info'
              }
            )}
          />
          <div className="flex-1">
            {title && (
              <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
            )}
            <p className="text-sm text-gray-700">{message}</p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}`,
    dependencies: ['lucide-react', '@/lib/utils']
  },
  // Layout Components
  {
    id: 'hero-section',
    name: 'Hero Section',
    description: 'Modern hero section with gradient background and call-to-action',
    category: 'layouts',
    tags: ['hero', 'landing', 'gradient', 'cta'],
    author: 'Layout Team',
    downloads: 8934,
    likes: 1456,
    rating: 4.9,
    framework: 'react',
    featured: true,
    thumbnail: '/layouts/hero-section.jpg',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-01'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Build Amazing
          <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Digital Experiences
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          Create stunning websites and applications with our cutting-edge tools and beautiful components.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
    </section>
  );
}`,
    dependencies: ['@/components/ui/button', 'lucide-react']
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    description: 'Responsive grid layout for showcasing product features',
    category: 'layouts',
    tags: ['features', 'grid', 'showcase', 'responsive'],
    author: 'Layout Team',
    downloads: 5671,
    likes: 892,
    rating: 4.7,
    framework: 'react',
    thumbnail: '/layouts/feature-grid.jpg',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-10'),
    preview: '',
    code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Globe, Users, Smartphone, BarChart } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with cutting-edge technology and best practices.'
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'Built-in security features to protect your data and users.'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Deploy worldwide with our global CDN and infrastructure.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time collaboration tools.'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Responsive design that works perfectly on all devices.'
  },
  {
    icon: BarChart,
    title: 'Analytics',
    description: 'Detailed insights and analytics to track your success.'
  }
];

export function FeatureGrid() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Powerful features designed to help you build better products faster.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
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
  );
}`,
    dependencies: ['@/components/ui/card', 'lucide-react']
  },
  // Page Templates
  {
    id: 'pricing-page',
    name: 'Pricing Page',
    description: 'Complete pricing page with multiple plans and feature comparison',
    category: 'pages',
    tags: ['pricing', 'plans', 'billing', 'subscription'],
    author: 'Template Team',
    downloads: 3456,
    likes: 567,
    rating: 4.8,
    framework: 'react',
    new: true,
    thumbnail: '/pages/pricing.jpg',
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-14'),
    preview: '',
    code: `import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      { name: '5 Projects', included: true },
      { name: '1GB Storage', included: true },
      { name: 'Basic Support', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Custom Domain', included: false },
      { name: 'Team Collaboration', included: false }
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: 29,
    period: 'month',
    description: 'For growing businesses',
    features: [
      { name: 'Unlimited Projects', included: true },
      { name: '100GB Storage', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Domain', included: true },
      { name: 'Team Collaboration', included: false }
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For large organizations',
    features: [
      { name: 'Unlimited Projects', included: true },
      { name: 'Unlimited Storage', included: true },
      { name: '24/7 Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Domain', included: true },
      { name: 'Team Collaboration', included: true }
    ],
    popular: false
  }
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the plan that's right for you. Always know what you'll pay.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={\`relative \${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}\`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">\${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <span className={\`\${feature.included ? 'text-gray-900' : 'text-gray-400'}\`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={\`w-full \${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}\`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <Button variant="link">Contact us for custom enterprise solutions →</Button>
        </div>
      </div>
    </div>
  );
}`,
    dependencies: ['@/components/ui/button', '@/components/ui/card', '@/components/ui/badge', 'lucide-react']
  }
];
