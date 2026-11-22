"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "./form-util";
import { cn } from "@/lib/utils";

export interface EmailCardProps {
  originalEmail?: string;
  recipientName?: string;
  onSend?: (email: string) => Promise<void> | void;
  onClose?: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  isSending?: boolean;
  className?: string;
}

export function EmailCard({
  originalEmail = "",
  recipientName,
  onSend,
  onClose,
  title = "Send Email Notification",
  description = "Verify or customize recipient email address",
  isLoading = false,
  isSending = false,
  className,
}: EmailCardProps) {
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState("");

  const targetEmail = useCustomEmail && customEmail ? customEmail : originalEmail;

  const handleSend = async () => {
    if (!targetEmail) return;
    await onSend?.(targetEmail);
    setUseCustomEmail(false);
    setCustomEmail("");
  };

  return (
    <Card className={cn("w-full border-border/80 shadow-md", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Recipient / Default Email Box */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {recipientName ? "Recipient" : "Default Email Address"}
          </Label>
          {isLoading ? (
            <Skeleton className="w-full h-10 rounded-md" />
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-md border bg-muted/30 text-xs sm:text-sm font-medium">
              <span className="truncate">{recipientName ? `${recipientName} (${originalEmail})` : originalEmail || "No email provided"}</span>
            </div>
          )}
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-between rounded-lg border p-3 bg-card">
          <div className="space-y-0.5">
            <Label htmlFor="custom-email-switch" className="text-xs sm:text-sm font-medium cursor-pointer">
              Use Different Email Address
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Send this copy to an alternative address
            </p>
          </div>
          <Switch
            id="custom-email-switch"
            checked={useCustomEmail}
            onCheckedChange={setUseCustomEmail}
          />
        </div>

        {/* Custom Email Input */}
        {useCustomEmail && (
          <div className="space-y-1.5 animate-in fade-in-0 duration-200">
            <Label htmlFor="custom-email-input" className="text-xs font-medium">
              Alternative Email Address
            </Label>
            <Input
              id="custom-email-input"
              type="email"
              placeholder="e.g. accountant@company.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
            >
              Cancel
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={handleSend}
            disabled={
              isSending ||
              isLoading ||
              (useCustomEmail && !customEmail) ||
              (!useCustomEmail && !originalEmail)
            }
            className="gap-1.5"
          >
            {isSending ? (
              <LoadingState text="Sending" />
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmailCard;
