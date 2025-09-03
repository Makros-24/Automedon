import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/components/ui/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'dots';
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

export function Loading({ 
  className, 
  size = 'md', 
  variant = 'spinner', 
  text 
}: LoadingProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <motion.div
          className={cn(
            "border-2 border-current border-t-transparent rounded-full animate-spin",
            sizeClasses[size]
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <motion.div
          className={cn(
            "bg-current rounded-full",
            sizeClasses[size]
          )}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "bg-current rounded-full",
                size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
              )}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// Skeleton loading components for better UX
export function SkeletonText({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "bg-muted rounded h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-lg p-6 space-y-4", className)}>
      <motion.div
        className="bg-muted rounded h-48 w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="space-y-2">
        <motion.div
          className="bg-muted rounded h-6 w-3/4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
        />
        <motion.div
          className="bg-muted rounded h-4 w-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
        />
        <motion.div
          className="bg-muted rounded h-4 w-2/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export function SkeletonGrid({ 
  className, 
  columns = 3, 
  rows = 2 
}: { 
  className?: string; 
  columns?: number; 
  rows?: number; 
}) {
  return (
    <div className={cn("grid gap-6", `grid-cols-1 md:grid-cols-${columns}`, className)}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}