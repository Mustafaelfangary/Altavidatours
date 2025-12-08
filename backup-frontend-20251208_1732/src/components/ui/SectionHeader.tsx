import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  alignment = 'center',
  className
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div className={cn('mb-8 md:mb-12', alignmentClasses[alignment], className)}>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-travelok-blue-dark mb-3 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg md:text-xl text-travelok-gray max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;