import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Event } from "@/types";
import { ListFilter } from "lucide-react";
import { Badge } from "./ui/badge";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ListFilter className="h-4 w-4" />
          View All Events
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>All Events</SheetTitle>
          <SheetDescription>
            View and manage all your scheduled events
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          {sortedEvents.length === 0 ? (
            <p className="text-center text-muted-foreground">No events scheduled</p>
          ) : (
            sortedEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      event.color === "work"
                        ? "bg-blue-50 text-blue-700"
                        : event.color === "personal"
                        ? "bg-green-50 text-green-700"
                        : event.color === "other"
                        ? "bg-purple-50 text-purple-700"
                        : ""
                    }
                  >
                    {event.color || "default"}
                  </Badge>
                </div>
                <div className="text-sm">
                  <p>
                    {event.startTime} - {event.endTime}
                  </p>
                  {event.description && (
                    <p className="mt-2 text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}