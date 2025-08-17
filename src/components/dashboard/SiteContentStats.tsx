import { SiteContent } from "@/types/site-content";
import { Card } from "@/components/ui/Card";
import { FileText, Calendar, User } from "lucide-react";

interface SiteContentStatsProps {
  content: SiteContent[];
}

export function SiteContentStats({ content }: SiteContentStatsProps) {
  const totalFields = content.length;
  const lastUpdated =
    content.length > 0
      ? new Date(
          Math.max(
            ...content.map((item) => new Date(item.updated_at).getTime()),
          ),
        )
      : null;

  const uniquePages = [...new Set(content.map((item) => item.page))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Fields</p>
            <p className="text-2xl font-bold text-gray-900">{totalFields}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {lastUpdated
                ? lastUpdated.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Never"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pages</p>
            <p className="text-2xl font-bold text-gray-900">
              {uniquePages.length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
