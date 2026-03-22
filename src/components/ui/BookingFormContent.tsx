import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import ContactInformationFields from "./ContactInformationFields";
import AppointmentSummary from "./AppointmentSummary";
import BookingFormHeader from "./BookingFormHeader";
import BookingImageUpload from "./BookingImageUpload";
import BookingFormActions from "./BookingFormActions";
import { useLocale } from "@/contexts/LocaleContext";
import { createPublicAppointment } from "@/services/appointments";
import type { Availability, Appointment } from "@/services/appointments";

interface BookingFormContentProps {
  selectedSlot: Availability;
  onSuccess: (appointment: Appointment) => void;
  onCancel: () => void;
}

export default function BookingFormContent({
  selectedSlot,
  onSuccess,
  onCancel,
}: BookingFormContentProps) {
  const { copy } = useLocale();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (file: File | null) => {
    setReferenceImage(file);
    setError(null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    console.log("📸 Uploading reference image...");
    const supabase = await import("@/lib/supabase/browser-client").then((m) =>
      m.createClient(),
    );
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `appointments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("tattoosappointment")
      .upload(filePath, file);

    if (uploadError) {
      console.error("❌ Image upload failed:", uploadError);
      throw new Error(
        `${copy.booking.failedToUploadImage}: ${uploadError.message}`,
      );
    }

    console.log("✅ Image uploaded successfully:", filePath);
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim() || !formData.email.trim()) {
      setError(copy.booking.requiredFields);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let imageUrl: string | undefined;
      if (referenceImage) {
        imageUrl = await uploadImage(referenceImage);
      }

      console.log("🚀 Creating appointment...", {
        availability_id: selectedSlot.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        image_url: imageUrl,
      });

      const appointment = await createPublicAppointment({
        availability_id: selectedSlot.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        image_url: imageUrl,
      });

      console.log("✅ Appointment created successfully:", appointment);
      onSuccess(appointment);
    } catch (err) {
      console.error("❌ Error creating appointment:", err);

      let errorMessage: string = copy.booking.failedToBook;

      if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Error details:", {
          name: err.name,
          message: err.message,
          stack: err.stack,
        });
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        console.error("Unknown error type:", typeof err, err);
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <BookingFormHeader selectedSlot={selectedSlot} />
      <CardContent className="p-4 sm:p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
              {copy.booking.contactInformation}
            </h3>
            <ContactInformationFields
              formData={formData}
              onUpdate={updateFormData}
              disabled={submitting}
            />
          </div>

          <BookingImageUpload
            onFileSelect={handleImageSelect}
            onError={setError}
            disabled={submitting}
          />

          <AppointmentSummary selectedSlot={selectedSlot} />

          <BookingFormActions submitting={submitting} onCancel={onCancel} />
        </form>
      </CardContent>
    </Card>
  );
}
