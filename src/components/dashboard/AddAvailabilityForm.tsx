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
import { Plus, X, Clock } from "lucide-react";
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

      // Create a single slot with the exact duration specified by the admin
      const slot = {
        date: newSlot.date,
        time_start: newSlot.time_start + ":00", // Add seconds for HH:mm:ss format
        time_end: newSlot.time_end + ":00",
        is_booked: false,
      };

      const supabase = createClient();
      const { error } = await supabase.from("availabilities").insert([slot]);

      if (error) throw error;

      // Reset form and call success callback
      setNewSlot({ date: "", time_start: "", time_end: "" });
      setError(null);
      alert("Successfully created availability slot!");
      onSuccess();
    } catch (err) {
      console.error("Error adding availability:", err);
      setError("Failed to add availability slot");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate duration of the slot in hours and minutes
  const calculateDuration = () => {
    if (!newSlot.time_start || !newSlot.time_end) return null;

    const startTime = new Date(`2000-01-01T${newSlot.time_start}`);
    const endTime = new Date(`2000-01-01T${newSlot.time_end}`);

    if (startTime >= endTime) return null;

    const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
  };

  const duration = calculateDuration();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Add New Availability Slot</CardTitle>
            <CardDescription>
              Create a custom appointment slot with your preferred duration.
              You have full control over the start and end times.
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
              placeholder="e.g., 14:30"
            />
          </div>
        </div>

        {/* Duration Preview */}
        {duration && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <Clock className="w-4 h-4" />
              <span>
                <strong>Slot Duration:</strong> {duration}
              </span>
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> You can create slots of any duration - 15 minutes, 1 hour, 2.5 hours, or whatever works best for your services.
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={() => void addAvailability()}
            disabled={submitting || !newSlot.date || !newSlot.time_start || !newSlot.time_end}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            {submitting ? "Creating..." : "Create Availability Slot"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
