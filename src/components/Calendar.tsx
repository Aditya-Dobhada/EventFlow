import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EventDialog } from "./EventDialog";
import { EventList } from "./EventList";
import { CalendarDay, Event } from "@/types";
import { getMonthDays, formatDate } from "@/lib/calendar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useLocalStorage<Event[]>("events", []);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);

  const calendarDays = getMonthDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  calendarDays.forEach((day) => {
    day.events = events.filter((event) => event.date === formatDate(day.date));
  });

  const filteredDays = calendarDays.map((day) => ({
    ...day,
    events: day.events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setEditingEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (
    e: React.MouseEvent,
    event: Event,
    day: CalendarDay
  ) => {
    e.stopPropagation();
    setSelectedDate(day.date);
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents([...events, event]);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleExportEvents = () => {
    const monthEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const blob = new Blob([JSON.stringify(monthEvents, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `events-${currentDate.toISOString().slice(0, 7)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDragStart = (e: React.DragEvent, event: Event) => {
    e.stopPropagation();
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDay: CalendarDay) => {
    e.preventDefault();
    if (!draggedEvent) return;

    const updatedEvent = {
      ...draggedEvent,
      date: formatDate(targetDay.date),
    };

    setEvents(events.map((e) => (e.id === draggedEvent.id ? updatedEvent : e)));
    setDraggedEvent(null);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <CalendarIcon className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <p className="text-sm text-muted-foreground">
              {
                events.filter((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    eventDate.getMonth() == currentDate.getMonth() &&
                    eventDate.getFullYear() == currentDate.getFullYear()
                  );
                }).length
              }{" "}
              events this month
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[250px]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              className="shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <EventList events={events} />
            <Button
              variant="outline"
              onClick={handleExportEvents}
              className="flex items-center gap-2 shrink-0"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden shadow-sm">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="bg-card p-3 text-center font-medium text-sm text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {filteredDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "bg-card p-2 min-h-[120px] transition-colors hover:bg-accent/50 cursor-pointer border-t",
              !day.isCurrentMonth && "opacity-50 hover:opacity-70",
              day.isToday && "ring-2 ring-primary ring-inset"
            )}
            onClick={() => handleDayClick(day)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, day)}
          >
            <div className="font-medium text-sm mb-1">{day.date.getDate()}</div>
            <div className="space-y-1">
              {day.events.map((event) => (
                <Badge
                  key={event.id}
                  variant="secondary"
                  className={cn(
                    "w-full justify-start text-left font-normal text-xs truncate hover:bg-accent/80",
                    event.color === "work" &&
                      "bg-blue-50 text-blue-700 hover:bg-blue-100",
                    event.color === "personal" &&
                      "bg-green-50 text-green-700 hover:bg-green-100",
                    event.color === "other" &&
                      "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                  onClick={(e) => handleEventClick(e, event, day)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event)}
                >
                  {event.startTime.slice(0, 5)} - {event.title}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDate && (
        <EventDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          selectedDate={selectedDate}
          existingEvents={events}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}
