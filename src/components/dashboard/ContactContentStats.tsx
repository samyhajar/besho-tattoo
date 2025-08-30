import { SiteContent } from "@/types/site-content";
import { Card } from "@/components/ui/Card";
import { FileText, Calendar, User, MessageSquare } from "lucide-react";

interface ContactContentStatsProps {
  content: SiteContent[];
}

export function ContactContentStats({ content }: ContactContentStatsProps) {
  const contactContent = content.filter(item => item.page === 'contact');
  const totalFields = contactContent.length;
  const lastUpdated = contactContent.length > 0
    ? new Date(Math.max(...contactContent.map(item => new Date(item.updated_at).getTime())))
    : null;

  const sections = [...new Set(contactContent.map(item => item.section))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                ? lastUpdated.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Never'
              }
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
            <p className="text-sm font-medium text-gray-600">Sections</p>
            <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Form Fields</p>
            <p className="text-2xl font-bold text-gray-900">
              {contactContent.filter(item => item.section === 'form').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
