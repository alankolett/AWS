import React from 'react';
import { UpcomingEvents } from '@/components/features/UpcomingEvents';

export default function EventsPage() {
  return (
    <div className="flex flex-col w-full">
      <UpcomingEvents />
    </div>
  );
}
