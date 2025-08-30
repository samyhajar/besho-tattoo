"use client";

import { useState } from "react";
import ContactFormField from "./ContactFormField";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (field: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (_error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:pl-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Send us a Message
      </h2>
      <p className="text-gray-600 mb-8">
        Fill out the form below and we&apos;ll get back to you as soon as possible.
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
        />

        <ContactFormField
          id="subject"
          label="Subject"
          type="text"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e)}
          placeholder="What&apos;s this about?"
          disabled={isSubmitting}
          required
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
        />

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>

        {submitStatus === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">Message sent successfully!</p>
            <p className="text-green-700 text-sm mt-1">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Failed to send message</p>
            <p className="text-red-700 text-sm mt-1">
              Please try again or contact us directly.
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          Note: For tattoo appointments, please include details about your desired design and preferred dates.
        </p>
      </form>
    </div>
  );
}