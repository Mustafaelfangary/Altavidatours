'use client';

import { useEffect, useState } from 'react';
import { ItineraryDay } from '@prisma/client';
import { toast } from 'sonner';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ItineraryDayForm from './ItineraryDayForm';

export default function ItineraryDayManager({ itineraryId }: { itineraryId: string }) {
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await fetch(`/api/dashboard/itineraries/${itineraryId}/days`);
        if (!response.ok) throw new Error('Failed to fetch itinerary days.');
        const data = await response.json();
        setDays(data);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchDays();
  }, [itineraryId]);

  const handleAddDay = async () => {
    try {
      const response = await fetch(`/api/dashboard/itineraries/${itineraryId}/days`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: days.length + 1,
          title: 'New Day',
          description: 'Description for the new day.',
        }),
      });
      if (!response.ok) throw new Error('Failed to add day.');
      const newDay = await response.json();
      setDays([...days, newDay]);
      toast.success('Itinerary day added successfully.');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteDay = async (dayId: string) => {
    const originalDays = [...days];
    setDays(days.filter((d) => d.id !== dayId));

    try {
      const response = await fetch(
        `/api/dashboard/itineraries/${itineraryId}/days/${dayId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        setDays(originalDays);
        throw new Error('Failed to delete day.');
      }
      toast.success('Itinerary day deleted.');
    } catch (error) {
      setDays(originalDays);
      toast.error((error as Error).message);
    }
  };

  const handleSaveDay = async (dayId: string, data: { dayNumber: number; title: string; description: string; }) => {
     try {
      const response = await fetch(`/api/dashboard/itineraries/${itineraryId}/days/${dayId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save day.');
      const updatedDay = await response.json();
      setDays(days.map(d => d.id === dayId ? updatedDay : d));
      toast.success('Itinerary day saved successfully.');
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedDays = Array.from(days);
    const [removed] = reorderedDays.splice(result.source.index, 1);
    reorderedDays.splice(result.destination.index, 0, removed);

    setDays(reorderedDays);

    const dayIds = reorderedDays.map((day) => day.id);

    try {
      const response = await fetch(`/api/dashboard/itineraries/${itineraryId}/days`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayIds }),
      });

      if (!response.ok) {
        setDays(days);
        throw new Error('Failed to reorder days.');
      }
      toast.success('Itinerary days reordered.');
    } catch (error) {
      setDays(days);
      toast.error((error as Error).message);
    }
  };

  if (loading) return <p>Loading itinerary days...</p>;

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={handleAddDay}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Day
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="days">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {days.map((day, index) => (
                <Draggable key={day.id} draggableId={day.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4 p-4 border rounded-lg"
                    >
                      <ItineraryDayForm day={day} onSave={(data) => handleSaveDay(day.id, data)} />
                       <Button variant="destructive" size="sm" onClick={() => handleDeleteDay(day.id)} className="mt-2">
                        Delete
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

