"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/browser-client";

interface NewSlot {
  date: string;
  time_start: string;
  time_end: string;
}

interface AddAvailabilityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddAvailabilityForm({
  onSuccess,
  onCancel,
}: AddAvailabilityFormProps) {
  const [newSlot, setNewSlot] = useState<NewSlot>({
    date: "",
    time_start: "",
    time_end: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayDate = new Date().toISOString().split("T")[0];

  const addAvailability = async () => {
    if (!newSlot.date || !newSlot.time_start || !newSlot.time_end) {
      setError("Please fill in all fields");
      return;
    }

    // Validate time range
    const startTime = new Date(`2000-01-01T${newSlot.time_start}`);
    const endTime = new Date(`2000-01-01T${newSlot.time_end}`);

    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Generate 30-minute slots
      const slots = [];
      const slotDuration = 30; // minutes
      let currentTime = new Date(startTime);

      while (currentTime < endTime) {
        const slotStart = new Date(currentTime);
        const slotEnd = new Date(
          currentTime.getTime() + slotDuration * 60 * 1000,
        );

        // Don't create a slot if it would go beyond the end time
        if (slotEnd > endTime) {
          break;
        }

        slots.push({
          date: newSlot.date,
          time_start: slotStart.toTimeString().slice(0, 8), // HH:mm:ss format
          time_end: slotEnd.toTimeString().slice(0, 8),
          is_booked: false,
        });

        currentTime = slotEnd;
      }

      if (slots.length === 0) {
        setError("Time range is too short to create any 30-minute slots");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.from("availabilities").insert(slots);

      if (error) throw error;

      // Reset form and call success callback
      setNewSlot({ date: "", time_start: "", time_end: "" });
      setError(null);
      alert(
        `Successfully created ${slots.length} appointment slots of 30 minutes each!`,
      );
      onSuccess();
    } catch (err) {
      console.error("Error adding availability:", err);
      setError("Failed to add availability slots");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate how many slots will be created
  const calculateSlots = () => {
    if (!newSlot.time_start || !newSlot.time_end) return 0;

    const startTime = new Date(`2000-01-01T${newSlot.time_start}`);
    const endTime = new Date(`2000-01-01T${newSlot.time_end}`);

    if (startTime >= endTime) return 0;

    const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return Math.floor(diffMinutes / 30);
  };

  const slotsToCreate = calculateSlots();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Add New Availability Slots</CardTitle>
            <CardDescription>
              Define a time range and we&apos;ll automatically create 30-minute
              appointment slots. For example: 12:00 to 16:00 will create 8 slots
              of 30 minutes each.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              min={todayDate}
              value={newSlot.date}
              onChange={(e) =>
                setNewSlot((prev) => ({ ...prev, date: e.target.value }))
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="time_start">Start Time</Label>
            <Input
              id="time_start"
              type="time"
              value={newSlot.time_start}
              onChange={(e) =>
                setNewSlot((prev) => ({ ...prev, time_start: e.target.value }))
              }
              className="mt-1"
              placeholder="e.g., 12:00"
            />
          </div>

          <div>
            <Label htmlFor="time_end">End Time</Label>
            <Input
              id="time_end"
              type="time"
              value={newSlot.time_end}
              onChange={(e) =>
                setNewSlot((prev) => ({ ...prev, time_end: e.target.value }))
              }
              className="mt-1"
              placeholder="e.g., 16:00"
            />
          </div>
        </div>

        {slotsToCreate > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> This will create {slotsToCreate}{" "}
              appointment slots of 30 minutes each.
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => void addAvailability()}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {submitting ? "Creating Slots..." : "Create Slots"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
