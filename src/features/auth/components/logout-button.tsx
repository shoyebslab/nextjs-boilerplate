"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function LogoutButton({
  className,
  variant = "ghost",
  size = "sm",
  showIcon = true,
  children = "Sign out",
}: LogoutButtonProps) {
  const { logout, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={isLoading}
      onClick={() => logout()}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-1.5" />}
      <span>{children}</span>
    </Button>
  );
}
