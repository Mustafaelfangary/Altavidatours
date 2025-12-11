import { Metadata } from 'next';
import DailyToursSettingsClient from './DailyToursSettingsClient';

export const metadata: Metadata = {
  title: 'Daily Tours Settings | Admin Dashboard',
  description: 'Manage daily tours page content',
};

export default function DailyToursSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nile-blue">Daily Tours Page Settings</h1>
        <p className="text-ancient-stone mt-1">
          Manage the content displayed on the Daily Tours page
        </p>
      </div>
      <DailyToursSettingsClient />
    </div>
  );
}



