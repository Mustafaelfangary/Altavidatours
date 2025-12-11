import { NotificationList } from '@/components/dashboard/NotificationList';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationList />
    </div>
  );
}

