'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'white'
}

export function LoadingSpinner({ size = 'md', className, color = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-400',
    white: 'text-white'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
  color?: 'primary' | 'secondary' | 'white'
}

export function LoadingDots({ className, color = 'primary' }: LoadingDotsProps) {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-400',
    white: 'bg-white'
  }

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  )
}

interface LoadingBarProps {
  progress?: number
  className?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  animated?: boolean
}

export function LoadingBar({ 
  progress, 
  className, 
  color = 'primary', 
  animated = false 
}: LoadingBarProps) {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-400',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  }

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2 overflow-hidden', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300 ease-in-out',
          colorClasses[color],
          animated && 'animate-pulse'
        )}
        style={{
          width: progress !== undefined ? `${Math.min(100, Math.max(0, progress))}%` : '100%',
          transform: progress === undefined ? 'translateX(-100%)' : undefined,
          animation: progress === undefined ? 'loading-bar 2s ease-in-out infinite' : undefined
        }}
      />
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  className?: string
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  message = 'Loading...', 
  className,
  spinnerSize = 'lg'
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size={spinnerSize} />
            <p className="text-sm font-medium text-gray-700">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
  lines?: number
}

export function Skeleton({ 
  className, 
  variant = 'rectangular', 
  animation = 'pulse',
  lines = 1 
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'bg-gray-200 h-4 rounded',
              animationClasses[animation],
              i === lines - 1 && 'w-3/4', // Last line is shorter
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-gray-200',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  )
}

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  fallback, 
  errorFallback,
  ...props 
}: LazyImageProps) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  if (error && errorFallback) {
    return <>{errorFallback}</>
  }

  return (
    <div className="relative">
      {loading && (
        <div className={cn('absolute inset-0 flex items-center justify-center', className)}>
          {fallback || <Skeleton className="w-full h-full" />}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

// Component for smooth height transitions
interface AnimatedHeightProps {
  children: React.ReactNode
  isOpen: boolean
  className?: string
  duration?: number
}

export function AnimatedHeight({ 
  children, 
  isOpen, 
  className, 
  duration = 300 
}: AnimatedHeightProps) {
  const [height, setHeight] = React.useState<number | 'auto'>(0)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight)
        // Set to auto after animation completes for responsive behavior
        setTimeout(() => setHeight('auto'), duration)
      } else {
        setHeight(contentRef.current.scrollHeight)
        // Force reflow
        contentRef.current.offsetHeight
        setHeight(0)
      }
    }
  }, [isOpen, duration])

  return (
    <div
      className={cn('overflow-hidden transition-all ease-in-out', className)}
      style={{
        height: height,
        transitionDuration: `${duration}ms`
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
