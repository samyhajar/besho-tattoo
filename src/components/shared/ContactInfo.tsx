import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="lg:pr-16">
      <h2 className="text-2xl font-light tracking-wide text-black mb-8">
        Contact Information
      </h2>

      <div className="space-y-8">
        {/* Studio Address */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-6 h-6 mt-1">
            <MapPin className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-black mb-1">Studio Location</h3>
            <p className="text-gray-600 leading-relaxed">
              Kreuzberg Street 42
              <br />
              10965 Berlin, Germany
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-6 h-6 mt-1">
            <Phone className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-black mb-1">Phone</h3>
            <p className="text-gray-600">+49 30 1234 5678</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-6 h-6 mt-1">
            <Mail className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-black mb-1">Email</h3>
            <p className="text-gray-600">hello@mhanna-letters.com</p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-6 h-6 mt-1">
            <Clock className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-black mb-1">Studio Hours</h3>
            <div className="text-gray-600 space-y-1">
              <p>Monday - Friday: 10:00 - 19:00</p>
              <p>Saturday: 11:00 - 17:00</p>
              <p>Sunday: By appointment only</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-6 h-6 mt-1">
            <Instagram className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-black mb-1">Follow Us</h3>
            <a
              href="https://instagram.com/mhanna.letters"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              @mhanna.letters
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
