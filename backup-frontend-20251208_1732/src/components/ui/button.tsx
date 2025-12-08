import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

// Ripple effect type
interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

// Ripple effect component
const Ripple = ({ ripple }: { ripple: Ripple }) => (
  <motion.span
    className="absolute rounded-full bg-white/20"
    style={{
      left: ripple.x,
      top: ripple.y,
      width: ripple.size,
      height: ripple.size,
    }}
    initial={{ opacity: 1, scale: 0 }}
    animate={{ opacity: 0, scale: 4 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  />
)

const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none ring-offset-background overflow-hidden",
  {
    variants: {
      variant: {
        // Primary - Egyptian Blue with subtle hover lift and shadow
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg active:shadow-md",
        
        // Secondary - Gold with shimmer effect
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg active:shadow-md",
        
        // Outline - Subtle border with hover effect
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/5 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm",
        
        // Ghost - Subtle hover effect with scale
        ghost: "hover:bg-accent/10 hover:text-accent-foreground active:bg-accent/20 hover:scale-[1.02] active:scale-100",
        
        // Link - Text button with underline animation
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-dark",
        
        // Accent - Teal accent with pulse animation on hover
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg active:shadow-md hover:animate-pulse-slow",
        
        // Gradient - Primary to accent gradient with shine effect
        gradient: "bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg active:shadow-md",
        
        // Destructive - Red with shake animation on hover
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg active:shadow-md hover:animate-shake",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        default: "h-10 px-6 text-sm rounded-xl",
        lg: "h-12 px-8 text-base rounded-2xl",
        xl: "h-14 px-10 text-lg rounded-2xl font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        full: "rounded-full",
        lg: "rounded-xl",
        xl: "rounded-2xl",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },
      animation: {
        pulse: "animate-pulse-slow",
        bounce: "animate-bounce-slow",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      rounded: "lg",
      shadow: "md",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  rounded?: 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animation?: 'none' | 'pulse' | 'bounce'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      rounded,
      shadow,
      animation,
      children,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([])
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const Comp = asChild ? Slot : "button"

    // Handle ripple effect on click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e)
      }
      
      // Only create ripple for non-link buttons
      if (variant !== 'link' && !disabled) {
        const button = buttonRef.current
        if (button) {
          const rect = button.getBoundingClientRect()
          const size = Math.max(rect.width, rect.height)
          const x = e.clientX - rect.left - size / 2
          const y = e.clientY - rect.top - size / 2
          const newRipple = { id: Date.now(), x, y, size }
          
          setRipples((prev) => [...prev, newRipple])
          
          // Remove ripple after animation completes
          setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
          }, 800)
        }
      }
    }

    return (
      <Comp
        ref={(node) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
          buttonRef.current = node
        }}
        className={cn(
          buttonVariants({ variant, size, fullWidth, rounded, shadow, animation, className }),
          'relative overflow-hidden',
          (variant === 'gradient' || variant === 'secondary') && 'group'
        )}
        disabled={isLoading || disabled}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effect */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <Ripple key={ripple.id} ripple={ripple} />
          ))}
        </AnimatePresence>

        {/* Shimmer effect for gradient buttons */}
        {(variant === 'gradient' || variant === 'secondary') && (
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 via-white/50 to-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
        )}

        {/* Content */}
        <span className={cn(
          'relative z-10 flex items-center justify-center gap-2',
          (variant === 'gradient' || variant === 'secondary') && 'text-white'
        )}>
          {isLoading ? (
            <motion.span 
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.span>
          ) : leftIcon && (
            <motion.span 
              className="flex-shrink-0"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {leftIcon}
            </motion.span>
          )}

          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: isLoading ? 0 : 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {children}
          </motion.span>

          {rightIcon && !isLoading && (
            <motion.span 
              className="flex-shrink-0"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {rightIcon}
            </motion.span>
          )}
        </span>
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }