'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Notification } from '@prisma/client';

async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch('/api/dashboard/notifications?limit=5&unreadOnly=true');
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.notifications;
}

async function markAsRead(id: string) {
  await fetch(`/api/dashboard/notifications/${id}`, {
    method: 'PATCH',
  });
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications().then((data) => setNotifications(data ?? []));
    }
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          {(notifications?.length ?? 0) > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-semibold">Notifications</div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onSelect={() => handleNotificationClick(notification)}
            >
              <Link href="/dashboard/notifications" className="block w-full">
                <div className="text-sm font-medium">{notification.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuItem>
          <Link
            href="/dashboard/notifications"
            className="w-full text-center text-sm text-blue-500 hover:underline"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}