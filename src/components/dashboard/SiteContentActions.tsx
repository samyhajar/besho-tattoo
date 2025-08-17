import { Button } from "@/components/ui/Button";
import { Save, RefreshCw, CheckCircle } from "lucide-react";

interface SiteContentActionsProps {
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function SiteContentActions({
  saving,
  saved,
  onSave,
  onReset,
}: SiteContentActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <Button
        variant="outline"
        onClick={onReset}
        disabled={saving}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Reset Changes
      </Button>

      <Button
        onClick={() => void onSave()}
        disabled={saving}
        className="flex items-center gap-2"
      >
        {saving ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
