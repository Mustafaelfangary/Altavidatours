'use client';

import { ReactNode, forwardRef } from 'react';
import { useScrollAnimation, useParallax } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ 
    children, 
    className, 
    animation = 'fade-in',
    delay = 0,
    duration = 600,
    threshold = 0.1,
    triggerOnce = true,
    ...props 
  }, forwardedRef) => {
    const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

    const animationClasses = {
      'fade-in': 'animate-fade-in',
      'slide-up': 'animate-slide-up',
      'slide-in-left': 'animate-slide-in-left',
      'slide-in-right': 'animate-slide-in-right',
      'scale-in': 'animate-scale-in',
    };

    // Ensure both internal observer ref and any forwarded ref are set
    const setRefs = (node: HTMLDivElement | null) => {
      // Attach to internal ref used by IntersectionObserver
      // @ts-ignore - ref is created as HTMLElement
      ref.current = node as any;
      // Attach to forwarded ref if provided
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef && 'current' in forwardedRef) {
        // @ts-ignore - forwardedRef may be mutable ref
        forwardedRef.current = node;
      }
    };

    return (
      <div
        ref={setRefs}
        className={cn(
          'transition-all duration-300',
          isVisible ? animationClasses[animation] : 'opacity-0',
          className
        )}
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedSection.displayName = 'AnimatedSection';

interface StaggeredAnimationProps {
  children: ReactNode[];
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  staggerDelay?: number;
  threshold?: number;
}

export function StaggeredAnimation({
  children,
  className,
  animation = 'slide-up',
  staggerDelay = 100,
  threshold = 0.1,
}: StaggeredAnimationProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <AnimatedSection
          key={index}
          animation={animation}
          delay={isVisible ? index * staggerDelay : 0}
          triggerOnce={true}
        >
          {child}
        </AnimatedSection>
      ))}
    </div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function FloatingElement({ children, className, intensity = 1 }: FloatingElementProps) {
  return (
    <div 
      className={cn('floating', className)}
      style={{
        animationDuration: `${6 / intensity}s`,
      }}
    >
      {children}
    </div>
  );
}

interface ParallaxElementProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxElement({ children, className, speed = 0.5 }: ParallaxElementProps) {
  const { ref, offset } = useParallax(speed);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  );
}
