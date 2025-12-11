import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-white rounded-lg shadow", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("p-6 space-y-1.5", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("p-6 pt-0 flex items-center", className)}
      {...props}
    />
  );
}


