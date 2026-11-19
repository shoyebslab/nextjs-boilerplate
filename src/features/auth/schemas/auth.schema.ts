import { isValidEmail, isStrongPassword } from "@/lib/validations";
import { LoginCredentials } from "../types/auth.types";

export function validateLogin(credentials: LoginCredentials): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const identifier = credentials.email || credentials.username;
  if (!identifier || identifier.trim() === "") {
    errors.email = "Email or username is required.";
  }

  if (!credentials.password || credentials.password.length < 4) {
    errors.password = "Password must be at least 4 characters long.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
