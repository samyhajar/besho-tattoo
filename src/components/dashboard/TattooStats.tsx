import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface TattooStatsProps {
  stats: {
    total: number;
    categories: number;
    thisMonth: number;
  };
}

export default function TattooStats({ stats }: TattooStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Tattoos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.categories}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.thisMonth}</div>
        </CardContent>
      </Card>
    </div>
  );
}
