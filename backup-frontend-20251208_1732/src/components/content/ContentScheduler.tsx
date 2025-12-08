import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ContentSchedulerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
}

export function ContentScheduler({ value, onChange }: ContentSchedulerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>Schedule publish date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(date) => {
            onChange(date || null);
            setOpen(false);
          }}
          initialFocus
        />
        <div className="p-3 border-t flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Remove schedule
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
