import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GridExportProps {
  onExport: () => void;
  disabled?: boolean;
}

export function GridExport({ onExport, disabled }: GridExportProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onExport}
      disabled={disabled}
      className="gap-1.5 text-xs h-9"
    >
      <Download className="h-3.5 w-3.5" />
      <span>Export CSV</span>
    </Button>
  );
}
