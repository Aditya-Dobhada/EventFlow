import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types";
import { useState, useEffect } from "react";
import { hasTimeOverlap } from "@/lib/calendar";
import { Clock, Calendar as CalendarIcon, Tag, Trash2 } from "lucide-react";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  selectedDate: Date;
  existingEvents: Event[];
  editingEvent?: Event;
}

export function EventDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  existingEvents,
  editingEvent,
}: EventDialogProps) {
  const [title, setTitle] = useState(editingEvent?.title ?? "");
  const [description, setDescription] = useState(
    editingEvent?.description ?? ""
  );
  const [startTime, setStartTime] = useState(
    editingEvent?.startTime ?? "09:00"
  );
  const [endTime, setEndTime] = useState(editingEvent?.endTime ?? "10:00");
  const [color, setColor] = useState(editingEvent?.color ?? "default");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(editingEvent?.title ?? "");
      setDescription(editingEvent?.description ?? "");
      setStartTime(editingEvent?.startTime ?? "09:00");
      setEndTime(editingEvent?.endTime ?? "10:00");
      setColor(editingEvent?.color ?? "default");
      setError("");
    }
  }, [isOpen, editingEvent]);

  const handleSave = () => {
    if (!title || !startTime || !endTime) {
      setError("Please fill in all required fields");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }

    const newEvent: Event = {
      id: editingEvent?.id ?? crypto.randomUUID(),
      title,
      description,
      startTime,
      endTime,
      date: selectedDate.toISOString().split("T")[0],
      color,
    };

    const hasOverlap = existingEvents
      .filter((event) => event.id !== newEvent.id)
      .some((event) => hasTimeOverlap(event, newEvent));

    if (hasOverlap) {
      setError("This time slot overlaps with an existing event");
      return;
    }

    onSave(newEvent);
    onClose();
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleDelete = () => {
    if (editingEvent && onDelete) {
      onDelete(editingEvent.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarIcon className="h-5 w-5" />
            {editingEvent ? "Edit Event" : "New Event"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category
            </Label>

            <Select
              value={color}
              // @ts-ignore
              onValueChange={(value) => setColor(value as Event["color"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem className="focus:bg-blue-100" value="work">
                  Work
                </SelectItem>
                <SelectItem className="focus:bg-green-100" value="personal">
                  Personal
                </SelectItem>
                <SelectItem className="focus:bg-purple-100" value="other">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event details..."
              className="h-24"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </p>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {editingEvent && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            {editingEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
