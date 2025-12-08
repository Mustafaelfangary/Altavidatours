'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/useSettings';

interface Cruise {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export function CruiseManager() {
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Cruise Manager');
  const { get, loading } = useSettings();

  // Only use settings after component mounts (client-side only)
  useEffect(() => {
    if (!loading) {
      const cruiseTitle = get('cruise_manager_title', 'Cruise Manager');
      setTitle(cruiseTitle as string);
    }
  }, [get, loading]);

  const handleAddCruise = (cruise: Cruise) => {
    setCruises([...cruises, cruise]);
  };

  const handleUpdateCruise = (id: string, updatedCruise: Partial<Cruise>) => {
    setCruises(cruises.map(cruise => 
      cruise.id === id ? { ...cruise, ...updatedCruise } : cruise
    ));
  };

  const handleDeleteCruise = (id: string) => {
    setCruises(cruises.filter(cruise => cruise.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Cruise</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cruise</DialogTitle>
            </DialogHeader>
            {/* Add your cruise form here */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {cruises.map(cruise => (
          <div key={cruise.id} className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold">{cruise.name}</h3>
            <p className="text-gray-600">{cruise.description}</p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={() => handleUpdateCruise(cruise.id, {})}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteCruise(cruise.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 