'use client';

import { useState, useEffect } from 'react';
import { Notification } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

async function fetchNotifications(page: number): Promise<{ notifications: Notification[], total: number, pages: number }> {
  const response = await fetch(`/api/dashboard/notifications?page=${page}&limit=10`);
  if (!response.ok) {
    return { notifications: [], total: 0, pages: 0 };
  }
  return response.json();
}

async function deleteNotification(id: string) {
  await fetch(`/api/dashboard/notifications/${id}`, {
    method: 'DELETE',
  });
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotifications(page).then(({ notifications, pages }) => {
      setNotifications(notifications ?? []);
      setTotalPages(pages ?? 1);
    });
  }, [page]);

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {(notifications ?? []).map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between p-4 rounded-lg ${
            notification.read ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <div>
            <p className="font-medium">{notification.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(notification.id)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      ))}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? 'primary' : 'outline'}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );
}

