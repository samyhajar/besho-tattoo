import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface ClientDetailHeaderProps {
  client: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export default function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">
              {client.full_name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{client.full_name}</h1>
            <p className="text-gray-600">{client.email}</p>
            {client.phone && (
              <p className="text-gray-600 text-sm">{client.phone}</p>
            )}
          </div>
        </div>
      </div>
      <Button
        onClick={() => router.push("/dashboard/clients")}
        className="bg-gray-600 hover:bg-gray-700"
      >
        Back to Clients
      </Button>
    </div>
  );
}