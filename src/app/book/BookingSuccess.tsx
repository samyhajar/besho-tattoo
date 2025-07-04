import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";

export default function BookingSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
            Booking Confirmed!
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-2">
            Your appointment has been successfully booked. We&apos;ll review
            your request and send you a confirmation email shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3 text-sm sm:text-base">
              What happens next?
            </h3>
            <div className="text-xs sm:text-sm text-blue-800 space-y-2 text-left">
              <div className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>We&apos;ll review your booking within 24 hours</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>
                  You&apos;ll receive a confirmation email with details
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>
                  If we need to discuss your design, we&apos;ll reach out
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>
                  Please bring your ID and any additional references to your
                  appointment
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => router.push("/portfolio")}
              className="order-2 sm:order-1 inline-flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              View Our Portfolio
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="order-1 sm:order-2 inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
            >
              Book Another Appointment
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
