import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import ImageUploadField from "./ImageUploadField";
import ContactInformationFields from "./ContactInformationFields";
import { createPublicAppointment } from "@/services/appointments";
import type { Availability } from "@/services/appointments";

interface BookingFormProps {
  selectedSlot: Availability | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BookingForm({
  selectedSlot,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleImageSelect = (file: File | null) => {
    setReferenceImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      setError("No appointment slot selected");
      return;
    }

    if (!formData.full_name.trim() || !formData.email.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Upload image first if provided
      let imageUrl: string | undefined;
      if (referenceImage) {
        const supabase = await import("@/lib/supabase/browser-client").then(
          (m) => m.createClient(),
        );
        const fileExt = referenceImage.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `appointments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("tattoosappointment")
          .upload(filePath, referenceImage);

        if (uploadError) {
          throw new Error("Failed to upload image: " + uploadError.message);
        }

        imageUrl = filePath;
      }

      await createPublicAppointment({
        availability_id: selectedSlot.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        image_url: imageUrl,
      });

      onSuccess();
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedSlot) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">
            Please select an appointment slot first
          </p>
          <Button onClick={onCancel} className="mt-4">
            Back to Calendar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
        <CardDescription>
          Fill in your details to confirm your appointment for{" "}
          {new Date(selectedSlot.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at {formatTime(selectedSlot.time_start)} -{" "}
          {formatTime(selectedSlot.time_end)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          <ContactInformationFields
            formData={formData}
            onUpdate={updateFormData}
            disabled={submitting}
          />

          {/* Reference Image Upload */}
          <ImageUploadField
            label="Reference Image (Optional)"
            id="reference-image"
            _file={referenceImage}
            preview={imagePreview}
            onFileSelect={handleImageSelect}
            onError={setError}
            disabled={submitting}
            maxSizeMB={10}
          />

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Booking...
                </div>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
