import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CheckCircle, Video, ExternalLink } from "lucide-react";
import Header from "@/components/shared/Header";
import { useLocale } from "@/contexts/LocaleContext";
import type { Appointment } from "@/services/appointments";

interface BookingSuccessProps {
  appointment: Appointment | null;
}

export default function BookingSuccess({ appointment }: BookingSuccessProps) {
  const router = useRouter();
  const { copy } = useLocale();

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />

      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] p-4">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-white">
              {copy.booking.bookingConfirmed}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2 text-gray-300">
              {copy.booking.bookingConfirmedDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {appointment?.google_meet_link && (
              <div className="bg-blue-900/30 p-4 sm:p-6 rounded-lg border border-blue-700">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Video className="w-5 h-5 text-blue-400" />
                  <h3 className="font-medium text-blue-100 text-sm sm:text-base">
                    {copy.booking.meetCreated}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-blue-200 mb-4">
                  {copy.booking.meetDescription}
                </p>
                <a
                  href={appointment.google_meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                >
                  <Video className="w-4 h-4" />
                  {copy.booking.joinMeet}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            <div className="bg-gray-700 p-4 sm:p-6 rounded-lg border border-gray-600">
              <h3 className="font-medium text-white mb-3 text-sm sm:text-base">
                {copy.booking.nextSteps}
              </h3>
              <div className="text-xs sm:text-sm text-gray-300 space-y-2 text-left">
                <div className="flex items-start space-x-2">
                  <span className="font-medium">•</span>
                  <span>{copy.booking.nextStepReview}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">•</span>
                  <span>
                    {copy.booking.nextStepEmail(
                      Boolean(appointment?.google_meet_link),
                    )}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">•</span>
                  <span>{copy.booking.nextStepDiscuss}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">•</span>
                  <span>{copy.booking.nextStepBringId}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => router.push("/portfolio")}
                className="order-2 sm:order-1 inline-flex items-center justify-center px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                {copy.booking.viewPortfolio}
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="order-1 sm:order-2 inline-flex items-center justify-center px-4 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
              >
                {copy.booking.bookAnotherAppointment}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
