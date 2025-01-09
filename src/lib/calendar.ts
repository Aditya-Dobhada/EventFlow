import { CalendarDay, Event } from '@/types';

export function getMonthDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);  
  // Get the first day to display (including padding days from previous month)
  const firstDayToDisplay = new Date(firstDayOfMonth);
  firstDayToDisplay.setDate(firstDayToDisplay.getDate() - firstDayOfMonth.getDay());

  const days: CalendarDay[] = [];
  const today = new Date();
  
  // Generate 42 days (6 weeks) to ensure consistent calendar size
  for (let i = 0; i < 42; i++) {
    const date = new Date(firstDayToDisplay);
    date.setDate(date.getDate() + i);
    
    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      events: []
    });
  }

  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function hasTimeOverlap(event1: Event, event2: Event): boolean {
  const start1 = new Date(`${event1.date}T${event1.startTime}`);
  const end1 = new Date(`${event1.date}T${event1.endTime}`);
  const start2 = new Date(`${event2.date}T${event2.startTime}`);
  const end2 = new Date(`${event2.date}T${event2.endTime}`);

  return start1 < end2 && end1 > start2;
}