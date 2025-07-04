import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface TattooErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function TattooErrorState({ error, onRetry }: TattooErrorStateProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <BackButton />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tattoo Portfolio</h1>
          <p className="text-gray-600 mt-2">Manage your tattoo artwork and portfolio</p>
        </div>
      </div>
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button onClick={onRetry} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );
}