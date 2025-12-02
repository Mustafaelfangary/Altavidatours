import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none ring-offset-background transform hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      variant: {
        // Primary - Egyptian Blue
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-md hover:shadow-lg active:shadow-md",
        
        // Secondary - Gold
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-md hover:shadow-lg active:shadow-md",
        
        // Outline - Subtle border with hover effect
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 active:bg-primary/20",
        
        // Ghost - Subtle hover effect
        ghost: "hover:bg-accent/10 hover:text-accent-foreground active:bg-accent/20",
        
        // Link - Text button
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-dark",
        
        // Accent - Teal accent
        accent: "bg-accent text-accent-foreground hover:bg-accent-dark shadow-md hover:shadow-lg active:shadow-md",
        
        // Gradient - Primary to accent gradient
        gradient: "bg-gradient-to-r from-primary to-accent text-white hover:from-primary-dark hover:to-accent-dark shadow-md hover:shadow-lg active:shadow-md",
        
        // Destructive - Red for destructive actions
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg active:shadow-md",
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
    compoundVariants: [
      // Add pulse animation to gradient variant by default
      {
        variant: "gradient",
        animation: "pulse",
        className: "animate-pulse-slow",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "lg",
      shadow: "md",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Show loading spinner */
  isLoading?: boolean
  /** Show icon before children */
  leftIcon?: React.ReactNode
  /** Show icon after children */
  rightIcon?: React.ReactNode
  /** Make the button full width */
  fullWidth?: boolean
  /** Rounded corners */
  rounded?: 'lg' | 'xl' | 'full'
  /** Shadow size */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Animation type */
  animation?: 'none' | 'pulse' | 'bounce'
  /** Disabled state */
  disabled?: boolean
  /** Button content */
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    fullWidth,
    rounded,
    shadow,
    animation,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            rounded,
            shadow,
            animation,
            className,
          }),
          'relative overflow-hidden group',
          isLoading && 'pointer-events-none',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
          </span>
        )}
        <span 
          className={`inline-flex items-center justify-center gap-2 transition-all duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {leftIcon && <span className="text-lg">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="text-lg">{rightIcon}</span>}
        </span>
        
        {/* Ripple effect */}
        <span className="absolute inset-0 overflow-hidden">
          <span className="absolute top-1/2 left-1/2 w-0 h-0 bg-white/20 rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[500%] group-hover:opacity-100 transition-all duration-700 -translate-x-1/2 -translate-y-1/2" />
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
