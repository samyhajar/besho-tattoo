"use client";

import { useState } from "react";
import ContactFormField from "./ContactFormField";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  variant?: "default" | "dark";
}

export default function ContactForm({ variant = "default" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm();
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact",
          data: formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.error("Email sending failed:", result.error);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDarkVariant = variant === "dark";

  return (
    <div className={cn(isDarkVariant ? "" : "lg:pl-16")}>
      <h2
        className={cn(
          "mb-6 text-2xl",
          isDarkVariant
            ? "font-home-serif font-normal text-white"
            : "font-semibold text-gray-900",
        )}
      >
        Send us a Message
      </h2>
      <p
        className={cn(
          "mb-8",
          isDarkVariant ? "font-home-sans text-neutral-400" : "text-gray-600",
        )}
      >
        Fill out the form below and we&apos;ll get back to you as soon as
        possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ContactFormField
          id="name"
          label="Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e)}
          placeholder="Your full name"
          disabled={isSubmitting}
          required
          variant={variant}
        />

        <ContactFormField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e)}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
          required
          variant={variant}
        />

        <ContactFormField
          id="subject"
          label="Subject"
          type="text"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e)}
          placeholder="What's this about?"
          disabled={isSubmitting}
          required
          variant={variant}
        />

        <ContactFormField
          id="message"
          label="Message"
          type="textarea"
          value={formData.message}
          onChange={(e) => handleInputChange("message", e)}
          placeholder="Tell us about your project or questions..."
          disabled={isSubmitting}
          required
          variant={variant}
        />

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-3 px-6 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
              isDarkVariant
                ? "border border-white bg-white font-home-sans text-sm uppercase tracking-[0.22em] font-medium text-black hover:bg-neutral-200"
                : "bg-black font-semibold text-white hover:bg-gray-800",
            )}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>

        {submitStatus === "success" && (
          <div
            className={cn(
              "mt-4 p-4",
              isDarkVariant
                ? "border border-emerald-900/60 bg-emerald-950/40"
                : "rounded-md border border-green-200 bg-green-50",
            )}
          >
            <p
              className={cn(
                isDarkVariant
                  ? "font-medium text-emerald-200"
                  : "text-green-800 font-medium",
              )}
            >
              Message sent successfully! 🎉
            </p>
            <p
              className={cn(
                "mt-1 text-sm",
                isDarkVariant ? "text-emerald-300/80" : "text-green-700",
              )}
            >
              Thank you for reaching out. We&apos;ll get back to you soon!
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div
            className={cn(
              "mt-4 p-4",
              isDarkVariant
                ? "border border-red-950/80 bg-red-950/40"
                : "rounded-md border border-red-200 bg-red-50",
            )}
          >
            <p
              className={cn(
                isDarkVariant
                  ? "font-medium text-red-200"
                  : "text-red-800 font-medium",
              )}
            >
              Unable to send message
            </p>
            <p
              className={cn(
                "mt-1 text-sm",
                isDarkVariant ? "text-red-300/80" : "text-red-700",
              )}
            >
              Failed to send message. Please try again or contact us directly.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
