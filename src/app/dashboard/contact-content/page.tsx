"use client";

import { useEffect, useState } from "react";
import { ContactContentStats } from "@/components/dashboard/ContactContentStats";
import { SiteContentForm } from "@/components/dashboard/SiteContentForm";
import { getSiteContent } from "@/services/site-content";
import { SiteContent } from "@/types/site-content";

export default function ContactContentPage() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadContactContent();
  }, []);

  const loadContactContent = async () => {
    try {
      setLoading(true);
      const data = await getSiteContent();
      setContent(data);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load contact content",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-[32rem] max-w-full animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>

        <div className="h-[34rem] animate-pulse rounded-xl border border-gray-200 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Contact Content
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage the contact page headline, studio details, and editable page
          image.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : null}

      <ContactContentStats content={content} />

      <SiteContentForm
        content={content}
        onContentUpdated={loadContactContent}
        mode="contact"
      />
    </div>
  );
}
