import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your studio efficiently</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="font-medium text-sm">Add New Tattoo</div>
          <div className="text-xs text-gray-600">Upload your latest work to the portfolio</div>
        </button>

        <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="font-medium text-sm">Set Availability</div>
          <div className="text-xs text-gray-600">Update your schedule for bookings</div>
        </button>

        <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="font-medium text-sm">Add Product</div>
          <div className="text-xs text-gray-600">List new merchandise in your shop</div>
        </button>

        <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="font-medium text-sm">View Analytics</div>
          <div className="text-xs text-gray-600">Check your studio performance</div>
        </button>
      </CardContent>
    </Card>
  );
}