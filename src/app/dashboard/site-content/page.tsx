"use client";

import { useState, useEffect } from "react";
import { SiteContentForm } from "@/components/dashboard/SiteContentForm";
import { SiteContentStats } from "@/components/dashboard/SiteContentStats";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import { getSiteContent } from "@/services/site-content";
import { SiteContent } from "@/types/site-content";

export default function SiteContentPage() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadSiteContent();
  }, []);

  const loadSiteContent = async () => {
    try {
      setLoading(true);
      const data = await getSiteContent();
      setContent(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load site content",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContentUpdated = () => {
    void loadSiteContent();
  };

  if (loading) {
    return (
      <DashboardGuard>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div
                          key={j}
                          className="h-4 bg-gray-200 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardGuard>
    );
  }

  return (
    <DashboardGuard>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Site Content Management
            </h1>
            <p className="text-gray-600">
              Manage the text and image content for your home page, About
              section, and contact page.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Stats */}
          <SiteContentStats content={content} />

          {/* Content Form */}
          <SiteContentForm
            content={content}
            onContentUpdated={handleContentUpdated}
          />
        </div>
      </div>
    </DashboardGuard>
  );
}
