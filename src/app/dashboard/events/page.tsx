"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  EyeOff,
  Link as LinkIcon,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  createEvent,
  deleteEvent,
  fetchAllEvents,
  formatEventDate,
  isPastEvent,
  setEventPublished,
  updateEvent,
} from "@/services/events";
import type { Event, EventFormData, EventMutationInput } from "@/types/event";

const emptyFormData: EventFormData = {
  title: "",
  event_date: "",
  location: "",
  redirect_url: "",
  is_published: true,
  display_order: "0",
};

function getFriendlyEventError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong while loading events.";

  if (
    message.includes("Could not find the table") ||
    message.includes('relation "public.events" does not exist') ||
    message.includes("404")
  ) {
    return "The events table is not available on the connected Besho Supabase project yet. The UI is ready, but the database migration still needs to be applied on that remote.";
  }

  return message;
}

function toFormData(event: Event): EventFormData {
  return {
    title: event.title,
    event_date: event.event_date,
    location: event.location,
    redirect_url: event.redirect_url || "",
    is_published: event.is_published,
    display_order: String(event.display_order),
  };
}

function toMutationInput(formData: EventFormData): EventMutationInput {
  return {
    title: formData.title.trim(),
    event_date: formData.event_date,
    location: formData.location.trim(),
    redirect_url: formData.redirect_url.trim() || null,
    is_published: formData.is_published,
    display_order: Number.parseInt(formData.display_order || "0", 10) || 0,
  };
}

interface EventSectionProps {
  title: string;
  description: string;
  emptyMessage: string;
  events: Event[];
  activeAction: string | null;
  onEdit: (event: Event) => void;
  onTogglePublished: (event: Event) => void;
  onDelete: (event: Event) => void;
}

function EventSection({
  title,
  description,
  emptyMessage,
  events,
  activeAction,
  onEdit,
  onTogglePublished,
  onDelete,
}: EventSectionProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          events.map((event) => {
            const toggleActionKey = `toggle:${event.id}`;
            const deleteActionKey = `delete:${event.id}`;
            const isBusy =
              activeAction === toggleActionKey ||
              activeAction === deleteActionKey;

            return (
              <article
                key={event.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
                          event.is_published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700",
                        ].join(" ")}
                      >
                        {event.is_published ? "Published" : "Hidden"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span>{formatEventDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      {event.redirect_url ? (
                        <a
                          href={event.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span className="truncate">{event.redirect_url}</span>
                        </a>
                      ) : null}
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                        Display order {event.display_order}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(event)}
                      disabled={isBusy}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onTogglePublished(event)}
                      disabled={isBusy}
                    >
                      {event.is_published ? (
                        <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                      ) : (
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      {event.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(event)}
                      disabled={isBusy}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(emptyFormData);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllEvents();
      setEvents(data);
    } catch (loadError) {
      console.error("Error loading events:", loadError);
      setError(getFriendlyEventError(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, []);

  const upcomingPublishedEvents = useMemo(
    () => events.filter((event) => event.is_published && !isPastEvent(event)),
    [events],
  );

  const unpublishedEvents = useMemo(
    () => events.filter((event) => !event.is_published),
    [events],
  );

  const pastEvents = useMemo(
    () => events.filter((event) => event.is_published && isPastEvent(event)),
    [events],
  );

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | boolean,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingEvent(null);
    setFormData(emptyFormData);
    setShowForm(true);
    setError(null);
  };

  const openEditForm = (event: Event) => {
    setEditingEvent(event);
    setFormData(toFormData(event));
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setEditingEvent(null);
    setFormData(emptyFormData);
    setShowForm(false);
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    const input = toMutationInput(formData);

    if (!input.title) {
      setError("Event title is required.");
      return;
    }

    if (!input.event_date) {
      setError("Event date is required.");
      return;
    }

    if (!input.location) {
      setError("Event location is required.");
      return;
    }

    if (input.redirect_url) {
      try {
        const parsedUrl = new URL(input.redirect_url);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          setError("Redirect URL must start with http:// or https://.");
          return;
        }
      } catch {
        setError("Redirect URL must be a valid URL.");
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);

      if (editingEvent) {
        await updateEvent(editingEvent.id, input);
      } else {
        await createEvent(input);
      }

      closeForm();
      await loadEvents();
    } catch (submitError) {
      console.error("Error saving event:", submitError);
      setError(getFriendlyEventError(submitError));
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (event: Event) => {
    const actionKey = `toggle:${event.id}`;

    try {
      setActiveAction(actionKey);
      setError(null);
      await setEventPublished(event.id, !event.is_published);
      await loadEvents();
    } catch (toggleError) {
      console.error("Error toggling event visibility:", toggleError);
      setError(getFriendlyEventError(toggleError));
    } finally {
      setActiveAction(null);
    }
  };

  const handleDelete = async (event: Event) => {
    const confirmed = window.confirm(
      `Delete "${event.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    const actionKey = `delete:${event.id}`;

    try {
      setActiveAction(actionKey);
      setError(null);
      await deleteEvent(event.id);
      await loadEvents();
    } catch (deleteError) {
      console.error("Error deleting event:", deleteError);
      setError(getFriendlyEventError(deleteError));
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <BackButton />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Events
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
            Create, publish, and manage the upcoming studio events that appear
            in the homepage hero section.
          </p>
        </div>

        <Button type="button" onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {editingEvent ? "Edit Event" : "Add Event"}
            </CardTitle>
            <CardDescription>
              Published upcoming events are shown on the public hero. Past dates
              and unpublished events stay hidden from visitors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Event Title"
                  value={formData.title}
                  onChange={(event) =>
                    handleInputChange("title", event.target.value)
                  }
                  placeholder="Guest spot in Vienna"
                  autoComplete="off"
                  required
                />
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(event) =>
                    handleInputChange("location", event.target.value)
                  }
                  placeholder="Vienna, Austria"
                  autoComplete="off"
                  required
                />
                <Input
                  label="Event Date"
                  type="date"
                  value={formData.event_date}
                  onChange={(event) =>
                    handleInputChange("event_date", event.target.value)
                  }
                  required
                />
                <Input
                  label="Display Order"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.display_order}
                  onChange={(event) =>
                    handleInputChange("display_order", event.target.value)
                  }
                />
                <div className="md:col-span-2">
                  <Input
                    label="Redirect URL"
                    type="url"
                    value={formData.redirect_url}
                    onChange={(event) =>
                      handleInputChange("redirect_url", event.target.value)
                    }
                    placeholder="https://example.com/bookings/guest-spot"
                    autoComplete="off"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Optional. When set, visitors can click the event in the hero
                    timeline and be redirected there.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <input
                    id="event-published"
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(event) =>
                      handleInputChange("is_published", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
                  />
                  <Label
                    htmlFor="event-published"
                    className="text-sm text-gray-900"
                  >
                    Publish this event to the public homepage hero
                  </Label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  You can keep an event hidden until everything is confirmed.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? editingEvent
                      ? "Saving..."
                      : "Creating..."
                    : editingEvent
                      ? "Save Changes"
                      : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <p className="text-sm text-gray-600">Loading events...</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <EventSection
            title="Upcoming Published"
            description="These are visible to visitors and appear in the hero when the date is today or later."
            emptyMessage="No published upcoming events yet."
            events={upcomingPublishedEvents}
            activeAction={activeAction}
            onEdit={openEditForm}
            onTogglePublished={handleTogglePublished}
            onDelete={handleDelete}
          />
          <EventSection
            title="Draft / Unpublished"
            description="Keep planned events hidden here until you are ready to show them publicly."
            emptyMessage="No unpublished events right now."
            events={unpublishedEvents}
            activeAction={activeAction}
            onEdit={openEditForm}
            onTogglePublished={handleTogglePublished}
            onDelete={handleDelete}
          />
          <EventSection
            title="Past Events"
            description="Published events with dates in the past automatically stop appearing in the public hero."
            emptyMessage="No past published events yet."
            events={pastEvents}
            activeAction={activeAction}
            onEdit={openEditForm}
            onTogglePublished={handleTogglePublished}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
