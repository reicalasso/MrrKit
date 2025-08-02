'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles } from 'lucide-react';
import { AIPanel } from './ai-panel';

export function AITrigger() {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="h-9 gap-2 relative bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300"
        title="AI Assistant (Ctrl+Shift+A)"
      >
        <Bot className="h-4 w-4 text-indigo-600" />
        <span className="text-indigo-700 font-medium text-sm hidden sm:inline">AI Copilot</span>
        
        {/* Animated indicator */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
        
        {/* Sparkle effect */}
        <Sparkles className="h-3 w-3 text-purple-500 absolute -top-0.5 -left-0.5 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </Button>

      {/* Sidebar Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* AI Panel - slides in from right */}
          <div className="h-full transform transition-transform duration-300 ease-out">
            <AIPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
