import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription className="text-base">Manage your studio efficiently</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link
          href="/dashboard/tattoos/new"
          className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors block"
        >
          <div className="font-medium text-base">Add New Tattoo</div>
          <div className="text-sm text-gray-600">Upload your latest work to the portfolio</div>
        </Link>

        <Link
          href="/dashboard/availabilities"
          className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors block"
        >
          <div className="font-medium text-base">Set Availability</div>
          <div className="text-sm text-gray-600">Update your schedule for bookings</div>
        </Link>

        {/* Temporarily disabled */}
        {/* <Link
          href="/dashboard/products"
          className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors block"
        >
          <div className="font-medium text-base">Add Product</div>
          <div className="text-sm text-gray-600">List new merchandise in your shop</div>
        </Link> */}

        <Link
          href="/dashboard/appointments"
          className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors block"
        >
          <div className="font-medium text-base">View Appointments</div>
          <div className="text-sm text-gray-600">Check your studio appointments</div>
        </Link>
      </CardContent>
    </Card>
  );
}