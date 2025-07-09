import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setTimeout(() => {
        setShowSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitting(false);

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }, 1000);
    }, 0);
  };

  return (
    <div className="lg:pl-16 relative">
      <h2 className="text-2xl font-light tracking-wide text-black mb-8">
        Send a Message
      </h2>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center">
            Thank you for your message! We&apos;ll get back to you soon.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-black mb-2 block">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-black mb-2 block">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Subject */}
        <div>
          <Label htmlFor="subject" className="text-black mb-2 block">
            Subject *
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
            placeholder="What's this about?"
          />
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message" className="text-black mb-2 block">
            Message *
          </Label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black resize-none"
            placeholder="Tell us about your project or question..."
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-4 text-lg font-medium tracking-wide transition-all duration-300 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        For tattoo appointments, please use our{" "}
        <a href="/book" className="text-black hover:underline">
          booking system
        </a>
        .
      </p>
    </div>
  );
}
