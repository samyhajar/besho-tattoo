"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  createGoogleMeetForAppointment,
  deleteGoogleMeetForAppointment,
} from "@/services/appointments";

interface GoogleMeetButtonProps {
  appointmentId: string;
  existingMeetLink?: string | null;
  existingEventId?: string | null;
  onMeetCreated?: (meetLink: string) => void;
  onMeetDeleted?: () => void;
}

export default function GoogleMeetButton({
  appointmentId,
  existingMeetLink,
  existingEventId,
  onMeetCreated,
  onMeetDeleted,
}: GoogleMeetButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [meetLink, setMeetLink] = useState(existingMeetLink);
  const [eventId, setEventId] = useState(existingEventId);

  const handleCreateMeet = async () => {
    setIsCreating(true);
    try {
      const result = await createGoogleMeetForAppointment(appointmentId);
      setMeetLink(result.meetLink);
      setEventId(result.eventId);
      onMeetCreated?.(result.meetLink);
    } catch (error) {
      console.error("Error creating Google Meet:", error);
      alert("Failed to create Google Meet session. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteMeet = async () => {
    if (!confirm("Are you sure you want to delete this Google Meet session?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteGoogleMeetForAppointment(appointmentId);
      setMeetLink(null);
      setEventId(null);
      onMeetDeleted?.();
    } catch (error) {
      console.error("Error deleting Google Meet:", error);
      alert("Failed to delete Google Meet session. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (meetLink) {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(meetLink, "_blank")}
          className="flex-1"
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
          Join Google Meet
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteMeet}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {isDeleting ? "Deleting..." : "Delete Meet"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCreateMeet}
      disabled={isCreating}
      className="w-full sm:w-auto"
    >
      <svg
        className="w-4 h-4 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
          fill="currentColor"
        />
      </svg>
      {isCreating ? "Creating Google Meet..." : "Create Google Meet"}
    </Button>
  );
}
