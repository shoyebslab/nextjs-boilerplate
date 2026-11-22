"use client";

import { RefreshCw } from "lucide-react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface CaptchaProps {
  value: string;
  challenge: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  error?: string;
  className?: string;
}

export function Captcha({
  value,
  challenge,
  onChange,
  onRefresh,
  error,
  className,
}: CaptchaProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor="captcha">Enter the captcha</Label>
      <div className="flex items-center gap-2">
        <div
          className="flex h-10 min-w-32 flex-1 items-center justify-center overflow-hidden rounded-md border bg-muted/40 px-3"
          aria-label={`Captcha challenge: ${challenge}`}
        >
          <div className="select-none tracking-[0.28em]" aria-hidden="true">
            {challenge.split("").map((character, index) => (
              <span
                key={`${character}-${index}`}
                className="inline-block text-base font-bold text-foreground"
                style={{
                  transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (8 + (index % 3) * 4)}deg)`,
                }}
              >
                {character}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Refresh captcha"
          title="Refresh captcha"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <Input
        id="captcha"
        type="text"
        placeholder="Enter the characters you see"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        aria-invalid={Boolean(error)}
      />
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
