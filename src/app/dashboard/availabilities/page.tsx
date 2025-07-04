"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/browser-client";
import type { Availability } from "@/services/appointments";
import AddAvailabilityForm from "@/components/dashboard/AddAvailabilityForm";
import AvailabilityStats from "@/components/dashboard/AvailabilityStats";
import AvailabilityList from "@/components/dashboard/AvailabilityList";

export default function AvailabilitiesPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    void loadAvailabilities();
  }, []);

  const loadAvailabilities = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error } = await supabase
        .from("availabilities")
        .select("*")
        .order("date", { ascending: true })
        .order("time_start", { ascending: true });

      if (error) throw error;
      setAvailabilities(data || []);
    } catch (err) {
      console.error("Error loading availabilities:", err);
      setError("Failed to load availabilities");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    void loadAvailabilities();
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-600 mt-2">
            Manage your schedule and time slots
          </p>
        </div>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Time Slot
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add New Slot Form */}
      {showAddForm && (
        <AddAvailabilityForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Stats */}
      <AvailabilityStats availabilities={availabilities} />

      {/* Availability List */}
      <AvailabilityList
        availabilities={availabilities}
        onUpdate={() => void loadAvailabilities()}
      />
    </div>
  );
}
