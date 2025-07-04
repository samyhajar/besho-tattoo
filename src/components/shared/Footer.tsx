import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-12 bg-[#0e1424] border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Image
              src="/logo-besho.png"
              alt="Besho Tattoo Studio"
              width={180}
              height={60}
              className="h-auto w-[140px] mb-4"
            />
            <p className="text-gray-400 max-w-md">
              Professional tattoo studio dedicated to creating unique,
              high-quality tattoos that tell your story.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/portfolio"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@beshotattoo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Art Street, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Besho Tattoo Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
