"use client";

import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function ContactInfo() {
  const { getContactContent, loading } = useSiteContent();
  const contactContent = getContactContent();

  const formatAddress = (address: string) => {
    return address.split('\n').map((line, index) => (
      <span key={index}>
        {line.trim()}
        {index < address.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const formatHours = (hours: string) => {
    return hours.split('\n').map((line, index) => (
      <span key={index}>
        {line.trim()}
        {index < hours.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Contact Information
        </h2>
        <p className="text-gray-600 mb-8">
          Ready to start your tattoo journey? Get in touch with us to discuss your ideas and schedule a consultation.
        </p>
      </div>

      {/* Address */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <MapPin className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Studio Location</h3>
          <p className="text-gray-600">
            {loading ? "Loading..." : contactContent.address ? formatAddress(contactContent.address) : "Vienna, Austria\nBy appointment only"}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Phone className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Phone</h3>
          <p className="text-gray-600">
            {loading ? "Loading..." : contactContent.phone ? (
              <a href={`tel:${contactContent.phone}`} className="hover:text-gray-900 transition-colors">
                {contactContent.phone}
              </a>
            ) : (
              <a href="tel:+43123456789" className="hover:text-gray-900 transition-colors">
                +43 123 456 789
              </a>
            )}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Mail className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Email</h3>
          <p className="text-gray-600">
            {loading ? "Loading..." : contactContent.email ? (
              <a href={`mailto:${contactContent.email}`} className="hover:text-gray-900 transition-colors">
                {contactContent.email}
              </a>
            ) : (
              <a href="mailto:info@beshotattoo.com" className="hover:text-gray-900 transition-colors">
                info@beshotattoo.com
              </a>
            )}
          </p>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Clock className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Hours</h3>
          <p className="text-gray-600">
            {loading ? "Loading..." : contactContent.hours ? formatHours(contactContent.hours) : "By appointment only\nTuesday - Saturday"}
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Instagram className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Follow Us</h3>
          <p className="text-gray-600">
            {loading ? "Loading..." : contactContent.socialMedia ? (
              <a 
                href={`https://instagram.com/${contactContent.socialMedia.replace('@', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                {contactContent.socialMedia}
              </a>
            ) : (
              <a 
                href="https://instagram.com/beshotattoo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                @beshotattoo
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
