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
import AppointmentSummary from "./AppointmentSummary";
import { createPublicAppointment } from "@/services/appointments";
import type { Availability } from "@/services/appointments";

interface BookingFormContentProps {
  selectedSlot: Availability;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BookingFormContent({
  selectedSlot,
  onSuccess,
  onCancel,
}: BookingFormContentProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

    if (!formData.full_name.trim() || !formData.email.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

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

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl">
          Complete Your Booking
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Fill in your details to confirm your appointment for{" "}
          <span className="font-medium text-gray-900">
            {new Date(selectedSlot.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {formatTime(selectedSlot.time_start)} -{" "}
            {formatTime(selectedSlot.time_end)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
              Contact Information
            </h3>
            <ContactInformationFields
              formData={formData}
              onUpdate={updateFormData}
              disabled={submitting}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
              Reference Image (Optional)
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Upload a reference image to help us understand your tattoo
                vision better.
              </p>
              <ImageUploadField
                label=""
                id="reference-image"
                _file={referenceImage}
                preview={imagePreview}
                onFileSelect={handleImageSelect}
                onError={setError}
                disabled={submitting}
                maxSizeMB={10}
              />
            </div>
          </div>

          <AppointmentSummary selectedSlot={selectedSlot} />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
              className="order-2 sm:order-1 w-full sm:flex-1"
            >
              Back to Calendar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="order-1 sm:order-2 w-full sm:flex-1 py-3 sm:py-2"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Booking...</span>
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
