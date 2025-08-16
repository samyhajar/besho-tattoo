import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ContactFormField from "@/components/shared/ContactFormField";
import { sendContactForm } from "@/lib/emailjs";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (showError) {
      setShowError(false);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage("");

    try {
      const result = await sendContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.success) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Hide success message after 7 seconds
        setTimeout(() => setShowSuccess(false), 7000);
      } else {
        setShowError(true);
        setErrorMessage("Failed to send message. Please try again or contact us directly.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setShowError(true);
      setErrorMessage("Failed to send message. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:pl-16 relative">
      <h2 className="text-2xl font-light tracking-wide text-black mb-8">
        Send a Message
      </h2>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium">
                Message sent successfully! 🎉
              </p>
              <p className="text-green-700 text-sm mt-1">
                Thank you for reaching out. We&apos;ll get back to you soon!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">
                Unable to send message
              </p>
              <p className="text-red-700 text-sm mt-1">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
        <ContactFormField
          id="name"
          label="Name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Your full name"
          disabled={isSubmitting}
        />

        <ContactFormField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />

        <ContactFormField
          id="subject"
          label="Subject"
          type="text"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="What's this about?"
          disabled={isSubmitting}
        />

        <ContactFormField
          id="message"
          label="Message"
          type="textarea"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell us about your project or question..."
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-4 text-lg font-medium tracking-wide transition-all duration-300 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-medium">💡 For tattoo appointments:</span> Please use our{" "}
          <a href="/book" className="text-black hover:underline font-medium">
            booking system
          </a>{" "}
          for faster scheduling.
        </p>
      </div>
    </div>
  );
}