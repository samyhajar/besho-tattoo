import BackButton from "@/components/ui/BackButton";

export default function DesignsLoadingState() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <BackButton />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Designs Portfolio
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your design concepts and artwork
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <span className="text-gray-600">Loading designs...</span>
        </div>
      </div>
    </div>
  );
}
