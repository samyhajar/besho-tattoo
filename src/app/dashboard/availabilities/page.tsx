"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import BackButton from "@/components/ui/BackButton";
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

  const loadAvailabilities = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    void loadAvailabilities();
  }, []);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    void loadAvailabilities();
  };

  const handleAddCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Back Button - Mobile Only */}
      <BackButton />

      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Availability
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage your schedule and time slots
          </p>
        </div>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 sm:py-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Time Slots</span>
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="space-y-4">
          <AddAvailabilityForm
            onSuccess={handleAddSuccess}
            onCancel={handleAddCancel}
          />
        </div>
      )}

      {/* Stats */}
      {!showAddForm && (
        <div className="space-y-4 sm:space-y-6">
          <AvailabilityStats availabilities={availabilities} />

          {/* List */}
          <AvailabilityList
            availabilities={availabilities}
            onUpdate={() => void loadAvailabilities()}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && !showAddForm && (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">
            Loading availabilities...
          </p>
        </div>
      )}
    </div>
  );
}
