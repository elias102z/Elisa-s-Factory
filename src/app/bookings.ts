import { EventInput } from '@fullcalendar/core';

// ✅ Blocked slots that cannot be booked
export const BLOCKED_SLOTS: EventInput[] = [
  { 
    title: 'Blocked', 
    start: '2024-03-13T12:00:00', 
    backgroundColor: '#ff4d4d', 
    borderColor: '#ff4d4d', 
    className: ['blocked-slot'] 
  },
  { 
    title: 'Blocked', 
    start: '2024-03-14T14:00:00', 
    backgroundColor: '#ff4d4d', 
    borderColor: '#ff4d4d', 
    className: ['blocked-slot'] 
  }
];

