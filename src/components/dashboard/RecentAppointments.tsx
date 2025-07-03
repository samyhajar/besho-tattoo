import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function RecentAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>Latest bookings from your clients</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-sm">John Doe</p>
            <p className="text-xs text-gray-600">Sleeve tattoo consultation</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Today, 2:00 PM</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Confirmed
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-sm">Sarah Smith</p>
            <p className="text-xs text-gray-600">Small wrist tattoo</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Tomorrow, 10:00 AM</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Pending
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-sm">Mike Johnson</p>
            <p className="text-xs text-gray-600">Touch-up session</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Dec 15, 3:30 PM</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
              Scheduled
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}